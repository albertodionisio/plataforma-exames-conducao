# ESTRADA — Especificação Técnica e Plano de Produção

Plataforma digital de preparação para exames de condução em Moçambique.
Arquitectura funcional, aplicação, dados, segurança, assinaturas e pagamentos, publicidade, identidade visual, testes e implantação.

**Versão 3.1** — consolida a Especificação Técnica v3.0 (25 de Outubro de 2026) e o documento "Modelo de Assinaturas e Monetização" num só documento. O modelo de assinaturas está integrado na secção 10 (e a política de anúncios na secção 11); não existe um segundo documento a manter.

Identidade visual proposta: clássica, discreta, educativa e exclusiva; azul-marinho, marfim e verde discreto, sem efeitos futuristas ou excesso de animações.

> Este documento é uma especificação de produção. Não é, por si só, código-fonte executável nem comprova que serviços externos estejam configurados.

---

## Como usar este documento

Este documento transforma o plano de produto numa especificação técnica de referência para uma equipa de desenvolvimento ou outra IA. Inclui decisões de produto, arquitectura recomendada, modelos de dados, contratos de API, regras de negócio, segurança, testes e etapas de lançamento.

Uma especificação reduz ambiguidades, mas não substitui o repositório de código, credenciais de serviços, contas de pagamento/publicidade, revisão jurídica, nem testes em ambiente real.

**Fonte de verdade para planos e preços:** `config.js`. Os valores deste documento coincidem com ele; qualquer alteração de preços ou planos exige aprovação do dono (ver `REGRAS.md`).

### Estado das decisões

| Área | Estado | Nota |
|---|---|---|
| 50 exames × 25 perguntas | Definido | 1.250 posições; conteúdo precisa de ser produzido e validado. |
| Modo estudo | Definido | Explicação após cada resposta; cronómetro continua. |
| Duração/pontuação | Regra do produto | 60 min; 0,8 valores por resposta certa; limiar interno 18/20, exigindo 23 certas. |
| Modelo de receita | Definido | Cinco opções de acesso (secção 10): Free e quatro planos pagos. Substitui a proposta anterior de um único plano semanal. |
| Identidade visual | Direcção definida | Exclusiva, clássica e discreta; nome/logótipo pendentes. |
| Tecnologias | Recomendação | Stack proposta; aprovar antes da implementação. |
| Categoria de carta | Pendente | Confirmar categoria e programa de estudo. |
| Pagamentos e SMS | Pendente | Escolher fornecedores com cobertura e condições adequadas. |
| Renovação, cancelamento, atendimento | Pendente | Ver secção 19. |

## Índice

1. Visão geral e limites do produto
2. Requisitos funcionais e regras de negócio
3. Arquitectura recomendada
4. Estrutura da aplicação e módulos
5. Modelo de dados
6. Contratos de API
7. Autenticação, SMS e permissões
8. Exames, cronómetro e pontuação
9. Conteúdo pedagógico
10. Assinaturas, monetização e pagamentos
11. Publicidade
12. Identidade visual e UX
13. Segurança e privacidade
14. Operação e recuperação
15. Testes e critérios de aceitação
16. Implantação
17. Repositório e configuração
18. Plano de execução
19. Riscos e decisões pendentes
20. Critérios de entrega

---

## 1. Visão geral e limites do produto

### 1.1 Objectivo

Construir uma aplicação web responsiva, leve e adaptada a telemóveis, para ajudar candidatos em Moçambique a estudar o Código da Estrada, praticar perguntas de escolha múltipla e acompanhar erros e progresso.

### 1.2 Regras do produto

- 50 exames, 25 perguntas cada, quatro alternativas e exactamente uma correcta por pergunta.
- Modo estudo: após responder, mostrar correcção e explicação pedagógica.
- Cronómetro de 60 minutos iniciado no começo; continua durante a leitura das explicações.
- Ao expirar, submeter automaticamente; perguntas sem resposta são identificadas e valem zero.
- Cada resposta certa vale 0,8 valores; máximo 20; limiar interno 18/20, ou 23 respostas certas.
- Três exames gratuitos, sempre os mesmos para todos os utilizadores. Os restantes são desbloqueados por assinatura paga (secção 10).
- Todos os planos permitem tentativas ilimitadas nos exames a que o utilizador tem acesso.
- Não interromper exame com anúncios, nem cobrir pergunta, alternativas ou cronómetro.

O tempo, a pontuação e o limiar são regras internas de treino, não regras oficiais do exame sem confirmação competente.

### 1.3 Fora do âmbito inicial

- Aplicação nativa: começar por web responsiva/PWA.
- Rankings, funcionalidades sociais, painel de escolas e modo offline completo: avaliar depois.
- Não apresentar o serviço como oficial nem prometer aprovação.

---

## 2. Requisitos funcionais

