# PENDENTE — definições da aplicação

Tarefas do módulo de definições. Protocolo geral em `INSTRUCOES.md`. Executar uma tarefa de cada vez; reservar no GitHub antes de alterar código.


## DEF-008 — Integração, testes e auditoria final das definições
- Estado: EM CURSO — ChatGPT-ESTRADA-DEF1 — 2026-11-14 13:55 UTC+02 — ficheiros: public/definicoes/, public/ajuda/, scripts/testar-definicoes.js, .github/workflows/testar-definicoes.yml, docs/definicoes/ — último sinal: 2026-11-14 14:05 UTC+02
- Parcial: integração técnica de DEF-002 a DEF-007 revista; avisos e limites das funções estão explícitos; centro de ajuda e documentos legais pendentes estão ligados; testes de sintaxe, estrutura, navegação e build aprovados no GitHub Actions run 43590916328; deploy GitHub Pages run 43590916121 aprovado; verificação Vercel no commit d6695c5c4bb986499e7a976a80f9280dc40b651a com estado success («Deployment has completed»). Falta o dono confirmar a validação visual/interactiva em telemóvel e computador.
- Pedido: integrar as áreas DEF-002 a DEF-007, testar navegação, acessibilidade, persistência e comportamento em telemóvel/desktop.
- Onde mexer: módulo `public/definicoes/`, testes e documentação relacionada.
- Pronto quando: todas as opções têm destino/acção real ou estado indisponível explícito; testes automatizados passam; regressões críticas corrigidas; validação visual pelo dono registada.
- Cuidados: não declarar funções dependentes de backend/serviços externos como activas; não mexer em áreas alheias ao módulo.

