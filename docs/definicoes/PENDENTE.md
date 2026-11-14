# PENDENTE — definições da aplicação

Tarefas do módulo de definições. Protocolo geral em `INSTRUCOES.md`. Executar uma tarefa de cada vez; reservar no GitHub antes de alterar código.

## DEF-002 — Aparência e preferências
- Estado: EM CURSO — ChatGPT-ESTRADA-DEF1 — 2026-11-14 12:50 UTC+02 — ficheiros: public/definicoes/index.html, public/definicoes/definicoes.css, public/definicoes/definicoes.js, scripts/testar-definicoes.js — último sinal: 2026-11-14 12:50 UTC+02
- Pedido: tornar funcionais as preferências de apresentação da aplicação, começando por opções suportadas e persistência local; não mostrar controlos sem efeito.
- Onde mexer: `public/definicoes/` e, se necessário, integração global após verificar reservas de ficheiros partilhados.
- Pronto quando: tema/preferência implementado com estado persistente e acessível; opções de som/idioma só activadas se existir suporte real; testes e validação visual móvel concluídos.
- Cuidados: não alterar preços, planos, dados de exames ou ficheiros partilhados reservados sem autorização específica. Não prometer tradução ou efeitos sonoros inexistentes.

## DEF-003 — Notificações
- Estado: LIVRE
- Pedido: implementar preferências e notificações úteis, incluindo permissões e estados de suporte do navegador quando aplicável.
- Onde mexer: módulo de definições e integração de notificações; documentar dependências externas.
- Pronto quando: permissões são pedidas apenas após acção explícita; estados permitido/negado/não suportado são tratados; não há notificações fictícias; testes aprovados.
- Cuidados: não pedir permissão automaticamente ao abrir a aplicação; não enviar mensagens sem consentimento.

## DEF-004 — Perfil e segurança
- Estado: LIVRE
- Pedido: estruturar e implementar gestão de perfil e segurança conforme a autenticação realmente existente.
- Onde mexer: módulo de definições e autenticação/backend, caso já exista.
- Pronto quando: dados apresentados vêm de fonte real; alterações são validadas e protegidas; se faltar backend, a interface informa claramente e não simula conta.
- Cuidados: nunca guardar palavras-passe em texto simples nem expor dados pessoais.

## DEF-005 — Histórico, resultados e progresso
- Estado: LIVRE
- Pedido: disponibilizar histórico de exames, resultados, perguntas guardadas e progresso com base em dados reais.
- Onde mexer: módulo de definições e camada de persistência disponível.
- Pronto quando: dados são recuperados de forma consistente, com estados vazios e erros tratados; não inventar resultados nem perder dados; testes de recuperação aprovados.
- Cuidados: preservar o fluxo e os resultados actuais dos exames; não alterar perguntas ou pontuação.

## DEF-006 — Planos, subscrições e pagamentos
- Estado: LIVRE
- Pedido: apresentar estado do plano e preparar gestão de subscrição/pagamentos de acordo com as integrações existentes.
- Onde mexer: módulo de definições e integração de pagamentos.
- Pronto quando: estado e validade vêm de fonte verificável; dependências externas ficam documentadas; nenhuma cobrança é simulada.
- Cuidados: preços, planos, cobranças e bloqueios exigem aprovação expressa do dono. Manter o regime de testes actual até nova autorização.

## DEF-007 — Ajuda, suporte e informação legal
- Estado: LIVRE
- Pedido: disponibilizar ajuda, perguntas frequentes, contacto, reporte de problemas, termos e privacidade com conteúdo verdadeiro e canais válidos.
- Onde mexer: módulo de definições e documentação pública.
- Pronto quando: cada ligação abre conteúdo ou canal existente; documentos legais são revistos antes de publicação; não usar contactos inventados.
- Cuidados: não afirmar apoio 24/7, garantias ou estatuto oficial sem fundamento.

## DEF-008 — Integração, testes e auditoria final das definições
- Estado: LIVRE
- Pedido: integrar as áreas DEF-002 a DEF-007, testar navegação, acessibilidade, persistência e comportamento em telemóvel/desktop.
- Onde mexer: módulo `public/definicoes/`, testes e documentação relacionada.
- Pronto quando: todas as opções têm destino/acção real ou estado indisponível explícito; testes automatizados passam; regressões críticas corrigidas; validação visual pelo dono registada.
- Cuidados: não declarar funções dependentes de backend/serviços externos como activas; não mexer em áreas alheias ao módulo.

