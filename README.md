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


## Autenticação Supabase (FE-012)

A autenticação por email e palavra-passe usa o projecto Supabase ESTRADA (ldtvbmmweqiaggmsicnu). O URL do projecto e a chave publishable ficam em config.js; esta chave é pública e foi concebida para uso no frontend. Nunca substituir por uma chave service_role ou por qualquer chave secreta.

Antes de testar registos e confirmações por email:
1. No Supabase, abrir Authentication → URL Configuration.
2. Definir Site URL para o endereço público real do site ESTRADA no Netlify.
3. Adicionar esse mesmo endereço à lista Redirect URLs. Acrescentar também o endereço local de desenvolvimento, se for usado.
4. Em Authentication → Sign In / Providers, confirmar que o fornecedor Email está activo.
5. Se a confirmação de email estiver activa, o utilizador deve abrir o link recebido antes de iniciar sessão.

O login Google está preparado no código, mas permanece desactivado (googleOAuthEnabled: false). Para o activar, criar as credenciais OAuth no Google Cloud, configurar o fornecedor Google no painel Supabase e só então mudar a opção para true. O Client Secret do Google fica guardado apenas no painel Supabase, nunca em config.js, no GitHub ou no frontend.

Nesta fase, as contas são geridas pelo Supabase Auth. Ainda não foi criada uma tabela pública de perfis nem uma base de dados de tentativas, resultados ou assinaturas; esses módulos devem ter tarefas e modelos próprios.
