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
| Firebase Authentication | Integrado no frontend | Email/palavra-passe, confirmação, recuperação, Google, sessão persistente e logout. Falta teste real em preview. |
| Cloud Firestore | Preparado | Perfil mínimo em `users/{uid}`; regras ainda não publicadas. |
| Firebase Hosting | Não adoptado | A aplicação continua alojada no Vercel. |
| Cloud Storage | Adiado | Não existe requisito actual de uploads; avaliar billing/Blaze antes de activar. |
| Cloud Functions | Adiado | Backend confiável poderá usar Cloud Functions (plano/billing compatível) ou endpoints Vercel com Firebase Admin SDK no servidor. Nunca usar Admin SDK no browser. |
| Firebase Cloud Messaging | Preparação documental | Push depende de service worker, chave VAPID, permissões e teste nos dispositivos. Não está activo. |
| Analytics | Adiado | Não foi fornecido `measurementId`; não inventar nem enviar dados sem política de privacidade. |
| Remote Config | Adiado | Activar quando existirem parâmetros concretos para gerir remotamente. |
| App Check | Preparação documental | Web usa reCAPTCHA; registar e monitorizar antes de impor enforcement. Não está activo. |
| Crashlytics | Fase Android | Considerar na aplicação Android; não declarar recolha web activa. |

## Modelo de dados e segurança

- `users/{uid}`: perfil mínimo; cada utilizador só pode aceder ao próprio documento.
- `subscriptions/{uid}`: plano/validade, escritos apenas por backend confiável.
- `exam_attempts/{attemptId}`: tentativas/resultados, escritos apenas por backend confiável.
- `payment_transactions/{transactionId}`: transacções confirmadas por servidor/webhook.

O cliente não pode criar nem alterar subscrições, resultados finais ou pagamentos. O resultado calculado no browser não é uma fonte confiável para conceder benefícios ou confirmar pagamentos; o servidor deverá validar a operação.

Perguntas, alternativas, explicações e imagens estáticas permanecem em `data/exames/` e `public/`, servidas como conteúdo estático com a estratégia CDN/cache existente. Não duplicar estes dados no Firestore. Telefone, se recolhido, é apenas contacto; não activar SMS/OTP.

## Domínio Vercel no fluxo Google

O `vercel.json` encaminha transparentemente `/__/auth/*` e `/__/firebase/*` para os auxiliares do Firebase Authentication. O `authDomain` usa o domínio Vercel. Isto segue a opção de reverse proxy documentada pelo Firebase e os rewrites externos do Vercel, mas **a compatibilidade ainda tem de ser confirmada em Preview Deployment com pedidos GET/POST e login Google completo**.

Passos externos:
1. Firebase Console → Authentication → Settings → Authorized domains: adicionar `plataforma-exames-conducao.vercel.app`.
2. Firebase Console → Authentication → Sign-in method: confirmar Google e Email/Password activos.
3. No Google Cloud OAuth Client associado ao Firebase, confirmar/adicionar o URI que o Firebase indicar para o domínio Vercel: `https://plataforma-exames-conducao.vercel.app/__/auth/handler`. Manter o URI Firebase padrão até o novo fluxo passar.
4. Criar Preview Deployment desta branch e verificar `/__/auth/handler`, `/__/auth/iframe` e pedidos POST, sem 302.
5. Testar escolha de conta, autenticação e retorno ao exame pendente. Se o proxy falhar, reverter temporariamente `authDomain` para `plataforma-exames-conducao.firebaseapp.com`; não publicar um login quebrado.

## Activação e validação

1. Instalar Firebase CLI num ambiente confiável e autenticar na conta proprietária.
2. Copiar `.firebaserc.example` para `.firebaserc` local e substituir o placeholder pelo Project ID correcto. Não commitar o ficheiro local.
3. Executar Firebase Emulator Suite para Auth e Firestore e validar regras.
4. Só após revisão e autorização, publicar: `firebase deploy --only firestore:rules --project plataforma-exames-conducao`.
5. Não publicar índices até existir consulta que os exija.
6. Completar testes reais de registo, verificação, recuperação, Google, logout e persistência no preview.

## Custos e limites

O Spark não exige método de pagamento e inclui quotas gratuitas em vários produtos. Firestore tem quotas de leituras, escritas, armazenamento e tráfego; App Check e FCM também têm limites. reCAPTCHA Enterprise pode ter custos acima da quota gratuita. Cloud Functions e determinados recursos de Storage/Google Cloud podem exigir Blaze e billing. Confirmar preços e limites actuais no Console antes de activar. Não prometer custo zero ou capacidade ilimitada.

## Protecção de dados

Antes de activar Analytics, FCM ou recolhas adicionais, definir política de privacidade, consentimento quando aplicável, retenção e minimização de dados. Não guardar passwords, tokens de sessão, dados completos de cartões ou segredos no Firestore.
