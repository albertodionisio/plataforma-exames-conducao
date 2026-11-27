# Plano de estabilização e conclusão da migração Firebase — ESTRADA-JB

**Actualizado:** 27 de Novembro de 2026  
**Branch de trabalho:** `feat/firebase-full-migration`  
**Commit funcional validado:** `b3e72828c9e74c0b1102f671bac62b8b881224a7`  
**BE-002:** CONCLUÍDA na branch; PR #3 aberta em draft, sem merge.  
**Produção:** bloqueada até autorização expressa.

Este plano substitui os estados e previsões antigas deste ficheiro. Os registos anteriores foram substituídos porque descreviam a migração como divergente, a autenticação Preview como não testada e o backend de pagamentos como inexistente. Essas descrições já não correspondem ao estado actual.

## Regras de segurança

- Não fazer merge para `main`, publicar regras Firestore ou fazer deploy de produção sem autorização expressa.
- Não apagar, pausar ou alterar o projecto Supabase.
- Não expor credenciais, tokens, service accounts ou variáveis secretas.
- Distinguir testes de emulador, Preview, Sandbox e produção.
- Consultar `PENDENTE.md`, `HISTORICO.md` e `INSTRUCOES.md) antes de alterar tarefas reservadas.

## Etapas e estado actual

### ETAPA 1 — Autenticação
**Estado: CONCLUÍDA na validação Preview acordada.**

- [x] Firebase Authentication integrado na branch.
- [x] Testes automatizados Auth/Firestore Emulator aprovados no workflow Firebase.
- [x] Proprietário confirmou login Google funcional no Preview após autorizar os domínios do deployment e alias da branch.
- [x] Não voltar a solicitar a autorização dos mesmos domínios como pendência.
- [ ] A validação de todos os fluxos reais de email/telefone deve ser considerada separadamente; os testes de emulador não provam, por si só, entrega real de emails ou titularidade telefónica.

### ETAPA 2 — Sincronização e preservação das branches
**Estado: CONCLUÍDA.**

- [x] Integradas as alterações da `main` na branch Firebase sem alterar a `main`.
- [x] Commit de merge: `ba7df6f2c1141884e9fb7c4cf7a405aa908df4e4`.
- [x] PR #10 fechada como merged; a sincronização ocorreu na branch de migração.
- [x] Documentos partilhados reconciliados sem eliminar registos independentes.

### ETAPA 3 — Testes automáticos e estabilização do fluxo de exames
**Estado: CONCLUÍDA.**

- [x] Sintaxe JavaScript e componente de assinaturas passaram no workflow de exames.
- [x] Validação de integração Firebase passou.
- [x] Corrigida a asserção: o teste lê o caminho declarado pela primeira pergunta, confirma a existência do ficheiro e confirma que a imagem é renderizada.
- [x] Workflow completo de exames aprovado: run `45949323808` — SUCCESS, incluindo componente de assinaturas, fluxo E2E, validador oficial, documentos e build Netlify.

A falha antiga `45833068139` foi resolvida; não foi removida a verificação da imagem.

### ETAPA 4 — Validação funcional no Preview
**Estado: CONCLUÍDA para os fluxos que o proprietário testou.**

- [x] Preview Vercel READY no commit-base: deployment `dpl_ALFzFnbZbmMvmoZCmragfPcQRaQt`.
- [x] Login Google validado.
- [x] Proprietário confirmou os três exames gratuitos no plano Free.
- [x] Proprietário confirmou escolha do plano semanal e checkout Sandbox.
- [x] Proprietário confirmou processamento/confirmacão, activação da assinatura e desbloqueio dos exames.
- [x] Proprietário executou o Exame 27 e confirmou imagens, navegação, cronómetro, avaliação e resultado.
- [x] Não pedir para repetir os mesmos testes funcionais.

### ETAPA 5 — Revisão de segurança e configuração Firestore
**Estado: REVISÃO DO CÓDIGO CONCLUÍDA; publicação e IAM real ficam bloqueados para produção.**

- [x] Revistas `firestore.rules` e `firestore.indexes.json` contra o modelo actual.
- [x] Confirmado isolamento por UID, default-deny e bloqueio de escrita directa pelo cliente em tentativas, subscrições e pagamentos.
- [x] Testes positivos/negativos no Firestore Emulator aprovados no run `45949604987`.
- [x] Confirmado que os secrets Firebase Admin, telefone e ePay estão limitados ao Preview da branch; nenhum valor foi lido ou exposto.
- [ ] Confirmar permissões mínimas da service account directamente no Firebase/IAM antes de produção; não é possível comprová-las apenas pela lista de variáveis do Vercel.
- [ ] Publicar regras apenas após autorização expressa. Não copiar secrets Preview para Production.

### ETAPA 6 — Backend, assinaturas e pagamentos
**Estado: CONCLUÍDA na branch; Sandbox comprovado e idempotência adicional aprovada em CI.**

- [x] Firebase ID token validado pelo backend.
- [x] Catálogo fechado de planos/preços no servidor.
- [x] UID beneficiário fixado antes do checkout; o telefone/titular do meio de pagamento não altera a conta beneficiária.
- [x] Referência UUID gerada no servidor.
- [x] Checkout individual ePay implementado.
- [x] Callback HMAC, validação de referência/valor/moeda e consulta de estado implementados.
- [x] Activação Firestore transaccional e idempotente coberta por testes.
- [x] Proprietário comprovou o fluxo Sandbox completo, incluindo desbloqueio.
- [x] Implementada chave de idempotência estável por UID e tentativa, persistida em sessionStorage; mesma referência é reutilizada na ePay e o cliente não pode reutilizar a chave para outro plano.
- [x] Retries após falha reutilizam a transacção; estados `creating` sem actualização há mais de 2 minutos podem ser recuperados com a mesma chave.
- [x] Teste automatizado simula falha inicial, retry, reutilização do checkout, conflito de plano e nova tentativa independente; run `45949604987` SUCCESS.
- [ ] Preparar ambiente live apenas depois de aprovação comercial e autorização expressa. Não há cobrança real activa nesta fase.

### ETAPA 7 — Auditoria final e lançamento
**Estado: FORA DO FECHO DA BE-002; bloqueada até autorização de lançamento.**

- [x] Testes automáticos da migração e do fluxo de exames aprovados na branch.
- [ ] Auditoria de lançamento, desempenho, acessibilidade e compatibilidade Android.
- [ ] Preparar empacotamento e instalação Android de produção.
- [ ] Rever privacidade, termos, suporte e requisitos operacionais.
- [ ] Apresentar riscos e pedir autorização explícita para regras, merge e deploy.

## Evidências de referência

| Evidência | Resultado |
|---|---|
| Commit de sincronização | `ba7df6f2c1141884e9fb7c4cf7a405aa908df4e4` |
| Validar integração Firebase — run `45949604987` | SUCCESS no commit `b3e72828` |
| Validar exames — run `45949323808` | SUCCESS no commit `38083921` |
| Preview Vercel — `dpl_AH9K5qUVJf5bCQpSm4gLLQZwmVzy` | READY no commit `b3e72828` |
| Teste manual de autenticação, planos, pagamento Sandbox e Exame 27 | Confirmado pelo proprietário |

Para o estado global e as limitações, consultar [docs/ESTADO-ATUAL.md](ESTADO-ATUAL.md).


## Fecho da BE-002 — 27 de Novembro de 2026

A tarefa de migração foi concluída na branch `feat/firebase-full-migration`: frontend Firebase, autenticação, perfil Firestore, regras revistas e testadas em emulador, backend Admin, ePay Sandbox, idempotência de checkout, documentação e CI aprovados. A PR #3 continua aberta em draft, sem merge.

A branch está 663 commits à frente e 2 atrás da `main`; os dois commits em falta são da DADOS-083 (Exames 31/34) e devem ser preservados/reconciliados antes de eventual integração. Não foi alterada a `main`.

A estrutura e as regras de `exam_attempts` estão preparadas, mas não existe ainda endpoint Admin para sincronizar tentativas/resultados; a tentativa permanece local no browser e o histórico multi-dispositivo exige tarefa própria. O fecho da BE-002 não declara a aplicação pronta para produção: regras Firestore não publicadas, permissões IAM da service account ainda por confirmar directamente no Firebase, serviços complementares opcionais não activos, ePay live não configurada e lançamento Android/Web ainda por autorizar.