| ID | Requisito | Comportamento |
|---|---|---|
| FR-01 | Registo e sessão | Email/password e Google OAuth após configuração. |
| FR-02 | Verificação de telefone | Código SMS temporário, limite de tentativas e prevenção de abuso. |
| FR-03 | Catálogo | Mostrar 50 exames, tema, estado de acesso e progresso. |
| FR-04 | Plano gratuito | Permitir os 3 exames gratuitos fixos, com tentativas ilimitadas. |
| FR-05 | Assinatura | Quatro planos pagos (semanais e mensais) com 25 ou 50 exames; anúncios reduzidos nos semanais e ausentes nos mensais. |
| FR-06 | Modo estudo | Guardar resposta e mostrar explicação imediatamente. |
| FR-07 | Cronómetro | Prazo calculado no servidor; relógio local não prolonga a tentativa. |
| FR-08 | Expiração da tentativa | Finalizar automaticamente ao terminar o prazo. |
| FR-09 | Resultados | Nota /20, certas, erradas, não respondidas e resultado interno. |
| FR-10 | Revisão | Rever perguntas erradas e explicações. |
| FR-11 | Progresso | Histórico e evolução por tema. |
| FR-12 | Administração | Editar, rever e publicar perguntas com auditoria. |
| FR-13 | Publicidade | Anúncios em zonas permitidas, conforme o plano activo (secção 11). |
| FR-14 | Auditoria | Registar acções administrativas e eventos de pagamento. |
| FR-15 | Expiração da assinatura | Bloquear automaticamente os exames pagos ao expirar, preservar conta e histórico, manter os 3 gratuitos. |
| FR-16 | Notificações de expiração | Avisos automáticos 3 dias antes, 1 dia antes, no dia e após a expiração (secção 10.11). |

---

## 3. Arquitectura recomendada

Frontend TypeScript em aplicação web/PWA, backend API modular, PostgreSQL e fornecedores externos para autenticação, SMS, email, pagamentos e anúncios. Para o primeiro lançamento, um backend modular único tende a ser mais simples e barato que microserviços.

```
[Browser / PWA]
      | HTTPS
      v
[Frontend: páginas, formulários, acessibilidade]
      | API autenticada
      v
[Backend modular]
   | Auth / Users / Questions / Attempts / Scoring
   | Subscriptions / Payments / Ads / Notifications / Admin / Audit
   |            |             |
   v            v             v
[PostgreSQL] [SMS/Email] [Pagamento/Ads]
   |
   v
[Backups + logs + monitorização]
```

| Componente | Responsabilidade | Princípio |
|---|---|---|
| Frontend | Interface e navegação | Não decide nota nem permissão de plano. |
| Backend | Autorização, regras, prazo, pontuação | Fonte de verdade. |
| PostgreSQL | Dados e histórico | Restrições, índices, migrações e backups. |
| Auth | Identidade e sessão | OAuth e recuperação seguros. |
| SMS/email | Verificação e mensagens | Segredos só no servidor. |
| Pagamento | Cobrança e eventos | Confirmar por webhook assinado. |
| Publicidade | Exibição e medição | Não intrusiva e suprimida nos planos sem anúncios. |
| Notificações | Avisos de expiração | Automáticas, sem duplicados, registadas. |
| Admin | Gestão editorial | Funções restritas e acções auditadas. |

### Princípios arquitectónicos

- Separar interface, regras de negócio e persistência.
- Menor privilégio para utilizadores, administradores e serviços.
- Migrações versionadas; segredos fora do Git.
- Exportação de dados e possibilidade de trocar de fornecedor.
- Registar erros sem recolher dados pessoais desnecessários.

---

## 4. Estrutura da aplicação e módulos

```
apps/
  web/src/{app,components,features,lib,styles,tests}
  api/src/{modules,middleware,jobs,config,tests}
packages/shared/
database/{migrations,seeds}
docs/{architecture,api,operations,privacy}
scripts/
.env.example
README.md
```

Módulos: Auth, Users, QuestionBank, Simulation, Attempt, Scoring, Subscription, Payment, Ads, Notification, Admin e Audit. Esta é uma estrutura de referência, não um repositório já implementado.

### Fronteiras

- **Auth:** sessões, OAuth, SMS e recuperação.
- **QuestionBank:** perguntas, alternativas, fontes, revisão e versões.
- **Attempt:** início, respostas, prazo e submissão.
- **Scoring:** cálculo de nota e estado interno.
- **Subscription/Payment:** plano, eventos, renovação, cancelamento e expiração.
- **Notification:** verificação periódica das assinaturas e envio dos avisos de expiração.
- **Ads:** locais de anúncios e regras por plano.
- **Admin/Audit:** publicação e registo de alterações.

---

## 5. Modelo de dados

