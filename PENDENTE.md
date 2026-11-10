# PENDENTE — geral e interface

Leia `INSTRUCOES.md` antes de reservar uma tarefa. Formato e protocolo estão lá.

## Geral (GER-)

## GER-005 — Auditoria comparativa do Simulado 1
- Estado: LIVRE
- Pedido: comparar as 25 perguntas do Simulado 1 do ESTRADA com o modelo de perguntas do aplicativo original guardado em `original/Codigo_e_Sinais_de_Transito_1_1.apk`. Identificar o objectivo de cada pergunta (identificação, interpretação, regra ou situação prática), verificar se o ESTRADA preserva esse objectivo e apontar melhorias necessárias.
- Onde mexer: leitura de `original/Codigo_e_Sinais_de_Transito_1_1.apk` e `data/exames/exame1.js`; criar apenas o relatório `docs/auditorias/simulado-1.md`.
- Pronto quando: relatório cobre as 25 perguntas, compara os tipos de pergunta com o aplicativo original, classifica cada uma como manter/melhorar/corrigir/substituir e justifica cada observação com evidência.
- Cuidados: não copiar perguntas literalmente do APK; não alterar `exame1.js`; não inventar conteúdo que não tenha sido encontrado no aplicativo. Alterações às perguntas só depois da aprovação do dono.

## GER-006 — Catálogo de sinais com nomenclatura oficial
- Estado: LIVRE
- Pedido: criar um catálogo de referência dos sinais utilizados no ESTRADA, conferindo cada código, imagem e designação com o PDF de sinais incluído nos documentos de referência do APK original.
- Onde mexer: consultar `original/Codigo_e_Sinais_de_Transito_1_1.apk` e os ficheiros em `public/sinais/`; criar `docs/referencia-sinais.md`.
- Pronto quando: cada sinal já utilizado nas perguntas tem código, designação exactamente como consta no PDF, página de referência e caminho da imagem correspondente; divergências ou imagens em falta ficam claramente assinaladas.
- Cuidados: não inventar nomes nem substituir designações por sinónimos; não redesenhar ou trocar imagens nesta tarefa; não alterar perguntas. Se o PDF e o aplicativo divergirem, registar a divergência sem escolher silenciosamente uma versão.

## GER-007 — Validador automático dos ficheiros de simulados
- Estado: EM CURSO — Claude-GER007 — 2026-11-10 07:55 UTC — ficheiros: scripts/validar-exames.js — último sinal: 2026-11-10 07:55 UTC
- Pedido: criar uma ferramenta simples, sem dependências externas, para detectar erros estruturais nos ficheiros de perguntas antes de serem publicados.
- Onde mexer: criar `scripts/validar-exames.js`; ler os ficheiros existentes em `data/exames/`.
- Pronto quando: o comando `node scripts/validar-exames.js` verifica todos os ficheiros de exame encontrados e reporta, por ficheiro e pergunta, problemas como número diferente de 25 perguntas, alternativas diferentes de quatro, índice de resposta correcta inválido, explicação em falta, números de pergunta repetidos e imagens referenciadas que não existem; termina com código de erro quando encontra falhas.
- Cuidados: não alterar os ficheiros dos exames; não exigir que os 50 exames já existam; não introduzir dependências nem alterar `package.json` (actualmente inexistente).

## GER-008 — Decisão técnica do backend na OCI
- Estado: LIVRE
- Pedido: preparar uma proposta técnica concreta para a primeira versão do backend e da base de dados, considerando a preferência do dono por Oracle Cloud Infrastructure e recursos gratuitos.
- Onde mexer: consultar `docs/ESTRADA_Especificacao_Tecnica.md` e documentação oficial actual da Oracle; criar `docs/architecture/DECISAO_BACKEND_OCI.md`.
- Pronto quando: documento compara opções viáveis para API, base de dados, alojamento, autenticação, backups e implantação; apresenta custos/limites conhecidos, riscos, arquitectura recomendada e etapas de implementação; distingue claramente recursos gratuitos, limites e serviços que podem gerar custos.
- Cuidados: não criar contas, não configurar serviços, não publicar credenciais, não alterar preços/planos e não implementar código backend nesta tarefa. A escolha final da stack continua dependente da aprovação do dono.

## Interface (FE-)

## FE-001 — Auditoria de experiência móvel e acessibilidade
- Estado: EM CURSO — ChatGPT-FE001 — 2026-11-10 09:55 UTC+02 — ficheiros: styles.css, docs/auditorias/interface-movel.md — último sinal: 2026-11-10 10:00 UTC+02
- Pedido: melhorar a utilização da versão actual em telemóveis, sem alterar as regras de negócio nem o funcionamento dos simulados.
- Onde mexer: `styles.css`; criar um relatório curto de verificação em `docs/auditorias/interface-movel.md`, se forem encontrados pontos relevantes.
- Pronto quando: interface verificada em larguras móveis comuns; navegação, botões, alternativas, imagens, tabela de planos e cabeçalho não provocam cortes ou deslocamento horizontal; foco de teclado é visível e os controlos têm áreas de toque adequadas; alterações testadas no navegador.
- Cuidados: não alterar `app.js`, `index.html` ou `config.js`; não mudar identidade visual, textos comerciais, preços ou planos. Se a correcção exigir ficheiros partilhados, parar e pedir ao dono para criar/autorizar tarefa separada.

