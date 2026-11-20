# Firestore: colecção payment_transactions (2026-11-20, 19:46)

Imagem: `2026-11-20_firestore-payment-transactions.png`. Foram tapados os identificadores dos documentos e o `uid` do utilizador, porque o repositório é público. Os valores dos campos aparecem cortados ("...") no ecrã original; não há chaves nem segredos.

Conteúdo: Firebase Console, projecto `plataforma-exames-conducao`, Firestore > Dados (base `(default)`, plano Spark). Colecções na raiz:
- `payment_transactions` (aberta)
- `phone_auth...` (duas colecções com este prefixo, nomes cortados)
- `subscriptio...` (nome cortado, provavelmente `subscriptions`)

Dentro de `payment_transactions` há **7 documentos**. Um deles está aberto e tem estes campos (nome e tipo; valores não visíveis):
`amount` (string), `createdAt` (timestamp), `currency` (string), `durationDays` (int64), `exams` (int64, valor **25**), `externalReference` (string), `graceDays` (int64), `paymentUrl` (string), `planCode` (string), `planName` (string), `provider` (string), `providerPaymentId` (string), `status` (string), `uid` (string), `updatedAt` (timestamp).

## Leitura
- A integração de pagamento (ePay) já está a **gravar transacções** no Firestore: há 7 registos de teste ou reais. Não se sabe daqui se são de teste.
- O campo `exams` com 25 e `durationDays`/`graceDays` mostram que cada transacção guarda o plano (número de exames, duração e carência).
- Não se vê o `status` (valor cortado), por isso este print não prova que algum pagamento foi **confirmado**.
- Não editar nem apagar documentos à mão na consola (os ícones de lápis e lixo aparecem ao lado de cada campo).
