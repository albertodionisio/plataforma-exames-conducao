# PENDENTE — geral e interface

> **Estado actualizado em 2026-11-28:** o Vercel é a plataforma de hospedagem e Preview da ESTRADA-JB. O Netlify foi abandonado e não constitui uma tarefa pendente. A FE-014 está concluída e registada em `HISTORICO.md`. A FE-001 está em validação final: adaptação Web por dimensões e orientação automática implementada em CSS; falta confirmar CI e validação visual/interactiva no Preview. Não alterar ficheiros reservados por outras tarefas.

## Geral (GER-)

Sem tarefas gerais activas registadas neste ficheiro.

## Interface (FE-)

### FE-001 — Auditoria de experiência móvel e acessibilidade
- Estado: EM CURSO — ChatGPT-7 — continuação autorizada em 2026-11-28.
- Objectivo: garantir uma única versão Web responsiva, que se adapte automaticamente à largura, altura e orientação real do ecrã.
- Implementado: foco visível; alvos de toque adequados; adaptações para ecrãs estreitos; imagens flexíveis; tabelas com scroll interno; cartões de planos responsivos; controlos de conta com 44 px; reorganização compacta para orientação horizontal de pouca altura; na realização de exames com imagem em horizontal, imagem à esquerda e enunciado/alternativas à direita, mantendo a organização vertical actual.
- Ficheiros autorizados: `styles.css` e `docs/auditorias/interface-movel.md`.
- Critérios de conclusão: CI aprovado; Preview Vercel READY; verificação visual/interactiva de 320, 360, 390 e 600 px, vertical e horizontal, incluindo cabeçalho/menu, catálogo, pergunta/imagem, alternativas, conta, planos, PDFs, zoom, foco e ausência de scroll horizontal da página. Confirmar no exame horizontal imagem à esquerda e pergunta/alternativas à direita; confirmar que a organização vertical não mudou.
- Restrições: não alterar `app.js`, `index.html` ou `config.js`; não mudar identidade visual, textos comerciais, preços, planos, autenticação ou regras dos exames. Não implementar selector manual de orientação na Web.
- Melhoria futura APK: selector manual no cabeçalho com Automático, Vertical e Horizontal; fica fora desta tarefa e não bloqueia a conclusão da versão Web.

## Melhorias futuras — fora das tarefas activas

- **APK — selector de orientação:** disponibilizar no cabeçalho as opções Automático, Vertical e Horizontal, guardando a preferência do utilizador. Não implementar na versão Web nesta fase.
