# PENDENTE — geral e interface

> **Nota de estado — 27/11/2026:** consultar [docs/ESTADO-ATUAL.md](docs/ESTADO-ATUAL.md) antes de interpretar as descrições antigas abaixo. O proprietário já validou no Preview o login Google, o plano Free (3 exames), a assinatura semanal em Sandbox, a confirmação/activação e o desbloqueio dos exames, além do fluxo funcional do Exame 27. A integração Firebase CI passou no run `45833068199`. O workflow de exames run `45833068139` ainda falha numa asserção desactualizada do caminho da imagem do Exame 27 (`scripts/testar-fluxo.js:220`). Não repetir os testes manuais já confirmados. As tarefas EM CURSO mantêm as reservas existentes: esta nota não as conclui nem autoriza outra sessão a editar os respectivos ficheiros.

## Geral (GER-)


## Interface (FE-)


## FE-010 — Ecrã de abertura (splash) estilo WhatsApp com assinatura "From BORJA"
- Estado: LIVRE
- Pedido: ao abrir a plataforma, mostrar um ecrã de abertura de 1,5–2 s: fundo liso, logótipo ESTRADA centrado e, no rodapé do ecrã, a assinatura pequena e discreta, como o "from Meta" do WhatsApp (referência: o ecrã de abertura do WhatsApp com "from Meta" no rodapé; a imagem foi removida do repositório a pedido do dono). Assinatura: linha pequena "from", abaixo "B O R J A" (com espaçamento entre letras), "Technology & Innovation" e, por último, "Todos Direitos Reservados" em letra ainda menor. Estilo escuro e tipografia simples, como descrito abaixo.
- Estilo visual (seguir as imagens): ecrã inteiro, conteúdo repartido em duas zonas — logótipo no centro (um pouco acima do meio, ~45% da altura) e assinatura colada ao fundo, centrada, a ~24–32 px da borda inferior. Assinatura em duas linhas de hierarquia: "from" pequeno e leve em cinzento (como no WhatsApp); "B O R J A" em letra grossa (bold/extrabold), maiúsculas, com `letter-spacing` largo, cor cinzenta sobre fundo escuro `#1a1a1a` (ou verde da marca sobre fundo claro, como o "Meta" do WhatsApp); "Technology & Innovation" bem menor, bold, cinzento; "Todos Direitos Reservados" o mais pequeno de todos (≈10–11 px), mesmo cinzento. Fonte sem serifa, geométrica e simples (Poppins/Montserrat ou a fonte do sistema se não houver ficheiro local). Nada de caixas, linhas ou sombras.
- Onde mexer: `index.html` (bloco do splash), `styles.css` (posição fixa no fundo com `bottom` + `env(safe-area-inset-bottom)`, tamanhos pequenos com `clamp()`), `app.js` (esconder com transição suave após carregar; mostrar só na 1.ª abertura da sessão).
- Pronto quando: logótipo ao centro, assinatura colada ao fundo e legível em ecrãs de 360 px a desktop; não bloqueia a app nem os testes (`scripts/testar-fluxo.js`); respeita `prefers-reduced-motion`; sem imagens externas.
- Cuidados: usar apenas o logótipo já existente em `icons/`; não alterar perguntas, pontuação, planos ou preços.


## FE-001 — Auditoria de experiência móvel e acessibilidade
- Estado: EM CURSO — ChatGPT-7 — 2026-11-27 11:03 UTC+02 — ficheiros: styles.css, docs/auditorias/interface-movel.md — último sinal: 2026-11-27 11:05 UTC+02 — reserva assumida com autorização expressa do dono; verificações estáticas concluídas, falta validação visual no navegador.
- Pedido: melhorar a utilização da versão actual em telemóveis, sem alterar as regras de negócio nem o funcionamento dos exames.
- Onde mexer: `styles.css`; criar um relatório curto de verificação em `docs/auditorias/interface-movel.md`, se forem encontrados pontos relevantes.
- Pronto quando: interface verificada em larguras móveis comuns; navegação, botões, alternativas, imagens, tabela de planos e cabeçalho não provocam cortes ou deslocamento horizontal; foco de teclado é visível e os controlos têm áreas de toque adequadas; alterações testadas no navegador.
- Cuidados: não alterar `app.js`, `index.html` ou `config.js`; não mudar identidade visual, textos comerciais, preços ou planos. Se a correcção exigir ficheiros partilhados, parar e pedir ao dono para criar/autorizar tarefa separada.
- Parcial actualizado (2026-11-27): preservadas as melhorias móveis e de foco já publicadas; acrescentados alvos mínimos de 44 px para os controlos de entrar, sair e alternar entre entrar/criar conta. Relatório actualizado com a auditoria estática do viewport, menu, grelha de exames, cartões de planos, alternativas, leitor PDF e barra inferior. Commits: `87b3fce` (CSS) e `cc8a72e` (relatório). Falta validação visual/interactiva num navegador real às larguras 320, 360, 390 e 600 px, incluindo zoom/orientação, foco e ausência de scroll horizontal.



## FE-005 — Publicação web no Netlify dos Exames 31–51
- Estado: LIVRE — reserva antiga de ChatGPT-6 libertada em 2026-11-27; a tarefa continua por concluir. O primeiro deploy público no Netlify, a confirmação do URL e a validação pelo proprietário ainda não estão comprovados.
- Pedido: disponibilizar a versão web da aplicação no Netlify, com os Exames 31–51 acessíveis durante a fase de testes, para o dono validar através do endereço gratuito do site.
- Pronto quando: build estático gera `dist/` com a aplicação e os 21 exames; APK original e documentação interna ficam fora do site; CI valida o build; Netlify publica a partir da branch principal; URL pública abre correctamente e o dono consegue iniciar os Exames 31–51.
- Cuidados: não declarar o site publicado sem confirmar um deploy bem-sucedido e abrir o URL real. Pagamentos, contas e assinaturas continuam inactivos e não devem ser apresentados como funcionais. O acesso 31–51 é temporário para testes e deve ser revisto antes da abertura comercial.
- Parcial: `netlify.toml` e `scripts/build-netlify.js` criados; configuração de testes temporários alargada de 31–40 para 31–51; teste de fluxo verifica que todos os 21 exames abrem; build de publicação exclui o APK original e documentação interna. CI aprovado no run 43494538991 (validação estrutural, fluxo dos Exames 31–51 e build Netlify). Falta apenas concluir o primeiro deploy no painel Netlify, confirmar o URL público e fazer a validação visual pelo dono.


