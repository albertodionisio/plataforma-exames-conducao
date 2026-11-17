# Firebase — arquitectura e activação do ESTRADA

Estado nesta branch: Firebase Authentication integrado no frontend; perfil mínimo preparado no Cloud Firestore; proxy de autenticação configurado para validação em Preview Deployment. Esta branch ainda não está integrada em produção. As regras Firestore não foram publicadas e o fluxo real de autenticação ainda requer teste após a configuração externa.

## Projecto existente

- Project ID: `plataforma-exames-conducao`
- Aplicação Web: ESTRADA Web
- Cloud Firestore: base `(default)`, região `africa-south1` (Johannesburg).
- Plano observado: Spark.
- Authentication: Google e E-mail/palavra-passe activados pelo dono.
- Domínio de autenticação pretendido: `plataforma-exames-conducao.vercel.app`.
- A configuração Web pública está em `config.js`. A Firebase Web API key é um identificador público; nunca colocar service-account, private key, OAuth client secret ou tokens no frontend.

## Serviços e estado

| Serviço | Estado | Observação |
|---|---|---|
| Firebase Authentication | Integrado no frontend; testes automáticos no Emulator Suite | Email/palavra-passe, confirmação, recuperação, Google, sessão persistente e logout. Registo, verificação, recuperação e novo login são cobertos pelo Auth Emulator; a entrega real de emails e OAuth continuam a exigir validação no Preview. |
| Cloud Firestore | Preparado | Perfil mínimo em `users/{uid}`; regras ainda não publicadas. |
| Firebase Hosting | Não adoptado | A aplicação continua alojada no Vercel. |
| Cloud Storage | Adiado | Não existe requisito actual de uploads. O Storage for Firebase exige Blaze; no Spark, buckets não ficam acessíveis. Como perguntas/imagens são estáticas, não há motivo para activar agora. |
| Cloud Functions | Adiado | Deploy de Cloud Functions exige Blaze e billing. Backend confiável poderá usar Cloud Functions ou endpoints Vercel com Firebase Admin SDK no servidor. Nunca usar Admin SDK no browser. |
| Firebase Cloud Messaging | Preparação documental | Push depende de service worker, chave VAPID, permissões e teste nos dispositivos. Não está activo. |
| Analytics | Adiado | Não foi fornecido `measurementId`; não inventar nem enviar dados sem política de privacidade. |
| Remote Config | Adiado | Activar quando existirem parâmetros concretos para gerir remotamente. |
| App Check | Preparação documental | Web usa reCAPTCHA; registar e monitorizar antes de impor enforcement. Não está activo. |
| Crashlytics | Fase Android | Considerar na aplicação Android; não declarar recolha web activa. |

## Contas existentes do fornecedor anterior

As contas de utilizador que existiam no Supabase não são automaticamente reconhecidas pelo Firebase Authentication. Esta entrega não exporta nem importa utilizadores, passwords ou hashes. Para testar a nova autenticação, criar uma conta no ESTRADA com Firebase e confirmar o email; o mesmo endereço de email pode ser registado no Firebase independentemente da conta antiga. Uma migração em massa de utilizadores exigiria exportação/importação segura e validação do algoritmo de hash, fora do âmbito desta entrega. O projecto e os dados antigos não foram apagados.

## Autenticação por telefone e palavra-passe

Foi preparado um fluxo adicional, separado do email/Google, em `/api/auth/phone` (Vercel Function). O registo e o login usam número em formato internacional E.164; números moçambicanos com nove algarismos são normalizados com o indicativo +258. O utilizador define e confirma a palavra-passe no registo. Não há SMS nem OTP e, por isso, o sistema não comprova a titularidade do número.

A palavra-passe é processada no servidor com scrypt e salt aleatório; apenas o hash é guardado em `phone_auth_accounts`. O identificador do documento é um HMAC do número, não o número em texto simples. O servidor emite um Firebase custom token para a sessão. O acesso aos documentos de contas telefónicas é exclusivamente administrativo; as regras do Firestore continuam a negar acesso directo do cliente. O endpoint limita tentativas por telefone e endereço IP.

**Configuração obrigatória antes de activar no Preview (não colocar no GitHub):**
1. Criar uma service account com permissões mínimas necessárias para Firebase Authentication (criar custom tokens) e Cloud Firestore (ler/escrever apenas as colecções técnicas necessárias). Guardar o JSON completo como variável Vercel `FIREBASE_SERVICE_ACCOUNT_JSON`, no ambiente Preview da branch `feat/firebase-full-migration`.
2. Criar um segredo aleatório com pelo menos 32 caracteres (por exemplo, `openssl rand -hex 32`) e guardá-lo como variável Vercel `PHONE_AUTH_PEPPER`, também apenas em Preview.
3. Não enviar estes valores por chat, não os incluir em commits e não os colocar em `config.js`. A função devolve erro de serviço indisponível enquanto faltarem.
4. Depois de configurar as variáveis, criar um novo Preview e testar registo, logout, login e persistência de sessão com um número de teste controlado pelo dono.

