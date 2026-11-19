"use strict";
const lib = require("./_lib");
module.exports = async function paymentStatus(req, res) {
  if (req.method !== "GET") { res.setHeader("Allow", "GET"); return lib.json(res, 405, { error: "Método não permitido." }); }
  try {
    const user = await lib.authenticatedUser(req);
    const id = String(req.query && req.query.transactionId || "");
    if (!/^[a-f0-9-]{36}$/i.test(id)) return lib.json(res, 400, { error: "Referência inválida." });
    const db = lib.getAdmin().firestore(), ref = db.collection("payment_transactions").doc(id.toLowerCase());
    const snap = await ref.get();
    if (!snap.exists || snap.data().uid !== user.uid) return lib.json(res, 404, { error: "Pagamento não encontrado." });
    let saved = snap.data();
    if (saved.status !== "paid" && saved.providerPaymentId) {
      const current = await lib.epayRequest("/payments/" + encodeURIComponent(saved.providerPaymentId), { method: "GET" });
      const result = await lib.applyProviderPayment(db, current);
      saved = (await ref.get()).data();
      if (!result.matched && result.reason === "valor ou moeda não correspondem")
        return lib.json(res, 409, { error: "Os dados devolvidos pela ePay não correspondem ao pedido." });
    }
    return lib.json(res, 200, { transactionId: id, status: saved.status, planName: saved.planName,
      subscriptionActivated: saved.subscriptionActivated === true });
  } catch (error) {
    console.error("Falha ao consultar pagamento ESTRADA:", error && error.message);
    return lib.json(res, lib.safeError(error), { error: error && error.status === 401 ? error.message :
      "Não foi possível consultar o pagamento. Tenta novamente." });
  }
};
