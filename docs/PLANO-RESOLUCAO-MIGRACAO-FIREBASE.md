# Plano de resolução — migração Supabase → Firebase (ESTRADA)

Actualizado: 2026-11-16  
Branch de trabalho: `feat/firebase-full-migration`  
PR: #3 (rascunho)

Este plano transforma as pendências da migração numa sequência de etapas verificáveis. A ordem é intencional: preservar o trabalho e estabilizar a branch antes de publicar qualquer alteração.

## Regras de segurança

- Não fazer merge para `main`, não publicar regras Firestore e não fazer deploy de produção sem autorização expressa.
- Não apagar, pausar ou alterar o projecto Supabase. As contas existentes foram confirmadas pelo proprietário como contas de teste; não há contas reais antigas a migrar.
- Não expor credenciais, tokens, service accounts ou variáveis secretas.
- Não alterar perguntas, imagens, cronómetro, pontuação, planos ou preços durante a migração.
- Antes de editar ficheiros reservados por outra tarefa/sessão, verificar `PENDENTE.md` e coordenar para não sobrepor trabalho.
- Distinguir sempre testes de emulador, preview, produção e testes manuais do proprietário.

## Sequência de execução

### ETAPA 1 — Congelar o estado e confirmar os pontos de partida
- [x] Confirmar branch `feat/firebase-full-migration` e PR #3.
- [x] Comparar `main` com a branch Firebase: a comparação consultada indica 68 commits à frente e 12 atrás; as branches divergiram.
- [x] Confirmar que a migração Firebase está na branch, enquanto a `main` ainda contém integração Supabase.
- [x] Registar que as contas Supabase existentes eram apenas contas de teste; não é necessária migração de contas.
- [ ] Actualizar este plano com os SHAs e estados mais recentes antes de cada operação de sincronização.

**Resultado esperado:** estado-base documentado, sem alteração destrutiva.

### ETAPA 2 — Reconciliar as branches sem perder os exames mais recentes
- [ ] Obter a lista exacta dos 12 commits que estão em `main` e ainda não chegaram à branch Firebase.
- [ ] Comparar os ficheiros de dados dos exames 34–37 e quaisquer outros dados alterados nas duas linhas de desenvolvimento.
- [ ] Identificar conflitos em código, configuração, documentação e dados.
- [ ] Integrar as alterações de `main` na branch Firebase numa operação controlada, preservando a migração e os dados mais recentes.
- [ ] Confirmar que não houve duplicação, regressão ou perda de exames.
- [ ] Registar o resultado e os commits de integração.

**Programação necessária:** resolução de conflitos e eventual adaptação de código/dados, apenas nos ficheiros em conflito. Não fazer merge da PR para `main`.

### ETAPA 3 — Corrigir e estabilizar os testes de fluxo
- [ ] Reproduzir a falha actual de `scripts/testar-fluxo.js` na branch.
- [ ] Determinar se o comportamento correcto é focar a alternativa escolhida ou o título da pergunta, tendo em conta acessibilidade e a navegação real.
- [ ] Alinhar teste e implementação; não alterar a experiência do utilizador só para silenciar um teste.
- [ ] Verificar separadamente a falha de fluxo existente em `main`, sem misturar essa correcção com a migração.
- [ ] Executar o conjunto completo: sintaxe, fluxo, validação de exames, Auth Emulator e Firestore Emulator.
- [ ] Confirmar CI verde na branch.

**Programação necessária:** provável ajuste em `app.js` e/ou `scripts/testar-fluxo.js`, após reproduzir a falha e decidir qual comportamento é correcto.

### ETAPA 4 — Confirmar Firebase no ambiente real de Preview
- [ ] Confirmar que o Preview aponta para o commit mais recente da branch (o relatório anterior identificou um Preview antigo).
- [ ] Verificar variáveis/configuração do ambiente Preview sem revelar valores secretos.
- [ ] Validar registo por email, envio de verificação, confirmação do endereço, login, recuperação, logout e persistência.
- [ ] Validar login Google e retorno ao exame seleccionado.
- [ ] Testar proxy Vercel para `/__/auth/*` e `/__/firebase/*`.
- [ ] Registar separadamente resultados do emulador e do serviço Firebase real.

**Programação necessária:** corrigir configuração ou proxy apenas se os testes reais identificarem falhas.