Contas criadas só com telefone não têm recuperação automática de palavra-passe: sem email alternativo verificado, SMS ou códigos de recuperação previamente guardados, não existe forma segura de provar a identidade. O utilizador deve ser avisado antes de escolher este método. Como o número não é verificado, outra pessoa pode registar um número que não controla; esta limitação deve ser considerada antes de disponibilizar publicamente o método.

A implementação não altera nem desactiva email/palavra-passe ou Google. O backend depende de credenciais Admin e de Firestore; a configuração de produção não é feita nesta etapa.

## Modelo de dados e segurança

- `users/{uid}`: perfil mínimo; cada utilizador só pode aceder ao próprio documento.
- `subscriptions/{uid}`: plano/validade, escritos apenas por backend confiável.
- `exam_attempts/{attemptId}`: tentativas/resultados, escritos apenas por backend confiável.
- `payment_transactions/{transactionId}`: transacções confirmadas por servidor/webhook.

O cliente não pode criar nem alterar subscrições, resultados finais ou pagamentos. O resultado calculado no browser não é uma fonte confiável para conceder benefícios ou confirmar pagamentos; o servidor deverá validar a operação.

Perguntas, alternativas, explicações e imagens estáticas permanecem em `data/exames/` e `public/`, servidas como conteúdo estático com a estratégia CDN/cache existente. Não duplicar estes dados no Firestore. Telefone, se recolhido, é apenas contacto; não activar SMS/OTP.

## Domínio Vercel no fluxo Google

O `vercel.json` encaminha `/__/auth/*` e `/__/firebase/*` para os auxiliares do Firebase Authentication. O `authDomain` usa `plataforma-exames-conducao.vercel.app` apenas no domínio de produção definitivo; localhost e todos os Preview deployments usam `plataforma-exames-conducao.firebaseapp.com`. Esta separação evita exigir um callback OAuth Google diferente para cada URL temporário de Preview. O proxy Vercel fica reservado à produção e só deve ser considerado validado depois de testar GET, POST e o login Google completo.

Passos externos:
1. Firebase Console → Authentication → Settings → Authorized domains: adicionar `plataforma-exames-conducao.vercel.app` e `plataforma-exames-conducao-git-feat-firebase-full-3be547-jjb18.vercel.app` (Preview Vercel actual).
2. Firebase Console → Authentication → Sign-in method: confirmar Google e Email/Password activos.
3. No Google Cloud OAuth Client associado ao Firebase, adicionar o URI de callback de produção `https://plataforma-exames-conducao.vercel.app/__/auth/handler`. Não adicionar callbacks para Preview: estes usam o `authDomain` Firebase padrão.
4. Criar Preview Deployment desta branch e testar login Google/email com o domínio Firebase padrão.
5. Depois do merge e deploy autorizado em produção, validar `/__/auth/handler` e `/__/auth/iframe` por GET/POST e completar o login através do proxy Vercel, sem 302. Se falhar, manter o domínio Firebase padrão até corrigir.

## Activação e validação

1. Instalar Firebase CLI num ambiente confiável e autenticar na conta proprietária.
2. Copiar `.firebaserc.example` para `.firebaserc` local e substituir o placeholder pelo Project ID correcto. Não commitar o ficheiro local.
3. Executar Firebase Emulator Suite para Auth e Firestore; o workflow `Validar integração Firebase` executa `scripts/testar-auth-firebase.js` e `scripts/testar-regras-firestore.js` num projecto isolado `demo-estrada`.
4. Só após revisão e autorização, publicar: `firebase deploy --only firestore:rules --project plataforma-exames-conducao`.
5. Não publicar índices até existir consulta que os exija.
6. No Preview, confirmar a recepção real do email de verificação, abrir o link e validar a conta; testar também o Google, logout e persistência. O fluxo de registo/verificação/recuperação já tem cobertura automatizada no Auth Emulator, mas o emulador não prova a entrega de email pelo serviço real.

## Custos e limites

O Spark não exige método de pagamento e inclui quotas gratuitas em vários produtos. Firestore tem quotas de leituras, escritas, armazenamento e tráfego; App Check e FCM também têm limites. reCAPTCHA Enterprise pode ter custos acima da quota gratuita. Cloud Functions e determinados recursos de Storage/Google Cloud podem exigir Blaze e billing. Confirmar preços e limites actuais no Console antes de activar. Não prometer custo zero ou capacidade ilimitada.

## Protecção de dados

Antes de activar Analytics, FCM ou recolhas adicionais, definir política de privacidade, consentimento quando aplicável, retenção e minimização de dados. Não guardar passwords, tokens de sessão, dados completos de cartões ou segredos no Firestore.

## Documentação oficial consultada

- Firebase Authentication — reverse proxy e domínios de autenticação: https://firebase.google.com/docs/auth/web/redirect-best-practices
- Firebase Authentication — domínios autorizados e erros de autenticação: https://firebase.google.com/docs/auth/faq-and-troubleshooting
- Cloud Storage for Firebase — requisitos Blaze/Spark: https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024
- Cloud Functions for Firebase — requisitos de billing: https://firebase.google.com/docs/functions/faq-and-troubleshooting
- Firebase pricing plans: https://firebase.google.com/pricing/
