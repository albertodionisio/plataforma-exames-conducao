"use strict";
const crypto = require("node:crypto");
const lib = require("./_lib");
module.exports = async function createPayment(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return lib.json(res, 405, { error: "Método não permitido." }); }
  try {
    const user = await lib.authenticatedUser(req);
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const plan = lib.PLANS[body.planCode];
    if (!plan) return lib.json(res, 400, { error: "Escolhe um plano pago válido." });
    const requestId = typeof body.requestId === "string" && /^[a-f0-9-]{36}$/i.test(body.requestId)
      ? body.requestId.toLowerCase() : crypto.randomUUID();
    const app = lib.getAdmin(), db = app.firestore();
    const paymentRef = db.collection("payment_transactions").doc(requestId);
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
        createdAt: app.firestore.FieldValue.serverTimestamp(), updatedAt: app.firestore.FieldValue.serverTimestamp()
      });
      return { existing: false };
    });
    if (created.existing) {
      if (created.data.planCode !== body.planCode) return lib.json(res, 409, { error: "Este pedido já foi usado para outro plano." });
      if (created.data.paymentUrl) return lib.json(res, 200, { transactionId: requestId, payment_url: created.data.paymentUrl, status: created.data.status });
      return lib.json(res, 409, { error: "O pagamento está a ser preparado. Aguarda alguns segundos e consulta novamente." });
    }
    const origin = lib.baseUrl(req);
    const payment = await lib.epayRequest("/payments", {
      method: "POST",
      body: JSON.stringify({
        amount: plan.amount, currency: "MZN", description: "Assinatura ESTRADA — " + plan.name,
        external_reference: externalReference,
        return_url: origin + "/?payment=" + encodeURIComponent(requestId) + "#/planos",
        cancel_url: origin + "/#/planos", callback_url: origin + "/api/payments/callback"
      })
    });
    if (!payment || !payment.id || !payment.payment_url) throw new Error("Resposta incompleta da ePay.");
    await paymentRef.update({
      providerPaymentId: String(payment.id), paymentUrl: String(payment.payment_url),
      status: String(payment.status || "pending"), updatedAt: app.firestore.FieldValue.serverTimestamp()
    });
    return lib.json(res, 201, { transactionId: requestId, payment_url: payment.payment_url, status: payment.status || "pending" });
  } catch (error) {
    console.error("Falha ao criar checkout ESTRADA:", error && error.message);
    return lib.json(res, lib.safeError(error), { error: error && [401,403].includes(error.status) ? error.message :
      "Não foi possível iniciar o pagamento. Tenta novamente mais tarde." });
  }
};
