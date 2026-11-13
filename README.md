# Plataforma de exames de exame de condução

Nome provisório: **ESTRADA** (muda-se só em `config.js`).

Site de treino para o exame de condução em Moçambique: exames de 25 perguntas, cronómetro de 60 minutos, explicação a cada resposta e nota de 0,8 valores por resposta certa.

## Estado
Versão de demonstração (só front-end, sem servidor):
- Início, catálogo de 50 exames (3 grátis, restantes bloqueados), página de planos
- Exame 1 completo (25 perguntas reescritas) com cronómetro, correção imediata e resultado
- Exames 2 e 3 (grátis) em preparação

## Fonte principal do projecto
Este repositório GitHub é a referência principal do projecto. As alterações, decisões técnicas e funcionalidades concluídas devem ser registadas aqui para manter o trabalho consistente entre sessões e colaboradores.

## Trabalho com várias sessões
Leia `INSTRUCOES.md` primeiro. Tarefas em `PENDENTE.md` e `data/exames/PENDENTE.md`; o que já foi feito em `HISTORICO.md`; decisões do dono em `REGRAS.md`.

## Estrutura
- `index.html`, `styles.css`, `app.js`: interface e lógica
- `config.js`: nome, regras e planos
- `data/exames/exame1.js`: perguntas do exame 1 (um ficheiro por exame)
- `public/sinais/`: sinais (A17 redesenhado em SVG; os outros recortados do PDF de sinais)
- `manifest.webmanifest`, `icons/`: base para instalar como app (PWA/APK)

## Como ver
Abrir `index.html` no navegador.

## Regras do repositório
Não guardar aqui chaves, tokens nem ficheiros `.env`. O APK original está em `original/`, só como referência de trabalho.