### ETAPA 5 — Fechar configuração Firebase externa
- [ ] Confirmar domínios autorizados no Firebase Authentication.
- [ ] Confirmar o OAuth redirect/callback `/__/auth/handler` no cliente OAuth Google correcto.
- [ ] Confirmar os domínios de Preview e produção que serão realmente utilizados.
- [ ] Rever `firestore.rules` e `firestore.indexes.json` antes de qualquer publicação.
- [ ] Só publicar regras depois de autorização expressa do proprietário.

**Acção do proprietário quando chegar esta etapa:** abrir o Firebase Console/Google Cloud para aprovar ou corrigir domínios e callback OAuth, caso a configuração não possa ser feita por acesso técnico disponível. Não pedir esta acção antes de termos os valores exactos e evidência do que falta.

### ETAPA 6 — Implementar backend confiável para operações protegidas
- [ ] Definir arquitectura backend compatível com Firebase e com o alojamento aprovado.
- [ ] Implementar endpoint/serviço seguro para criação e consulta de tentativas.
- [ ] Implementar lógica de subscrições e estado de acesso, sem confiar em valores enviados pelo cliente.
- [ ] Implementar integração de pagamentos apenas depois de escolher fornecedor, credenciais e fluxo de confirmação.
- [ ] Validar Firebase ID tokens no servidor e aplicar autorização por utilizador.
- [ ] Criar testes de segurança para impedir que o cliente altere resultados, pagamentos ou subscrições.
- [ ] Documentar segredos necessários como nomes de variáveis, nunca os seus valores.

**Programação necessária:** sim. O backend de tentativas, subscrições e pagamentos ainda não existe. Esta etapa exige decisões de produto e credenciais do fornecedor de pagamentos antes da integração final.

### ETAPA 7 — Verificação final e decisão de lançamento
- [ ] Confirmar que a branch não tem dependências operacionais Supabase no frontend nem em runtime.
- [ ] Pesquisar referências restantes e classificar as que são apenas históricas/testes/documentação.
- [ ] Confirmar CI verde e validação dos exames.
- [ ] Confirmar Preview e fluxos reais aprovados.
- [ ] Rever regras Firestore e arquitectura backend.
- [ ] Actualizar PR #3, descrição, evidências e lista de tarefas.
- [ ] Apresentar ao proprietário um resumo de riscos e pedir autorização explícita para publicar regras, fazer merge e/ou deploy de produção.

## O que depende do proprietário

Não é necessário executar agora qualquer passo manual. Só será solicitada intervenção quando:
1. for necessária aprovação/autenticação na conta Vercel ou Google Cloud/Firebase Console;
2. for necessário testar uma caixa de email ou dispositivo real;
3. for preciso escolher/fornecer credenciais de um fornecedor de pagamentos;
4. for tomada uma decisão irreversível ou de lançamento (publicar regras, merge, deploy de produção ou apagar serviços).

## Estado conhecido na criação deste plano

- Firebase Auth e perfil Firestore estão implementados na branch Firebase.
- Regras Firestore e testes de Auth/Firestore Emulator existem no repositório; a existência dos ficheiros e os testes do emulador não provam publicação no projecto real.
- O relatório técnico de 2026-11-16 indicou CI Firebase aprovado e uma falha no teste de fluxo.
- A comparação GitHub consultada indica `main` e `feat/firebase-full-migration` divergentes: 68 commits à frente e 12 atrás.
- A `main` continua a conter integração Supabase; a migração não está concluída em produção.
- O proprietário confirmou que as contas Supabase existentes eram contas de teste, sem utilizadores reais antigos a migrar.
- Não foi feito merge, deploy de produção, publicação de regras ou alteração destrutiva no Supabase.

## Registo de execução

| Etapa | Estado | Evidência / observação |
|---|---|---|
| 1. Estado-base | Concluída | Branch e PR localizadas; `main` HEAD `fc08c00`; merge-base `7cde108`; Firebase branch commit do plano `c0da8e2`; comparação: 69 à frente, 12 atrás, 26 ficheiros diferentes. Valores reconfirmados em 2026-11-16. |
| 2. Sincronização | Por fazer | 68 à frente / 12 atrás; requer análise dos commits |
| 3. Testes de fluxo | Por fazer | Falha reportada em foco após resposta |
| 4. Preview real | Por fazer | Preview reportado como antigo; validar commit e fluxos |
| 5. Console Firebase/OAuth | Por fazer | Sem conector Firebase |
| 6. Backend | Por fazer | Ainda não implementado |
| 7. Lançamento | Bloqueado pelas etapas anteriores | Sem merge/deploy/publicação autorizados |
