# ESTRADA — Exames de condução

Aplicação web de preparação para exames de condução em Moçambique.

## Estado da versão de testes
- Catálogo configurado para 51 exames.
- Os Exames 31–51 estão integrados: 21 exames, cada um com 25 perguntas.
- Durante esta fase, os Exames 31–51 estão temporariamente abertos para testes, sem pagamento.
- O Exame 1 permanece como demonstração. Os Exames 2–30 ainda não estão integrados nesta versão.
- O exame tem cronómetro de 60 minutos, 0,8 valores por resposta certa e aprovação a partir de 18 valores.
- A correcção é apresentada apenas no resultado e na revisão pedagógica, depois da submissão.
- A área de planos está integrada visualmente; autenticação por email/palavra-passe integrada no código, pendente configuração de URL de retorno e teste real; pagamentos e assinaturas ainda não estão activos.

## Publicação no Netlify
O ficheiro `netlify.toml` configura a publicação automática:
- Comando de build: `node scripts/build-netlify.js`
- Pasta publicada: `dist/`
- Node.js: versão 20.

O build copia apenas os ficheiros necessários para executar a aplicação. O APK original, documentação interna, histórico e listas de tarefas não são publicados no site.

## Desenvolvimento e validação
- Abrir `index.html` localmente para uma pré-visualização simples.
- Executar `node scripts/validar-exames.js` para validar os dados dos exames.
- Executar `node scripts/testar-fluxo.js` para testar o acesso e o fluxo dos Exames 31–51.
- Executar `node scripts/build-netlify.js` para gerar a pasta de publicação `dist/`.

## Fonte principal
O repositório GitHub é a fonte principal do projecto. Consultar `INSTRUCOES.md`, `REGRAS.md`, `PENDENTE.md`, `data/exames/PENDENTE.md` e `HISTORICO.md` antes de alterar o projecto.

## Segurança
Não guardar chaves, tokens, passwords nem ficheiros `.env` no repositório. O APK original está em `original/` apenas como referência de trabalho e fica excluído da publicação do site.


## Firebase Authentication e Firestore

A migração para Firebase está em curso na branch `feat/firebase-full-migration`. O frontend usa Firebase Authentication para email/palavra-passe, confirmação de email, recuperação, Google e sessão persistente. O perfil mínimo é sincronizado em `users/{uid}` no Cloud Firestore, sujeito à publicação das regras.

A configuração Web pública fica em `config.js`. Não guardar credenciais Admin, service-account, tokens ou segredos no repositório. O domínio Vercel está preparado como `authDomain` através de rewrites `/__/auth/*`; requer teste em Preview Deployment e autorização do domínio no Firebase/Google OAuth antes de ser considerado activo.

Ver `docs/firebase/README.md` para arquitectura, serviços adiados, activação e validação. Firestore não recebe perguntas nem imagens estáticas. Tentativas, resultados, assinaturas e pagamentos continuam bloqueados para escrita pelo cliente até existir backend confiável. Esta migração de código não elimina projectos nem dados externos antigos.


### Autenticação por telefone (preparação)

O frontend inclui registo/login por número de telefone e palavra-passe, sem SMS, através de uma Vercel Function e Firebase custom tokens. A palavra-passe é guardada como hash scrypt no Firestore, nunca em texto simples. Antes de testar o fluxo real, configurar `FIREBASE_SERVICE_ACCOUNT_JSON` e `PHONE_AUTH_PEPPER` como variáveis secretas do ambiente Preview Vercel. Ver `docs/firebase/README.md` para os requisitos, limitações e passos de activação. O número não é verificado e contas exclusivamente telefónicas não têm recuperação automática de palavra-passe.


## Cache individual e cache partilhado

A persistência individual das tentativas (pergunta, respostas e prazo absoluto) e das preferências fica no armazenamento local do navegador, por utilizador/dispositivo. O Service Worker e a Cache API guardam apenas recursos estáticos da própria origem, com versão e limpeza automática de versões antigas. API, Firebase, autenticação e pagamentos são excluídos. A configuração de cabeçalhos está em `vercel.json` e `netlify.toml`; o build inclui `service-worker.js`. Ver `docs/cache-estrada.md` e executar `node scripts/testar-cache.js`.