| Tabela | Campos principais | Finalidade |
|---|---|---|
| users | id, auth_provider_id, email, phone, phone_verified_at, role, created_at, status | Perfil e estado; password nunca em texto simples. |
| topics | id, name, description, parent_id, active | Organização temática. |
| legal_sources | id, title, jurisdiction, publication_date, version, article_ref | Rastreabilidade legal. |
| questions | id, topic_id, prompt, explanation, difficulty, status, source_id, version, reviewed_at | Conteúdo e revisão. |
| question_options | id, question_id, option_key, option_text, is_correct, position | Quatro opções; uma correcta. |
| simulations | id, number, title, is_premium, active, version | Catálogo de exames. |
| simulation_questions | simulation_id, question_id, position | Perguntas fixadas e ordenadas. |
| attempts | id, user_id, simulation_id, started_at, deadline_at, submitted_at, status, score | Tentativa e resultado. |
| attempt_answers | id, attempt_id, question_id, selected_option_id, answered_at, is_correct | Resposta e histórico. |
| subscriptions | id, user_id, plan_code, status, starts_at, ends_at, auto_renew, provider_ref | Plano activo e validade. `plan_code` identifica um dos cinco planos. |
| payments | id, user_id, subscription_id, provider_event_id, amount, currency, status | Cobranças e reconciliação. |
| notification_log | id, user_id, subscription_id, type, sent_at, status | Registo dos avisos de expiração, para evitar duplicados e permitir consulta. |
| ad_events | id, user_id nullable, placement, event_type, occurred_at | Métricas minimizadas. |
| admin_audit_logs | id, actor_user_id, action, entity_type, entity_id, created_at | Auditoria. |
| sms_verifications | id, user_id, phone_hash, code_hash, expires_at, attempts, verified_at | Verificação sem código em texto simples. |

A tabela `notification_log` resulta do requisito de registar o envio dos avisos (secção 10.11) e não existia na versão 3.0.

### Restrições

- Exame publicado: 25 perguntas publicadas.
- Pergunta publicada: exactamente quatro alternativas e uma correcta.
- Tentativa tem um único estado final; submissão idempotente.
- Evento de pagamento tem ID único para evitar duplicação.
- O mesmo aviso de expiração não é enviado duas vezes para o mesmo evento.
- Guardar versão/snapshot suficiente para rever perguntas antigas.
- A expiração de uma assinatura não elimina conta, histórico de tentativas nem resultados.

---

## 6. Contratos de API

Proposta REST/JSON sob `/api/v1`. Documentar o contrato final com OpenAPI. Os endpoints administrativos exigem papéis específicos.

| Método/rota | Acesso | Finalidade |
|---|---|---|
| GET /me | Autenticado | Perfil e verificação. |
| POST /auth/phone/start | Autenticado | Enviar código SMS. |
| POST /auth/phone/confirm | Autenticado | Confirmar código. |
| GET /simulations | Público/autenticado | Catálogo e bloqueios. |
| POST /attempts | Autenticado | Iniciar exame se autorizado. |
| GET /attempts/{id} | Dono/admin | Estado e perguntas. |
| PUT /attempts/{id}/answers/{questionId} | Dono | Guardar resposta dentro do prazo. |
| POST /attempts/{id}/submit | Dono/serviço | Submissão idempotente. |
| GET /attempts/{id}/result | Dono/admin | Resultado. |
| GET /progress | Autenticado | Progresso por tema. |
| GET /plans | Público | Planos publicados. |
| POST /payments/checkout | Autenticado | Criar checkout. |
| POST /webhooks/payments/{provider} | Fornecedor | Processar webhook assinado. |
| GET /subscription | Autenticado | Estado da assinatura, data de expiração e tempo restante. |
| POST /subscription/cancel | Autenticado | Cancelar, quando suportado. |
| POST /admin/questions | Editor | Criar pergunta em rascunho. |
| POST /admin/questions/{id}/publish | Revisor/editor autorizado | Publicar conteúdo validado. |

### Resposta de resultado ilustrativa

```json
{
  "attemptId": "uuid",
  "status": "submitted",
  "score": 18.4,
  "maximumScore": 20,
  "correctCount": 23,
  "wrongCount": 1,
  "unansweredCount": 1,
  "passedPracticeThreshold": true
}
```

O backend calcula o resultado a partir das respostas guardadas; nunca aceita a nota calculada pelo browser.

### Erros consistentes

400 validação; 401 sessão inválida; 403 sem permissão; 404 recurso indisponível; 409 conflito/estado final; 422 estado incompatível; 429 limite excedido; 500 erro interno sem segredos.

---

## 7. Autenticação, SMS e permissões

- Registo/login por email e palavra-passe através de fornecedor fiável ou implementação conforme padrões reconhecidos.
- Google OAuth após configurar client ID, segredo no servidor e URLs de retorno permitidas.
- Recuperação de conta sem revelar se um email está registado.
- Código SMS de utilização única, com expiração, limites de tentativas e limites por número/IP.
- Administradores devem usar protecção adicional; SMS não deve ser o único factor administrativo.
- Cookies seguros HttpOnly/Secure/SameSite quando aplicável; protecção CSRF se necessário.
- Autorização no backend em cada pedido; esconder botão no frontend não é segurança.

