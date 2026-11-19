"use strict";

const fs = require("node:fs");
const {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds
} = require("@firebase/rules-unit-testing");
const {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where
} = require("firebase/firestore");

async function main() {
  const projectId = "demo-estrada";
  const rules = fs.readFileSync("firestore.rules", "utf8");
  const testEnv = await initializeTestEnvironment({
    projectId,
    firestore: { rules }
  });

  try {
    await testEnv.clearFirestore();
    const alice = testEnv.authenticatedContext("alice", { email: "alice@example.test", email_verified: true }).firestore();
    const bob = testEnv.authenticatedContext("bob", { email: "bob@example.test", email_verified: true }).firestore();
    const unverified = testEnv.authenticatedContext("unverified", { email: "unverified@example.test", email_verified: false }).firestore();
    const phoneUser = testEnv.authenticatedContext("phone-user", { phoneAuth: true, phone: "+258841234567" }).firestore();
    const anonymous = testEnv.unauthenticatedContext().firestore();

    await testEnv.withSecurityRulesDisabled(async (context) => {
      const admin = context.firestore();
      await setDoc(doc(admin, "exam_attempts/alice-attempt"), { uid: "alice", score: 18.4, status: "approved" });
      await setDoc(doc(admin, "exam_attempts/bob-attempt"), { uid: "bob", score: 16.8, status: "failed" });
      await setDoc(doc(admin, "subscriptions/alice"), { uid: "alice", plan: "monthly", active: true });
      await setDoc(doc(admin, "subscriptions/bob"), { uid: "bob", plan: "weekly", active: true });
      await setDoc(doc(admin, "payment_transactions/alice-payment"), { uid: "alice", status: "confirmed", amount: 150 });
      await setDoc(doc(admin, "payment_transactions/bob-payment"), { uid: "bob", status: "confirmed", amount: 80 });
    });

    await assertFails(getDoc(doc(anonymous, "users/alice")));
    await assertFails(getDoc(doc(bob, "users/alice")));
    await assertFails(setDoc(doc(unverified, "users/unverified"), { uid: "unverified", email: "unverified@example.test" }));
    await assertSucceeds(setDoc(doc(alice, "users/alice"), { uid: "alice", email: "alice@example.test", displayName: "Alice", createdAt: new Date() }));
    await assertSucceeds(updateDoc(doc(alice, "users/alice"), { displayName: "Alice B.", updatedAt: new Date() }));
    await assertFails(updateDoc(doc(alice, "users/alice"), { email: "attacker@example.test" }));
    await assertFails(updateDoc(doc(alice, "users/alice"), { uid: "bob" }));
    await assertFails(getDocs(collection(alice, "users")));
    await assertFails(deleteDoc(doc(alice, "users/alice")));

    await assertSucceeds(setDoc(doc(phoneUser, "users/phone-user"), { uid: "phone-user", phone: "+258841234567", displayName: "Conta telefónica", createdAt: new Date() }));
    await assertSucceeds(getDoc(doc(phoneUser, "users/phone-user")));
    await assertSucceeds(updateDoc(doc(phoneUser, "users/phone-user"), { displayName: "Nome actualizado", updatedAt: new Date() }));
    await assertFails(setDoc(doc(phoneUser, "users/fake-phone"), { uid: "fake-phone", phone: "+258849999999", createdAt: new Date() }));
    await assertFails(updateDoc(doc(phoneUser, "users/phone-user"), { phone: "+258849999999" }));
    await assertFails(updateDoc(doc(phoneUser, "users/phone-user"), { phone: null }));
    await assertFails(deleteDoc(doc(phoneUser, "users/phone-user")));
    await assertFails(getDoc(doc(phoneUser, "users/alice")));
    await assertFails(setDoc(doc(alice, "users/alice"), { uid: "alice", email: "alice@example.test", phone: "+258841234567", createdAt: new Date() }));

    for (const path of ["phone_auth_accounts/private", "phone_auth_rate_limits/private"]) {
      await assertFails(getDoc(doc(phoneUser, path)));
    }
    for (const name of ["phone_auth_accounts", "phone_auth_rate_limits"]) {
      await assertFails(getDocs(collection(phoneUser, name)));
    }
    await assertFails(setDoc(doc(phoneUser, "phone_auth_accounts/fake"), { uid: "phone-user", phone: "+258841234567", passwordHash: "forged" }));
    await assertFails(setDoc(doc(phoneUser, "phone_auth_rate_limits/fake"), { count: 0 }));

    await assertSucceeds(getDoc(doc(alice, "exam_attempts/alice-attempt")));
    await assertFails(getDoc(doc(alice, "exam_attempts/bob-attempt")));
    await assertSucceeds(getDocs(query(collection(alice, "exam_attempts"), where("uid", "==", "alice"))));
    await assertFails(getDocs(collection(alice, "exam_attempts")));
    await assertFails(setDoc(doc(alice, "exam_attempts/fake"), { uid: "alice", score: 20 }));
    await assertFails(updateDoc(doc(alice, "exam_attempts/alice-attempt"), { score: 20 }));
    await assertFails(deleteDoc(doc(alice, "exam_attempts/alice-attempt")));
    await assertFails(getDocs(query(collection(alice, "exam_attempts"), where("uid", "==", "bob"))));

    await assertSucceeds(getDoc(doc(alice, "subscriptions/alice")));
    await assertFails(getDoc(doc(alice, "subscriptions/bob")));
    await assertFails(setDoc(doc(alice, "subscriptions/alice"), { uid: "alice", plan: "premium", active: true }));
    await assertFails(getDocs(collection(alice, "subscriptions")));
    await assertFails(updateDoc(doc(alice, "subscriptions/alice"), { active: false }));
    await assertFails(deleteDoc(doc(alice, "subscriptions/alice")));
    await assertSucceeds(getDoc(doc(alice, "payment_transactions/alice-payment")));
    await assertFails(getDoc(doc(alice, "payment_transactions/bob-payment")));
    await assertSucceeds(getDocs(query(collection(alice, "payment_transactions"), where("uid", "==", "alice"))));
    await assertFails(getDocs(collection(alice, "payment_transactions")));
    await assertFails(getDocs(query(collection(alice, "payment_transactions"), where("uid", "==", "bob"))));
    await assertFails(setDoc(doc(alice, "payment_transactions/fake"), { uid: "alice", status: "confirmed", amount: 999999 }));
    await assertFails(updateDoc(doc(alice, "payment_transactions/alice-payment"), { amount: 1 }));
    await assertFails(deleteDoc(doc(alice, "payment_transactions/alice-payment")));
    await assertFails(getDoc(doc(alice, "admin/secrets")));

    console.log("APROVADO: regras Firestore — perfis email/telefone, claims, credenciais privadas, tentativas, assinaturas, pagamentos e default-deny.");
  } finally {
    await testEnv.cleanup();
  }
}

main().catch((error) => {
  console.error("FALHOU: testes das regras Firestore", error);
  process.exitCode = 1;
});
