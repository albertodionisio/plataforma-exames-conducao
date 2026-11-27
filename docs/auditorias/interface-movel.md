# Auditoria de experiência móvel e acessibilidade — FE-001

## Âmbito
Revisão da interface existente com base em `index.html`, `styles.css` e nos elementos gerados por `app.js`. O trabalho desta continuação ficou limitado a `styles.css` e a este relatório. Não foram alterados ficheiros de lógica, HTML, configuração, textos comerciais, preços ou planos.

## Trabalho já publicado e preservado
- Foco de teclado visível com `:focus-visible`.
- Altura mínima de 44 px nos botões de acção, alternativas, cartões de exame e ligações principais de navegação.
- Cabeçalho e navegação adaptáveis até 600 px, com menu móvel fornecido pela FE-008.
- Ajustes de tipografia, espaçamento, cartões e grelha de exames; a grelha passa a uma coluna até 360 px.
- Imagens limitadas à largura disponível e com proporção preservada.
- Estado da pergunta com quebra de linha; tabela genérica com largura mínima para não comprimir as colunas.
- Os cartões de planos são apresentados numa grelha de duas colunas em ecrãs largos e uma coluna até 620 px; os botões de adesão têm altura mínima de 48 px e os controlos de selecção mantêm foco visível.

## Correcção adicional desta continuação
A revisão dos estilos e do HTML identificou que os controlos de sessão da conta tinham apenas 36 px de altura mínima e que o botão textual para alternar entre entrar/criar conta não tinha área de toque mínima explícita. Em `styles.css`, os controlos `.conta-entrar`, `.conta-sair` e `.link-button` passaram a ter pelo menos 44 px de altura, alinhamento central e espaçamento interno. Não foram alterados os fluxos de autenticação.

## Verificações estáticas
- Confirmado o meta viewport `width=device-width, initial-scale=1`.
- Confirmada a existência de regras de foco visível e de áreas mínimas de toque para os controlos principais.
- Confirmado que os cartões de planos são responsivos no ficheiro próprio `public/assinaturas/planos.css`; não existe uma tabela de planos no HTML actual.
- Confirmado que a barra inferior e os controlos do leitor de PDF têm áreas de toque próprias; o layout do leitor usa altura dinâmica e respeita a área segura inferior.
- Confirmado que a FE-001 não alterou `app.js`, `index.html`, `config.js`, preços, planos ou regras dos exames.

## Correcção adicional — tabelas em ecrãs estreitos
- A tabela genérica tinha `min-width:560px` sem um contentor de deslocamento próprio, o que podia alargar o documento e provocar scroll horizontal da página em telemóveis.
- Em `styles.css`, a tabela passou a limitar-se à largura disponível e a gerir o seu próprio deslocamento horizontal (`overflow-x:auto`), preservando a largura mínima do conteúdo sem empurrar o viewport.
- A alteração ficou limitada a `styles.css`; não foram alterados HTML, JavaScript, autenticação, exames, planos ou preços.

## Validação ainda necessária
A validação visual e interactiva num navegador real continua pendente. Verificar as larguras de 320, 360, 390 e 600 px, incluindo Início, catálogo, pergunta com imagem, alternativas, cabeçalho/menu, conta e cartões de Planos. Confirmar ausência de deslocamento horizontal da página, legibilidade, áreas de toque e foco por teclado. Testar também orientação horizontal e zoom do navegador. Não declarar FE-001 concluída antes dessa confirmação.

## Verificações estáticas após a correcção
- CSS com 145 chavetas de abertura e 145 de fecho.
- Regras de adaptação presentes para 600 px e 360 px.
- Foco de teclado visível e áreas mínimas de 44 px nos controlos principais, incluindo entrar/sair e alternância de autenticação.
- Botões dos planos mantêm altura mínima de 48 px em `public/assinaturas/planos.css`.
- Tabelas limitadas à largura do contentor, com deslocamento horizontal próprio; a página deixa de herdar a largura mínima de 560 px da tabela.
- Estas verificações são estáticas; não substituem a validação visual e interactiva em navegador real.