| Papel | Permissões |
|---|---|
| Visitante | Páginas públicas e catálogo limitado. |
| Utilizador | Exames gratuitos, perfil e progresso próprio. |
| Assinante | Exames do plano pago activo, conforme o plano (secção 10). |
| Editor | Criar/editar perguntas em rascunho. |
| Revisor | Verificar conteúdo e aprovar publicação. |
| Administrador | Gerir funções autorizadas; acções críticas auditadas. |

---

## 8. Exames, cronómetro e pontuação

```
draft -> in_progress -> submitted
                     -> expired/submitted

deadline_at = started_at + 60 minutes
score       = correct_count * 0.8
passed      = score >= 18.0
unanswered  = 25 - answered_count
wrong       = answered_count - correct_count
```

- O servidor cria `started_at` e `deadline_at`; relógio local serve apenas para exibir contagem.
- Ao iniciar, fixar a versão e as perguntas da tentativa; não enviar a resposta correcta antecipadamente.
- Ao responder, validar dono, estado e prazo; guardar resposta e devolver explicação.
- Ao expirar, bloquear novas respostas e finalizar automaticamente.
- A submissão deve ser transaccional e idempotente; repetir pedido não cria resultado duplicado.
- Repetir um exame inicia uma nova tentativa, com novas respostas e acesso às explicações associadas.
- O sistema guarda o histórico das tentativas e os resultados, para o utilizador acompanhar a evolução e identificar o que precisa de estudar mais.

| Certas | Nota | Resultado interno |
|---|---|---|
| 23 | 18,4/20 | Aprovado |
| 22 | 17,6/20 | Não aprovado |
| 25 | 20/20 | Aprovado |

Recomendação inicial: no modo estudo, bloquear a resposta após confirmação para preservar consistência. Esta regra deve ser confirmada antes da implementação.

---

## 9. Conteúdo pedagógico

Objectivo editorial: pelo menos 1.250 perguntas originais, organizadas em 50 exames. A cobertura final deve ser validada por profissional competente no Código da Estrada moçambicano.

- Sinalização vertical, horizontal e luminosa.
- Agentes reguladores e hierarquia de indicações.
- Prioridades, cruzamentos, rotundas, STOP e cedência de passagem.
- Indicadores, manobras, ultrapassagem e mudança de via.
- Velocidade, distância de segurança, paragem e estacionamento.
- Iluminação, visibilidade, avarias e condições meteorológicas.
- Peões, veículos prioritários e condução defensiva.
- Fadiga, distracção, álcool e comportamento de risco.
- Passageiros, carga, estado do veículo, pneus, travões e documentos.
- Deveres do condutor, infracções, acidentes e cenários integrados.

| Campo | Obrigação |
|---|---|
| Enunciado | Claro, sem ambiguidades. |
| Alternativas | Quatro opções plausíveis, uma correcta. |
| Explicação | Motivo da resposta em linguagem pedagógica. |
| Tema/dificuldade | Classificação editorial. |
| Referência legal | Diploma/artigo exacto, apenas se verificado. |
| Estado/versão | Rascunho, revisão, aprovado, publicado ou retirado. |
| Direitos de media | Origem/licença de imagens. |

Fluxo: rascunho → revisão factual/legal → revisão pedagógica → validação de resposta única → aprovação → publicação versionada.

Não copiar bancos privados nem usar imagens sem licença. Não inventar artigos legais.

---

## 10. Assinaturas, monetização e pagamentos

### 10.1 Objectivo e modelo

O modelo de monetização oferece diferentes opções de acesso aos exames, para que cada utilizador escolha o plano mais adequado às suas necessidades e capacidades financeiras. É um **modelo misto**: um plano gratuito com publicidade, planos semanais com publicidade reduzida e planos mensais sem publicidade e com atendimento prioritário.

O utilizador pode experimentar a plataforma gratuitamente antes de pagar. Os planos pagos diferem na quantidade de exames, mantendo a possibilidade de repetir ilimitadamente os exames desbloqueados durante a validade da assinatura.

### 10.2 Os cinco planos

| Plano | Preço | Validade | Exames | Publicidade | Atendimento |
|---|---|---|---|---|---|
| Free | 0 MT | Sem limite | 3 fixos | Sim | Normal |
| Semanal Básico | 50 MT | 7 dias | 25 | Reduzida | Normal |
| Semanal Completo | 80 MT | 7 dias | 50 | Reduzida | Normal |
| Mensal Básico | 80 MT | 30 dias | 25 | Sem anúncios | Prioritário |
| Mensal Completo | 150 MT | 30 dias | 50 | Sem anúncios | Prioritário |

A diferença entre os planos pagos é determinada pela duração, pela quantidade de exames e pelos benefícios de publicidade e atendimento. Preços e validades são apresentados de forma clara antes da confirmação de qualquer pagamento. Os valores em vigor estão em `config.js`.

