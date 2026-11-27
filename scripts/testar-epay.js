#!/usr/bin/env node
"use strict";
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const lib = require("../lib/epay");
const raw = Buffer.from(JSON.stringify({ external_reference: "estrada_123e4567-e89b-12d3-a456-426614174000", status: "paid", amount: "50.00", currency: "MZN" }));
const apiSecret = "sk_test_example_secret_for_unit_tests";
const whSecret = "whsec_example_secret_for_unit_tests";
const sig = crypto.createHmac("sha256", apiSecret).update(raw).digest("hex");
const t = String(Math.floor(Date.now()/1000));
const whSig = "t=" + t + ",v1=" + crypto.createHmac("sha256", whSecret).update(t + ".").update(raw).digest("hex");
assert.equal(lib.verifyPaymentCallback(raw, sig, apiSecret), true);
assert.equal(lib.verifyPaymentCallback(raw, sig, "wrong"), false);
assert.equal(lib.verifyStoreWebhook(raw, whSig, whSecret), true);
assert.equal(lib.verifyStoreWebhook(raw, whSig, "wrong"), false);
assert.equal(lib.verifyStoreWebhook(raw, whSig, whSecret, Number(t)+301), false);
// O retorno do checkout deve preservar o hostname que o browser utilizou,
 // e nunca confiar no hostname efémero VERCEL_URL quando existe Host estável.
const envAnterior = {
  APP_BASE_URL: process.env.APP_BASE_URL,
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_URL: process.env.VERCEL_URL,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL
};
delete process.env.APP_BASE_URL;
process.env.VERCEL_ENV = "preview";
process.env.VERCEL_URL = "plataforma-exames-conducao-q5fj96ik1-jjb18.vercel.app";
assert.equal(lib.baseUrl({ headers: { host: "plataforma-exames-conducao-git-feat-firebase-full-3be547-jjb18.vercel.app" } }),
  "https://plataforma-exames-conducao-git-feat-firebase-full-3be547-jjb18.vercel.app",
  "o retorno deve usar o alias estável da sessão, não o deployment efémero");
assert.equal(lib.baseUrl({ headers: { host: "plataforma-exames-conducao-q5fj96ik1-jjb18.vercel.app" } }),
  "https://plataforma-exames-conducao-q5fj96ik1-jjb18.vercel.app",
  "os hosts de Preview do próprio projecto continuam permitidos");
assert.throws(() => lib.baseUrl({ headers: { host: "dominio-malicioso.example" } }), /não autorizado/,
  "um Host externo não pode controlar o return_url");
process.env.VERCEL_ENV = "production";
process.env.VERCEL_PROJECT_PRODUCTION_URL = "plataforma-exames-conducao.vercel.app";
assert.equal(lib.baseUrl({ headers: { host: "plataforma-exames-conducao-git-feature-jjb18.vercel.app" } }),
  "https://plataforma-exames-conducao.vercel.app",
  "produção deve continuar a usar o domínio oficial configurado");
for (const [key, value] of Object.entries(envAnterior)) {
  if (value === undefined) delete process.env[key]; else process.env[key] = value;
}

