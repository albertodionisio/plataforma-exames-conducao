# Auditoria de experiência móvel e acessibilidade — FE-001

## Âmbito
Revisão da interface existente com base em `index.html`, `styles.css` e nos elementos gerados por `app.js`. Não foram alterados ficheiros de lógica, HTML, configuração, textos comerciais, preços ou planos.

## Pontos identificados
- O cabeçalho usava uma única linha flexível; em larguras estreitas, a marca e a navegação podiam competir pelo espaço.
- Os links e botões não tinham uma altura mínima comum para toque.
- Não existia uma regra explícita de foco visível para navegação por teclado.
- O estado da pergunta usa duas informações lado a lado e podia ficar apertado em ecrãs pequenos.
- A tabela de planos já está dentro de um contentor com deslocamento horizontal; foi definida uma largura mínima para preservar a leitura das colunas sem alargar a página inteira.
- A grelha de simulados precisava de uma coluna de segurança para larguras muito estreitas.

## Alterações publicadas em `styles.css`
- Foco de teclado visível com `:focus-visible`.
- Altura mínima de 44 px nos controlos interactivos principais.
- Cabeçalho e navegação com quebra de linha em ecrãs até 600 px.
- Ajustes de espaçamento, tipografia e cartões em telemóveis.
- Grelha adaptável, com uma coluna até 360 px.
- Imagens limitadas à largura disponível e com proporção preservada.
- Estado da pergunta com quebra de linha e espaçamento próprio.
- Tabela com largura mínima para manter as colunas legíveis dentro do contentor rolável.

## Verificações efectuadas
- Inspecção estática dos seletores e da estrutura realmente usada pela página.
- Confirmado que as regras novas estão publicadas no GitHub.
- Confirmado que as alterações ficaram limitadas a `styles.css`, sem tocar em `app.js`, `index.html` ou `config.js`.

## Verificações ainda pendentes
A validação visual em navegador ainda não foi executada nesta sessão. É necessário abrir a página e verificar, pelo menos, as larguras de 320, 360, 390 e 600 px, incluindo início, catálogo, pergunta com imagem, alternativas e tabela de planos. Confirmar ausência de deslocamento horizontal da página, leitura e foco por teclado. Por isso, esta auditoria é parcial e FE-001 permanece EM CURSO até à verificação visual.
