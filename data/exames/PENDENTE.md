# PENDENTE — dados dos simulados

Leia `INSTRUCOES.md` antes de reservar uma tarefa. Um ficheiro por exame: `data/exames/exameN.js`.
Use `exame1.js` como modelo do formato.

## DADOS-001 — Simulado 2 (grátis)
- Estado: EM CURSO — Claude-1 — 2026-11-09 20:45 UTC — ficheiros: data/exames/exame2.js, index.html, app.js — último sinal: 2026-11-09 20:45 UTC
- Pedido: criar o simulado 2 com 25 perguntas reescritas, com explicação em cada resposta.
- Onde mexer: `data/exames/exame2.js` (novo). Se for preciso registar o ficheiro, `index.html`/`app.js` (confirmar que nenhuma outra tarefa EM CURSO os usa).
- Pronto quando: o simulado 2 abre, tem 25 perguntas, cronómetro de 60 minutos, correção imediata e resultado, sem erros no navegador.
- Cuidados: perguntas reescritas, sem copiar do APK original; não repetir perguntas do exame 1.

## DADOS-002 — Simulado 3 (grátis)
- Estado: LIVRE
- Pedido: criar o simulado 3 com 25 perguntas reescritas, com explicação em cada resposta.
- Onde mexer: `data/exames/exame3.js` (novo).
- Pronto quando: igual a DADOS-001, para o simulado 3.
- Cuidados: não repetir perguntas dos exames 1 e 2.

## DADOS-004 — Imagens de cena do exame 1 (perguntas 2, 3, 7 e 15)
- Estado: LIVRE
- Parcial: feitas as perguntas 2, 3 e 15 (2026-11-09, Claude-2). Falta a 7 (a imagem enviada tem uma passadeira à frente da lomba e pode confundir a resposta: gerar de novo sem passadeira).
- Pedido: criar as 4 imagens de cena que faltam no exame 1 (rua com ligeiros e um camião; estrada à noite; marcas brancas transversais no pavimento; braço de condutor à janela com a palma para baixo). A descrição de cada uma está em `imagem.descricao` no `data/exames/exame1.js`.
- Onde mexer: `public/cenas/` (pasta nova) e o campo `imagem.src` das perguntas 2, 3, 7 e 15 em `data/exames/exame1.js`.
- Pronto quando: as 4 perguntas mostram a imagem em vez de «Imagem em preparação», e cada imagem corresponde à pergunta e à resposta certa.
- Cuidados: o dono gera as imagens (IA ou fotografia) e envia; não copiar as fotos do APK original. Em Moçambique circula-se pela esquerda. Pergunta 7: confirmar a resposta («lombas») com a imagem final.

