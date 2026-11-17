"use strict";

const assert = require("node:assert/strict");
const endpoint = require("../api/auth/phone.js");
const { normalizarTelefone, hashPassword, igualSeguro } = endpoint._test;

async function main() {
  assert.equal(normalizarTelefone("841234567"), "+258841234567");
  assert.equal(normalizarTelefone("+258 84 123 4567"), "+258841234567");
  assert.equal(normalizarTelefone("00258841234567"), "+258841234567");
  assert.equal(normalizarTelefone("+447700900123"), "+447700900123");
  assert.equal(normalizarTelefone("telefone-invalido"), null);
  assert.equal(normalizarTelefone("123"), null);

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
