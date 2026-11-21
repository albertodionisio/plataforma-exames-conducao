"use strict";
const dns = require("node:dns").promises;
const { domainToASCII } = require("node:url");
const DISPOSABLE_DOMAINS = new Set([
  "10minutemail.com", "guerrillamail.com", "mailinator.com",
  "temp-mail.org", "tempmail.com", "yopmail.com",
  "getnada.com", "throwawaymail.com", "maildrop.cc"
]);
function parseEmailAddress(value) {
  if (typeof value !== "string") return null;
  const email = value.trim();
  if (!email || email.length > 254 || /\s/.test(email)) return null;
  const at = email.lastIndexOf("@");
  if (at < 1 || at === email.length - 1) return null;
  const local = email.slice(0, at), rawDomain = email.slice(at + 1).toLowerCase().replace(/\.$/, "");
  if (local.length > 64 || !/^[A-Z0-9.!#$%&'*+/=?^`{|}~-]+$/i.test(local) ||
      local.startsWith(".") || local.endsWith(".") || local.includes("..")) return null;
  const domain = domainToASCII(rawDomain);
  if (!domain || domain.length > 253 || !domain.includes(".") ||
      domain.split(".").some(label => !label || label.length > 63 ||
        !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(label))) return null;
  return { email, domain };
}
function isDisposableDomain(domain) {
  const value = String(domain || "").toLowerCase();
  return Array.from(DISPOSABLE_DOMAINS).some(item => value === item || value.endsWith("." + item));
}
async function domainAcceptsMail(domain, resolver) {
  const lookup = resolver || dns;
  try {
    const mx = await lookup.resolveMx(domain);
    if (Array.isArray(mx) && mx.length) return true;
  } catch (error) {
    if (!error || !["ENODATA", "ENOTFOUND", "ENOTIMP"].includes(error.code)) throw error;
  }
  // RFC fallback: a domain without MX may still receive mail through A/AAAA.
  for (const method of ["resolve4", "resolve6"]) {
    try {
      const records = await lookup[method](domain);
      if (Array.isArray(records) && records.length) return true;
    } catch (error) {
      if (!error || !["ENODATA", "ENOTFOUND", "ENOTIMP"].includes(error.code)) throw error;
    }
  }
  return false;
}
async function validateEmailAddress(value, resolver) {
  const parsed = parseEmailAddress(value);
  if (!parsed) return { valid: false, reason: "Formato de email inválido." };
  if (isDisposableDomain(parsed.domain)) return { valid: false, reason: "Este domínio de email temporário não é aceite. Usa um endereço pessoal." };
  if (!await domainAcceptsMail(parsed.domain, resolver))
    return { valid: false, reason: "Este domínio não parece estar configurado para receber emails. Confirma o endereço." };
  return { valid: true, email: parsed.email, domain: parsed.domain };
}
module.exports = { parseEmailAddress, isDisposableDomain, domainAcceptsMail, validateEmailAddress };
