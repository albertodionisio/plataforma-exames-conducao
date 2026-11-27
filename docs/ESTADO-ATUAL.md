# Estado actual do projecto ESTRADA-JB

**Actualizado:** 27 de Novembro de 2026  
**Branch de referência:** `feat/firebase-full-migration`  
**Commit funcional validado:** `b3e72828c9e74c0b1102f671bac62b8b881224a7`  
**Produção:** não publicada; `main` não foi alterada nesta fase.

Este documento é a fonte central do estado operacional. Registos históricos e anexos datados continuam preservados; quando divergirem, prevalece este documento e o código da branch indicada.

## Estado geral

| Área | Estado actual | Evidência / limite |
|---|---|---|
| BE-002 — migração Firebase | **CONCLUÍDA na branch e PR #3** | Migração funcional, backend, testes, documentação e Preview estabilizados. Não significa lançamento em produção. |
| Sincronização Git | Branch de migração preservada | `feat/firebase-full-migration` está 2 commits atrás da `main`. Os 2 commits em falta pertencem à DADOS-083 (Exames 31/34); preservar e reconciliar antes de qualquer merge. |
| Autenticação Google | Validada manualmente no Preview | O proprietário confirmou login Google funcional depois de autorizar os domínios de Preview. |
| Email/palavra-passe | Implementado e testado | Registo, login, recuperação e confirmação testados no Auth Emulator; não afirmar entrega real de todos os emails no Preview. |
| Telefone/palavra-passe | Implementado e testado | Firebase custom token, scrypt, HMAC e limites anti-abuso. Não usa SMS/OTP e não comprova titularidade do número. |
| Perfil Firestore | Implementado | Perfil mínimo em `users/{uid}`, limitado ao próprio UID. |
| Regras Firestore | Revistas no repositório e aprovadas no Emulator Suite | Isolamento por UID, default-deny e escritas de tentativas/subscrições/pagamentos bloqueadas ao cliente. **Ainda não publicadas no projecto Firebase real.** |
| Persistência de tentativas | Estrutura `exam_attempts` e regras preparadas | Ainda não existe endpoint Admin para sincronizar tentativas/resultados; o estado do exame permanece local no browser. Histórico multi-dispositivo requer tarefa própria. |
| Migração Supabase | Concluída no frontend activo | `app.js`, `index.html` e `config.js` não contêm dependências Supabase. O projecto antigo não foi apagado nem alterado. Contas antigas eram de teste; não foi feita migração de contas. |
| Backend ePay | Implementado e testado em Sandbox | Firebase ID token, catálogo de planos no servidor, UID beneficiário, checkout individual, callback HMAC e consulta de estado. |
| Idempotência do checkout | Reforçada e testada automaticamente | Chave por tentativa/conta, referência determinística UUIDv8, reutilização da mesma chave na ePay e recuperação de pedidos falhados ou presos em criação há mais de 2 minutos. |
| Assinaturas | Activação transaccional | Subscrição associada ao UID que iniciou o checkout; callbacks repetidos não prolongam duas vezes a validade. |
| Catálogo de exames | 51 exames nesta branch | 25 perguntas por exame; 3 gratuitos. Exames 31–51 continuam temporariamente abertos para validação de conteúdo, não como política comercial final. |
| Experiência de exame | Validada pelo proprietário no Preview | Imagens, navegação, cronómetro, avaliação e resultado foram confirmados; não pedir para repetir os testes já feitos. |
| CI — exames | SUCCESS | Run `45949323808`, commit `38083921`; incluiu o teste de fluxo com a asserção de imagem corrigida. |
| CI — Firebase | SUCCESS | Run `45949604987`, commit `b3e72828`; inclui testes ePay/idempotência, email, configuração, telefone e Auth/Firestore Emulator. |
| Preview Vercel | READY | Deployment `dpl_AH9K5qUVJf5bCQpSm4gLLQZwmVzy`, commit `b3e72828`. |
| Produção Web/Android | Não lançada | Não houve merge para `main`, publicação de regras Firestore ou activação de ePay live. |

## Autenticação e dados

Firebase Authentication é o fornecedor activo no frontend. Google foi validado manualmente no Preview. Email/password e recuperação estão implementados; os testes de emulador cobrem registo, verificação, recuperação e novo login. O método telefónico usa custom token, sem SMS/OTP; não apresentar o número como verificado.

O cliente só trabalha directamente com o perfil próprio. Tentativas, subscrições e pagamentos são operações de servidor através do Firebase Admin SDK. As regras negam por omissão e os testes verificam acesso próprio, isolamento entre utilizadores e bloqueio de escritas privilegiadas.

## Pagamentos e assinaturas

O proprietário comprovou anteriormente o fluxo ePay Sandbox: selecção do plano, checkout, confirmação, activação da assinatura e desbloqueio dos exames. A assinatura pertence ao UID autenticado que iniciou o checkout, mesmo quando o meio de pagamento pertence a familiar/terceiro.

A criação de checkout exige uma chave de idempotência do cliente. O backend combina essa chave com o UID para derivar uma referência estável e envia a mesma referência à ePay. Retries após falha reutilizam a transacção; pedidos em estado `creating` sem actualização há mais de 2 minutos podem ser recuperados. O teste automatizado simula falha, retry, resposta repetida e conflito de plano. A alteração da idempotência ainda não foi submetida a um novo pagamento manual Sandbox.

**Sandbox não é produção.** As variáveis `EPAY_SECRET_KEY`, `EPAY_WEBHOOK_SECRET`, `FIREBASE_SERVICE_ACCOUNT_JSON` e `PHONE_AUTH_PEPPER` estão configuradas como secrets apenas para Preview da branch `feat/firebase-full-migration`. A consulta de ambientes não mostrou variáveis de Production; os valores nunca foram lidos ou expostos.

## Serviços complementares

- **Vercel Functions:** backend activo nesta arquitectura.
- **Firebase Hosting / Cloud Functions:** não adoptados.
- **Cloud Storage:** não adoptado; perguntas e imagens continuam estáticas no repositório/CDN.
- **App Check, FCM, Analytics, Remote Config e Crashlytics:** avaliados, mas não activos nesta entrega.
- Não declarar qualquer serviço como activo sem configuração, consentimento e testes específicos.

## Limites antes de produção

1. Publicar as regras Firestore apenas depois de autorização expressa.
2. Confirmar directamente no Firebase/IAM que a service account tem apenas as permissões mínimas necessárias; o conector de ambiente permite confirmar a presença e o alvo dos secrets, mas não inspeccionar a política IAM sem aceder à credencial.
3. Confirmar domínios definitivos e callback OAuth de produção.
4. Configurar e validar credenciais ePay live apenas após aprovação comercial e autorização expressa.
5. Fazer sincronização controlada dos 2 commits DADOS-083 antes de eventual merge; não perder trabalho concorrente.
6. Completar auditorias de lançamento Android, acessibilidade, privacidade, suporte e recuperação.

## Regras de operação

- GitHub é a fonte principal de verdade; continuar o trabalho na branch Firebase até decisão explícita de integração.
- PR #3 permanece aberta e em draft para revisão; não fazer merge para `main` sem autorização expressa.
- Não publicar regras Firestore nem fazer deploy de produção sem autorização expressa.
- Não apagar, pausar ou alterar o projecto Supabase antigo.
- Nunca guardar segredos no repositório nem copiar secrets Preview para Production.
