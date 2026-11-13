# PENDENTE — geral e interface

Leia `INSTRUCOES.md` antes de reservar uma tarefa. Formato e protocolo estão lá.

## Geral (GER-)

## Interface (FE-)

## GER-012 — Uniformizar a nomenclatura oficial da plataforma
- Estado: EM CURSO — ChatGPT-3 — 2026-11-13 — ficheiros: index.html, app.js, config.js, docs/, README.md, REGRAS.md, INSTRUCOES.md, PENDENTE.md, HISTORICO.md, data/exames/PENDENTE.md e restantes textos de interface — último sinal: 2026-11-13 14:09 UTC
- Pedido: por decisão expressa do dono, a plataforma deve usar «exame» como designação oficial em todos os pontos apresentados ao utilizador e na documentação do produto. Usar exclusivamente «exame/exames» como designação do produto, catálogo, navegação, planos, instruções, resultados, perguntas frequentes e textos de apoio.
- Onde mexer: todos os ficheiros textuais do repositório em que a palavra seja usada como designação do produto; verificar especialmente interface, configuração, documentação, instruções, histórico e listas de tarefas.
- Pronto quando: pesquisa global documentada; textos de interface e documentação actualizados para «exame/exames»; nomes técnicos, identificadores, caminhos e referências históricas só são alterados quando seguro e sem quebrar compatibilidade; testes de sintaxe/validação passam; revisão final confirma a uniformidade da nomenclatura em todos os pontos visíveis.
- Cuidados: não alterar perguntas, respostas, pontuação, preços, planos ou regras funcionais. O dono autorizou expressamente esta alteração global, incluindo os ficheiros partilhados, sem alterar a lógica das tarefas concorrentes. Não renomear identificadores/caminhos técnicos se isso puder quebrar compatibilidade; registar excepções técnicas inevitáveis.
- Parcial: textos, rotas, propriedades de configuração, planos, manifesto PWA, documentação e nomes de ficheiros editoriais actualizados. CI aprovado no run 43439833819 (sintaxe JavaScript, teste de assinaturas e validador de exames). Falta validação visual no navegador pelo dono.

## FE-002 — Resultado final com semáforo e revisão pedagógica
- Estado: EM CURSO — ChatGPT-ESTRADA-6 — 2026-11-13 20:45 UTC+02 — ficheiros: app.js, config.js, scripts/testar-fluxo.js, styles-resultados.css, index.html — último sinal: 2026-11-13 20:55 UTC+02
- Nota: o dono autorizou em 2026-11-13 a transferência desta tarefa para ChatGPT-ESTRADA-6 e a utilização temporária dos Exames 31–40 sem bloqueio de assinatura, exclusivamente durante a fase de testes. O modo de teste deverá ficar desligável por configuração antes da validação final. O dono autorizou em 2026-11-12 o uso de `app.js`, `styles.css` e `index.html` apesar das reservas paradas de DADOS-001 (Claude-1, desde 2026-11-09) e FE-001 (ChatGPT-FE001, desde 2026-11-10). Essas tarefas continuam com o seu estado; esta só usa os ficheiros partilhados.
- Pedido: alterar o fluxo do exame para não revelar acertos, erros ou explicações durante a realização. Depois de responder às 25 perguntas ou terminar o tempo, submeter automaticamente e apresentar nota, certas, erradas, em branco e estado final. Usar um semáforo gráfico real: luz verde acesa para APROVADO (nota >= 18/20) e luz vermelha acesa para REPROVADO (nota < 18/20). Disponibilizar «Rever exame» com pergunta, imagem, resposta seleccionada, resposta correcta e explicação pedagógica; incluir também perguntas certas e assinalar as não respondidas.
- Onde mexer: `app.js` e, se necessário, `styles.css`; criar/actualizar testes de fluxo.
- Pronto quando: durante o exame não existe feedback de correcção; submissão manual e por fim do cronómetro funcionam; cálculo respeita 0,8 valores por resposta certa e limiar 18; a revisão preserva a ordem e as respostas seleccionadas no exame; semáforo e nota são apresentados correctamente em aprovação e reprovação; testes e validação visual concluídos.
- Cuidados: verificar primeiro se `app.js` e `styles.css` estão livres; não alterar dados de perguntas nem regras de pontuação; não mostrar um estado de aprovação sem nota.

- Parcial: fluxo actualizado e publicado; inclui navegação entre perguntas, selecção sem feedback, submissão manual/automática, nota, semáforo e revisão de todas as respostas. Por pedido expresso do dono em 2026-11-13, o acesso temporário de teste foi alargado aos Exames 31–51. Teste automatizado actualizado para abrir todos os 21 exames. A publicação Netlify está a ser preparada na tarefa FE-005. Ainda falta validação visual no navegador pelo dono.
## FE-001 — Auditoria de experiência móvel e acessibilidade
- Estado: EM CURSO — ChatGPT-FE001 — 2026-11-10 09:55 UTC+02 — ficheiros: styles.css, docs/auditorias/interface-movel.md — último sinal: 2026-11-10 10:05 UTC+02
- Pedido: melhorar a utilização da versão actual em telemóveis, sem alterar as regras de negócio nem o funcionamento dos exames.
- Onde mexer: `styles.css`; criar um relatório curto de verificação em `docs/auditorias/interface-movel.md`, se forem encontrados pontos relevantes.
- Pronto quando: interface verificada em larguras móveis comuns; navegação, botões, alternativas, imagens, tabela de planos e cabeçalho não provocam cortes ou deslocamento horizontal; foco de teclado é visível e os controlos têm áreas de toque adequadas; alterações testadas no navegador.
- Cuidados: não alterar `app.js`, `index.html` ou `config.js`; não mudar identidade visual, textos comerciais, preços ou planos. Se a correcção exigir ficheiros partilhados, parar e pedir ao dono para criar/autorizar tarefa separada.
- Parcial: ajustes responsivos e de foco publicados em `styles.css`; relatório parcial em `docs/auditorias/interface-movel.md`. Falta validar visualmente no navegador nas larguras indicadas no relatório.


## FE-005 — Publicação web no Netlify dos Exames 31–51
- Estado: EM CURSO — ChatGPT-6 — 2026-11-13 — ficheiros: netlify.toml, scripts/build-netlify.js, .github/workflows/validar-exames.yml, README.md — último sinal: preparação do build de publicação
- Pedido: disponibilizar a versão web da aplicação no Netlify, com os Exames 31–51 acessíveis durante a fase de testes, para o dono validar através do endereço gratuito do site.
- Pronto quando: build estático gera `dist/` com a aplicação e os 21 exames; APK original e documentação interna ficam fora do site; CI valida o build; Netlify publica a partir da branch principal; URL pública abre correctamente e o dono consegue iniciar os Exames 31–51.
- Cuidados: não declarar o site publicado sem confirmar um deploy bem-sucedido e abrir o URL real. Pagamentos, contas e assinaturas continuam inactivos e não devem ser apresentados como funcionais. O acesso 31–51 é temporário para testes e deve ser revisto antes da abertura comercial.
- Parcial: `netlify.toml` e `scripts/build-netlify.js` criados; configuração de testes temporários alargada de 31–40 para 31–51; teste de fluxo verifica que todos os 21 exames abrem; build de publicação exclui o APK original e documentação interna. CI aprovado no run 43494538991 (validação estrutural, fluxo dos Exames 31–51 e build Netlify). Falta apenas concluir o primeiro deploy no painel Netlify, confirmar o URL público e fazer a validação visual pelo dono.
