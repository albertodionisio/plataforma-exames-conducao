# PENDENTE — geral e interface

> **Nota de estado — 27/11/2026:** consultar [docs/ESTADO-ATUAL.md](docs/ESTADO-ATUAL.md) antes de interpretar as descrições antigas abaixo. O proprietário já validou no Preview o login Google, o plano Free (3 exames), a assinatura semanal em Sandbox, a confirmação/activação e o desbloqueio dos exames, além do fluxo funcional do Exame 27. A integração Firebase CI passou no run `45833068199`. O workflow de exames run `45833068139` ainda falha numa asserção desactualizada do caminho da imagem do Exame 27 (`scripts/testar-fluxo.js:220`). Não repetir os testes manuais já confirmados. As tarefas EM CURSO mantêm as reservas existentes: esta nota não as conclui nem autoriza outra sessão a editar os respectivos ficheiros.

## Geral (GER-)


## Interface (FE-)

## FE-014 — Coerência dos cartões e acções de subscrição
- Estado: IMPLEMENTAÇÃO E VALIDAÇÃO VISUAL CONCLUÍDAS pelo proprietário em 2026-11-27; CI automatizado ainda por confirmar.
- Aplicada aos cinco planos existentes (Free, Semanal Básico, Semanal Completo, Mensal Básico e Mensal Completo), sem alterar preços, benefícios ou durações.
- Comportamento confirmado visualmente pelo proprietário: plano pago activo mantém círculo seleccionado, selo «PLANO ACTIVO» e botão «Plano activo»; restantes planos pagos apresentam «Mudar para [plano]»; Free apresenta «Aceder aos exames gratuitos»; estado de carência tem indicação própria.
- Antes de mudar de plano, a aplicação pede confirmação com plano actual, destino, preço, duração e efeito da alteração. A confirmação informa que a mudança só ocorre após pagamento aprovado e que o período restante é preservado e acrescentado à duração contratada, conforme a lógica actual do backend.
- Ficheiros: `public/assinaturas/planos.js`, `scripts/testar-assinaturas.js`.
- Testes automatizados actualizados; aguarda-se confirmação do resultado CI no commit funcional.
- Cuidados respeitados: sem alterações a preços, catálogo, regras de acesso, backend de pagamentos, `main` ou produção.

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


