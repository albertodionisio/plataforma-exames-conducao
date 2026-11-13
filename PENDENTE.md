# PENDENTE — geral e interface

Leia `INSTRUCOES.md` antes de reservar uma tarefa. Formato e protocolo estão lá.

## Geral (GER-)

## Interface (FE-)

## FE-002 — Resultado final com semáforo e revisão pedagógica
- Estado: EM CURSO — Claude-FE002 — 2026-11-12 13:42 UTC+02 — ficheiros: app.js, styles.css, index.html (só se necessário), scripts/testar-fluxo.js — último sinal: 2026-11-12 13:42 UTC+02
- Nota: o dono autorizou em 2026-11-12 o uso de `app.js`, `styles.css` e `index.html` apesar das reservas paradas de DADOS-001 (Claude-1, desde 2026-11-09) e FE-001 (ChatGPT-FE001, desde 2026-11-10). Essas tarefas continuam com o seu estado; esta só usa os ficheiros partilhados.
- Pedido: alterar o fluxo do exame para não revelar acertos, erros ou explicações durante a realização. Depois de responder às 25 perguntas ou terminar o tempo, submeter automaticamente e apresentar nota, certas, erradas, em branco e estado final. Usar um semáforo gráfico real: luz verde acesa para APROVADO (nota >= 18/20) e luz vermelha acesa para REPROVADO (nota < 18/20). Disponibilizar «Rever exame» com pergunta, imagem, resposta seleccionada, resposta correcta e explicação pedagógica; incluir também perguntas certas e assinalar as não respondidas.
- Onde mexer: `app.js` e, se necessário, `styles.css`; criar/actualizar testes de fluxo.
- Pronto quando: durante o exame não existe feedback de correcção; submissão manual e por fim do cronómetro funcionam; cálculo respeita 0,8 valores por resposta certa e limiar 18; a revisão preserva a ordem e as respostas seleccionadas no exame; semáforo e nota são apresentados correctamente em aprovação e reprovação; testes e validação visual concluídos.
- Cuidados: verificar primeiro se `app.js` e `styles.css` estão livres; não alterar dados de perguntas nem regras de pontuação; não mostrar um estado de aprovação sem nota.

## FE-001 — Auditoria de experiência móvel e acessibilidade
- Estado: EM CURSO — ChatGPT-FE001 — 2026-11-10 09:55 UTC+02 — ficheiros: styles.css, docs/auditorias/interface-movel.md — último sinal: 2026-11-10 10:05 UTC+02
- Pedido: melhorar a utilização da versão actual em telemóveis, sem alterar as regras de negócio nem o funcionamento dos simulados.
- Onde mexer: `styles.css`; criar um relatório curto de verificação em `docs/auditorias/interface-movel.md`, se forem encontrados pontos relevantes.
- Pronto quando: interface verificada em larguras móveis comuns; navegação, botões, alternativas, imagens, tabela de planos e cabeçalho não provocam cortes ou deslocamento horizontal; foco de teclado é visível e os controlos têm áreas de toque adequadas; alterações testadas no navegador.
- Cuidados: não alterar `app.js`, `index.html` ou `config.js`; não mudar identidade visual, textos comerciais, preços ou planos. Se a correcção exigir ficheiros partilhados, parar e pedir ao dono para criar/autorizar tarefa separada.
- Parcial: ajustes responsivos e de foco publicados em `styles.css`; relatório parcial em `docs/auditorias/interface-movel.md`. Falta validar visualmente no navegador nas larguras indicadas no relatório.

## FE-005 — Registar o Simulado 32 na aplicação
- Estado: EM CURSO — ChatGPT-FE005 — 2026-11-13 UTC — ficheiros: index.html, PENDENTE.md, HISTORICO.md — último sinal: 2026-11-13 UTC
- Pedido: integrar o exame já publicado em `data/exames/exame32.js` na página principal, para que `window.EXAMES[32]` seja carregado antes de `app.js` e o catálogo o reconheça como disponível.
- Autorização: o dono autorizou expressamente esta integração no chat, incluindo a alteração pontual de `index.html`, apesar de ser ficheiro partilhado.
- Limite: não alterar `app.js`, CSS, conteúdo das perguntas, planos ou tarefas reservadas por outras sessões.
- Pronto quando: a tag script do exame 32 está antes de `app.js`; a referência é única; os caminhos e ordem de carregamento estão correctos; a alteração está publicada e confirmada no GitHub.
