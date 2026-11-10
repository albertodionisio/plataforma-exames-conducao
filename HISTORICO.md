# HISTÓRICO — o que já foi feito

Não é instrução: serve para consultar e para evitar repetir trabalho. Uma linha por tarefa concluída (ID, data, sessão, o que mudou).
Os IDs aqui nunca são reutilizados. O detalhe técnico fica no `git log`.

## Antes do protocolo de sessões (sem ID)
- Primeira versão do site: início, catálogo de 50 simulados (3 grátis), página de planos, simulado com cronómetro e base PWA.
- Simulado 1 completo com 25 perguntas reescritas (as de demonstração foram removidas).
- Sinal A17 redesenhado em SVG (`public/sinais/`).
- `.gitignore` e README com regras do repositório.

## Com ID
- GER-009 — CONCLUÍDA — ChatGPT-1 (2026-11-10): protocolo de coordenação entre sessões actualizado em `INSTRUCOES.md`; GitHub definido como fonte de verdade com consulta directa, confirmação pós-escrita e reserva concorrente de tarefas para impedir duplicação.
- GER-002 — CONCLUÍDA — Claude-1: estados LIVRE / EM CURSO / CONCLUÍDA explícitos no `INSTRUCOES.md`, com campo `último sinal` e regra para sessões que param por limite (a tarefa fica protegida; reassumir só com autorização do dono).
- GER-003 — CONCLUÍDA — Claude-1: regra "enviar por blocos" (a sessão não vê o seu limite) e secção "Conferir o texto com o histórico (git log)" no `INSTRUCOES.md`; removida a regra de "fechar antes do limite", que não se pode cumprir.
- DADOS-003 — CONCLUÍDA — Claude-2 (2026-11-09): sinais recortados do `sinais.pdf` (G11, E1, N5, D16, H4, E47, N34) em `public/sinais/` e ligados às perguntas 4, 10, 14, 16, 17, 21 e 25 do exame 1 (a pergunta 1 já usava o A17).
- GER-001 — CONCLUÍDA — Claude-1: os dois documentos (Especificação Técnica v3.0 e Modelo de Assinaturas e Monetização) juntos num só em `docs/ESTRADA_Especificacao_Tecnica.md` (v3.1), com o modelo dentro das secções 10 e 11, sem repetições; preços e planos iguais aos de `config.js`; `REGRAS.md` aponta para ele. Fica por decidir pelo dono: quais dos 50 simulados entram nos planos Básico (25).
- DADOS-004 — CONCLUÍDA — Claude-2 (2026-11-09): imagens de cena do exame 1 (perguntas 2, 3, 7 e 15) em `public/cenas/`, geradas pelo dono e ligadas em `data/exames/exame1.js`. Pergunta 7: enunciado ajustado para «faixas pintadas» porque a lomba da imagem tem faixas amarelas e brancas.
- GER-004 — CONCLUÍDA — Claude-2 (2026-11-09): APK original guardado em `original/` (62 MB) como referência de trabalho para todas as sessões, por decisão do dono, com o repositório ainda público. `.gitignore`, `README.md` e `REGRAS.md` ajustados (APKs gerados em `android/` continuam fora do repositório).
