# Plataforma de simulados de exame de condução

Nome provisório: **ESTRADA** (muda-se só em `config.js`).

Site de treino para o exame de condução em Moçambique: simulados de 25 perguntas, cronómetro de 60 minutos, explicação a cada resposta e nota de 0,8 valores por resposta certa.

## Estado
Versão de demonstração (só front-end, sem servidor):
- Início, catálogo de 50 simulados (3 grátis, restantes bloqueados), página de planos
- Simulado 1 completo (25 perguntas reescritas) com cronómetro, correção imediata e resultado
- Simulados 2 e 3 (grátis) em preparação

## Fonte principal do projecto
Este repositório GitHub é a referência principal do projecto. As alterações, decisões técnicas e funcionalidades concluídas devem ser registadas aqui para manter o trabalho consistente entre sessões e colaboradores.

## Estrutura
- `index.html`, `styles.css`, `app.js`: interface e lógica
- `config.js`: nome, regras e planos
- `data/exames/exame1.js`: perguntas do exame 1 (um ficheiro por exame)
- `public/sinais/`: sinais redesenhados em SVG
- `manifest.webmanifest`, `icons/`: base para instalar como app (PWA/APK)

## Como ver
Abrir `index.html` no navegador.

## Regras do repositório
Não guardar aqui o APK original, chaves, tokens nem ficheiros `.env`.
