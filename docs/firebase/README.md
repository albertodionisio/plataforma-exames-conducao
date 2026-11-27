# Firebase — arquitectura e estado de activação do ESTRADA-JB

**Actualizado:** 27 de Novembro de 2026  
**Project ID:** `plataforma-exames-conducao`  
**Branch de trabalho:** `feat/firebase-full-migration`  
**Produção:** não integrada; regras Firestore ainda não publicadas.

Consultar [Estado actual do projecto](../ESTADO-ATUAL.md) para o resumo consolidado. Este documento descreve a integração actual e separa testes automatizados, validação manual no Preview e activação em produção.

## Estado confirmado

| Componente | Estado actual | Limite |
|---|---|---|
| Firebase Authentication — Google | Validado manualmente no Preview pelo proprietário | Domínios Preview/alias foram autorizados no Firebase Console. |
| Email/palavra-passe | Implementação e testes de emulador presentes | Não afirmar que todos os fluxos reais de email foram manualmente validados no Preview. |
| Telefone/palavra-passe | Backend custom token e testes automatizados presentes | Não usa SMS/OTP e não comprova titularidade do número. |
| Cloud Firestore | Perfil, colecções e regras preparados; testes no Emulator Suite passaram | Regras ainda não publicadas no projecto real. |
| Firebase Admin SDK | Utilizado no backend para operações privilegiadas | Service account apenas em secret do ambiente servidor. |
| Firebase Hosting | Não adoptado | A aplicação continua alojada no Vercel. |
| Cloud Storage | Não adoptado | Perguntas e imagens são recursos estáticos no repositório. |
| Cloud Functions | Não adoptado | Endpoints backend são Vercel Functions nesta arquitectura. |
| Cloud Messaging / Push | Não activo | Requer implementação, configuração e testes específicos. |
| App Check / Analytics / Crashlytics | Não activos nesta entrega | Não declarar recolha ou enforcement activos. |

## Projecto e autenticação

- Project ID: `plataforma-exames-conducao`.
- Firestore: base `(default)`, região documentada `africa-south1`.
- A configuração Web pública está em `config.js`. A Firebase Web API key é identificador público; service account, private keys, OAuth client secrets e tokens nunca devem ser incluídos no frontend.
- Google login foi comprovado pelo proprietário no Preview depois de autorizar o domínio exacto do deployment e o alias estável da branch.
- Email/password cria a conta e inicia sessão sem exigir confirmação obrigatória do email, conforme decisão do proprietário. Recuperação depende do acesso à caixa de correio.
- Telefone/password usa endpoint backend e Firebase custom token; não envia SMS/OTP e não deve apresentar o número como verificado.

## Firestore e modelo de dados

Colecções utilizadas/preparadas:
- `users/{uid}` — perfil mínimo da conta.
- `subscriptions/{uid}` — plano e validade da assinatura.
- `payment_transactions/{transactionId}` — registos de checkout e confirmação.
- `exam_attempts/{attemptId}` — estrutura prevista para tentativas/resultados, sujeita à implementação e validação backend correspondentes.
- `phone_auth_accounts` e `phone_auth_rate_limits` — dados técnicos de autenticação telefónica, acessíveis apenas ao Admin SDK.

As regras seguem princípio default-deny e isolamento por UID. O cliente não deve escrever directamente pagamentos, assinaturas ou resultados finais. Consultas de dados do utilizador devem filtrar pelo UID autenticado; as regras Firestore não funcionam como filtros.

**Importante:** testes de regras no Emulator Suite passaram no workflow indicado abaixo, mas as regras ainda não foram publicadas no Firebase real. Rever regras e índices antes de qualquer publicação. Não publicar sem autorização expressa.

## Autenticação telefónica

O fluxo aceita números em formato internacional E.164 e normaliza números moçambicanos. A palavra-passe é processada no servidor com scrypt e salt; o identificador do documento é HMAC do número. O servidor emite Firebase custom token e aplica limites anti-abuso.

Não existe SMS/OTP nem prova de que o utilizador controla o número. Contas exclusivamente telefónicas não têm recuperação automática segura de palavra-passe sem mecanismo adicional previamente configurado. Esta limitação deve ser comunicada antes de disponibilizar o método publicamente.

## Configuração do servidor

Variáveis sensíveis são configuradas apenas como secrets no ambiente apropriado:
- `FIREBASE_SERVICE_ACCOUNT_JSON`
- `PHONE_AUTH_PEPPER`
- segredos da ePay descritos em [docs/epay/README.md](../epay/README.md)

Nunca guardar valores secretos neste repositório, nem copiar secrets Preview para Production.

## Testes e evidências

No commit `ba7df6f2c1141884e9fb7c4cf7a405aa908df4e4`, o GitHub Actions **Validar integração Firebase**, run `45833068199`, terminou com sucesso. Incluiu:
- verificação de sintaxe das funções backend;
- testes ePay sem chamadas externas;
- testes de validação de email;
- testes da configuração Firebase;
- testes de autenticação telefónica;
- testes Authentication e Firestore no Emulator Suite, incluindo regras.

O proprietário confirmou manualmente no Preview o login Google. Isto complementa, mas não substitui, os testes automatizados.

## Activação futura

Antes de produção:
1. rever integralmente `firestore.rules` e `firestore.indexes.json`;
2. confirmar domínios definitivos e OAuth redirect/callback;
3. validar todos os fluxos reais necessários no domínio final;
4. confirmar secrets e permissões mínimas no ambiente Production;
5. concluir auditoria de segurança e plano de recuperação;
6. obter autorização expressa antes de publicar regras, integrar na `main` ou fazer deploy de produção.

Não apagar nem alterar o projecto Supabase antigo sem pedido explícito. As contas existentes foram identificadas pelo proprietário como contas de teste; não há migração de contas reais a executar nesta fase.