### 10.3 Organização e acesso aos exames

- Existem 50 exames diferentes, identificados individualmente, cada um com 25 perguntas.
- Os três exames gratuitos são sempre os mesmos para todos os utilizadores e fazem parte do conjunto de 50 dos planos pagos.
- O plano Free dá acesso apenas aos três exames gratuitos. Os planos pagos desbloqueiam 25 ou 50 exames, conforme a assinatura.
- O acesso é controlado automaticamente pelo sistema, de acordo com o plano activo. Antes de permitir um exame pago, a plataforma verifica o estado da assinatura.
- Esta regra de acesso é centralizada num serviço backend, usado tanto no catálogo como no início de um exame.

### 10.4 Duração e validade

- A validade começa a contar a partir da activação do acesso pago, após a confirmação do pagamento.
- Assinatura semanal: 7 dias. Assinatura mensal: 30 dias.
- Durante esse período o utilizador acede aos exames desbloqueados e faz novas tentativas sem limite.
- A plataforma apresenta a data de expiração e, quando possível, o tempo restante.

### 10.5 Tentativas ilimitadas

Todos os planos permitem tentativas ilimitadas nos exames a que o utilizador tem acesso. No plano Free, os três exames podem ser repetidos quantas vezes se desejar, sem pagamento. Nos planos pagos, qualquer exame desbloqueado pode ser repetido durante toda a validade. Ver secção 8 para o comportamento de cada tentativa.

### 10.6 Expiração das assinaturas

- Ao expirar uma assinatura paga, o sistema bloqueia automaticamente os exames pagos que dependam dela.
- A expiração **não elimina** a conta, o histórico de tentativas nem os resultados anteriores.
- O utilizador continua a ter acesso aos três exames gratuitos, sem pagar.
- Para recuperar o acesso pago, renova a assinatura ou adquire um novo plano compatível.
- A plataforma informa sobre a expiração e oferece uma opção clara para renovar ou escolher outro plano.

### 10.7 Renovação e alteração de planos

- A plataforma permite adquirir nova assinatura quando a anterior expira.
- As condições de renovação, a eventual renovação automática, o cancelamento e o tratamento de pagamentos pendentes ou falhados **têm de ser definidos antes da implementação final** (ver secção 19).
- Ao mudar de plano, o sistema actualiza as permissões de acordo com a assinatura efectivamente confirmada, sem conceder benefícios sem pagamento válido.

### 10.8 Atendimento prioritário

Os utilizadores com assinaturas mensais têm atendimento prioritário em relação aos restantes. Os pedidos de suporte destes assinantes recebem prioridade no tratamento, sobretudo em pagamentos, acesso à conta, problemas técnicos e funcionamento dos exames.

O atendimento prioritário não é garantia de assistência permanente, salvo se a administração o definir expressamente. Antes do lançamento têm de ser estabelecidos os canais de atendimento, os procedimentos e os prazos de resposta.

### 10.9 Fluxo de pagamento

```
1. Utilizador escolhe plano
2. Backend cria checkout
3. Fornecedor processa pagamento
4. Webhook assinado chega ao backend
5. Backend valida assinatura, valor, moeda e referência
6. Regista evento único
7. Activa assinatura até ends_at
8. Frontend consulta estado actualizado
```

- Nunca activar um plano pago apenas pelo retorno do browser.
- Validar a assinatura criptográfica do webhook e impedir eventos duplicados.
- Tratar pagamento pendente, falhado, reembolsado, cancelado e expirado.
- Informar se a renovação é automática ou manual e como cancelar.
- Métodos de pagamento e renovação ainda não foram aprovados.

### 10.10 Resumo das regras comerciais

O modelo baseia-se em cinco opções: um plano gratuito e quatro pagos. O Free dá três exames fixos, tentativas ilimitadas e publicidade. Os semanais dão 25 ou 50 exames, tentativas ilimitadas e publicidade reduzida. Os mensais dão 25 ou 50 exames, tentativas ilimitadas, ausência de publicidade e atendimento prioritário. Os preços são 50 MT e 80 MT (semanais) e 80 MT e 150 MT (mensais), com validades de 7 e 30 dias. O modelo deve ser implementado de forma transparente: preços, duração, benefícios e condições claros para os utilizadores.

### 10.11 Notificações de expiração das assinaturas

A plataforma tem um sistema automático de notificações para avisar quando uma assinatura paga está perto de expirar, para o utilizador renovar a tempo e evitar a interrupção do acesso.

**Momentos de envio.** O sistema verifica regularmente a validade das assinaturas activas e envia:

| Momento | Finalidade |
|---|---|
| 3 dias antes da expiração | Primeira notificação: a assinatura está perto do fim. |
| 1 dia antes da expiração | Lembrete para renovar e manter o acesso aos exames pagos. |
| No dia da expiração | Aviso de que a assinatura termina nesse dia. |
| Após a expiração | Informa que o acesso pago foi suspenso e que é possível renovar. |

