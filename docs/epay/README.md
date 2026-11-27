# Integração ePay — ESTRADA-JB

**Actualizado:** 27 de Novembro de 2026  
**Branch:** `feat/firebase-full-migration`  
**Estado:** fluxo completo comprovado pelo proprietário em Sandbox; não activo em produção.

O estado geral e as evidências estão em [Estado actual](../ESTADO-ATUAL.md). Esta página descreve o fluxo implementado e as limitações actuais.

## Estado confirmado

- O checkout individual é criado pelo backend; a aplicação não utiliza o checkout fixo do produto do painel como fluxo normal.
- O proprietário testou no Preview o pagamento Sandbox, a confirmação, a activação da assinatura e o desbloqueio dos exames.
- O teste automatizado `scripts/testar-epay.js` passou no GitHub Actions run `45833068199`.
- A integração não está autorizada para pagamentos reais. Não trocar para chave live nem fazer deploy de produção sem aprovação expressa.

## Fluxo implementado

1. O utilizador inicia sessão no Firebase e escolhe um plano pago.
2. O frontend obtém um Firebase ID token e envia `planCode` para `POST /api/payments/create`.
3. O backend valida a identidade, consulta o catálogo de planos do servidor e fixa `uid` e `accountUid` no registo antes de criar o checkout. Não confia no preço enviado pelo browser.
4. O servidor gera a referência UUID e cria o registo em `payment_transactions/{transactionId}`.
5. O backend chama a API de pagamentos da ePay e devolve `payment_url`; o frontend valida que o destino é HTTPS em `checkout.epay.co.mz` e redirecciona o comprador.
6. A ePay envia callback para `POST /api/payments/callback`. O backend valida a assinatura HMAC do corpo bruto, referência, valor e moeda.
7. O retorno do browser não activa a assinatura. O frontend consulta `GET /api/payments/status?transactionId=UUID`; o backend verifica a propriedade da transacção e consulta o estado junto da ePay.
8. Após confirmação válida como `paid`, a subscrição é activada em transacção Firestore em `subscriptions/{accountUid}`. A operação é idempotente; callbacks repetidos não prolongam duas vezes a validade.
9. A conta beneficiária é sempre o UID autenticado que iniciou o checkout. O pagador pode usar M-Pesa ou outro meio pertencente a familiar/terceiro.

## Endpoints

- `POST /api/payments/create` — requer Firebase ID token; recebe `{ planCode }`; referência gerada no servidor.
- `GET /api/payments/status?transactionId=UUID` — consulta apenas transacções do próprio utilizador e tenta recuperar uma activação ainda não concluída.
- `POST /api/payments/callback` — callback individual da ePay; valida HMAC-SHA256 com a chave API.
- `POST /api/payments/webhook` — endpoint opcional para eventos gerais; valida `X-Epay-Signature` com timestamp e HMAC, quando configurado.

## Catálogo de planos no servidor

Os valores abaixo são os definidos no código desta branch e devem ser confirmados em `lib/epay.js` antes de qualquer alteração comercial.

| Código | Plano | Valor | Duração | Carência |
|---|---|---:|---:|---:|
| `weekly_basic` | Semanal Básico | 50 MT | 7 dias | 0 dias |
| `weekly_full` | Semanal Completo | 80 MT | 7 dias | 0 dias |
| `monthly_basic` | Mensal Básico | 80 MT | 30 dias | 5 dias |
| `monthly_full` | Mensal Completo | 150 MT | 30 dias | 5 dias |

A configuração da interface também existe em `config.js`; alterações de preço/plano exigem aprovação do proprietário e alinhamento entre interface e backend.

## Testes e evidências

O script `scripts/testar-epay.js` verifica assinaturas válidas/inválidas, janela temporal do webhook, conversão monetária em cêntimos, referências, associação do UID, catálogo de planos e idempotência da activação de uma transacção já marcada como paga.

GitHub Actions: workflow **Validar integração Firebase**, run `45833068199`, sucesso no commit `ba7df6f2c1141884e9fb7c4cf7a405aa908df4e4`.

O teste Sandbox manual do proprietário confirmou a operação ponta a ponta, incluindo o desbloqueio dos exames. Isto é evidência funcional de Sandbox, não de produção.

## Configuração e segredos

Os nomes de variáveis necessários no servidor incluem:
- `FIREBASE_SERVICE_ACCOUNT_JSON`
- `EPAY_SECRET_KEY` (chave de teste em Preview)
- `EPAY_WEBHOOK_SECRET` (apenas se o webhook geral for utilizado)
- `PHONE_AUTH_PEPPER`

Nunca colocar valores destas variáveis no GitHub, frontend, commits ou mensagens. Não copiar segredos de Preview para Production. Chaves `sk_live_` só podem ser configuradas após aprovação comercial e autorização explícita.

## Precauções

- Nunca activar assinatura apenas pelo `return_url`.
- Não confiar no preço, UID ou estado enviados pelo browser.
- Não usar o checkout fixo do painel ePay para testes: ele não identifica a conta Firebase iniciadora e pode operar em produção.
- O callback individual e a consulta de estado são o fluxo principal; webhook geral é opcional.
- A criação gera nova referência por pedido. O botão do frontend é desactivado durante o pedido, mas uma chave estável de idempotência entre tentativas repetidas é uma melhoria ainda por avaliar.
- Não declarar pagamentos comerciais activos enquanto o ambiente live não estiver configurado, auditado e autorizado.
