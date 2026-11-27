# Estado actual do projecto ESTRADA-JB

**Actualizado em:** 27 de Novembro de 2026  
**Branch de referência:** `feat/firebase-full-migration`  
**Commit de referência:** `ba7df6f2c1141884e9fb7c4cf7a405aa908df4e4`  
**Produção:** não publicada; `main` não foi alterada nesta fase.

Este documento é o resumo operacional actual. Quando uma nota histórica ou anexo datado divergir daqui, prevalece o estado confirmado neste documento e nos ficheiros/código da branch indicada. Registos históricos não devem ser apagados: devem ser lidos como fotografias do estado na data em que foram escritos.

## Estado geral

| Área | Estado actual | Evidência / limite |
|---|---|---|
| Sincronização Git | Concluída na branch Firebase | Commit de merge `ba7df6f`; a branch incorporou as alterações da `main`. |
| Autenticação Google | Validada manualmente no Preview | O proprietário confirmou login funcional após autorizar os domínios Preview no Firebase Authentication. |
| Autenticação por email/telefone | Implementação e testes automatizados presentes | Não confundir testes de emulador/código com validação completa de todos os fluxos reais no Preview. |
| Firestore | Integração e regras testadas nos emuladores | As regras ainda não foram publicadas no projecto Firebase real. |
| Catálogo de exames | 51 exames integrados nesta branch | 25 perguntas por exame; 3 exames gratuitos. Exames 31–51 permanecem temporariamente disponíveis para validação de conteúdo, não como política comercial final. |
| Experiência de exame | Validada pelo proprietário no Preview | Cronómetro, imagens, navegação, correcção e resultado final foram testados; Exame 27 concluído em sessão de validação. |
| Planos e acesso | Fluxo Free e desbloqueio semanal testados | Proprietário confirmou 3 exames no Free e desbloqueio após assinatura Sandbox. |
| Criação de pagamento ePay | Código e testes automatizados aprovados | Checkout individual; plano/preço definidos no servidor; UID beneficiário fixado antes do checkout; referência gerada no servidor. |
| Confirmação/activação ePay | Fluxo funcional Sandbox comprovado pelo proprietário | Pagamento, confirmação, activação da assinatura e acesso aos exames foram comprovados em Sandbox. Não significa cobrança real em produção. |
| CI Firebase | Sucesso no commit de referência | GitHub Actions run `45833068199`; inclui sintaxe API, testes ePay/email, configuração Firebase e emuladores Auth/Firestore. |
| CI exames | Falha conhecida no teste de fluxo | Run `45833068139`: falha em `scripts/testar-fluxo.js:220`, que espera uma imagem num caminho antigo do Exame 27; a pergunta actual usa `public/sinais/D79-sinal-pdf-600dpi.png`. O ficheiro existe. A asserção precisa de ser revista sem enfraquecer a validação visual. |
| Preview Vercel | READY | Deployment `dpl_ALFzFnbZbmMvmoZCmragfPcQRaQt`, SHA igual ao commit de referência. |
| Produção Android/Web | Não lançada | Não fazer merge para `main`, publicar regras Firestore ou activar credenciais ePay live sem autorização expressa. |

## Autenticação

O proprietário validou o início de sessão Google no Preview depois de adicionar o domínio de deployment e o alias estável da branch à lista de domínios autorizados do Firebase Authentication. Não voltar a pedir essa configuração como se ainda estivesse por fazer.

O código também inclui email/palavra-passe, recuperação de palavra-passe e autenticação telefónica por palavra-passe/custom token sem SMS/OTP. A existência dos testes de emulador não prova, por si só, que cada fluxo real de email/telefone foi testado no Preview. Não afirmar verificação de titularidade de números telefónicos.

## Exames e experiência

A configuração actual em `config.js` define 51 exames, 3 gratuitos, 25 perguntas por exame, 60 minutos, 0,8 valores por resposta certa e aprovação a partir de 18 valores. O modo de bypass de acesso pago está desligado (`modoTesteAcessoPago: false`; `examesAbertosTeste: []`). A disponibilidade temporária dos Exames 31–51 na versão de validação deve ser distinguida da política comercial final.

O proprietário confirmou no Preview a apresentação de imagens, navegação, cronómetro, avaliação e resultado. A reprovação no Exame 27 durante a demonstração foi o resultado da tentativa e não foi reportada como defeito.

## Pagamentos e assinaturas

O fluxo individual ePay foi testado em Sandbox pelo proprietário: selecção do plano, criação do checkout, processamento/confirmação, activação da assinatura e desbloqueio dos exames. O pagamento pode ser efectuado por meio pertencente a familiar/terceiro; a assinatura pertence sempre ao UID autenticado que iniciou o checkout.

O código valida o Firebase ID token, escolhe plano/preço no servidor, gera UUID de referência, verifica valor/moeda e assinatura do callback, consulta o estado do pagamento e activa a subscrição em transacção Firestore com idempotência. O endpoint de estado permite ao utilizador consultar apenas a sua transacção.

**Limites:** Sandbox não é produção. Não há autorização para trocar para chaves live, cobrar clientes reais ou declarar pagamentos comerciais activos. O webhook geral é opcional; o callback individual e a consulta de estado são o fluxo principal. Não utilizar o checkout fixo de produto do painel para testes.

## Pendências e riscos conhecidos

1. Corrigir a asserção desactualizada do Exame 27 em `scripts/testar-fluxo.js:220`, preservando teste real de carregamento e associação da imagem.
2. Rever e actualizar documentação operacional e tarefas antigas que ainda descrevem autenticação, pagamento ou migração como não testados.
3. Rever robustez/idempotência de pedidos de criação repetidos: o servidor gera nova referência por pedido; o frontend desactiva o botão durante o processamento, mas não há chave estável de idempotência entre tentativas.
4. Rever as regras Firestore antes de qualquer publicação. Não publicar nesta fase.
5. Completar auditoria global de segurança, compatibilidade móvel/Android, acessibilidade, desempenho e comportamento em produção.
6. Preparar a activação live e lançamento apenas quando houver credenciais/aprovações e autorização expressa.

## Regras de operação

- GitHub é a fonte principal de verdade; trabalhar nesta branch até decisão explícita de integração.
- Não alterar `main`, não fazer merge, não publicar regras Firestore e não fazer deploy de produção sem autorização.
- Não apagar dados, contas, projectos ou recursos.
- Nunca guardar segredos no repositório nem copiar secrets Preview para Production.
- Ao actualizar o estado, actualizar também `README.md`, documentos específicos afectados, `PENDENTE.md` e `HISTORICO.md), sem apagar registos históricos nem sobrescrever tarefas reservadas por outras sessões.