As notificações só são enviadas quando aplicáveis à situação da assinatura. O sistema evita enviar a mesma notificação duas vezes para o mesmo evento.

**Conteúdo.** Cada notificação indica: nome do plano activo, data de expiração, tempo restante (quando aplicável), os benefícios que se mantêm ou são suspensos, e uma opção para renovar ou consultar os planos.

**Canais.** O sistema permite notificações dentro da plataforma (por exemplo, avisos no painel do utilizador). A arquitectura deve permitir, no futuro, outros canais — correio electrónico, SMS ou notificações push — conforme os serviços disponíveis, os custos e as preferências do utilizador. Canais externos só podem ser usados depois de configurados e com os dados e autorizações necessários.

**Depois da renovação.** Quando o utilizador renova e o pagamento é confirmado, o sistema actualiza a validade do plano e cancela os avisos de expiração que já não se aplicam. Se não renovar, mantêm-se as regras da secção 10.6: bloqueio dos exames pagos e preservação dos três gratuitos.

**Gestão e controlo.** A plataforma regista cada envio (utilizador, tipo de aviso, data e estado, quando disponível) na tabela `notification_log`. O sistema funciona automaticamente, sem o administrador enviar avisos à mão; o administrador pode consultar o estado das notificações para acompanhar e resolver falhas. A implementação considera a privacidade, a segurança dos dados e a prevenção de mensagens duplicadas.

---

## 11. Publicidade

A política de publicidade é diferenciada pelo plano activo: gerar receita nos planos Free e semanais e oferecer experiência sem anúncios aos assinantes mensais.

| Plano | Regra de anúncios |
|---|---|
| Free | Anúncios nas áreas permitidas; não podem impedir o acesso aos três exames gratuitos nem comprometer funcionalidades essenciais. |
| Semanais | Quantidade reduzida em comparação com o Free; publicidade moderada, para uma experiência de estudo confortável. |
| Mensais | Completamente sem publicidade durante a validade da assinatura. É um dos principais benefícios destes planos. |

### Locais e restrições

| Local | Regra |
|---|---|
| Página inicial | Um espaço discreto entre secções. |
| Área de estudo | Fora do conteúdo principal. |
| Resultados | Abaixo do resumo, sem esconder a nota. |
| Exame activo | Sem anúncios intrusivos; preferencialmente nenhum. |
| Planos mensais | Sem publicidade enquanto a assinatura estiver activa. |

- A publicidade não interrompe exames em andamento, não bloqueia perguntas, não interfere com o cronómetro e não impede a submissão das respostas.
- A plataforma distingue correctamente os utilizadores pelo plano activo, e mostra anúncios só onde são permitidos. Isto vale na interface e na elegibilidade do backend.
- Cumprir regras da rede publicitária, consentimento aplicável e restrições etárias.
- Não incentivar cliques, não gerar tráfego artificial e não prometer rendimento fixo.
- Se o anúncio não carregar, a aplicação continua a funcionar.
- Medir métricas agregadas com o mínimo de dados pessoais necessário.

---

## 12. Identidade visual e experiência

A identidade será própria, clássica, discreta, educativa e profissional; não excessivamente moderna, futurista ou carregada. O nome e logótipo definitivos permanecem pendentes.

| Elemento | Direcção proposta |
|---|---|
| Cores | Azul-marinho, fundo marfim, verde discreto e dourado opcional como pequeno acento. |
| Tipografia | Família legível, hierarquia consistente e tamanho confortável. |
| Logótipo | Símbolo original ligado à aprendizagem e circulação; não imitar emblemas oficiais. |
| Ícones | Um conjunto consistente e simples. |
| Movimento | Animações mínimas e respeito por preferência de movimento reduzido. |
| Tom | Português claro e adequado a Moçambique. |
| Anúncios | Identificados e visualmente separados do conteúdo educativo. |

- Páginas: inicial, registo/login, SMS, painel, catálogo, exame, resultados, revisão, progresso, biblioteca de sinais, assinatura, perfil, privacidade, suporte e painel administrativo.
- Contraste adequado, foco visível, botões cómodos para toque e não depender só da cor para certo/errado.
- Optimizar imagens, fontes e JavaScript para Android modesto e ligações lentas.

---

## 13. Segurança e privacidade

- HTTPS obrigatório.
- Validar entradas no cliente e servidor; consultas parametrizadas.
- Verificar que cada utilizador só acede às próprias tentativas.
- Rate limit para login, SMS, checkout e submissão.
- Segredos em gestor de segredos/variáveis protegidas, nunca no Git.
- Backups cifrados e testes de restauração.
- Recolher apenas dados necessários; publicar privacidade, termos e retenção.
- Definir procedimentos para acesso, correcção e eliminação de dados conforme lei aplicável.
- Actualizar dependências e executar análise de vulnerabilidades.
- Não guardar dados completos de cartões nem expor chaves privadas no frontend.
- Rever obrigações legais e fiscais em Moçambique antes do lançamento.

