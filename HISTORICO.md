# HISTÓRICO — o que já foi feito

Não é instrução: serve para consultar e para evitar repetir trabalho. Uma linha por tarefa concluída (ID, data, sessão, o que mudou).
Os IDs aqui nunca são reutilizados. O detalhe técnico fica no `git log`.

## Antes do protocolo de sessões (sem ID)
- Primeira versão do site: início, catálogo de 50 simulados (3 grátis), página de planos, simulado com cronómetro e base PWA.
- Simulado 1 completo com 25 perguntas reescritas (as de demonstração foram removidas).
- Sinal A17 redesenhado em SVG (`public/sinais/`).
- `.gitignore` e README com regras do repositório.

## Com ID
- GER-007 — CONCLUÍDA — Claude-GER007 (2026-11-10): validador `scripts/validar-exames.js` (sem dependências; `node scripts/validar-exames.js`). Verifica cada `data/exames/exameN.js`: 25 perguntas, 4 alternativas, índice de `correta` válido, explicação presente, números de pergunta repetidos, imagens existentes dentro do repositório, e que o ficheiro define `window.EXAMES[N]` com N igual ao nome. Código de saída 1 se houver falhas. Não altera ficheiros de exame; testado com o exame 1 (sem problemas) e com ficheiros deliberadamente errados.
- GER-009 — CONCLUÍDA — ChatGPT-1 (2026-11-10): protocolo de coordenação entre sessões actualizado em `INSTRUCOES.md`; GitHub definido como fonte de verdade com consulta directa, confirmação pós-escrita e reserva concorrente de tarefas para impedir duplicação.
- GER-002 — CONCLUÍDA — Claude-1: estados LIVRE / EM CURSO / CONCLUÍDA explícitos no `INSTRUCOES.md`, com campo `último sinal` e regra para sessões que param por limite (a tarefa fica protegida; reassumir só com autorização do dono).
- GER-003 — CONCLUÍDA — Claude-1: regra "enviar por blocos" (a sessão não vê o seu limite) e secção "Conferir o texto com o histórico (git log)" no `INSTRUCOES.md`; removida a regra de "fechar antes do limite", que não se pode cumprir.
- DADOS-003 — CONCLUÍDA — Claude-2 (2026-11-09): sinais recortados do `sinais.pdf` (G11, E1, N5, D16, H4, E47, N34) em `public/sinais/` e ligados às perguntas 4, 10, 14, 16, 17, 21 e 25 do exame 1 (a pergunta 1 já usava o A17).
- GER-001 — CONCLUÍDA — Claude-1: os dois documentos (Especificação Técnica v3.0 e Modelo de Assinaturas e Monetização) juntos num só em `docs/ESTRADA_Especificacao_Tecnica.md` (v3.1), com o modelo dentro das secções 10 e 11, sem repetições; preços e planos iguais aos de `config.js`; `REGRAS.md` aponta para ele. Fica por decidir pelo dono: quais dos 50 simulados entram nos planos Básico (25).
- DADOS-004 — CONCLUÍDA — Claude-2 (2026-11-09): imagens de cena do exame 1 (perguntas 2, 3, 7 e 15) em `public/cenas/`, geradas pelo dono e ligadas em `data/exames/exame1.js`. Pergunta 7: enunciado ajustado para «faixas pintadas» porque a lomba da imagem tem faixas amarelas e brancas.
- GER-004 — CONCLUÍDA — Claude-2 (2026-11-09): APK original guardado em `original/` (62 MB) como referência de trabalho para todas as sessões, por decisão do dono, com o repositório ainda público. `.gitignore`, `README.md` e `REGRAS.md` ajustados (APKs gerados em `android/` continuam fora do repositório).
- GER-008 — CONCLUÍDA — Claude-GER008 (2026-11-11): proposta técnica do backend na OCI em `docs/architecture/DECISAO_BACKEND_OCI.md`. Recomenda uma VM Ampere A1 Always Free (limite actual 2 OCPU/12 GB) com PostgreSQL próprio e cópias cifradas no Object Storage; compara com Autonomous Database, MySQL HeatWave e PostgreSQL gerido (pago); lista riscos (instâncias ociosas, capacidade, ponto único de falha), custos, etapas e decisões do dono. Pontos por confirmar listados no documento. Nada foi criado na Oracle; a escolha final depende do dono.
- GER-005 — CONCLUÍDA — Claude-GER005 (2026-11-11): auditoria comparativa do Simulado 1 em `docs/auditorias/simulado-1.md`. Das 25 perguntas, 22 a manter, 2 a melhorar (5 e 15) e 1 a corrigir (25: a imagem mostra 400 m e o texto fala em 300 m); nenhuma a substituir. O objectivo e a resposta de cada pergunta coincidem com o original; as regras verificadas conferem com o Código da Estrada. Nada foi alterado em `exame1.js`; as correcções aguardam aprovação do dono.
