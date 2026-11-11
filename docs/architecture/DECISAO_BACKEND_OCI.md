# Decisão técnica do backend na OCI (proposta)

- **Tarefa:** GER-008 · **Sessão:** Claude-GER008 · **Data da pesquisa:** 2026-11-11
- **Estado:** PROPOSTA. A escolha final da stack depende da aprovação do dono (Borja). Nada foi criado nem configurado na Oracle: nenhuma conta, serviço ou credencial.
- **Relação com outros documentos:** parte da arquitectura de `docs/ESTRADA_Especificacao_Tecnica.md` (secções 3, 5, 7, 13, 14, 16 e 19): frontend web/PWA, backend modular único, **PostgreSQL**, fornecedores externos para SMS, pagamento e anúncios.

## 1. Resumo

**Recomendação para a primeira versão:** uma única máquina virtual **Ampere A1** (Always Free) com a API e o **PostgreSQL** instalado por nós, mais **Object Storage** para cópias de segurança cifradas. É a única opção que fica a custo zero **e** mantém PostgreSQL, como diz a especificação.

Os pontos que o dono tem de saber antes de decidir:

1. **O plano gratuito encolheu.** A documentação oficial actual (página alterada em 2026-06-12) indica que o Ampere A1 gratuito é **2 OCPU e 12 GB de memória no total** (1.500 horas OCPU e 9.000 horas GB por mês). Antes eram 4 OCPU e 24 GB. Os limites podem voltar a mudar; o desenho tem de caber no mínimo e ter saída.
2. **Uma só máquina é um ponto único de falha.** Sem alta disponibilidade no plano gratuito. Para um site de treino com poucos utilizadores é aceitável no início; para cobrar assinaturas, o dono deve aceitar esse risco de forma explícita.
3. **Risco de recuperação de máquinas "paradas".** A Oracle pode recuperar instâncias Always Free consideradas ociosas (secção 5). Um site novo, com pouco tráfego, pode cair nessa definição.
4. **O PostgreSQL gerido da Oracle não é gratuito** (não consta da lista Always Free). Fica como caminho de crescimento.
5. **SMS não existe no plano gratuito da OCI.** Continua a depender de um fornecedor externo (risco já registado na especificação, secção 19).

## 2. O que é gratuito (confirmado na documentação oficial)

Fonte: *Always Free Resources*, documentação Oracle OCI (consultada em 2026-11-11). Aplica-se à **região principal (home region)** da conta, que **não pode ser mudada depois** de criada.

| Recurso | Limite gratuito | Relevância para o ESTRADA |
|---|---|---|
| Computação Ampere A1 (Arm) | 1.500 horas OCPU e 9.000 horas GB por mês = **2 OCPU e 12 GB** no total; 1 instância de 2 OCPU ou 2 de 1 OCPU | Servidor da API e da base de dados |
| Computação AMD Micro | até 2 VM de 1/8 OCPU e 1 GB | Demasiado pequena para API + base de dados; serve só para tarefas leves |
| Block Volume (discos) | **200 GB no total**, discos de arranque incluídos; 5 cópias de volume; mínimo de 47 a 50 GB por disco de arranque | Disco da VM e dados do PostgreSQL |
| Object Storage | 20 GB; 50.000 pedidos de API por mês | Cópias de segurança |
| Autonomous AI Database | 2 instâncias, 1 CPU Oracle e 20 GB cada, **20 sessões simultâneas**, sem escalar | Alternativa gerida, mas é base de dados Oracle |
| MySQL HeatWave | 1 sistema, 50 GB de dados e 50 GB de cópias | Alternativa gerida, mas é MySQL |
| NoSQL | 3 tabelas de 25 GB | Não aplicável ao modelo relacional do ESTRADA |
| Flexible Load Balancer | 1, a 10 Mbps | Opcional; com uma só VM não é necessário |
| Email Delivery | 3.000 e-mails por mês | Verificação de conta e avisos de expiração por e-mail |
| Notifications | 1 milhão de notificações HTTPS e 1.000 por e-mail por mês | Alertas operacionais. **Não inclui SMS** |
| Monitoring / Logging | 500 milhões de pontos de ingestão no Monitoring; 10 GB por mês no Logging (partilhado com VCN Flow Logs) | Monitorização e alertas (secção 14 da especificação) |
| Vault | 150 segredos; chaves por software gratuitas | Guardar segredos fora do Git (secção 13 da especificação) |
| Certificates | 5 autoridades e 150 certificados | Alternativa ao TLS na própria VM |
| Tráfego de saída | 10 TB por mês | Largamente suficiente |
| Bastion | gratuito | Acesso SSH restrito e temporizado |

