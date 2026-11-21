# Validação das regras Firestore com Emulator Suite

Este procedimento testa `firestore.rules` num emulador local/CI. Não liga ao projecto Firebase real, não publica regras e não altera dados de produção.

## Ambiente

- Configuração isolada: `firebase.emulator.json`
- Projecto de demonstração: `demo-estrada` (não é o Project ID real)
- Firestore Emulator: `127.0.0.1:8080`
- Testes: `scripts/testar-regras-firestore.js`
- Dependências de desenvolvimento: Firebase SDK, `@firebase/rules-unit-testing` e Firebase CLI.

## Executar localmente

Requer Node.js 24+ e Java 21+.

```sh
npm install --no-save --package-lock=false 'firebase@^12' '@firebase/rules-unit-testing@^5' firebase-tools
npx firebase-tools emulators:exec --only firestore --project demo-estrada --config firebase.emulator.json "node scripts/testar-regras-firestore.js"
```

O comando termina com código diferente de zero se alguma permissão não corresponder ao esperado.

## Cenários cobertos

- Utilizador anónimo não lê perfis.
- Um utilizador não lê o perfil de outra pessoa.
- A criação do próprio perfil exige email verificado e campos permitidos.
- O proprietário pode actualizar apenas campos de perfil autorizados; não pode alterar UID, email ou data de criação.
- Tentativas só podem ser lidas pelo proprietário; consultas de lista precisam de filtrar por UID; o cliente não cria nem altera tentativas/resultados.
- Assinaturas e pagamentos podem ser lidos pelo proprietário, mas nunca criados ou alterados pelo cliente.
- Colecções não previstas são negadas por omissão.

## Integração contínua

O workflow `.github/workflows/validar-firebase.yml` instala as dependências temporárias, inicia o Firestore Emulator e executa os testes em cada push/PR abrangido. O ambiente de teste usa sempre `demo-estrada`; não é necessário configurar credenciais, Admin SDK, `.firebaserc` ou acesso ao projecto real.

## Limites

Um resultado aprovado valida o comportamento das regras no Emulator Suite. Não publica regras no Firebase real, não confirma domínios OAuth, não testa login real no navegador e não substitui a revisão final do modelo de dados nem a validação do backend.
