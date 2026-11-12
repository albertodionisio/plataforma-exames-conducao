# PENDENTE — geral e interface

Leia `INSTRUCOES.md` antes de reservar uma tarefa. Formato e protocolo estão lá.

## Geral (GER-)

## Interface (FE-)

## FE-002 — Resultado final com semáforo e revisão pedagógica
- Estado: LIVRE
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
