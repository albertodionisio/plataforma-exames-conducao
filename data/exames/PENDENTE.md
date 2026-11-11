# PENDENTE — dados dos simulados

Leia `INSTRUCOES.md` antes de reservar uma tarefa. Um ficheiro por exame: `data/exames/exameN.js`.
Use `exame1.js` como modelo do formato.

## Referência comum para a criação dos exames

- **Exame 1:** concluído e já implementado em `data/exames/exame1.js`. Serve como modelo de estrutura e qualidade; não deve ser refeito nesta fase.
- **Fonte de consulta:** `original/Codigo_e_Sinais_de_Transito_1_1.apk`. O APK contém 30 exames de referência, com 25 perguntas cada, e os PDFs de apoio indicados em `original/LEIAME.md`.
- **Processo obrigatório para cada novo exame:** abrir o exame correspondente no aplicativo original; identificar as 25 perguntas, a imagem/sinal associado quando existir, o tema e o objectivo pedagógico de cada uma; registar o número correspondente no exame de origem; só depois redigir a pergunta e as quatro alternativas de forma original para o ESTRADA.
- **Mapa de referência:** criar `docs/referencias-exames/exameN-mapeamento.md` para cada exame. Deve relacionar número da pergunta de origem com número da pergunta no ESTRADA, tema, tipo (identificação de sinal, interpretação, regra ou situação prática), objectivo avaliado e referência da imagem/sinal. Registar também perguntas sem imagem e divergências encontradas.
- **Não copiar:** não transcrever literalmente enunciados, alternativas ou explicações do APK. O mapa de referência deve conter apenas identificação e análise, não reproduzir o banco original.
- **Qualidade e validação:** não repetir perguntas de exames anteriores; confirmar a resposta correcta com a legislação moçambicana e os documentos de referência disponíveis; escrever explicação clara; garantir 25 perguntas, quatro alternativas e um índice correcto; executar `node scripts/validar-exames.js`.
- **Imagens:** associar cada imagem à pergunta certa. Reutilizar imagens do repositório quando forem correspondentes; se faltar uma imagem, registar a necessidade no mapa, sem inventar ou associar uma imagem semelhante só para preencher.
- **Separação de tarefas:** cada sessão trabalha apenas no exame que reservou. Não alterar tarefas EM CURSO de outra sessão nem ficheiros partilhados sem verificar o protocolo de `INSTRUCOES.md`.

## DADOS-001 — Simulado 2 (grátis)
- Estado: EM CURSO — Claude-1 — 2026-11-09 20:45 UTC — ficheiros: data/exames/exame2.js, index.html, app.js — último sinal: 2026-11-09 20:45 UTC
- Pedido: criar o simulado 2 com 25 perguntas reescritas, com explicação em cada resposta, usando o Exame 2 do aplicativo original como referência e respeitando o processo comum acima.
- Onde mexer: `data/exames/exame2.js` (novo) e `docs/referencias-exames/exame2-mapeamento.md`. Se for preciso registar o ficheiro, `index.html`/`app.js` (confirmar que nenhuma outra tarefa EM CURSO os usa).
- Pronto quando: o simulado 2 abre, tem 25 perguntas, cronómetro de 60 minutos, correção imediata e resultado, mapa de referência completo, validação automática sem erros e sem erros no navegador.
- Cuidados: perguntas reescritas, sem copiar do APK original; não repetir perguntas do exame 1. Esta tarefa já está reservada: nenhuma outra sessão deve mexer nela sem autorização do dono.

## DADOS-002 — Simulado 3 (grátis)
- Estado: LIVRE
- Pedido: consultar o Exame 3 do aplicativo original, analisar as 25 perguntas e criar o simulado 3 para o ESTRADA com perguntas reescritas e explicação em cada resposta.
- Onde mexer: `data/exames/exame3.js` (novo) e `docs/referencias-exames/exame3-mapeamento.md`.
- Pronto quando: o simulado 3 abre, tem 25 perguntas, cronómetro de 60 minutos, correção imediata e resultado; mapa de referência completo; `node scripts/validar-exames.js` passa; não há erros no navegador.
- Cuidados: seguir o processo comum; não repetir perguntas dos exames 1 e 2; não copiar texto do APK; não alterar ficheiros partilhados que estejam reservados por outra tarefa.

## DADOS-005 — Simulado 4
- Estado: LIVRE
- Pedido: consultar o Exame 4 do aplicativo original, analisar as 25 perguntas e criar o simulado 4 para o ESTRADA com perguntas reescritas e explicação em cada resposta.
- Onde mexer: `data/exames/exame4.js` (novo) e `docs/referencias-exames/exame4-mapeamento.md`.
- Pronto quando: o simulado 4 abre, tem 25 perguntas, cronómetro de 60 minutos, correção imediata e resultado; mapa de referência completo; `node scripts/validar-exames.js` passa; não há erros no navegador.
- Cuidados: seguir o processo comum; não repetir perguntas dos exames 1, 2 e 3; não copiar texto do APK; não alterar ficheiros partilhados que estejam reservados por outra tarefa.
