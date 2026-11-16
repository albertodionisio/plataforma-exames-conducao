# PENDENTE — geral e interface

Leia `INSTRUCOES.md` antes de reservar uma tarefa. Formato e protocolo estão lá.

## Geral (GER-)

## Backend e Firebase (BE-)

## BE-001 — Preparar fundação Firebase/Firestore sem activar migração da aplicação
- Estado: EM CURSO — ChatGPT-ESTRADA-FB1 — 2026-11-16 — ficheiros: firebase.json, firestore.rules, firestore.indexes.json, .firebaserc.example, docs/firebase/README.md, PENDENTE.md — último sinal: 2026-11-16
- Pedido: preparar no repositório os ficheiros versionados e documentação para o projecto Firebase já criado pelo dono, com Firestore Standard na região africa-south1 (Johannesburg), autenticação Google e email/password activada no Console. Definir uma estrutura inicial mínima e segura para users, subscriptions, exam_attempts e payment_transactions, sem armazenar perguntas/imagens estáticas no Firestore.
- Âmbito desta tarefa: apenas ficheiros novos de configuração, regras, índices e documentação Firebase, mais o registo desta tarefa. Não alterar app.js, index.html, config.js, package/dependências, integração Supabase existente, cache, exames, preços ou planos. Não publicar regras nem executar deploy. Não incluir apiKey, credenciais, tokens, service-account ou ficheiros .env.
- Pronto quando: (1) firebase.json referencia regras e índices; (2) regras negam por omissão e permitem apenas acesso ao próprio perfil com campos limitados; subscrições e pagamentos são apenas legíveis pelo próprio e nunca graváveis pelo cliente; tentativas ficam protegidas contra gravação directa do resultado pelo cliente; (3) índices mínimos documentados sem criar índices desnecessários; (4) .firebaserc.example não selecciona automaticamente um projecto real; (5) documentação explica estrutura, limites, configuração local e passos de validação; (6) ficheiros são revistos e commitados numa branch separada com PR, sem merge nem deploy.
- Cuidados: a aplicação ainda tem integração Supabase em curso (FE-012); esta tarefa não a substitui nem declara migração concluída. A activação real do Firebase Auth/Firestore no frontend fica para tarefa posterior, após revisão do dono e planeamento de migração. A configuração do Console foi feita manualmente pelo dono; não assumir que o projecto está ligado ao CLI nem que regras foram publicadas.

## Interface (FE-)
