# ESTRADA-JB — Exames de condução

Aplicação de preparação para exames de condução em Moçambique.

> **Estado actualizado (27/11/2026):** consultar primeiro [Estado actual do projecto](docs/ESTADO-ATUAL.md). Esse documento consolida o estado validado do código, autenticação, exames, pagamentos Sandbox, CI, Preview e pendências. Notas antigas são registos históricos, não necessariamente o estado actual.

## Versão de validação

- 51 exames integrados nesta branch; 25 perguntas por exame.
- 3 exames gratuitos. A disponibilidade temporária dos Exames 31–51 nesta versão de validação não define a política comercial final.
- 60 minutos por exame; 0,8 valores por resposta certa; aprovação a partir de 18 valores.
- A correcção e a explicação pedagógica são apresentadas depois da submissão, na revisão.
- O modo de bypass de acesso pago está desligado em `config.js`.

## Autenticação e dados

A migração para Firebase está integrada na branch `feat/firebase-full-migration`. O proprietário confirmou o login Google no Preview depois de autorizar os domínios correspondentes no Firebase Authentication. O código inclui também email/palavra-passe, recuperação por email e autenticação telefónica por palavra-passe/custom token sem SMS/OTP.

Os testes automáticos de Auth/Firestore Emulator passaram no workflow Firebase. Isto não significa que as regras Firestore estejam publicadas: continuam por rever/publicar no projecto real. A publicação exige autorização expressa.

## Planos, pagamentos e assinaturas

A integração individual ePay está implementada e os testes automatizados passaram. O proprietário comprovou o fluxo completo em Sandbox: selecção do plano, checkout, confirmação, activação da assinatura e desbloqueio dos exames. A assinatura é associada ao UID autenticado que iniciou o checkout, mesmo quando o meio de pagamento pertence a familiar/terceiro.

**Sandbox não é produção.** Não há cobrança comercial activa, não foram autorizadas chaves live e não foi feito deploy de produção. Consultar [documentação ePay](epay/README.md).

## CI e Preview conhecidos

- GitHub Actions **Validar integração Firebase**, run `45833068199`: sucesso no commit `ba7df6f2c1141884e9fb7c4cf7a405aa908df4e4`.
- GitHub Actions **Validar exames**, run `45833068139`: falha na asserção do caminho da imagem do Exame 27 em `scripts/testar-fluxo.js:220`; a imagem actual está em `public/sinais/D79-sinal-pdf-600dpi.png`. A falha não deve ser escondida: corrigir a expectativa e preservar a validação da imagem.
- Preview Vercel: [deployment de validação](https://plataforma-exames-conducao-r6givqbf2-jjb18.vercel.app), associado ao commit acima.
- A validação manual do proprietário no Preview confirmou autenticação Google, planos Free/Semanal, pagamento Sandbox e execução do Exame 27.

## Desenvolvimento

- `node scripts/validar-exames.js` — valida os dados dos exames.
- `node scripts/testar-fluxo.js` — testa o fluxo dos exames (há uma asserção conhecida por actualizar para o caminho actual da imagem do Exame 27).
- `node scripts/testar-epay.js` — testes locais da integração ePay sem chamadas externas.
- `node scripts/testar-firebase.js` e workflows do Firebase — validação da configuração e dos emuladores.
- `node scripts/build-netlify.js` — gera a pasta estática `dist/`.

## Documentação principal

1. [Estado actual](docs/ESTADO-ATUAL.md) — fonte rápida do estado real.
2. [Instruções para sessões](INSTRUCOES.md) e [Regras do projecto](REGRAS.md).
3. [Pendências](PENDENTE.md) e [Histórico](HISTORICO.md).
4. [Especificação técnica](docs/ESTRADA_Especificacao_Tecnica.md).
5. [Firebase](docs/firebase/README.md) e [ePay](docs/epay/README.md).

O GitHub é a fonte principal do projecto. A branch de trabalho é `feat/firebase-full-migration`; não integrar na `main`, publicar regras Firestore ou fazer deploy de produção sem autorização expressa.

## Segurança

Não guardar chaves, tokens, passwords, service accounts nem ficheiros `.env` no repositório. Segredos devem existir apenas no ambiente de servidor apropriado. Nunca usar credenciais live em Preview nem copiar secrets Preview para Production.
