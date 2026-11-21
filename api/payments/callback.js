"use strict";
const lib = require("../../lib/epay");
module.exports = async function paymentCallback(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return lib.json(res, 405, { error: "Método não permitido." }); }
  try {
    const raw = await lib.readRawBody(req);
    if (!lib.verifyPaymentCallback(raw, req.headers["x-educavelpay-signature"], process.env.EPAY_SECRET_KEY))
      return lib.json(res, 401, { error: "Assinatura do aviso inválida." });
    const payload = lib.parseJson(raw), payment = payload.payment || payload.data || payload;
    const result = await lib.applyProviderPayment(lib.getAdmin().firestore(), payment);
    if (!result.matched)
      return lib.json(res, 400, { error: "Dados do pagamento não correspondem à transacção." });
    return lib.json(res, 200, { received: true, matched: result.matched, duplicate: !!result.duplicate });
  } catch (error) {
    console.error("Falha no callback ePay:", error && error.message);
    return lib.json(res, lib.safeError(error), { error: "Não foi possível processar o aviso." });
  }
};
module.exports.config = { api: { bodyParser: false } };
