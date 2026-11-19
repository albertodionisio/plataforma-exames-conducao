"use strict";
const lib = require("../../lib/epay");
module.exports = async function storeWebhook(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return lib.json(res, 405, { error: "Método não permitido." }); }
  try {
    const raw = await lib.readRawBody(req);
    if (!lib.verifyStoreWebhook(raw, req.headers["x-epay-signature"], process.env.EPAY_WEBHOOK_SECRET))
      return lib.json(res, 401, { error: "Assinatura do webhook inválida." });
    const event = String(req.headers["x-epay-event"] || "");
    if (!["payment.paid", "payment.failed"].includes(event))
      return lib.json(res, 200, { received: true, ignored: true });
    const payload = lib.parseJson(raw), payment = payload.payment || payload.data || payload;
    if (!payment.status) payment.status = event === "payment.paid" ? "paid" : "failed";
    const result = await lib.applyProviderPayment(lib.getAdmin().firestore(), payment);
    return lib.json(res, 200, { received: true, matched: result.matched, duplicate: !!result.duplicate });
  } catch (error) {
    console.error("Falha no webhook geral ePay:", error && error.message);
    return lib.json(res, lib.safeError(error), { error: "Não foi possível processar o webhook." });
  }
};
module.exports.config = { api: { bodyParser: false } };