Se menores puderem utilizar a plataforma, rever a recolha de dados, publicidade e consentimento antes de publicar.

---

## 14. Operação e recuperação

| Área | Mínimo operacional |
|---|---|
| Logs | Estruturados; nunca incluir passwords, tokens ou códigos SMS. |
| Erros | Monitorização frontend/backend com identificador de correlação. |
| Métricas | Disponibilidade, latência, erros, exames, pagamentos falhados. |
| Alertas | Falhas de webhook, aumento de erros, backups falhados, falhas no envio de notificações. |
| Backups | Automáticos, retenção documentada e restauração testada. |
| Incidentes | Responsável, prioridade, contenção, recuperação e revisão. |
| Suporte | Canal de contacto e processo para erros de conteúdo/pagamento. |

Submissões e pagamentos devem ser transaccionais/idempotentes: uma falha parcial não pode duplicar resultados ou conceder acesso indevido.

---

## 15. Testes e critérios de aceitação

| ID | Teste | Critério |
|---|---|---|
| AT-01 | Estrutura | 25 perguntas por exame; quatro opções por pergunta. |
| AT-02 | Resposta única | Uma única alternativa correcta por pergunta publicada. |
| AT-03 | Cronómetro | Prazo no servidor; relógio local não o altera. |
| AT-04 | Explicação | Resposta e explicação após escolha; tempo continua. |
| AT-05 | Expiração da tentativa | Submissão automática e não respondidas identificadas. |
| AT-06 | Pontuação | 23 certas = 18,4; 22 = 17,6; branco = zero. |
| AT-07 | Gratuito | Três exames abrem sem pagamento. |
| AT-08 | Bloqueio | Exames pagos bloqueados sem assinatura activa. |
| AT-09 | Pagamento | Só webhook válido concede acesso. |
| AT-10 | Expiração da assinatura | Acesso pago removido; conta, histórico e os 3 gratuitos mantidos. |
| AT-11 | Anúncios por plano | Mensais não vêem anúncios; semanais vêem menos que o Free. |
| AT-12 | Privacidade | Utilizador não lê tentativas alheias. |
| AT-13 | Responsividade | Páginas essenciais funcionam em telemóvel. |
| AT-14 | Admin | Só papéis autorizados publicam conteúdo. |
| AT-15 | Webhook repetido | Evento repetido não duplica cobrança/acesso. |
| AT-16 | Acesso por plano | Plano de 25 exames desbloqueia 25; plano de 50 desbloqueia 50. |
| AT-17 | Notificações | Avisos a 3 dias, 1 dia, no dia e após a expiração; sem duplicados; cancelados após renovação. |

### Tipos de teste

- Unitários: pontuação, acesso por plano, expiração e validação de perguntas.
- Integração: API, base de dados, OAuth, SMS e webhooks sandbox.
- End-to-end: registo até exame; pagamento até desbloqueio.
- Segurança: permissões, rate limits, segredos e sessão.
- Usabilidade com candidatos; revisão editorial independente.

---

## 16. Implantação

| Ambiente | Uso | Dados |
|---|---|---|
| Local | Desenvolvimento | Dados fictícios e sem segredos reais. |
| Staging | Integração e aceitação | Fornecedores sandbox. |
| Produção | Utilizadores reais | Credenciais protegidas, backups e monitorização. |

- Executar lint, testes, integração e build.
- Aplicar migrações em staging e validar compatibilidade.
- Testar login, SMS, pagamento sandbox, anúncios e acesso.
- Fazer backup antes de migrações de risco.
- Publicar versão identificada com plano de rollback.
- Validar páginas essenciais após publicação.
- Não lançar enquanto perguntas e políticas não forem revistas.

O domínio próprio, DNS, HTTPS/TLS e políticas de segurança devem ser configurados depois de escolher o nome.

---

## 17. Repositório e configuração

```
APP_ENV=development
APP_URL=http://localhost:3000
API_URL=http://localhost:4000
DATABASE_URL=change_me
AUTH_PROVIDER=to_be_selected
GOOGLE_CLIENT_ID=change_me
GOOGLE_CLIENT_SECRET=server_only
SMS_PROVIDER=to_be_selected
SMS_API_KEY=server_only
PAYMENT_PROVIDER=to_be_selected
PAYMENT_SECRET_KEY=server_only
PAYMENT_WEBHOOK_SECRET=server_only
AD_PROVIDER=to_be_selected
LOG_LEVEL=info
```

Modelo de configuração, sem credenciais reais; não funciona até implementar o código e configurar os serviços.

