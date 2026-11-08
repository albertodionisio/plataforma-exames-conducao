# Plataforma de simulados de exame de condução

Nome provisório: **ESTRADA** (muda-se só em `config.js`).

Site de treino para o exame de condução em Moçambique: simulados de 25 perguntas, cronómetro de 60 minutos, explicação a cada resposta e nota de 0,8 valores por resposta certa.

## Estado
Versão de demonstração (só front-end, sem servidor):
- Início, catálogo de 50 simulados (3 grátis, restantes bloqueados), página de planos
- Um simulado funcional com cronómetro, correção imediata e resultado
- Perguntas de **demonstração**, ainda por validar

## Estrutura
- `index.html`, `styles.css`, `app.js`: interface e lógica
- `config.js`: nome, regras e planos
- `data/perguntas-demo.js`: perguntas de exemplo
- `public/sinais/`: sinais redesenhados em SVG
- `manifest.webmanifest`, `icons/`: base para instalar como app (PWA/APK)

## Como ver
Abrir `index.html` no navegador.

## Regras do repositório (enquanto for público)
Não guardar aqui o banco de perguntas, o APK original, chaves, tokens nem ficheiros `.env`.
