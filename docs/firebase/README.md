# Firebase — fundação inicial do ESTRADA

Estado: preparação de configuração; **não significa que a aplicação já esteja ligada ao Firebase**.

## Projecto criado no Console

- Project ID: `plataforma-exames-conducao`
- Aplicação Web registada: ESTRADA Web
- Authentication: fornecedores Google e E-mail/senha activados no Console, conforme configuração feita pelo dono.
- Cloud Firestore: edição Standard, base `(default)`, região `africa-south1` (Johannesburg), criada no Console.
- Plano observado no Console: Spark.
- A configuração Web do SDK foi fornecida pelo dono na conversa. Não copiar a configuração completa, chaves, tokens ou credenciais para este documento.

## Estado da integração

O frontend do repositório ainda contém integração Supabase. A tarefa BE-001 prepara apenas os ficheiros de configuração, regras e documentação do Firestore. Não substitui o fornecedor no frontend, não migra utilizadores e não activa o Firebase na aplicação. A migração deve ser uma tarefa própria, coordenada com a tarefa de autenticação FE-012, para evitar dois sistemas de identidade activos ou perda de sessões/dados.

## Estrutura de dados proposta

As colecções seguintes são destinadas a dados dinâmicos e privados:

| Colecção | Documento | Conteúdo | Escrita |
|---|---|---|---|
| `users` | `{uid}` | Perfil mínimo: UID, email, nome de apresentação, telefone de contacto, fotografia e datas | O próprio utilizador, apenas nos campos permitidos |
| `subscriptions` | `{uid}` | Plano, estado, início e expiração | Apenas servidor |
| `exam_attempts` | `{attemptId}` | UID, exame, datas, estado, respostas e resultado | Apenas servidor |
| `payment_transactions` | `{transactionId}` | UID, referência externa, valor, moeda, estado e datas | Apenas servidor/webhook validado |

O telefone no perfil é um dado de contacto. A autenticação por telefone/SMS não está activada nem é necessária para esta primeira configuração.

### Conteúdo que NÃO deve ir para o Firestore

Perguntas, alternativas, explicações pedagógicas e imagens estáticas dos exames permanecem nos ficheiros versionados/publicados da aplicação e na distribuição CDN/cache. Não duplicar esse catálogo no Firestore: isso evita leituras de documentos para cada consulta do conteúdo estático e mantém a estratégia de cache.

Nunca guardar passwords, tokens de sessão, chaves privadas, service-account JSON ou dados de cartão.

## Regras de segurança

O ficheiro `firestore.rules` aplica o princípio de negar por omissão:

- Perfil: cada utilizador só pode ler o documento cujo ID é o seu UID. Pode criar o próprio perfil e alterar apenas nome, telefone de contacto, fotografia e data de actualização.
- Subscrições: o utilizador só pode ler o documento próprio; não pode criar nem alterar o plano, preço, validade ou estado.
- Tentativas: o cliente só pode ler tentativas próprias. Criação, respostas finais, pontuação e submissão ficam reservadas ao servidor.
- Pagamentos: o cliente só pode ler registos próprios. Criação e alteração ficam reservadas ao servidor, depois de validar a notificação do fornecedor de pagamentos.
- Qualquer outra colecção fica bloqueada.

As regras pressupõem documentos com o campo `uid` nas colecções `exam_attempts` e `payment_transactions`. Consultas dessas colecções feitas pelo cliente terão de filtrar por `uid == request.auth.uid`; o Firestore não usa regras como filtros automáticos.

**Consequência importante:** até existir backend confiável com Firebase Admin SDK, a aplicação não deve tentar gravar tentativas, resultados, subscrições ou pagamentos directamente no Firestore. O Admin SDK ignora estas regras e só pode ser usado em ambiente de servidor, com credenciais protegidas.

## Índices

A configuração começa sem índices compostos. O Firestore cria automaticamente índices de campo único. Só acrescentar índices compostos quando uma consulta concreta os exigir e o Console/erro de consulta indicar a combinação necessária. Evitar índices preventivos sem consultas implementadas.

## Configuração local e validação

1. Instalar a Firebase CLI num ambiente de desenvolvimento confiável: `npm install -g firebase-tools`.
2. Copiar `.firebaserc.example` para `.firebaserc` e confirmar que o ID é exactamente `plataforma-exames-conducao`. O ficheiro local `.firebaserc` não deve ser commitado se contiver associações de ambiente pessoais.
3. Autenticar a CLI com a conta Google proprietária do projecto: `firebase login`.
4. Validar as regras com o Firebase Emulator Suite antes de publicar.
5. Só depois de revisão e autorização explícita, publicar apenas as regras: `firebase deploy --only firestore:rules --project plataforma-exames-conducao`.
6. Publicar índices separadamente apenas quando existirem consultas que os exijam: `firebase deploy --only firestore:indexes --project plataforma-exames-conducao`.

Não executar deploy a partir desta tarefa. O dono deve confirmar o projecto/conta e autorizar a publicação. A criação do banco no Console não prova que estas regras locais já estejam activas no projecto.

## Custos e limites

A utilização depende das quotas do plano, região, operações, armazenamento, tráfego e serviços activados. A cache/CDN dos ficheiros estáticos não é uma leitura Firestore; leituras de perfis, subscrições, tentativas e pagamentos continuam a consumir operações Firestore quando forem consultados. Não assumir capacidade ilimitada nem custo zero garantido. Monitorizar o uso no Console antes de abrir a plataforma a muitos utilizadores.

## Próximas tarefas (fora de BE-001)

- Integrar Firebase Authentication no frontend e decidir a migração segura das contas actualmente geridas pelo Supabase.
- Criar backend confiável para tentativas, cálculo de pontuação, subscrições e pagamentos.
- Implementar testes das regras no Emulator Suite e validar acessos permitidos/negados.
- Só então activar as operações correspondentes na aplicação.
