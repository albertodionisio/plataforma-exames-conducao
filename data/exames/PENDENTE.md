# PENDENTE — dados dos simulados

Leia `INSTRUCOES.md` antes de reservar uma tarefa. Um ficheiro por exame: `data/exames/exameN.js`.
Use `exame1.js` como modelo do formato e do nível de adaptação.

## Referência comum para a criação dos exames

- **Exame 1:** concluído e já implementado em `data/exames/exame1.js`. É o modelo de como transformar as perguntas do aplicativo original para o ESTRADA.
- **Fonte obrigatória:** `original/Codigo_e_Sinais_de_Transito_1_1.apk`. O APK contém 30 exames de referência, com 25 perguntas cada. Consultar também os PDFs de apoio indicados em `original/LEIAME.md` quando necessário.
- **Extrair antes de criar:** abrir no APK o exame correspondente ao número da tarefa e identificar as 25 perguntas reais, na ordem em que aparecem, incluindo enunciado, alternativas, resposta indicada, imagem/sinal e tema. Não criar o exame de memória nem substituir as perguntas por outras inventadas.
- **Modelar como no Exame 1:** a versão ESTRADA deve manter a mesma matéria, intenção, dificuldade aproximada e competência testada pela pergunta original. Fazer uma adaptação leve e fiel: trocar algumas palavras, melhorar a clareza e, quando ajudar, contextualizar ligeiramente a situação. Não mudar o assunto, a regra avaliada, o sentido da pergunta nem o nível de exigência. Deve continuar a parecer uma pergunta de exame de condução, não uma aula ou um exercício genérico.
- **Alternativas e resposta:** conservar o conteúdo essencial das alternativas e a lógica da pergunta, reformulando a linguagem de forma natural. Confirmar a alternativa correcta com o Código da Estrada e os documentos de referência. Não inventar uma resposta para fazer a pergunta parecer diferente. Distribuir as posições das respostas correctas de forma equilibrada e sem padrão previsível; não deixar a alternativa correcta sistematicamente mais longa.
- **Mapa de referência:** criar `docs/referencias-exames/exameN-mapeamento.md`. Para cada uma das 25 perguntas, indicar o número no exame original, o número no ESTRADA, tema, competência avaliada, resumo do enunciado de origem, tipo de pergunta, imagem/sinal e ficheiro de imagem correspondente. O mapa serve para rastreabilidade e revisão; não é um novo banco de perguntas.
- **Imagens:** preservar a correspondência exacta entre pergunta e imagem do aplicativo original. Identificar a imagem pelo conteúdo/sinal e associá-la à pergunta certa. Se a imagem ainda não existir no ESTRADA, registar a necessidade e indicar a referência de origem; não colocar a imagem noutra pergunta nem substituir por uma imagem apenas parecida.
  - **Qualidade visual:** quando um sinal do APK estiver desfocado, pixelizado ou com baixa resolução, procurar o mesmo sinal no PDF oficial de sinais incluído nos documentos de referência e extrair a imagem dessa fonte, mantendo código, desenho, cores e proporções. Preferir uma extracção nítida em resolução suficiente; não ampliar artificialmente uma imagem fraca, não redesenhar de memória e não usar um sinal apenas semelhante. Registar no mapa a página do PDF e o ficheiro extraído. Para fotografias/cenas, manter a imagem original correcta nesta fase e registar separadamente as que precisem de futura remodelação visual.
- **Explicações:** escrever uma explicação curta e clara para cada resposta, em português de Moçambique, que ajude o candidato a compreender por que razão a resposta está correcta. A explicação pode desenvolver o essencial, mas não deve alterar a regra examinada.
- **Não repetir:** comparar com os exames ESTRADA já concluídos e em curso. Evitar duplicar uma pergunta já usada noutro exame; se o APK repetir uma pergunta, assinalar isso no mapa e propor uma adaptação que preserve o conteúdo sem duplicação.
- **Validação:** garantir 25 perguntas, quatro alternativas, uma resposta correcta e índice correcto; confirmar conteúdo legal e executar `node scripts/validar-exames.js`. Testar que o exame abre, que imagens correspondem às perguntas e que não há erros no navegador.
- **Limite da tarefa:** cada sessão trabalha apenas no exame que reservou. Não alterar tarefas EM CURSO de outra sessão nem ficheiros partilhados sem verificar o protocolo de `INSTRUCOES.md`.

## DADOS-001 — Simulado 2 (grátis)
- Estado: EM CURSO — Claude-1 — 2026-11-09 20:45 UTC — ficheiros: data/exames/exame2.js, index.html, app.js — último sinal: 2026-11-09 20:45 UTC
- Pedido: extrair e analisar as 25 perguntas do Exame 2 do aplicativo original e modelá-las fielmente para o ESTRADA, seguindo a referência comum e o modelo do Exame 1.
- Onde mexer: `data/exames/exame2.js` (novo) e `docs/referencias-exames/exame2-mapeamento.md`. Se for preciso registar o ficheiro, `index.html`/`app.js` (confirmar que nenhuma outra tarefa EM CURSO os usa).
- Pronto quando: as 25 perguntas correspondem às 25 do Exame 2 de origem, com adaptação leve e fiel; imagens correctas; quatro alternativas e resposta validada; explicação por pergunta; abre no ESTRADA, cronómetro de 60 minutos, correcção imediata e resultado; mapa completo; validação automática e teste no navegador sem erros.
- Cuidados: não substituir por perguntas genéricas ou inventadas. Não repetir perguntas dos exames anteriores. Esta tarefa já está reservada: nenhuma outra sessão deve mexer nela sem autorização do dono.

## DADOS-002 — Simulado 3 (grátis)
- Estado: LIVRE
- Pedido: extrair as 25 perguntas do Exame 3 do aplicativo original e modelá-las fielmente para o ESTRADA, seguindo a referência comum e o modelo do Exame 1.
- Onde mexer: `data/exames/exame3.js` (novo) e `docs/referencias-exames/exame3-mapeamento.md`.
- Pronto quando: as 25 perguntas correspondem às 25 do Exame 3 de origem, com adaptação leve e fiel; imagens correctas; quatro alternativas e resposta validada; explicação por pergunta; abre no ESTRADA, cronómetro de 60 minutos, correcção imediata e resultado; mapa completo; validação automática e teste no navegador sem erros.
- Cuidados: não substituir por perguntas genéricas ou inventadas. Não repetir perguntas dos exames 1 e 2. Não alterar ficheiros partilhados que estejam reservados por outra tarefa.

## DADOS-005 — Simulado 4
- Estado: EM CURSO — ChatGPT-DADOS005 — 2026-11-11 14:39 UTC+02 — ficheiros: data/exames/exame4.js, docs/referencias-exames/exame4-mapeamento.md — último sinal: 2026-11-11 14:41 UTC+02
- Pedido: extrair as 25 perguntas do Exame 4 do aplicativo original e modelá-las fielmente para o ESTRADA, seguindo a referência comum e o modelo do Exame 1.
- Onde mexer: `data/exames/exame4.js` (novo) e `docs/referencias-exames/exame4-mapeamento.md`.
- Pronto quando: as 25 perguntas correspondem às 25 do Exame 4 de origem, com adaptação leve e fiel; imagens correctas; quatro alternativas e resposta validada; explicação por pergunta; abre no ESTRADA, cronómetro de 60 minutos, correcção imediata e resultado; mapa completo; validação automática e teste no navegador sem erros.
- Cuidados: não substituir por perguntas genéricas ou inventadas. Não repetir perguntas dos exames 1, 2 e 3. Não alterar ficheiros partilhados que estejam reservados por outra tarefa.