Pormenores a respeitar: as VM e os discos gratuitos têm de ser criados na home region; discos fora dela são cobrados. A porta 25 de saída está bloqueada por defeito (envio de e-mail directo exige pedido à Oracle; o serviço Email Delivery evita esse problema).

## 3. Opções comparadas

| Opção | Base de dados | Custo | Prós | Contras |
|---|---|---|---|---|
| **A. VM A1 + PostgreSQL próprio** (recomendada) | PostgreSQL instalado na VM | Zero, dentro dos limites | Igual à especificação; controlo total; migrações e restrições como previsto (secção 5) | Nós tratamos de actualizações, cópias de segurança e recuperação; ponto único de falha |
| B. VM A1 + Autonomous AI Database | Oracle (ATP) gerido | Zero, dentro dos limites | Cópias e correcções geridas | Dialecto Oracle em vez de PostgreSQL; 20 sessões simultâneas; 20 GB fixos; ligação por carteira de segurança; mais dependência da Oracle; obriga a rever o modelo de dados |
| C. VM A1 + MySQL HeatWave | MySQL gerido | Zero, dentro dos limites | Gerido; 50 GB | MySQL em vez de PostgreSQL (por exemplo, sem índices parciais); disponibilidade na região a confirmar |
| D. OCI Database with PostgreSQL (gerido) | PostgreSQL gerido | **Pago**: taxa por OCPU/hora mais armazenamento optimizado; cópias pagas à tarifa do Object Storage. O preço unitário não aparece na página pública consultada: usar o *Cost Estimator* da Oracle | PostgreSQL sem administração; cópias e actualizações geridas | Custo mensal fixo desde o primeiro dia; contraria o objectivo de recursos gratuitos |

Não foram comparadas alternativas fora da OCI porque o pedido do dono é partir da Oracle. Se a opção A falhar (capacidade ou limites), as saídas naturais são D ou um fornecedor externo de PostgreSQL gerido.

**Escolha proposta: A**, com a base de dados desenhada para poder passar para D sem alterar o código (PostgreSQL standard, sem extensões raras, migrações versionadas).

## 4. Arquitectura recomendada

```
Utilizador (browser/PWA)
   | HTTPS (443)
   v
[VM Ampere A1: 2 OCPU, 12 GB, disco 50 GB + volume de dados]
   |  Caddy ou Nginx (TLS, certificado automático, limites de pedidos)
   |  API modular (TypeScript/Node), um só processo gerido por systemd ou Docker
   |  PostgreSQL (só escuta em localhost)
   |
   +--> Object Storage: cópias cifradas diárias (pg_dump)
   +--> Email Delivery: verificação e avisos por e-mail
   +--> Fornecedor SMS externo (a escolher)
   +--> Fornecedor de pagamento (webhook assinado -> /payments/webhook)
   +--> OCI Monitoring + Notifications: alertas por e-mail
```

