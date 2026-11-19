"use strict";
const crypto = require("node:crypto");
const PROJECT_ID = "plataforma-exames-conducao";
const EPAY_BASE = "https://checkout.epay.co.mz/api/v1";
const MAX_BODY = 32 * 1024;
const PLANS = Object.freeze({
  weekly_basic: { name: "Semanal Básico", amount: 50, days: 7, graceDays: 0, exams: 25 },
  weekly_full: { name: "Semanal Completo", amount: 80, days: 7, graceDays: 0, exams: 50 },
  monthly_basic: { name: "Mensal Básico", amount: 80, days: 30, graceDays: 5, exams: 25 },
  monthly_full: { name: "Mensal Completo", amount: 150, days: 30, graceDays: 5, exams: 50 }
});
function json(res, status, data) {
  res.status(status).setHeader("Cache-Control", "no-store").json(data);
}
function getAdmin() {
  const admin = require("firebase-admin");
  if (admin.apps.length) return admin.app();
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON não configurada.");
  const serviceAccount = JSON.parse(raw);
  if (serviceAccount.project_id !== PROJECT_ID) throw new Error("A credencial Firebase pertence a outro projecto.");
  return admin.initializeApp({ credential: admin.credential.cert(serviceAccount), projectId: PROJECT_ID });
}
async function authenticatedUser(req) {
  const match = /^Bearer\s+(.+)$/i.exec(String(req.headers.authorization || ""));
  if (!match) { const e = new Error("Inicia sessão para continuar."); e.status = 401; throw e; }
  const admin = require("firebase-admin");
  return admin.auth(getAdmin()).verifyIdToken(match[1], true);
}
function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []; let size = 0;
    req.on("data", chunk => {
      size += chunk.length;
      if (size > MAX_BODY) { const e = new Error("Corpo demasiado grande."); e.status = 413; reject(e); req.destroy(); return; }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}
function parseJson(raw) {
  try { return JSON.parse(raw.toString("utf8")); }
  catch (_) { const e = new Error("JSON inválido."); e.status = 400; throw e; }
}
function timingSafeHex(actual, expected) {
  if (typeof actual !== "string" || typeof expected !== "string" ||
      !/^[a-f0-9]{64}$/i.test(actual) || !/^[a-f0-9]{64}$/i.test(expected)) return false;
  const a = Buffer.from(actual, "hex"), b = Buffer.from(expected, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function verifyPaymentCallback(raw, signature, secret) {
  if (!secret || typeof signature !== "string") return false;
  return timingSafeHex(signature.trim(), crypto.createHmac("sha256", secret).update(raw).digest("hex"));
}
function verifyStoreWebhook(raw, signature, secret, nowSeconds) {
  if (!secret || typeof signature !== "string") return false;
  const m = /^t=(\d+),v1=([a-f0-9]{64})$/i.exec(signature.trim());
  if (!m) return false;
  const timestamp = Number(m[1]), now = Number.isFinite(nowSeconds) ? nowSeconds : Math.floor(Date.now()/1000);
  if (!Number.isSafeInteger(timestamp) || Math.abs(now - timestamp) > 300) return false;
  const expected = crypto.createHmac("sha256", secret).update(m[1] + ".").update(raw).digest("hex");
  return timingSafeHex(m[2], expected);
}
function amountToCents(value) {
  const s = String(value == null ? "" : value).trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(s)) return null;
  const p = s.split(".");
  return Number(p[0]) * 100 + Number((p[1] || "").padEnd(2, "0"));
}
function baseUrl(req) {
  const configured = process.env.APP_BASE_URL;
  if (configured) {
    const u = new URL(configured);
    if (u.protocol !== "https:" && u.hostname !== "localhost") throw new Error("APP_BASE_URL deve usar HTTPS.");
    return u.origin;
  }
  const host = process.env.VERCEL_ENV === "production"
    ? (process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || req.headers.host)
    : (process.env.VERCEL_URL || req.headers.host);
  if (!host || host.includes("/") || host.includes("@")) throw new Error("Host da aplicação inválido.");
  if (host === "localhost:3000" || host.startsWith("127.0.0.1:")) return "http://" + host;
  return "https://" + host;
}
function epaySecret() {
  const value = process.env.EPAY_SECRET_KEY;
  if (!value || !/^sk_(test|live)_[A-Za-z0-9_-]{12,}$/.test(value)) throw new Error("EPAY_SECRET_KEY não configurada ou inválida.");
  return value;
}
async function epayRequest(path, options) {
  const response = await fetch(EPAY_BASE + path, {
    ...options,
    headers: { Authorization: "Bearer " + epaySecret(), Accept: "application/json",
      "Content-Type": "application/json", ...(options && options.headers || {}) }
  });
  let data; try { data = await response.json(); } catch (_) { data = null; }
  if (!response.ok) {
    const e = new Error("A ePay não conseguiu processar o pedido.");
    e.status = response.status >= 400 && response.status < 500 ? 422 : 502; throw e;
  }
  return data && (data.payment || data.data || data);
}
function txIdFromReference(reference) {
  const m = /^estrada_([a-f0-9-]{36})$/i.exec(String(reference || ""));
  return m ? m[1].toLowerCase() : null;
}
async function applyProviderPayment(db, payment) {
  const id = txIdFromReference(payment && payment.external_reference);
  if (!id) return { matched: false, reason: "external_reference inválida" };
  const paymentRef = db.collection("payment_transactions").doc(id);
  const snapshot = await paymentRef.get();
  if (!snapshot.exists) return { matched: false, reason: "transacção não encontrada" };
  const saved = snapshot.data();
  if (amountToCents(payment.amount) !== amountToCents(saved.amount) || payment.currency !== "MZN")
    return { matched: false, reason: "valor ou moeda não correspondem" };
  if (!["paid", "failed", "pending", "cancelled"].includes(payment.status))
    return { matched: false, reason: "estado de pagamento desconhecido" };
  const admin = require("firebase-admin");
  const subscriptionRef = db.collection("subscriptions").doc(saved.uid);
  return db.runTransaction(async tx => {
    const currentSnap = await tx.get(paymentRef), current = currentSnap.data();
    if (!current) return { matched: false, reason: "transacção removida" };
    if (current.status === "paid") return { matched: true, duplicate: true, status: "paid" };
    const update = {
      status: payment.status, providerPaymentId: String(payment.id || current.providerPaymentId || ""),
      paymentType: payment.payment_type || null, updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    if (payment.status === "paid") {
      const subSnap = await tx.get(subscriptionRef), existing = subSnap.exists ? subSnap.data() : null;
      const now = Date.now();
      const oldEnd = existing && existing.endsAt && typeof existing.endsAt.toMillis === "function" ? existing.endsAt.toMillis() : 0;
      const endsAtMs = Math.max(now, oldEnd) + Number(saved.durationDays) * 86400000;
      tx.set(subscriptionRef, {
        uid: saved.uid, planCode: saved.planCode, planName: saved.planName, exams: saved.exams,
        status: "active", provider: "epay", lastPaymentTransactionId: id,
        startsAt: admin.firestore.Timestamp.fromMillis(now),
        endsAt: admin.firestore.Timestamp.fromMillis(endsAtMs),
        graceUntil: admin.firestore.Timestamp.fromMillis(endsAtMs + Number(saved.graceDays || 0) * 86400000),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      update.paidAt = admin.firestore.Timestamp.now();
      update.subscriptionActivated = true;
    }
    tx.update(paymentRef, update);
    return { matched: true, duplicate: false, status: payment.status };
  });
}
function getDb() { const admin = require("firebase-admin"); return admin.firestore(getAdmin()); }
function serverTimestamp() { const admin = require("firebase-admin"); return admin.firestore.FieldValue.serverTimestamp(); }
function safeError(error) { return error && error.status ? error.status : 503; }
module.exports = { PLANS, json, getAdmin, getDb, serverTimestamp, authenticatedUser, readRawBody, parseJson,
  verifyPaymentCallback, verifyStoreWebhook, amountToCents, baseUrl, epaySecret,
  epayRequest, txIdFromReference, applyProviderPayment, safeError };