- README de instalação, execução, testes e build.
- `.env.example` sem segredos.
- OpenAPI, diagrama de arquitectura e modelo de dados.
- Migrações SQL e seeds de desenvolvimento fictícios.
- Guia de implantação, backup, restauração e rollback.
- Políticas legais revistas e manual de administração.

Definição de pronto: código implementado, revisto, testado, documentado e validado em staging.

---

## 18. Plano de execução

| Fase | Entregáveis | Condição de avanço |
|---|---|---|
| 0. Decisões | Nome, categoria, stack, auth/SMS/pagamentos e regras finais | Decisões críticas aprovadas. |
| 1. Fundação | Repo, CI, base de dados, auth inicial, estilos | Build e testes automáticos. |
| 2. Conteúdo | Fluxo editorial e lote de perguntas validadas | Revisão competente concluída. |
| 3. Exames | Catálogo, tentativas, cronómetro, explicações, resultados | AT-01 a AT-06 aprovados. |
| 4. Contas | SMS, Google, perfil, histórico e revisão | Fluxos testados. |
| 5. Receita | Cinco planos, webhooks, acesso por plano, anúncios, expiração e notificações | Sandbox e expiração testados (AT-07 a AT-11, AT-15 a AT-17). |
| 6. QA | Segurança, desempenho, acessibilidade, backups | Sem defeitos críticos. |
| 7. Piloto | Grupo reduzido, suporte e métricas | Problemas críticos resolvidos. |
| 8. Lançamento | Domínio, produção, políticas e suporte | Checklist assinada. |

O calendário depende da equipa, revisão do conteúdo e fornecedores. Não é responsável prometer uma data antes de resolver estas dependências.

---

## 19. Riscos e decisões pendentes

| Questão | Impacto | Acção |
|---|---|---|
| Categoria de carta | Determina conteúdo e dificuldade | Definir categoria e confirmar programa. |
| Revisão legal | Perguntas erradas ensinam regras erradas | Revisor competente e referências verificadas. |
| Nome/domínio | Marca e publicação | Escolher nome e verificar disponibilidade. |
| Autenticação | Custo, segurança e exportação | Comparar fornecedores. |
| SMS Moçambique | Cobertura e custo | Testar entrega, remetente e preço. |
| Pagamento (semanal e mensal) | Suporte local pode variar | Validar métodos do público-alvo. |
| Publicidade | Receita e consentimento incertos | Escolher rede e rever políticas. |
| Custos | Hospedagem, SMS e email têm custo | Orçamento e alertas de consumo. |
| Privacidade | Dados pessoais e histórico | Política, retenção e resposta a incidentes. |
| Banco de perguntas | Qualidade define confiança | Produzir, rever, testar e versionar. |
| Renovação e cancelamento | Define o comportamento no fim do período e o tratamento de pagamentos falhados | Decidir renovação automática ou manual, cancelamento e pagamentos pendentes/falhados antes da implementação final. |
| Atendimento prioritário | Promessa feita aos assinantes mensais | Definir canais, procedimentos e prazos de resposta antes do lançamento. |
| Canais de notificação | SMS e email têm custo e exigem autorização | Escolher que canais externos usar, além do aviso dentro da plataforma. |
| Quais exames nos planos Básico | Os planos de 25 exames não dizem quais dos 50 incluem; também não está dito se contam os 3 gratuitos | O dono decide a composição dos 25 antes de implementar o acesso por plano. |

---

## 20. Critérios de conclusão e entrega

### Pacote final de software

- Código-fonte frontend/backend e estrutura clara.
- Dependências e scripts de instalação, execução, testes e build.
- Migrações e modelo de dados.
- Dados de demonstração identificados como fictícios.
- OpenAPI e documentação técnica.
- Testes automatizados e evidência dos resultados.
- `.env.example` e lista de credenciais que o proprietário deve configurar.
- README passo a passo e guia de implantação/recuperação.
- Políticas e textos legais revistos.
- Banco de perguntas com referências verificadas e histórico editorial.
- Identidade visual aprovada aplicada às páginas.

### Critérios de aceite

- Registo, login e verificação de telefone funcionam.
- Três exames gratuitos disponíveis e restantes bloqueados sem assinatura.
- Pagamento confirmado concede o plano comprado; expiração/cancelamento remove o acesso pago.
- Planos mensais não vêem anúncios; planos semanais vêem anúncios reduzidos.
- Avisos de expiração enviados nos momentos definidos, sem duplicados.
- Cronómetro de servidor, submissão e pontuação não são manipuláveis pelo browser.
- Resultados identificam certas, erradas e não respondidas.
- Admin autorizado gere conteúdo com auditoria.
- Aplicação funciona em telemóvel; backups e monitorização testados.

Este documento é uma especificação técnica de produção e plano de implementação. Não é código compilável, não configura serviços externos e não comprova que login Google, SMS, pagamentos ou publicidade estejam activos. Para um produto pronto a executar, é necessário implementar o repositório, configurar credenciais, produzir conteúdo e executar os testes.