- **Rede:** uma VCN, sub-rede pública só para a VM. Abrir apenas 80 e 443 ao mundo; SSH por Bastion ou restrito ao IP do administrador. A base de dados nunca fica exposta à internet.
- **Frontend:** ficheiros estáticos servidos pela própria VM (ou por outro alojamento estático). O volume de tráfego previsto cabe nos 10 TB de saída.
- **Staging:** usar a mesma máquina dividida não é recomendável. Opções: ambiente local com Docker e fornecedores em sandbox; ou dividir o A1 em duas VM de 1 OCPU (produção e staging), aceitando menos margem em produção. Decisão do dono.
- **Autenticação (especificação, secção 7):** implementada na API (palavras-passe com Argon2id, sessões em cookies HttpOnly/Secure/SameSite, Google OAuth). Não se recomenda tratar o serviço de identidade da OCI como parte do plano gratuito sem confirmar preços e limites: **a confirmar**.
- **Segredos (secção 13):** chaves de pagamento, SMS e OAuth no Vault da OCI ou em variáveis protegidas na VM; nunca no Git (regra de `REGRAS.md`).

## 5. Riscos e limites que têm de ser conhecidos

| Risco | Detalhe | Mitigação |
|---|---|---|
| Máquina considerada ociosa | A Oracle pode recuperar instâncias Always Free se, durante 7 dias, o uso do CPU (percentil 95), da rede e (nas A1) da memória ficar abaixo de 20% | Monitorizar; o ESTRADA com poucos utilizadores pode cumprir estes critérios. Avaliar a passagem a conta *Pay As You Go* (a Oracle diz que só cobra o que exceder os limites gratuitos). **A confirmar com a Oracle** se a passagem protege contra a recuperação de instâncias ociosas |
| "Out of host capacity" | A criação de instâncias A1 pode falhar por falta de capacidade na região | Tentar outro domínio de disponibilidade, repetir mais tarde ou passar a conta paga (a documentação oficial indica estas três vias) |
| Limites reduzidos sem aviso | Em 2026 o limite do A1 passou de 4 OCPU/24 GB para 2 OCPU/12 GB; a imprensa técnica relata que isto não foi anunciado de forma ampla | Dimensionar para 2 OCPU/12 GB; ter script de reconstrução da VM e plano de saída para a opção D ou outro fornecedor |
| Ponto único de falha | Uma VM, sem réplica | Cópias diárias; teste de restauro; aceitar um tempo de recuperação de horas, não de segundos; comunicar isso no suporte |
| Cópias na mesma conta | Se a conta for suspensa, perdem-se dados e cópias | Guardar também uma cópia cifrada fora da Oracle (por exemplo, num disco do dono ou noutro serviço) |
| Cópias de volume | Máximo de 5 no total; ao atingir o limite a criação falha | Preferir `pg_dump` para o Object Storage e usar cópias de volume só para a VM |
| Pedidos ao Object Storage | 50.000 por mês | Poucos ficheiros grandes e comprimidos; não guardar por pedido |
| Conta e cartão | O registo exige cartão de crédito ou débito para verificação de identidade; a Oracle pode verificá-lo periodicamente. Cartão inválido ou expirado pode levar à suspensão da conta | **A confirmar:** se um cartão emitido em Moçambique é aceite e se o país está disponível no registo. O dono decide quem é o titular da conta |
| Região | A home region define onde ficam VM e bases gratuitas e não se muda. A disponibilidade do Autonomous Database gratuito varia por região | Confirmar na tabela de regiões da Oracle antes de criar a conta. A região de Joanesburgo é a candidata natural pela proximidade, mas **a confirmar** (existência no registo, capacidade do A1 e suporte das opções B e C) |
| Dados pessoais | Os dados ficam fora de Moçambique | Rever obrigações legais antes do lançamento (secção 13 da especificação) |

## 6. Custos: o que é gratuito, o que tem limite, o que pode cobrar

- **Gratuito dentro dos limites:** VM A1 de 2 OCPU/12 GB; discos até 200 GB; Object Storage até 20 GB; 3.000 e-mails por mês; Monitoring, Logging e Notifications nos limites da secção 2; tráfego de saída até 10 TB.
- **Com limite (ao ultrapassar, cobra ou falha):** horas de A1 acima de 1.500 OCPU e 9.000 GB por mês; discos acima de 200 GB ou fora da home region; mais de 5 cópias de volume; mais de 3.000 e-mails por mês; mais de 20 GB no Object Storage numa conta que só tem o plano gratuito.
- **Gera custo:** OCI Database with PostgreSQL gerido; load balancers e outros recursos fora da lista gratuita; SMS; processamento de pagamentos (comissões do fornecedor).
- **Controlo de custos:** com conta paga, activar orçamentos com alertas e quotas por compartimento (a Oracle indica as quotas como forma de limitar o consumo). Orçamento máximo mensal a definir pelo dono.

