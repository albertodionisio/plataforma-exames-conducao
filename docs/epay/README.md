# Integração ePay — ESTRADA

## Estado
Backend preparado na branch de desenvolvimento. Não está activo em produção e não confirma pagamentos reais. O checkout fixo anterior do plano Semanal Básico foi retirado dos botões da aplicação; os planos pagos passam a solicitar um checkout individual ao backend. O link continua no painel ePay, sem ser apagado nesta fase.

## Fluxo
1. O utilizador inicia sessão no Firebase e escolhe um plano pago. A sessão identifica a conta destinatária; o meio de pagamento pode pertencer ao próprio ou a um familiar.
2. O frontend envia planCode e requestId para POST /api/payments/create, com Firebase ID token.
3. O servidor valida a identidade e escolhe preço/duração num catálogo fechado. Nunca aceita preço enviado pelo browser. Fixa `uid` e `accountUid` no registo da transacção antes de criar o checkout.
4. O servidor cria payment_transactions/{requestId} e chama POST https://checkout.epay.co.mz/api/v1/payments.
5. A ePay devolve payment_url e o comprador é redireccionado.
6. A ePay envia callback assinado para /api/payments/callback. O servidor valida HMAC-SHA256 do corpo bruto com EPAY_SECRET_KEY, referência, valor e moeda.
7. O retorno do browser abre /#/planos com a referência; o frontend consulta GET /api/payments/status. O backend consulta a ePay e só activa após status paid.
8. A activação é idempotente; avisos repetidos não duplicam a transacção. A subscrição é gravada em `subscriptions/{accountUid}` da conta que iniciou o checkout, independentemente do número/conta M-Pesa usado pelo pagador.

## Endpoints
- POST /api/payments/create — Firebase ID token e JSON { planCode }; a referência UUID é gerada exclusivamente no servidor.
- GET /api/payments/status?transactionId=UUID — só permite consultar pagamentos do próprio utilizador.
- POST /api/payments/callback — valida X-EducavelPay-Signature com HMAC-SHA256 do corpo bruto e a chave API.
- POST /api/payments/webhook — opcional; valida X-Epay-Signature (t=unix,v1=hex) com EPAY_WEBHOOK_SECRET e aceita payment.paid/payment.failed.

## Planos fixados no servidor
| Código | Plano | Valor | Duração | Carência |
|---|---|---:|---:|---:|
| weekly_basic | Semanal Básico | 50 MT | 7 dias | 0 |
| weekly_full | Semanal Completo | 80 MT | 7 dias | 0 |
| monthly_basic | Mensal Básico | 80 MT | 30 dias | 5 dias |
| monthly_full | Mensal Completo | 150 MT | 30 dias | 5 dias |

Os preços correspondem ao config.js desta branch. A carência mensal é registada em graceUntil; a validade nominal continua a ser 30 dias.

## Variáveis Vercel
Guardar como Secrets apenas em Preview durante os testes:
- FIREBASE_SERVICE_ACCOUNT_JSON — credencial Admin do projecto plataforma-exames-conducao.
- EPAY_SECRET_KEY — chave sk_test_ para sandbox. sk_live_ só depois dos testes, aprovação da loja e autorização explícita para produção.
- EPAY_WEBHOOK_SECRET — segredo whsec_ para webhook geral, se configurado no painel.
- PHONE_AUTH_PEPPER — segredo já usado pela autenticação por telefone.

Nunca colocar estes valores no GitHub, frontend ou mensagens. Não usar a chave de produção em Preview.

## Configuração do painel ePay
**Atenção ao ambiente:** a chave sk_test só protege pagamentos criados pela API. A documentação da ePay informa que produtos criados no painel e vendidos pelo checkout público são sempre cobrados em produção, mesmo quando a loja tem uma chave de teste. Por isso, não usar o link fixo do produto para testar nem o partilhar enquanto não for confirmado que se pretende vender em produção. O link foi retirado da aplicação, mas permanece no painel até à validação do novo fluxo.

No sandbox da API, os valores 50, 80 e 150 MT estão fora dos intervalos de teste que simulam falha/recusa e, segundo a documentação, devem resultar em pagamento de teste aprovado, sem cobrança real. Não usar 250/500 MT (falha imediata) nem 300/400 MT (recusa simulada) para testar sucesso.

O callback individual é enviado em cada pagamento. O webhook geral é opcional e só deve ser configurado depois de o endpoint estar publicado num Preview: https://<preview-vercel>/api/payments/webhook. Subscrever payment.paid e payment.failed.

O checkout fixo https://checkout.epay.co.mz/c/loja-jr5qps-p507 não identifica, por si só, a conta Firebase que iniciou a compra. Por isso não deve activar assinaturas automaticamente. Não é necessário apagar o link no painel ePay: pode ficar como alternativa manual; o fluxo normal da aplicação passa a usar checkouts individuais da API.

## Segurança e limitações
- Nunca activar pelo return_url.
- Chaves e segredos só no servidor.
- Callback usa corpo bruto, HMAC-SHA256 e comparação em tempo constante.
- external_reference é um UUID aleatório gerado exclusivamente no servidor e único por transacção.
- O endpoint de estado verifica o dono e consulta a ePay.
- O servidor verifica valor exacto em cêntimos e currency MZN.
- O UID autenticado é gravado antes do checkout como `uid` e `accountUid`; divergência posterior é rejeitada. O callback não usa número do pagador para escolher a conta.
- O utilizador pode pagar com M-Pesa de familiar ou terceiro; a ePay confirma o pagamento, mas a conta beneficiária permanece a conta ESTRADA-JB que iniciou aquela transacção.
- Activação em transacção Firestore, com idempotência.
- Nova compra prolonga a validade a partir da data mais tardia entre agora e a expiração actual, aplicando imediatamente o novo plano, para não perder dias pagos.
- O modo de acesso aberto para testes no config.js não foi alterado.
- A API ainda requer teste sandbox real e configuração no painel ePay. Sem cobrança real, deploy de produção ou publicação de regras Firebase.
