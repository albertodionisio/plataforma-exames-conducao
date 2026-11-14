# PENDENTE — definições da aplicação

Tarefas do módulo de definições. Protocolo geral em `INSTRUCOES.md`.

## DEF-001 — Página principal de definições
- Estado: EM CURSO — ChatGPT-ESTRADA-DEF1 — 2026-11-14 10:30 UTC — ficheiros: public/definicoes/index.html, public/definicoes/definicoes.css, public/definicoes/definicoes.js, docs/definicoes/PENDENTE.md — último sinal: 2026-11-14 10:30 UTC
- Pedido: criar a página principal de Definições do ESTRADA, com organização clara por categorias, navegação para as áreas previstas e adaptação a telemóveis e computadores.
- Onde mexer: módulo isolado em `public/definicoes/`; documentação e estado em `docs/definicoes/PENDENTE.md`.
- Pronto quando: página abre de forma independente dentro da publicação; apresenta categorias de personalização, conta e segurança, aprendizagem, subscrição, ajuda e informações; cada opção tem destino real ou é identificada honestamente como futura/indisponível; acessível por teclado e leitor de ecrã; responsiva; sem emojis; testes de estrutura, navegação e build aprovados.
- Cuidados: `index.html`, `app.js` e `styles.css` estão reservados por FE-008, FE-002, FE-001 e GER-012; não os alterar nesta tarefa. Não criar controlos fictícios, não activar pagamentos nem simular conta, notificações ou preferências que ainda não têm backend. A ligação no menu principal será feita numa tarefa posterior quando os ficheiros partilhados estiverem livres ou o dono autorizar expressamente a integração.