assert.equal(lib.amountToCents("50"), 5000);
assert.equal(lib.amountToCents("50.0"), 5000);
assert.equal(lib.amountToCents("150.00"), 15000);
assert.equal(lib.amountToCents("1.005"), null);
assert.equal(lib.amountToCents("-1.00"), null);
assert.equal(lib.txIdFromReference("estrada_123e4567-e89b-12d3-a456-426614174000"), "123e4567-e89b-12d3-a456-426614174000");
assert.equal(lib.txIdFromReference("estrada_bad"), null);
const chaveCheckout = "123e4567-e89b-42d3-a456-426614174000";
const idCheckout = lib.checkoutTransactionId("uid-conta-a", chaveCheckout);
assert.match(idCheckout, /^[a-f0-9]{8}-[a-f0-9]{4}-8[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/);
assert.equal(lib.checkoutTransactionId("uid-conta-a", chaveCheckout), idCheckout,
  "repetir o mesmo pedido da mesma conta deve produzir a mesma referência");
assert.notEqual(lib.checkoutTransactionId("uid-conta-b", chaveCheckout), idCheckout,
  "a mesma chave usada por outra conta deve produzir outra referência");
assert.notEqual(lib.checkoutTransactionId("uid-conta-a", "123e4567-e89b-42d3-a456-426614174001"), idCheckout,
  "uma nova chave de pedido deve produzir outra referência");
assert.throws(() => lib.checkoutTransactionId("uid-conta-a", "chave-inválida"), /idempotência inválida/);

assert.equal(lib.accountUidFromTransaction({ uid: "conta-joao", accountUid: "conta-joao" }), "conta-joao");
assert.equal(lib.accountUidFromTransaction({ uid: "conta-joao" }), "conta-joao", "transacções anteriores continuam compatíveis");
assert.equal(lib.accountUidFromTransaction({ uid: "conta-joao", accountUid: "conta-irma" }), null, "a conta de destino não pode ser alterada para outra conta");
assert.equal(lib.accountUidFromTransaction({ accountUid: "conta-joao" }), null, "a conta destinatária tem de ter UID autenticado");
const paymentSource = fs.readFileSync(require.resolve("../lib/epay"), "utf8");
const createSource = fs.readFileSync(require.resolve("../api/payments/create"), "utf8");
const statusSource = fs.readFileSync(require.resolve("../api/payments/status"), "utf8");
assert.ok(statusSource.includes("saved.subscriptionActivated !== true && saved.providerPaymentId"), "a consulta deve tentar reparar uma subscrição ainda não activada, mesmo quando o pagamento já está paid");
assert.ok(paymentSource.includes('db.collection("subscriptions").doc(accountUid)'), "a assinatura deve ser gravada no UID da conta iniciadora");
assert.ok(createSource.includes("uid: user.uid, accountUid: user.uid"), "o UID da conta deve ser fixado antes do checkout");
assert.ok(createSource.includes('req.headers["idempotency-key"]'), "o endpoint deve exigir a chave estável enviada pelo browser");
assert.ok(createSource.includes("lib.checkoutTransactionId(user.uid, idempotencyKey)"), "a referência deve ser determinística por UID e chave");
assert.ok(createSource.includes('"Idempotency-Key": requestId'), "a mesma referência deve ser enviada à ePay como chave idempotente");
assert.ok(createSource.includes('cancel_url: origin + "/?payment="'), "o retorno de cancelamento deve permitir consultar e libertar a chave do pedido");
const plansSource = fs.readFileSync(require.resolve("../public/assinaturas/planos"), "utf8");
assert.ok(plansSource.includes('"Idempotency-Key": chaveIdempotencia'), "o browser deve reutilizar a chave no checkout");
assert.ok(plansSource.includes("PREFIXO_CHAVE_CHECKOUT"), "a chave deve sobreviver a recarregamentos da sessão");
assert.ok(plansSource.includes("limparChavesCheckout()"), "a chave deve ser libertada após confirmação, falha ou cancelamento");

assert.doesNotMatch(paymentSource, /payment\\.phone|payer\\.phone|customer\\.phone/, "o telefone do pagador não pode determinar a conta beneficiária");
assert.deepEqual(Object.keys(lib.PLANS).sort(), ["monthly_basic","monthly_full","weekly_basic","weekly_full"].sort());
assert.equal(lib.PLANS.weekly_basic.amount, 50);
assert.equal(lib.PLANS.weekly_full.amount, 80);
assert.equal(lib.PLANS.monthly_basic.amount, 80);
assert.equal(lib.PLANS.monthly_basic.graceDays, 5);
assert.equal(lib.PLANS.monthly_full.amount, 150);
assert.equal(lib.PLANS.monthly_full.graceDays, 5);
assert.equal(lib.PLANS.weekly_basic.description, "ESTRADA-JB — Subscrição Semanal Básica");
assert.equal(lib.PLANS.weekly_full.description, "ESTRADA-JB — Subscrição Semanal Completa");
assert.equal(lib.PLANS.monthly_basic.description, "ESTRADA-JB — Subscrição Mensal Básica");
assert.equal(lib.PLANS.monthly_full.description, "ESTRADA-JB — Subscrição Mensal Completa");
console.log("APROVADO: ePay — HMAC, janela temporal, valores MZN, referências únicas e catálogo de planos.");


// Regressão: a criação do checkout pode gravar status=paid antes de activar a subscrição.
// Reprocessar esse pagamento tem de completar a activação, sem duplicar a validade.
async function testarActivacaoDePagamentoJaPago() {
  const id = "123e4567-e89b-12d3-a456-426614174000";
  const externalReference = "estrada_" + id;
  const docs = new Map();
  const paymentPath = "payment_transactions/" + id;
  docs.set(paymentPath, {
    uid: "conta-teste", accountUid: "conta-teste", planCode: "monthly_full",
    planName: "Mensal Completo", exams: 50, amount: "150.00", currency: "MZN",
    durationDays: 30, graceDays: 5, status: "paid", providerPaymentId: "provider-123"
  });
  function snapshot(path) {
    const value = docs.get(path);
    return { exists: value !== undefined, data: () => value && { ...value } };
  }
  function reference(collection, documentId) {
    const path = collection + "/" + documentId;
    return {
      path,
      get: async () => snapshot(path)
    };
  }
  const db = {
    collection: name => ({ doc: id => reference(name, id) }),
    runTransaction: async callback => {
      const writes = [];
      const tx = {
        get: async ref => snapshot(ref.path),
        set: (ref, value) => writes.push({ type: "set", path: ref.path, value }),
        update: (ref, value) => writes.push({ type: "update", path: ref.path, value })
      };
      const result = await callback(tx);
      for (const write of writes) {
        const previous = docs.get(write.path) || {};
        docs.set(write.path, write.type === "set" ? { ...write.value } : { ...previous, ...write.value });
      }
      return result;
    }
  };
  class FakeTimestamp {
    constructor(ms) { this.ms = ms; }
    toMillis() { return this.ms; }
    static fromMillis(ms) { return new FakeTimestamp(ms); }
    static now() { return new FakeTimestamp(Date.now()); }
  }
  const Module = require("node:module");
  const loadOriginal = Module._load;
  const fakeAdmin = { firestore: {
    Timestamp: FakeTimestamp,
    FieldValue: { serverTimestamp: () => ({ serverTimestamp: true }) }
  } };
  Module._load = function (request, parent, isMain) {
    if (request === "firebase-admin") return fakeAdmin;
    return loadOriginal.call(this, request, parent, isMain);
  };
  try {
    const payment = {
      id: "provider-123", external_reference: externalReference,
      amount: "150.00", currency: "MZN", status: "paid"
    };
    const first = await lib.applyProviderPayment(db, payment);
    assert.equal(first.matched, true, "o pagamento pago deve corresponder à transacção");
    assert.equal(first.subscriptionActivated, true, "o estado paid anterior não pode impedir a activação");
    assert.equal(first.duplicate, false, "a primeira activação em falta não é duplicada");
    const subscription = docs.get("subscriptions/conta-teste");
    assert.ok(subscription, "a subscrição tem de ser criada no UID que iniciou o checkout");
    assert.equal(subscription.planCode, "monthly_full");
    assert.equal(subscription.exams, 50);
    assert.equal(subscription.status, "active");
    const endBeforeDuplicate = subscription.endsAt.toMillis();
    assert.equal(docs.get(paymentPath).subscriptionActivated, true);
    const second = await lib.applyProviderPayment(db, payment);
    assert.equal(second.matched, true);
    assert.equal(second.duplicate, true, "repetir o callback após activação deve ser idempotente");
    assert.equal(docs.get("subscriptions/conta-teste").endsAt.toMillis(), endBeforeDuplicate,
      "o callback repetido não pode prolongar a validade duas vezes");
  } finally {
    Module._load = loadOriginal;
  }
}

async function testarCheckoutIdempotente() {
  const Module = require("node:module");
  const createPath = require.resolve("../api/payments/create");
  const documentos = new Map();
  const chavesFornecedor = [];
  let chamadasFornecedor = 0;
  let falharPrimeiraChamada = true;

  function referencia(coleccao, id) {
    const path = coleccao + "/" + id;
    return {
      path,
      update: async dados => documentos.set(path, { ...(documentos.get(path) || {}), ...dados })
    };
  }
  const db = {
    collection: nome => ({ doc: id => referencia(nome, id) }),
    runTransaction: async callback => {
      const escritas = [];
      const tx = {
        get: async ref => {
          const valor = documentos.get(ref.path);
          return { exists: valor !== undefined, data: () => valor && { ...valor } };
        },
        create: (ref, dados) => escritas.push({ tipo: "create", path: ref.path, dados }),
        update: (ref, dados) => escritas.push({ tipo: "update", path: ref.path, dados })
      };
      const resultado = await callback(tx);
      for (const escrita of escritas) {
        if (escrita.tipo === "create" && documentos.has(escrita.path))
          throw new Error("Documento já existe.");
        documentos.set(escrita.path, escrita.tipo === "create"
          ? { ...escrita.dados }
          : { ...(documentos.get(escrita.path) || {}), ...escrita.dados });
      }
      return resultado;
    }
  };
  const fakeLib = {
    PLANS: {
      weekly_basic: { name: "Semanal Básico", description: "Plano teste", amount: 50, days: 7, graceDays: 0, exams: 25 },
      weekly_full: { name: "Semanal Completo", description: "Plano teste", amount: 80, days: 7, graceDays: 0, exams: 50 }
    },
    authenticatedUser: async () => ({ uid: "uid-checkout-teste" }),
    checkoutTransactionId: lib.checkoutTransactionId,
    getDb: () => db,
    serverTimestamp: () => new Date(),
    baseUrl: () => "https://plataforma-exames-conducao.vercel.app",
    epayRequest: async (path, options) => {
      chamadasFornecedor++;
      chavesFornecedor.push(options.headers["Idempotency-Key"]);
      if (falharPrimeiraChamada) {
        falharPrimeiraChamada = false;
        throw new Error("falha simulada depois da criação local");
      }
      return {
        id: "provider-" + chamadasFornecedor,
        payment_url: "https://checkout.epay.co.mz/p/" + chamadasFornecedor,
        status: "pending"
      };
    },
    json: (res, status, data) => { res.status(status).setHeader("Cache-Control", "no-store").json(data); },
    safeError: error => error && error.status || 503
  };
  const loadOriginal = Module._load;
  delete require.cache[createPath];
  Module._load = function (request, parent, isMain) {
    if (request === "../../lib/epay" && parent && parent.filename === createPath) return fakeLib;
    return loadOriginal.call(this, request, parent, isMain);
  };
  let handler;
  try { handler = require(createPath); }
  finally { Module._load = loadOriginal; }

  async function pedido(key, planCode) {
    const response = {
      code: 0, body: null,
      status(value) { this.code = value; return this; },
      setHeader() { return this; },
      json(value) { this.body = value; return this; }
    };
    await handler({
      method: "POST",
      headers: { "idempotency-key": key, host: "plataforma-exames-conducao.vercel.app" },
      body: { planCode }
    }, response);
    return response;
  }

  const chave = "123e4567-e89b-42d3-a456-426614174010";
  const falha = await pedido(chave, "weekly_basic");
  assert.equal(falha.code, 503, "a falha temporária do fornecedor deve ser devolvida sem perder a referência local");
  const sucesso = await pedido(chave, "weekly_basic");
  assert.equal(sucesso.code, 201, "repetir a mesma chave deve recuperar o checkout que falhou");
  const idEsperado = lib.checkoutTransactionId("uid-checkout-teste", chave);
  assert.equal(sucesso.body.transactionId, idEsperado, "a tentativa recuperada deve manter o mesmo ID");
  assert.equal(chavesFornecedor.length, 2);
  assert.equal(chavesFornecedor[0], idEsperado);
  assert.equal(chavesFornecedor[1], idEsperado, "a ePay deve receber a mesma chave em cada tentativa");
  assert.equal(documentos.size, 1, "a repetição não pode criar uma segunda transacção Firestore");

  const repetido = await pedido(chave, "weekly_basic");
  assert.equal(repetido.code, 200, "um checkout já criado deve devolver a mesma ligação");
  assert.equal(repetido.body.transactionId, idEsperado);
  assert.equal(chamadasFornecedor, 2, "a repetição de um checkout existente não deve chamar a ePay novamente");

  const conflito = await pedido(chave, "weekly_full");
  assert.equal(conflito.code, 409, "a mesma chave não pode ser reutilizada para outro plano");
  const novo = await pedido("123e4567-e89b-42d3-a456-426614174011", "weekly_full");
  assert.equal(novo.code, 201, "uma nova chave deve permitir uma nova tentativa independente");
  assert.equal(documentos.size, 2);
  console.log("APROVADO: checkout idempotente — retry após falha, referência ePay estável, resposta repetida e conflito de plano.");
}

testarActivacaoDePagamentoJaPago().then(testarCheckoutIdempotente).then(() => {
  console.log("APROVADO: pagamento já marcado paid activa a subscrição uma vez; callbacks repetidos são idempotentes.");
}).catch(erro => {
  console.error(erro);
  process.exitCode = 1;
});
