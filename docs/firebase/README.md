# Firebase — fundação técnica do ESTRADA-JB

Estado desta entrega: configuração versionada e modelo inicial de segurança preparados; regras e testes automatizados executados no Firestore Emulator. **Isto não significa que as regras tenham sido publicadas no projecto Firebase real.** A migração da aplicação é acompanhada numa tarefa/branch separada.

## Projecto Firebase existente

- Project ID: `plataforma-exames-conducao`.
- Aplicação Web registada: ESTRADA Web.
- Cloud Firestore: edição Standard, base `(default)`, região `africa-south1` (Johannesburg), conforme configuração comunicada pelo dono.
- Plano observado durante a configuração: Spark.
- Authentication: fornecedores Google e E-mail/palavra-passe activados no Console, conforme configuração comunicada pelo dono.
- A chave Web do Firebase é um identificador público; service accounts, chaves privadas, tokens e segredos nunca devem entrar no repositório nem no browser.

A configuração real do Console deve ser confirmada no próprio Firebase Console antes de qualquer publicação. A branch e os ficheiros locais não provam, por si só, que as regras estejam activas no serviço.

## Ficheiros desta fundação

| Ficheiro | Responsabilidade |
|---|---|
| `firebase.json` | Liga Firebase CLI às regras e aos índices Firestore. |
| `.firebaserc.example` | Exemplo com placeholder; não selecciona nenhum projecto real. |
| `firestore.rules` | Regras de autorização por utilizador e negação por omissão. |
| `firestore.indexes.json` | Índices compostos; começa vazio enquanto não houver consultas que os exijam. |
| `firebase.emulator.json` | Configuração isolada para testar regras localmente/CI. |
| `scripts/testar-regras-firestore.js` | Testes positivos e negativos das regras. |
| `.github/workflows/validar-firebase-foundation.yml` | Valida JSON e executa os testes no Firestore Emulator. |

O ficheiro local `.firebaserc` é ignorado pelo Git. Também são ignorados nomes comuns de ficheiros service-account/Admin SDK. Não guardar credenciais em qualquer outro ficheiro, issue, commit ou mensagem.

## Modelo inicial de dados

As colecções destinam-se a dados dinâmicos e privados:

| Colecção | Documento | Conteúdo previsto | Escrita |
|---|---|---|---|
| `users` | `{uid}` | UID, email, nome, telefone validado por claim, fotografia e datas | O próprio utilizador, apenas nos campos permitidos |
| `subscriptions` | `{uid}` | Plano, estado, início, fim e carência | Apenas servidor |
| `exam_attempts` | `{attemptId}` | UID, exame, datas, estado, respostas e resultado | Apenas servidor |
| `payment_transactions` | `{transactionId}` | UID, referência, valor, moeda, estado e datas | Apenas servidor/webhook validado |

Perguntas, alternativas, explicações pedagógicas e imagens estáticas permanecem em `data/exames/` e `public/`, servidas como conteúdo estático e cache/CDN. Não duplicar esse catálogo no Firestore. Nunca guardar passwords, tokens de sessão, chaves privadas, JSON de service account ou dados completos de cartões.

## Segurança Firestore

As regras aplicam o princípio de negar por omissão:

- Perfil: o utilizador só pode ler o documento com o próprio UID. A criação exige email verificado ou uma custom claim de autenticação telefónica emitida pelo servidor. A actualização fica limitada aos campos de perfil permitidos; email, UID e data de criação não podem ser substituídos pelo cliente.
- Telefone: só é aceite quando corresponde exactamente à claim assinada `phone` e `phoneAuth` do Firebase Authentication. O cliente não pode inventar ou trocar o número.
- Credenciais e limites internos da autenticação telefónica: inacessíveis ao cliente.
- Subscrições: o utilizador pode ler apenas o próprio documento; não pode criar, alterar ou eliminar.
- Tentativas/resultados: o utilizador pode ler apenas registos próprios; criação, alteração e eliminação são reservadas ao servidor.
- Pagamentos: o utilizador pode ler apenas registos próprios; criação, alteração e eliminação são reservadas ao servidor.
- Qualquer outra colecção fica bloqueada.

As consultas de `exam_attempts` e `payment_transactions` devem filtrar por `uid == request.auth.uid`. As regras do Firestore não funcionam como filtros automáticos. O backend com Firebase Admin SDK contorna as regras e, por isso, só pode ser executado no servidor com credenciais protegidas e validações próprias.

## Índices

A configuração não cria índices compostos preventivos. O Firestore mantém automaticamente índices de campo único. Só acrescentar índices compostos quando uma consulta concreta os exigir; guardar no repositório a definição sugerida pelo erro/Console e testar a consulta antes de publicar.

## Testar sem tocar no projecto real

Os testes usam o identificador isolado `demo-estrada` e o Emulator Suite. Não usam credenciais, não alteram dados reais e não publicam regras.

Requisitos locais: Node.js 24, Java 21 e dependências temporárias do Firebase:

```bash
npm install --no-save --package-lock=false 'firebase@^12' '@firebase/rules-unit-testing@^5' firebase-tools
npx firebase-tools emulators:exec --only firestore --project demo-estrada --config firebase.emulator.json "node scripts/testar-regras-firestore.js"
```

O workflow `Validar fundação Firebase` executa estes passos automaticamente em cada alteração relevante e em Pull Requests para `main`. Os testes cobrem perfis email/telefone, utilizador não verificado, isolamento entre contas, imutabilidade do telefone, colecções privadas, tentativas, subscrições, pagamentos e negação por omissão.

## Configuração local e publicação — requer autorização

1. Instalar a Firebase CLI: `npm install -g firebase-tools`.
2. Copiar `.firebaserc.example` para `.firebaserc` apenas no ambiente local e substituir o placeholder pelo Project ID confirmado no Console.
3. Autenticar a CLI com a conta proprietária: `firebase login`.
4. Antes de qualquer publicação, confirmar explicitamente o projecto seleccionado com `firebase projects:list` e `firebase use`.
5. Depois de revisão e autorização do dono, publicar apenas as regras: `firebase deploy --only firestore:rules --project plataforma-exames-conducao`.
6. Publicar índices separadamente apenas quando necessários: `firebase deploy --only firestore:indexes --project plataforma-exames-conducao`.

**Esta entrega não executa deploy nem publica regras.** A publicação no Firebase real é uma acção externa com impacto nos acessos da aplicação e fica dependente de autorização explícita do dono. Não executar comandos de deploy como parte de CI.

## Serviços e custos

- Firebase Hosting não é necessário: o alojamento da aplicação continua no Vercel.
- Cloud Storage fica adiado porque as imagens actuais são estáticas; não activar um bucket sem requisito concreto.
- Cloud Functions não são necessárias para esta fundação; o backend Vercel pode usar Firebase Admin SDK no servidor. Avaliar a opção novamente se surgir uma necessidade real.
- FCM, App Check, Analytics, Remote Config e Crashlytics ficam para fases próprias, com requisitos de privacidade, domínio, dispositivos e custos documentados.
- Não assumir custo zero nem capacidade ilimitada. Leituras/escritas, armazenamento, tráfego e produtos activados podem gerar consumo; acompanhar quotas e preços no Console antes de abrir a plataforma a utilizadores.

## Limites desta etapa

Esta fundação não migra contas antigas, não activa frontend, não altera pagamentos, planos, exames ou cache e não apaga dados do fornecedor anterior. A integração funcional de Authentication, perfis e backend é acompanhada na etapa seguinte. O estado deve ser descrito sempre como preparado, testado no emulador ou activo no projecto real — nunca confundir estes estados.
