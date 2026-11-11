# PENDENTE — geral e interface

Leia `INSTRUCOES.md` antes de reservar uma tarefa. Formato e protocolo estão lá.

## Geral (GER-)

## GER-010 — Perguntas frequentes baseadas no APK original
- Estado: EM CURSO — Claude-GER010 — 2026-11-11 15:13 UTC+02 — ficheiros: docs/conteudos/perguntas-frequentes.md — último sinal: 2026-11-11 15:13 UTC+02
- Pedido: analisar o APK original para identificar dúvidas recorrentes e conteúdos que justifiquem uma secção de Perguntas Frequentes no ESTRADA. A secção deve responder a dúvidas reais sobre exames, regras de utilização, avaliação e preparação, sem inventar funcionalidades ainda não disponíveis.
- Onde mexer: consultar `original/Codigo_e_Sinais_de_Transito_1_1.apk`, `original/LEIAME.md`, documentos de referência e regras já registadas; criar apenas `docs/conteudos/perguntas-frequentes.md`.
- Pronto quando: documento apresenta perguntas e respostas curtas, claras e úteis, indica a origem/justificação de cada tema e separa dúvidas confirmadas no APK das recomendações editoriais para o ESTRADA.
- Cuidados: não copiar texto integral do APK; não afirmar que pagamentos, contas, notificações ou funcionalidades futuras já estão activas; não alterar interface nem código.



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

## GER-008 — Decisão técnica do backend na OCI
- Estado: LIVRE
- Pedido: preparar uma proposta técnica concreta para a primeira versão do backend e da base de dados, considerando a preferência do dono por Oracle Cloud Infrastructure e recursos gratuitos.
- Onde mexer: consultar `docs/ESTRADA_Especificacao_Tecnica.md` e documentação oficial actual da Oracle; criar `docs/architecture/DECISAO_BACKEND_OCI.md`.
- Pronto quando: documento compara opções viáveis para API, base de dados, alojamento, autenticação, backups e implantação; apresenta custos/limites conhecidos, riscos, arquitectura recomendada e etapas de implementação; distingue claramente recursos gratuitos, limites e serviços que podem gerar custos.
- Cuidados: não criar contas, não configurar serviços, não publicar credenciais, não alterar preços/planos e não implementar código backend nesta tarefa. A escolha final da stack continua dependente da aprovação do dono.

## Interface (FE-)

## FE-002 — Resultado final com semáforo e revisão pedagógica
- Estado: LIVRE
- Pedido: alterar o fluxo do exame para não revelar acertos, erros ou explicações durante a realização. Depois de responder às 25 perguntas ou terminar o tempo, submeter automaticamente e apresentar nota, certas, erradas, em branco e estado final. Usar um semáforo gráfico real: luz verde acesa para APROVADO (nota >= 18/20) e luz vermelha acesa para REPROVADO (nota < 18/20). Disponibilizar «Rever exame» com pergunta, imagem, resposta seleccionada, resposta correcta e explicação pedagógica; incluir também perguntas certas e assinalar as não respondidas.
- Onde mexer: `app.js` e, se necessário, `styles.css`; criar/actualizar testes de fluxo.
- Pronto quando: durante o exame não existe feedback de correcção; submissão manual e por fim do cronómetro funcionam; cálculo respeita 0,8 valores por resposta certa e limiar 18; a revisão preserva a ordem e as respostas seleccionadas no exame; semáforo e nota são apresentados correctamente em aprovação e reprovação; testes e validação visual concluídos.
- Cuidados: verificar primeiro se `app.js` e `styles.css` estão livres; não alterar dados de perguntas nem regras de pontuação; não mostrar um estado de aprovação sem nota.

## FE-003 — Auditoria e substituição de emojis por ícones adequados
- Estado: LIVRE
- Pedido: identificar todos os emojis usados como elementos visuais e substituí-los por ícones básicos, reconhecíveis e adequados à função e ao local. Os ícones devem ter tamanho equilibrado e pertencer a um conjunto coerente, sem poluição visual.
- Onde mexer: auditar `index.html`, `app.js`, `styles.css` e `icons/`; documentar a auditoria em `docs/auditorias/icone-interface.md`.
- Pronto quando: todos os locais com emojis forem identificados; cada substituição tiver ícone semanticamente adequado; estilo, espessura, proporções e tamanho forem consistentes; interface verificada em telemóvel e sem ícones quebrados.
- Cuidados: antes de reservar, confirmar que os ficheiros partilhados não estão reservados por FE-001, DADOS-001 ou outra tarefa. Não editar ficheiros partilhados enquanto houver conflito; se necessário, fazer primeiro apenas o relatório e aguardar autorização para a implementação.



## FE-001 — Auditoria de experiência móvel e acessibilidade
- Estado: EM CURSO — ChatGPT-FE001 — 2026-11-10 09:55 UTC+02 — ficheiros: styles.css, docs/auditorias/interface-movel.md — último sinal: 2026-11-10 10:05 UTC+02
- Pedido: melhorar a utilização da versão actual em telemóveis, sem alterar as regras de negócio nem o funcionamento dos simulados.
- Onde mexer: `styles.css`; criar um relatório curto de verificação em `docs/auditorias/interface-movel.md`, se forem encontrados pontos relevantes.
- Pronto quando: interface verificada em larguras móveis comuns; navegação, botões, alternativas, imagens, tabela de planos e cabeçalho não provocam cortes ou deslocamento horizontal; foco de teclado é visível e os controlos têm áreas de toque adequadas; alterações testadas no navegador.
- Cuidados: não alterar `app.js`, `index.html` ou `config.js`; não mudar identidade visual, textos comerciais, preços ou planos. Se a correcção exigir ficheiros partilhados, parar e pedir ao dono para criar/autorizar tarefa separada.
- Parcial: ajustes responsivos e de foco publicados em `styles.css`; relatório parcial em `docs/auditorias/interface-movel.md`. Falta validar visualmente no navegador nas larguras indicadas no relatório.