## 7. Etapas de implementação (fora desta tarefa)

1. **Decisões do dono** (secção 8).
2. **Conta e segurança:** criar a conta com a home region escolhida; autenticação multifactor; compartimento próprio do ESTRADA; alertas de orçamento; quotas.
3. **Rede:** VCN, regras mínimas (80/443; SSH restrito ou Bastion).
4. **Máquina:** criar a VM A1; actualizações automáticas de segurança; utilizador sem privilégios; firewall local.
5. **Base de dados:** instalar PostgreSQL; criar utilizadores com privilégios mínimos; aplicar o modelo da secção 5 da especificação por migrações versionadas.
6. **Cópias de segurança:** `pg_dump` diário, cifrado, para Object Storage e cópia externa; retenção definida; **teste de restauro antes de lançar**.
7. **API e TLS:** domínio e DNS; Caddy ou Nginx; API como serviço; limites de pedidos para login, SMS, checkout e submissão (secção 13).
8. **Integrações em sandbox:** e-mail, SMS, pagamento (webhook assinado e idempotente) e anúncios.
9. **Observabilidade:** logs estruturados sem segredos; alertas de erro, de cópia falhada e de uso da VM (para detectar o risco de máquina ociosa).
10. **Entrega contínua:** testes e *build* no GitHub, com publicação por SSH para staging e depois produção; versão identificada e plano de reversão (secção 16).
11. **Teste de carga e ensaio de recuperação** antes do lançamento; critério de aceitação: a aplicação completa um simulado de 25 perguntas e a submissão com o prazo calculado no servidor.

## 8. Decisões que ficam com o dono

1. Aceitar a opção A (PostgreSQL próprio na VM) ou preferir gestão pela Oracle (B, C ou D).
2. Região principal e titular da conta Oracle (cartão e contacto).
3. Aceitar o risco de ponto único de falha no lançamento e o tempo de recuperação indicado.
4. Passar para conta *Pay As You Go* com orçamento máximo, ou ficar só no plano gratuito.
5. Fornecedor de SMS e de pagamento (continuam pendentes na especificação, secção 19).
6. Como fazer staging (local, ou dividir o A1).
7. Domínio e nome definitivo (hoje "ESTRADA" é provisório).

## 9. O que ficou por confirmar

- Preço unitário do OCI Database with PostgreSQL (página pública sem valores; usar o *Cost Estimator*).
- Se Moçambique está disponível no registo e se o cartão local é aceite.
- Disponibilidade do Autonomous Database e capacidade do A1 na região escolhida.
- Se a conta *Pay As You Go* evita a recuperação de instâncias ociosas.
- Preços e limites de um serviço de identidade gerido da OCI, caso o dono prefira não implementar a autenticação na API.

## 10. Fontes

- Oracle, *Always Free Resources* (docs.oracle.com, `FreeTier`), página com última alteração em 2026-06-12: limites, instâncias ociosas, regiões, e-mail, notificações, base de dados.
- Oracle, *Database with PostgreSQL Pricing* (oracle.com/cloud/postgresql/pricing): modelo de preços (taxa por OCPU/hora e armazenamento; cópias à tarifa do Object Storage).
- Oracle, *OCI Cloud Free Tier FAQ* e *Free Tier*: registo com cartão para verificação, escolha da home region.
- InfoQ (2026-07), *Oracle Quietly Halves Free Tier Ampere A1 Compute Limits*: redução de 4 OCPU/24 GB para 2 OCPU/12 GB (fonte secundária).
