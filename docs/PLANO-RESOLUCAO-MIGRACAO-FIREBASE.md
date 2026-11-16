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
- [x] Recuperar os 12 commits que estavam apenas em `main`: PR auxiliar #6 (`main` → `feat/firebase-full-migration`) integrada com sucesso no commit `9b462c492a8743210ad606446a8057273d12daad`. A lista de commits foi confirmada pela PR (12 commits); todos os ficheiros afectados foram reconciliados antes do merge.
- [x] Comparar os ficheiros de dados dos exames 34–37 e mapas de referência nas duas branches. Exames 34 e 35 e respectivos mapas têm os mesmos blobs. Exames 36 e 37 e respectivos mapas diferem: `main` tem versões mais recentes. SHAs em 2026-11-16: exame36 main `125a5cb691c724afc42ea853d6706d64dbe8e312` / branch `2603dee1d1c7fe4f6e0177d82beaafc35e79ed3b`; exame37 main `78e6fbb4e1a1a9d79c7763fff2c712d80707b25f` / branch `0f52bc77ea9d6a4c107082339e2e1607ba5ca311`; mapa36 main `b69c7d7ebeab9a03bc99a887a3f3fbc3ea8d6305` / branch `1d3d72a8a62d0ee9e9c245b1f3c3af64f5681091`; mapa37 main `2f3ce35e79806364ce35e973a7c8478078d985de` / branch `d1d6d54938930ff4b688f1129c799d13b6db3fb3`. A comparação geral reportou 26 ficheiros e não listou estes quatro ficheiros apesar dos blobs divergirem; discrepância do resultado da API a resolver antes de sincronizar.
- [x] Identificar e resolver os conflitos de sincronização. A PR #6 só ficou mergeable depois de alinhar os ficheiros editoriais partilhados; a integração foi feita exclusivamente na branch Firebase. Os ficheiros centrais da migração não foram substituídos.
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
- [x] Validar os Exames 36 e 37 após a integração: 25 perguntas cada, quatro alternativas por pergunta, índices de resposta válidos, explicações presentes, zero referências a artigos, zero enunciados «Segundo o Código», distribuição A7/B6/C6/D6; respostas correctas unicamente mais longas em 0/25 e 4/25 (abaixo do limite de 7 do auditor). Nenhum problema estrutural ou editorial detectado.
- [ ] Confirmar o resultado dos workflows GitHub Actions no commit de sincronização. O conector devolveu zero status checks e não disponibiliza a listagem de execuções push; por isso, não declarar CI verde sem prova.
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
| 2. Sincronização | Conteúdo sincronizado; validação manual concluída; CI por confirmar | PR #6 integrada no commit `9b462c4`; branch 86 à frente / 0 atrás; Exames 34–37 e mapas reconciliados. Auditoria estrutural/editorial dos Exames 36–37 sem problemas. O conector não expôs o resultado dos workflows push. |
| 3. Testes de fluxo | Por fazer | Falha reportada em foco após resposta |
| 4. Preview real | Por fazer | Preview reportado como antigo; validar commit e fluxos |
| 5. Console Firebase/OAuth | Por fazer | Sem conector Firebase |
| 6. Backend | Por fazer | Ainda não implementado |
| 7. Lançamento | Bloqueado pelas etapas anteriores | Sem merge/deploy/publicação autorizados |


### Registo adicional da ETAPA 2 — auditoria de 2026-11-16

- PR #3 continua aberta e em rascunho; não foi feito merge.
- Comparação actual `main...feat/firebase-full-migration`: divergente, 70 commits à frente e 12 atrás; merge-base `7cde108fe82f4544a9797289859c858e841f3fed`; HEAD de `main` `fc08c00ba0ca5e8efa5fc60e27892c1d93b1a25d`.
- Os exames 34 e 35 e os seus mapas têm blobs idênticos nas duas branches.
- Os exames 36 e 37 e os mapas correspondentes diferem. As versões de `main` incluem reformulações mais recentes; não copiar sem revisão do conteúdo e dos registos DADOS.
- A comparação geral do GitHub não incluiu esses quatro caminhos na lista de ficheiros, apesar de `fetch_file` devolver SHAs diferentes. Este comportamento tem de ser esclarecido antes de uma integração automatizada.
- `PENDENTE.md` da `main` indica BE-002 ainda EM CURSO, com ficheiros de autenticação e documentação reservados. Não editar esses ficheiros nesta etapa sem coordenação. Nenhum ficheiro de código/dados foi alterado nesta auditoria.


### Registo final da ETAPA 2 — 2026-11-16

- PR auxiliar #6, `main` → `feat/firebase-full-migration`, integrada: commit `9b462c492a8743210ad606446a8057273d12daad`. A `main` não foi alterada; PR principal #3 continua aberta em rascunho.
- Comparação após integração: `main` é ancestral da branch; `ahead_by=86`, `behind_by=0`, merge-base `fc08c00ba0ca5e8efa5fc60e27892c1d93b1a25d`.
- Exames 34 e 35 já eram iguais; Exames 36 e 37 e mapas foram actualizados para os blobs mais recentes de `main`. Foram também integrados `docs/GUIA-PERGUNTAS.md`, `scripts/auditar-estilo.js`, `data/exames/PENDENTE.md`, `INSTRUCOES.md`, `REGRAS.md` e o registo dos anexos.
- Auditoria dos Exames 36 e 37 reproduzida a partir do script oficial `scripts/auditar-estilo.js`: ambos com 25 perguntas; artigos 0; «Segundo o Código» 0; respostas correctas únicas mais longas 0 e 4 (limite de revisão >7); posições A7/B6/C6/D6; enunciados curtos (≤90 caracteres) 6 e 7. Verificação estrutural adicional: quatro opções, índice correcto válido e explicação presente em todas as 50 perguntas.
- O conector de status não devolveu verificações para o commit de merge e não disponibiliza listagem de execuções push. CI não declarado verde; falta apenas consultar a execução GitHub Actions quando estiver acessível.
