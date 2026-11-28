# Auditoria de experiência móvel e acessibilidade — FE-001

## Objectivo e âmbito
Garantir que a única versão Web da ESTRADA-JB se adapta automaticamente às dimensões disponíveis e à orientação real do ecrã, sem criar uma aplicação móvel separada. A preferência manual entre Automático, Vertical e Horizontal não faz parte desta tarefa Web; fica reservada para uma futura versão APK.

O trabalho desta tarefa ficou limitado a `styles.css` e a este relatório. Não foram alterados `app.js`, `index.html`, `config.js`, fluxos de autenticação, regras dos exames, textos comerciais, preços ou benefícios dos planos.

## Adaptação responsiva existente e preservada
- Meta viewport `width=device-width, initial-scale=1`.
- Cabeçalho e navegação adaptáveis, incluindo menu móvel.
- Tipografia, espaçamentos, cartões e grelha de exames ajustados a ecrãs estreitos; grelha em coluna única até 360 px.
- Imagens limitadas à largura disponível e com proporção preservada.
- Estado da pergunta com quebra de linha.
- Tabelas limitadas à largura do contentor, com deslocamento horizontal próprio, sem alargar o viewport.
- Cartões de planos em duas colunas em ecrãs largos e uma coluna até 620 px.
- Botões de acção, alternativas, cartões e ligações principais com áreas mínimas de toque de 44 px; botões dos planos com 48 px.
- Foco de teclado visível com `:focus-visible`.
- Controlos de entrar, sair e alternar autenticação com altura mínima de 44 px.
- Barra inferior e leitor PDF preservam áreas de toque e área segura do dispositivo.

## Implementação desta continuação — orientação horizontal
Foi acrescentado um conjunto de regras CSS para dispositivos/ecrãs em orientação horizontal com altura disponível até 520 px:
- Cabeçalho mais compacto e controlos de conta alinhados sem ocupar uma linha inteira.
- Menu móvel aberto pode organizar as ligações horizontalmente e em várias linhas.
- Espaçamento vertical da área principal reduzido para aproveitar a altura disponível.
- Cartões de planos apresentados em duas colunas mesmo quando a largura está dentro do breakpoint móvel, evitando uma coluna excessivamente comprida em telemóveis na horizontal.
- Espaçamento interno, preços, benefícios e botões dos cartões ajustados para a altura reduzida.
- Barra inferior compactada, mantendo alvos de toque adequados e a área segura inferior.
- A mudança entre vertical e horizontal é automática através de media queries CSS; não requer JavaScript, recarregamento ou selector manual.

A versão Web não tenta bloquear nem rodar fisicamente o dispositivo. Responde à orientação comunicada pelo navegador e reorganiza a interface.

### Organização da página de exame em orientação horizontal
Foi implementada exclusivamente por CSS, sem alterar `app.js` ou o HTML gerado:
- Em orientação horizontal com altura até 520 px e largura a partir de 560 px, o contentor do exame com imagem passa a uma grelha de duas colunas.
- A imagem fica na coluna esquerda, com largura flexível, proporção preservada e limite de altura; não é cortada nem distorcida.
- A imagem usa `position: sticky` com deslocamento superior para permanecer visível no mesmo local enquanto a página do exame é deslocada.
- A regra base `.img{position:static}` preserva explicitamente o comportamento normal da imagem fora do breakpoint horizontal.
- O enunciado e as alternativas ficam na coluna direita e continuam a deslocar-se normalmente com a página; a imagem não acompanha esse movimento.
- Em orientação vertical, a imagem mantém `position: static`: acompanha o fluxo normal da página, tal como antes desta alteração, sem ficar fixa.
- Estado do exame, progresso, navegação e acções finais mantêm a largura total abaixo/acima da grelha conforme a sequência do conteúdo.
- O selector CSS só activa quando existe imagem na pergunta; perguntas sem imagem mantêm o fluxo normal.
- Em orientação vertical, estas regras não se aplicam: a organização actual permanece intacta.
- A disposição muda automaticamente ao rodar o dispositivo, sem recarregar e sem alterar respostas ou cronómetro.

## Preferência manual futura — APK
O selector no cabeçalho com as opções Automático, Vertical e Horizontal fica fora do âmbito da FE-001 Web. É uma melhoria futura da versão APK e não foi implementado nesta tarefa.

## Verificações estáticas
- Viewport configurado para a largura real do dispositivo.
- Breakpoints existentes de 600 px e 360 px preservados.
- Regras de orientação horizontal presentes com `(orientation: landscape)` e limite de altura de 520 px.
- Regras de foco visível e áreas mínimas de toque preservadas.
- Tabelas com scroll próprio, sem impor largura mínima ao documento.
- Cartões de planos com duas colunas em orientação horizontal de pouca altura.
- CSS com chavetas equilibradas.
- Regra de imagem fixa em scroll (`position: sticky`) aplicada apenas ao exame horizontal com imagem; comportamento vertical explicitamente reposto para `position: static`.
- Alterações restritas a `styles.css` e a este relatório.

## Validação e limites
Os testes automatizados do repositório e a construção Preview serão usados para detectar regressões gerais. As regras CSS podem ser verificadas estaticamente, mas isso não substitui uma inspecção visual num navegador real em cada largura/orientação. A validação final pelo proprietário deve confirmar 320, 360, 390 e 600 px, vertical e horizontal, incluindo Início, catálogo, pergunta com imagem, alternativas, cabeçalho/menu, conta, planos, PDFs, zoom, foco e ausência de scroll horizontal da página.

A FE-001 só deve ser declarada concluída após o CI passar e a validação visual/interactiva no Preview ser confirmada, incluindo uma pergunta com imagem em orientação horizontal para verificar imagem à esquerda e enunciado/alternativas à direita, e a mesma pergunta em vertical para confirmar que a disposição original permanece intacta.
