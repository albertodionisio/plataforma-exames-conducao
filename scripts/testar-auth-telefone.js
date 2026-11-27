"use strict";

const assert = require("node:assert/strict");
const endpoint = require("../api/auth/phone.js");
const { normalizarTelefone, hashPassword, igualSeguro } = endpoint._test;

async function main() {
  for (const prefix of ["84", "85", "86", "87", "88"]) {
    const national = prefix + "1234567";
    assert.equal(normalizarTelefone(national), "+258" + national, "Prefixo " + prefix + " deve ser aceite.");
    assert.equal(normalizarTelefone("+258 " + prefix + " 123 4567"), "+258" + national);
    assert.equal(normalizarTelefone("00258" + national), "+258" + national);
    assert.equal(normalizarTelefone("258" + national), "+258" + national);
  }
  for (const invalid of [
    "831234567", "891234567", "801234567", "84123456", "8412345678",
    "+258831234567", "+258891234567", "+447700900123", "telefone-invalido", "123"
  ]) {
    assert.equal(normalizarTelefone(invalid), null, "Número inválido deve ser rejeitado: " + invalid);
  }

  const salt = "a1b2c3d4e5f60718293a4b5c6d7e8f90";
  const first = await hashPassword("Palavra-passe-segura-2026", salt);
  const same = await hashPassword("Palavra-passe-segura-2026", salt);
  const different = await hashPassword("Outra-palavra-passe-2026", salt);
  assert.equal(first.length, 128, "scrypt deve produzir 64 bytes em hexadecimal.");
  assert.equal(igualSeguro(first, same), true);
  assert.equal(igualSeguro(first, different), false);
  assert.equal(igualSeguro(first, "00"), false);

  const source = require("node:fs").readFileSync("api/auth/phone.js", "utf8");
  assert.match(source, /crypto\.scrypt/);
  assert.match(source, /timingSafeEqual/);
  assert.match(source, /createCustomToken/);
  assert.match(source, /phone_auth_accounts/);
  assert.match(source, /phone_auth_rate_limits/);
  assert.doesNotMatch(source, /password:\s*password\s*[,}]/);

  console.log("APROVADO: autenticação por telefone — normalização E.164, scrypt, comparação segura, custom token e limites de tentativas.");
}

main().catch((error) => {
  console.error("FALHOU: autenticação por telefone", error);
  process.exitCode = 1;
});
