# REGRAS — decisões do dono e regras do repositório

Não reabrir estas decisões sem o dono pedir.

## Produto
- Nome provisório: **ESTRADA**. Muda-se só em `config.js`.
- Simulados de exame de condução em Moçambique: 25 perguntas, cronómetro de 60 minutos, explicação a cada resposta, 0,8 valores por resposta certa, limiar 18.
- Catálogo de 50 simulados; 3 grátis, restantes bloqueados por plano.
- Planos e preços: ficam em `config.js` (Free, Semanal Básico, Semanal Completo, Mensal Básico, Mensal Completo). Alterar preços ou planos só com aprovação do dono.
- As perguntas são reescritas; o site não usa o conteúdo do APK original (esse fica em `original/`, só para consulta).
- **Documento técnico único:** `docs/ESTRADA_Especificacao_Tecnica.md` (especificação técnica com o modelo de assinaturas e monetização dentro). Não existe um segundo documento; qualquer alteração faz-se nele.

## Interface e identidade visual
- **Não utilizar emojis na interface do ESTRADA.** Substituir emojis usados como elementos visuais por ícones próprios e consistentes, adequados à função e ao local onde aparecem (por exemplo: navegação, acções, categorias, estados e funcionalidades).
- Os ícones devem pertencer a um conjunto visual coerente, manter estilo, espessura e proporções consistentes e ser legíveis em ecrãs pequenos. Preferir SVG ou ficheiros de ícones próprios; não usar emojis como substitutos de ícones.
- Não alterar a interface ou ficheiros partilhados reservados por outra tarefa. A remoção/substituição dos emojis deve ser planeada numa tarefa própria, com auditoria dos locais onde aparecem e validação visual em telemóvel.

## Repositório
- **Este repositório é a fonte principal do projecto.** O que for decidido ou concluído regista-se aqui (`PENDENTE.md`, `HISTORICO.md`, `REGRAS.md`).
- **Nunca guardar** aqui: chaves, tokens, passwords nem ficheiros `.env`. O APK original está em `original/` (decisão do dono, 2026-11-09), só como referência de trabalho. Também não escrever segredos em issues, commits ou mensagens de commit.
- Tokens do GitHub: o dono cria um só para este repositório (Contents: Read and write, validade curta). Nenhuma sessão o escreve em ficheiros.
- O banco de perguntas privado só entra quando o repositório for privado (`dados-privados/` está no `.gitignore`).

## Trabalho com várias sessões
- Regras em `INSTRUCOES.md`. Resumo: ler antes, reservar antes de trabalhar, apagar do `PENDENTE.md` e registar no `HISTORICO.md` ao concluir, nunca duplicar.
