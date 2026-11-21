# ESTRADA-JB — Exames de condução

Aplicação de preparação para exames de condução em Moçambique.

## Estado da versão de testes

- O catálogo está estruturado para 51 exames.
- Os Exames 31–51 estão integrados nesta versão de testes e permanecem temporariamente acessíveis sem pagamento.
- O acesso temporário é apenas para validação; não representa a política comercial final.
- Cada exame contém 25 perguntas e tem cronómetro de 60 minutos.
- Cada resposta certa vale 0,8 valores; a aprovação exige pelo menos 18 valores.
- A correcção é apresentada no resultado e na revisão pedagógica, depois da submissão.

## Autenticação

A migração para Firebase está em curso na branch `feat/firebase-full-migration`.

- Email e palavra-passe: registo cria a conta e inicia sessão imediatamente; não exige confirmação do email.
- Google: autenticação integrada no frontend; requer validação no Preview.
- Telefone moçambicano e palavra-passe: fluxo backend com Firebase custom token, sem SMS/OTP. O número não é tratado como prova de titularidade.
- Recuperação da palavra-passe por email.
- Perfil mínimo associado ao UID autenticado no Cloud Firestore.
- O registo por email faz uma pré-validação de formato e domínio, incluindo detecção de domínios temporários conhecidos. Sem confirmação, essa verificação não prova que a caixa existe ou pertence ao utilizador.

Os fluxos reais de autenticação ainda precisam de validação no Preview. As regras Firestore passaram nos testes do Emulator Suite, mas ainda não foram publicadas no projecto Firebase real.

## Assinaturas e pagamentos

A integração ePay está preparada na branch de migração:

- O servidor define os planos, preços, duração e referência de pagamento.
- O checkout é individual e associado à conta ESTRADA-JB autenticada que o iniciou.
- O pagador pode utilizar um meio de pagamento pertencente a outra pessoa; a assinatura beneficia sempre a conta que iniciou o checkout.
- A confirmação depende da validação do pagamento pela ePay e da activação no backend.

O fluxo ainda aguarda um pagamento sandbox real de ponta a ponta. Não declarar pagamentos ou assinaturas activos em produção. Não usar o link de produto criado no painel ePay para testes: esse checkout pode cobrar em produção.

## Publicação no Netlify

O ficheiro `netlify.toml` configura a publicação estática:

- Comando de build: `node scripts/build-netlify.js`
- Pasta publicada: `dist/`
- Node.js: versão 20.

O build copia apenas os ficheiros necessários para executar a aplicação. O APK original, documentação interna, histórico e listas de tarefas não são publicados no site.

## Desenvolvimento e validação

- Abrir `index.html` localmente para uma pré-visualização simples.
- Executar `node scripts/validar-exames.js` para validar os dados dos exames.
- Executar `node scripts/testar-fluxo.js` para testar o fluxo dos exames.
- Executar `node scripts/build-netlify.js` para gerar a pasta de publicação `dist/`.

## Fonte principal

O repositório GitHub é a fonte principal do projecto. Consultar `INSTRUCOES.md`, `REGRAS.md`, `PENDENTE.md`, `data/exames/PENDENTE.md` e `HISTORICO.md` antes de alterar o projecto. Consultar também `docs/firebase/README.md` e `docs/epay/README.md` para a arquitectura e as limitações dos serviços.

## Segurança

Não guardar chaves, tokens, passwords nem ficheiros `.env` no repositório. As credenciais Firebase Admin, a chave ePay e os segredos de autenticação devem existir apenas como variáveis secretas no ambiente de servidor apropriado. Nunca usar credenciais de produção para testes.

O APK original está em `original/` apenas como referência de trabalho e fica excluído da publicação do site.
