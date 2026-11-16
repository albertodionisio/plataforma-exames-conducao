"use strict";

const assert = require("node:assert/strict");
const {
  initializeApp,
  deleteApp
} = require("firebase/app");
const {
  initializeAuth,
  inMemoryPersistence,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  applyActionCode,
  reload,
  sendPasswordResetEmail,
  confirmPasswordReset,
  signOut,
  deleteUser,
  signInWithEmailAndPassword
} = require("firebase/auth");

const PROJECT_ID = "demo-estrada";
const EMAIL = "candidato@estrada.test";
const PASSWORD = "Estrada-teste-2026!";
const NEW_PASSWORD = "Estrada-nova-2026!";

async function aguardarCodigo(email, requestType) {
  const endpoint = "http://127.0.0.1:9099/emulator/v1/projects/" +
    PROJECT_ID + "/oobCodes";
  const limite = Date.now() + 15000;
  while (Date.now() < limite) {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error("Não foi possível consultar os códigos do Auth Emulator: " + response.status);
    }
    const data = await response.json();
    const item = (data.oobCodes || []).find((codigo) =>
      codigo.email === email && codigo.requestType === requestType
    );
    if (item && item.oobCode) return item.oobCode;
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error("O Auth Emulator não gerou o código " + requestType + " para " + email);
}

async function main() {
  const app = initializeApp({
    apiKey: "demo-api-key",
    authDomain: PROJECT_ID + ".firebaseapp.com",
    projectId: PROJECT_ID,
    appId: "1:123456789:web:demo"
  }, "auth-emulator-test");
  const auth = initializeAuth(app, { persistence: inMemoryPersistence });
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  let user = null;

  try {
    // Registo real contra o emulador, sem tocar em contas do projecto de produção.
    const credential = await createUserWithEmailAndPassword(auth, EMAIL, PASSWORD);
    user = credential.user;
    assert.equal(user.email, EMAIL);
    assert.equal(user.emailVerified, false, "Uma conta nova deve começar por não verificada.");

    // O emulador captura o email; aplicamos o código para testar o percurso completo.
    await sendEmailVerification(user);
    const verificationCode = await aguardarCodigo(EMAIL, "VERIFY_EMAIL");
    await applyActionCode(auth, verificationCode);
    await reload(user);
    assert.equal(user.emailVerified, true, "A confirmação deve marcar o email como verificado.");

    // A recuperação também é testada com um código capturado pelo emulador.
    await sendPasswordResetEmail(auth, EMAIL);
    const resetCode = await aguardarCodigo(EMAIL, "PASSWORD_RESET");
    await confirmPasswordReset(auth, resetCode, NEW_PASSWORD);
    await signOut(auth);

    const signedIn = (await signInWithEmailAndPassword(auth, EMAIL, NEW_PASSWORD)).user;
    assert.equal(signedIn.email, EMAIL);
    assert.equal(signedIn.emailVerified, true);
    console.log("APROVADO: Auth Emulator — registo, verificação de email, recuperação e login com nova palavra-passe.");
  } finally {
    if (user) {
      try {
        await signOut(auth);
        await deleteUser(user);
      } catch (_) {}
    }
    await deleteApp(app);
  }

}

main().catch((error) => {
  console.error("FALHOU: testes Firebase Authentication Emulator", error);
  process.exitCode = 1;
});
