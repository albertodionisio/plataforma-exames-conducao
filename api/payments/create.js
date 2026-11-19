"use strict";
const crypto = require("node:crypto");
const lib = require("../../lib/epay");
module.exports = async function createPayment(req, res) {
  let paymentRef = null;
  let createdNew = false;
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return lib.json(res, 405, { error: "Método não permitido." }); }
  try {
    const user = await lib.authenticatedUser(req);
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const plan = lib.PLANS[body.planCode];
    if (!plan) return lib.json(res, 400, { error: "Escolhe um plano pago válido." });
    const requestId = crypto.randomUUID();
    const db = lib.getDb();
    paymentRef = db.collection("payment_transactions").doc(requestId);
    const externalReference = "estrada_" + requestId;
    const created = await db.runTransaction(async tx => {
      const snap = await tx.get(paymentRef);
      if (snap.exists) {
        const old = snap.data();
        if (old.uid !== user.uid) { const e = new Error("Referência de pagamento inválida."); e.status = 403; throw e; }
        return { existing: true, data: old };
      }
      tx.create(paymentRef, {
        uid: user.uid, planCode: body.planCode, planName: plan.name, exams: plan.exams,
        amount: plan.amount.toFixed(2), currency: "MZN", durationDays: plan.days, graceDays: plan.graceDays,
        status: "creating", provider: "epay", externalReference,
        createdAt: lib.serverTimestamp(), updatedAt: lib.serverTimestamp()
      });
      return { existing: false };
    });
    createdNew = !created.existing;
    if (created.existing) {
      if (created.data.planCode !== body.planCode) return lib.json(res, 409, { error: "Este pedido já foi usado para outro plano." });
      if (created.data.paymentUrl) return lib.json(res, 200, { transactionId: requestId, payment_url: created.data.paymentUrl, status: created.data.status });
      return lib.json(res, 409, { error: "O pagamento está a ser preparado. Aguarda alguns segundos e consulta novamente." });
    }
    const origin = lib.baseUrl(req);
    const payment = await lib.epayRequest("/payments", {
      method: "POST",
      headers: { "Idempotency-Key": requestId },
      body: JSON.stringify({
        amount: plan.amount, currency: "MZN", description: plan.description,
        external_reference: externalReference,
        return_url: origin + "/?payment=" + encodeURIComponent(requestId) + "#/planos",
        cancel_url: origin + "/#/planos", callback_url: origin + "/api/payments/callback"
      })
    });
    if (!payment || !payment.id || !payment.payment_url) throw new Error("Resposta incompleta da ePay.");
    await paymentRef.update({
      providerPaymentId: String(payment.id), paymentUrl: String(payment.payment_url),
      status: String(payment.status || "pending"), updatedAt: lib.serverTimestamp()
    });
    if (payment.status === "paid") await lib.applyProviderPayment(db, payment);
    return lib.json(res, 201, { transactionId: requestId, payment_url: payment.payment_url, status: payment.status || "pending" });
  } catch (error) {
    if (paymentRef && createdNew) {
      try { await paymentRef.update({ status: "failed", updatedAt: lib.serverTimestamp() }); } catch (_) {}
    }
    console.error("Falha ao criar checkout ESTRADA:", error && error.message);
    return lib.json(res, lib.safeError(error), { error: error && [401,403].includes(error.status) ? error.message :
      "Não foi possível iniciar o pagamento. Tenta novamente mais tarde." });
  }
};
