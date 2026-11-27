# Plano de estabilização e conclusão da migração Firebase — ESTRADA-JB

**Actualizado:** 27 de Novembro de 2026  
**Branch de trabalho:** `feat/firebase-full-migration`  
**Commit-base validado:** `ba7df6f2c1141884e9fb7c4cf7a405aa908df4e4`  
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
**Estado: PARCIAL — existe uma falha conhecida por corrigir.**

- [x] Sintaxe JavaScript e componente de assinaturas passaram no workflow de exames.
- [x] Validação de integração Firebase passou.
- [ ] Corrigir a asserção em `scripts/testar-fluxo.js:220`: o teste espera o caminho antigo `public/exames/exameN/exameN_1.jpg`, mas a primeira pergunta do Exame 27 usa `public/sinais/D79-sinal-pdf-600dpi.png`.
- [ ] Confirmar que o teste valida a imagem actual e o comportamento de carregamento, em vez de simplesmente remover a asserção.
- [ ] Reexecutar o workflow completo de exames, incluindo validador oficial, documentos e build Netlify.

Evidência actual: GitHub Actions run `45833068139` falhou no passo “Testar fluxo completo dos exames”; os passos posteriores foram skipped. O ficheiro de imagem apontado pelo Exame 27 existe no repositório.

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
**Estado: PENDENTE.**

- [ ] Rever `firestore.rules` e `firestore.indexes.json` contra o modelo actual.
- [ ] Confirmar isolamento por UID e que o cliente não pode escrever pagamentos, subscrições ou resultados finais.
- [ ] Rever permissões da service account e secrets por ambiente.
- [ ] Só publicar regras após revisão e autorização expressa.
- [ ] Não copiar secrets Preview para Production.

### ETAPA 6 — Backend, assinaturas e pagamentos
**Estado: IMPLEMENTAÇÃO E FLUXO SANDBOX COMPROVADOS; robustez adicional em revisão.**

- [x] Firebase ID token validado pelo backend.
- [x] Catálogo fechado de planos/preços no servidor.
- [x] UID beneficiário fixado antes do checkout; o telefone/titular do meio de pagamento não altera a conta beneficiária.
- [x] Referência UUID gerada no servidor.
- [x] Checkout individual ePay implementado.
- [x] Callback HMAC, validação de referência/valor/moeda e consulta de estado implementados.
- [x] Activação Firestore transaccional e idempotente coberta por testes.
- [x] Proprietário comprovou o fluxo Sandbox completo, incluindo desbloqueio.
- [ ] Avaliar chave de idempotência estável para pedidos repetidos de criação do checkout.
- [ ] Preparar ambiente live apenas depois de aprovação comercial e autorização expressa. Não há cobrança real activa nesta fase.

### ETAPA 7 — Auditoria final e lançamento
**Estado: BLOQUEADA — não iniciar publicação.**

- [ ] Concluir testes automáticos e resolver falhas.
- [ ] Auditoria integral de segurança, desempenho, acessibilidade e compatibilidade Android.
- [ ] Preparar empacotamento e instalação Android de produção.
- [ ] Rever privacidade, termos, suporte e requisitos operacionais.
- [ ] Apresentar riscos e pedir autorização explícita para regras, merge e deploy.

## Evidências de referência

| Evidência | Resultado |
|---|---|
| Commit de sincronização | `ba7df6f2c1141884e9fb7c4cf7a405aa908df4e4` |
| Validar integração Firebase — run `45833068199` | SUCCESS |
| Validar exames — run `45833068139` | FAILURE na asserção da imagem do Exame 27 |
| Preview Vercel — `dpl_ALFzFnbZbmMvmoZCmragfPcQRaQt` | READY |
| Teste manual de autenticação, planos, pagamento Sandbox e Exame 27 | Confirmado pelo proprietário |

Para o estado global e as limitações, consultar [docs/ESTADO-ATUAL.md](ESTADO-ATUAL.md).
