"use strict";

const crypto = require("node:crypto");
const admin = require("firebase-admin");

const PROJECT_ID = "plataforma-exames-conducao";
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 128;
const BODY_MAX = 4096;

function response(res, status, body) {
  res.status(status).setHeader("Cache-Control", "no-store").json(body);
}

function normalizarTelefone(value) {
  if (typeof value !== "string") return null;
  let phone = value.trim().replace(/[\s().-]/g, "");
  if (/^00258\d{9}$/.test(phone)) phone = "+258" + phone.slice(5);
  if (/^258\d{9}$/.test(phone)) phone = "+" + phone;
  if (/^\d{9}$/.test(phone)) phone = "+258" + phone;
  // Apenas números moçambicanos de 9 algarismos: Vodacom 84/85,
  // Movitel 86/87/88. O formato interno é sempre E.164 (+258).
  if (!/^\+258(?:84|85|86|87|88)\d{7}$/.test(phone)) return null;
  return phone;
}

function segredo(name) {
  const value = process.env[name];
  if (!value || value.length < 32) throw new Error("Configuração segura em falta: " + name);
  return value;
}

function adminApp() {
  if (admin.apps.length) return admin.app();
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON não configurada.");
  const serviceAccount = JSON.parse(raw);
  if (serviceAccount.project_id !== PROJECT_ID) throw new Error("A credencial Firebase pertence a outro projecto.");
  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: PROJECT_ID
  });
}

function hmac(value) {
  return crypto.createHmac("sha256", segredo("PHONE_AUTH_PEPPER")).update(value).digest("hex");
}

function hashPassword(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 },
      (error, key) => error ? reject(error) : resolve(key.toString("hex")));
  });
}

function igualSeguro(a, b) {
  const left = Buffer.from(String(a || ""), "hex");
  const right = Buffer.from(String(b || ""), "hex");
  return left.length === right.length && left.length > 0 && crypto.timingSafeEqual(left, right);
}

function ipDoPedido(req) {
  const forwarded = req.headers["x-forwarded-for"];
  const first = typeof forwarded === "string" ? forwarded.split(",")[0].trim() : "";
  return first || req.socket && req.socket.remoteAddress || "unknown";
}

function verificarOrigem(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    const parsed = new URL(origin);
    const host = String(req.headers.host || "").split(":")[0].toLowerCase();
    return parsed.protocol === "https:" && parsed.host.split(":")[0].toLowerCase() === host;
  } catch (_) {
    return false;
  }
}

async function limitar(db, keys) {
  const now = Date.now();
  for (const key of keys) {
    const ref = db.collection("phone_auth_rate_limits").doc(key);
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const data = snap.exists ? snap.data() : {};
      const active = data.resetAt && data.resetAt.toMillis() > now;
      const count = active ? Number(data.count || 0) : 0;
      if (count >= MAX_ATTEMPTS) {
        const error = new Error("Demasiadas tentativas. Aguarda 15 minutos e tenta novamente.");
        error.status = 429;
        throw error;
      }
      tx.set(ref, {
        count: count + 1,
        resetAt: admin.firestore.Timestamp.fromMillis(active ? data.resetAt.toMillis() : now + WINDOW_MS)
      });
    });
  }
}

function lerBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    if (Buffer.byteLength(req.body, "utf8") > BODY_MAX) return null;
    try { return JSON.parse(req.body); } catch (_) { return null; }
  }
  return null;
}

module.exports = async function phoneAuth(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return response(res, 405, { error: "Método não permitido." });
  }
  if (!verificarOrigem(req)) return response(res, 403, { error: "Pedido não autorizado." });
  const contentType = String(req.headers["content-type"] || "");
  if (!contentType.toLowerCase().includes("application/json")) {
    return response(res, 415, { error: "Formato de pedido inválido." });
  }
  const body = lerBody(req);
  if (!body || Buffer.byteLength(JSON.stringify(body), "utf8") > BODY_MAX) {
    return response(res, 400, { error: "Pedido inválido." });
  }

  const action = body.action;
  const phone = normalizarTelefone(body.phone);
  const password = body.password;
  if (!["register", "login"].includes(action) || !phone ||
      typeof password !== "string" || password.length < PASSWORD_MIN ||
      password.length > PASSWORD_MAX) {
    return response(res, 400, { error: "Indica um número válido e uma palavra-passe entre 8 e 128 caracteres." });
  }
  if (action === "register" && body.confirmPassword !== password) {
    return response(res, 400, { error: "As palavras-passe não coincidem." });
  }
  const firstName = typeof body.firstName === "string" ? body.firstName.trim().replace(/\\s+/g, " ") : "";
  const lastName = typeof body.lastName === "string" ? body.lastName.trim().replace(/\\s+/g, " ") : "";
  if (action === "register" && (!firstName || firstName.length > 50 || lastName.length > 60)) {
    return response(res, 400, { error: "Indica um primeiro nome válido. O sobrenome ou apelido pode ter até 60 caracteres." });
  }

  try {
    const app = adminApp();
    const db = admin.firestore(app);
    const phoneKey = hmac("phone:" + phone);
    const ipKey = hmac("ip:" + ipDoPedido(req));
    await limitar(db, [phoneKey, ipKey]);
    const accountRef = db.collection("phone_auth_accounts").doc(phoneKey);

    let uid;
    let displayName = "";
    if (action === "register") {
      const salt = crypto.randomBytes(16).toString("hex");
      const passwordHash = await hashPassword(password, salt);
      uid = "ph_" + phoneKey.slice(0, 48);
      await db.runTransaction(async (tx) => {
        const existing = await tx.get(accountRef);
        if (existing.exists) {
          const error = new Error("Não foi possível criar a conta com os dados indicados.");
          error.status = 409;
          throw error;
        }
        tx.create(accountRef, {
          uid,
          phone,
          firstName,
          lastName,
          displayName: [firstName, lastName].filter(Boolean).join(" "),
          salt,
          passwordHash,
          passwordAlgorithm: "scrypt-N16384-r8-p1",
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });
      displayName = [firstName, lastName].filter(Boolean).join(" ");
    } else {
      const snap = await accountRef.get();
      const account = snap.exists ? snap.data() : null;
      const salt = account && account.salt ? account.salt : "00000000000000000000000000000000";
      const expected = account && account.passwordHash ? account.passwordHash : "00".repeat(64);
      const actual = await hashPassword(password, salt);
      if (!account || !igualSeguro(actual, expected)) {
        return response(res, 401, { error: "Número ou palavra-passe incorrectos." });
      }
      uid = account.uid;
      displayName = typeof account.displayName === "string" ? account.displayName :
        [account.firstName, account.lastName].filter(Boolean).join(" ");
    }

    const token = await admin.auth(app).createCustomToken(uid, { phoneAuth: true, phone });
    return response(res, 200, { token, phone, displayName });
  } catch (error) {
    if (error && error.status === 429) return response(res, 429, { error: error.message });
    if (error && error.status === 409) return response(res, 409, { error: error.message });
    console.error("Falha na autenticação por telefone:", error && error.message);
    return response(res, 503, { error: "Não foi possível concluir o acesso neste momento. Tenta novamente mais tarde." });
  }
};

module.exports._test = { normalizarTelefone, hashPassword, igualSeguro };
