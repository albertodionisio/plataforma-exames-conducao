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
assert.equal(lib.accountUidFromTransaction({ uid: "conta-joao", accountUid: "conta-joao" }), "conta-joao");
assert.equal(lib.accountUidFromTransaction({ uid: "conta-joao" }), "conta-joao", "transacções anteriores continuam compatíveis");
assert.equal(lib.accountUidFromTransaction({ uid: "conta-joao", accountUid: "conta-irma" }), null, "a conta de destino não pode ser alterada para outra conta");
assert.equal(lib.accountUidFromTransaction({ accountUid: "conta-joao" }), null, "a conta destinatária tem de ter UID autenticado");
const paymentSource = fs.readFileSync(require.resolve("../lib/epay"), "utf8");
const createSource = fs.readFileSync(require.resolve("../api/payments/create"), "utf8");
assert.ok(paymentSource.includes('db.collection("subscriptions").doc(accountUid)'), "a assinatura deve ser gravada no UID da conta iniciadora");
assert.ok(createSource.includes("uid: user.uid, accountUid: user.uid"), "o UID da conta deve ser fixado antes do checkout");
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
  const adminPath = require.resolve("firebase-admin");
  const previousAdmin = require.cache[adminPath];
  require.cache[adminPath] = {
    id: adminPath, filename: adminPath, loaded: true,
    exports: { firestore: {
      Timestamp: FakeTimestamp,
      FieldValue: { serverTimestamp: () => ({ serverTimestamp: true }) }
    } }
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
    if (previousAdmin) require.cache[adminPath] = previousAdmin;
    else delete require.cache[adminPath];
  }
}

testarActivacaoDePagamentoJaPago().then(() => {
  console.log("APROVADO: pagamento já marcado paid activa a subscrição uma vez; callbacks repetidos são idempotentes.");
}).catch(erro => {
  console.error(erro);
  process.exitCode = 1;
});
