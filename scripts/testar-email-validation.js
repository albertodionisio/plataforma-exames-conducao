"use strict";
const assert = require("node:assert/strict");
const { parseEmailAddress, isDisposableDomain, domainAcceptsMail, validateEmailAddress } = require("../lib/email-validation");
(async function main() {
  assert.equal(parseEmailAddress(" utilizador@gmail.com ").domain, "gmail.com");
  assert.equal(parseEmailAddress("sem-arroba"), null);
  assert.equal(parseEmailAddress("a..b@gmail.com"), null);
  assert.equal(parseEmailAddress("a@dominio-sem-ponto"), null);
  assert.equal(isDisposableDomain("mailinator.com"), true);
  assert.equal(isDisposableDomain("sub.yopmail.com"), true);
  assert.equal(isDisposableDomain("gmail.com"), false);
  const mxResolver = {
    async resolveMx(domain) { assert.equal(domain, "example.com"); return [{ exchange: "mx.example.com", priority: 10 }]; },
    async resolve4() { return []; }, async resolve6() { return []; }
  };
  assert.equal(await domainAcceptsMail("example.com", mxResolver), true);
  const fallbackResolver = {
    async resolveMx() { const e = new Error("no MX"); e.code = "ENODATA"; throw e; },
    async resolve4() { return ["192.0.2.1"]; }, async resolve6() { return []; }
  };
  assert.equal(await domainAcceptsMail("example.com", fallbackResolver), true);
  const noMailResolver = {
    async resolveMx() { const e = new Error("not found"); e.code = "ENOTFOUND"; throw e; },
    async resolve4() { const e = new Error("not found"); e.code = "ENOTFOUND"; throw e; },
    async resolve6() { const e = new Error("not found"); e.code = "ENOTFOUND"; throw e; }
  };
  assert.deepEqual(await validateEmailAddress("pessoa@mailinator.com", mxResolver), {
    valid: false, reason: "Este domínio de email temporário não é aceite. Usa um endereço pessoal."
  });
  assert.equal((await validateEmailAddress("pessoa@example.com", mxResolver)).valid, true);
  assert.equal((await validateEmailAddress("pessoa@nao-existe.invalid", noMailResolver)).valid, false);
  console.log("APROVADO: validação de formato, domínios com MX/A/AAAA e bloqueio de domínios temporários.");
})().catch(error => { console.error(error); process.exitCode = 1; });
