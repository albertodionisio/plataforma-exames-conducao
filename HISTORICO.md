# HISTÓRICO — o que já foi feito

Não é instrução: serve para consultar e para evitar repetir trabalho. Uma linha por tarefa concluída (ID, data, sessão, o que mudou).
Os IDs aqui nunca são reutilizados. O detalhe técnico fica no `git log`.

## Antes do protocolo de sessões (sem ID)
- Primeira versão do site: início, catálogo de 50 simulados (3 grátis), página de planos, simulado com cronómetro e base PWA.
- Simulado 1 completo com 25 perguntas reescritas (as de demonstração foram removidas).
- Sinal A17 redesenhado em SVG (`public/sinais/`).
- `.gitignore` e README com regras do repositório.

## Com ID
- GER-002 — CONCLUÍDA — Claude-1: estados LIVRE / EM CURSO / CONCLUÍDA explícitos no `INSTRUCOES.md`, com campo `último sinal` e regra para sessões que param por limite (a tarefa fica protegida; reassumir só com autorização do dono).
- GER-003 — CONCLUÍDA — Claude-1: regra "enviar por blocos" (a sessão não vê o seu limite) e secção "Conferir o texto com o histórico (git log)" no `INSTRUCOES.md`; removida a regra de "fechar antes do limite", que não se pode cumprir.
- DADOS-003 — CONCLUÍDA — Claude-2 (2026-11-09): sinais recortados do `sinais.pdf` (G11, E1, N5, D16, H4, E47, N34) em `public/sinais/` e ligados às perguntas 4, 10, 14, 16, 17, 21 e 25 do exame 1 (a pergunta 1 já usava o A17).
