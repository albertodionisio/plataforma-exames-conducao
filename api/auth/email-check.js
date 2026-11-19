"use strict";
const { validateEmailAddress } = require("../../lib/email-validation");
module.exports = async function checkEmail(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).setHeader("Cache-Control", "no-store").json({ valid: false, error: "Método não permitido." }); }
  const body = req.body && typeof req.body === "object" ? req.body : {};
  try {
    const result = await validateEmailAddress(body.email);
    if (!result.valid) return res.status(400).setHeader("Cache-Control", "no-store").json({ valid: false, error: result.reason });
    return res.status(200).setHeader("Cache-Control", "no-store").json({ valid: true });
  } catch (error) {
    console.error("Falha na validação do domínio de email:", error && error.code);
    return res.status(503).setHeader("Cache-Control", "no-store").json({ valid: false, error: "Não foi possível validar o domínio agora. Tenta novamente." });
  }
};
