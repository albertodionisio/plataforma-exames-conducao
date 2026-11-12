# ESTRADA — Perguntas frequentes (fonte de conteúdos)

Documento editorial interno da tarefa GER-010. **Ainda não está ligado ao site.** Cada resposta indica de onde vem e se já corresponde ao que o ESTRADA faz hoje. Só se publica no site uma resposta com estado «Em vigor», ou depois de concluída a tarefa indicada no seu estado.

## Como ler este documento

**Origem** (de onde vem a resposta):

- **APK** — confirmado no APK original, por análise do código e dos ecrãs (referências A1 a A11, abaixo).
- **REGRAS** — decisão do dono registada em `REGRAS.md`.
- **ESPEC** — `docs/ESTRADA_Especificacao_Tecnica.md`.
- **CÓDIGO** — comportamento actual verificado no site (`app.js`, `config.js`, `public/assinaturas/planos.js`, `data/exames/exame1.js`).
- **EDITORIAL** — recomendação editorial para o ESTRADA; não é um facto confirmado no APK nem uma regra do produto.

**Estado** (se já existe):

- **Em vigor** — o site já faz isto.
- **Decidido, por implementar** — está decidido em `REGRAS.md`, mas o site ainda não o faz. Indica a tarefa que o implementa.
- **Planeado** — está previsto na especificação, mas não está activo.
- **Editorial** — conselho; não depende de funcionalidade.

## Base de verificação

- APK `original/Codigo_e_Sinais_de_Transito_1_1.apk`, versão 1.1 (pacote `com.app.codigoesinaisdetransito`), e `original/LEIAME.md`.
- **Análise estática**: leram-se os textos dos ecrãs, o manifesto e a lógica do código. A app **não foi executada**; o que não se consegue ver no código fica por afirmar.
- `REGRAS.md`, `docs/ESTRADA_Especificacao_Tecnica.md` e os ficheiros do site, ao estado do repositório de 2026-11-11 (commit `13165aa`).
- Não se copiou texto, pergunta nem imagem do APK. Citam-se apenas os nomes curtos dos botões e mensagens.

## O que o APK confirma

| Ref. | Facto confirmado |
|---|---|
| A1 | O menu tem três áreas: Exames, Sinais de Trânsito e Código de Estrada. |
| A2 | Cada exame tem 25 perguntas, com navegação numerada de 1 a 25. O `LEIAME.md` indica 30 exames. |
| A3 | O exame tem um contador de 60 minutos (começa em 59 minutos mais 60 segundos). Ao chegar a zero, o exame termina e passa ao resultado. |
| A4 | O botão «Terminar» pede confirmação («Deseja terminar o exame?», Sim/Não). |
| A5 | O botão «voltar» do telemóvel está desactivado durante o exame. |
| A6 | O resultado mostra Acertos, Erros e Média, com o estado Aprovado/Reprovado, e os botões «Revisão» e «Sair». |
| A7 | O cálculo do APK: média = acertos × 20 ÷ 25 (número inteiro); aprovado com 18 ou mais **acertos**; perguntas sem resposta contam como erros. |
| A8 | A «Revisão» reabre as perguntas com as respostas bloqueadas e coloridas. Não se identificou explicação em texto. |
| A9 | Se faltar ligação, aparece «Falha ao conectar a internet» com o botão «Voltar a tentar». A app tem anúncios, incluindo um anúncio com recompensa antes do resultado. |
| A10 | As perguntas podem ter imagem. Há também um treino de sinais (categoria, temporizador desligado ou de 30 s, som) e, dentro do APK, PDFs de sinais e do Código da Estrada. |
| A11 | O resultado de cada exame fica guardado no próprio telemóvel. |

## 1. Funcionamento dos simulados

**P: O que é um simulado?**
R: É uma prova de treino com perguntas de escolha múltipla sobre o Código da Estrada, feita com tempo limitado, como num exame. No fim recebes a nota e o resultado.
Origem: REGRAS; ESPEC §1.1–1.2; APK A2, A6. · Estado: Em vigor.

**P: Como começo um simulado?**
R: Abre «Simulados», escolhe um simulado disponível e responde às perguntas. Os marcados «Em breve» ainda estão em preparação; os bloqueados exigem um plano.
Origem: CÓDIGO (catálogo e página do simulado). · Estado: Em vigor. Hoje só o Simulado 1 está disponível.

**P: O ESTRADA diz-me durante o simulado se acertei?**
R: Não. Durante o simulado não se mostra se cada resposta está certa ou errada, nem explicações. Primeiro terminas as perguntas; depois vês a classificação e estudas as explicações com calma.
Origem: REGRAS (Avaliação e revisão dos simulados). · Estado: Decidido, por implementar (FE-002).
Nota interna: a versão actual do site ainda mostra certo/errado e a explicação logo a seguir a cada resposta. Não publicar esta resposta antes de a FE-002 estar concluída.

**P: Posso parar e continuar mais tarde?**
R: Não. Se saíres da página ou a actualizares, a tentativa perde-se e o simulado recomeça com os 60 minutos completos. Faz o simulado quando conseguires ter uma hora seguida.
Origem: CÓDIGO (o estado da tentativa vive só na página; o resultado só é guardado ao terminar). · Estado: Em vigor. Ver dúvida D6.

**P: Posso repetir um simulado?**
R: Sim. Podes repetir os simulados a que tens acesso as vezes que quiseres. Cada tentativa começa de novo, com as respostas e o tempo limpos.
Origem: ESPEC §1.2 (tentativas ilimitadas); CÓDIGO (botão «Repetir»). · Estado: Em vigor.

## 2. Estrutura dos exames

**P: Quantas perguntas tem cada simulado e como são?**
R: Cada simulado tem 25 perguntas. Cada pergunta tem quatro alternativas (A, B, C e D) e só uma está correcta.
Origem: REGRAS; ESPEC §1.2; APK A2; CÓDIGO (`data/exames/exame1.js` verificado com `scripts/validar-exames.js`). · Estado: Em vigor.

**P: Quantos simulados existem e quais são gratuitos?**
R: O catálogo tem 50 simulados. Os 3 primeiros são gratuitos; os restantes estão reservados a planos de acesso (a adesão ainda não está activa: ver «Já posso assinar e pagar um plano?»). Alguns simulados ainda estão em preparação e aparecem como «Em breve».
Origem: REGRAS; `config.js`; CÓDIGO (catálogo). · Estado: Em vigor. A disponibilidade de cada simulado muda com a produção; rever esta resposta quando entrarem novos simulados.

**P: As perguntas têm imagens?**
R: Sim. Várias perguntas, sobretudo as de sinais, trazem imagem.
Origem: APK A10; CÓDIGO (o Simulado 1 já tem perguntas com imagem). · Estado: Em vigor. Não afirmar que se pode ampliar a imagem: existe no APK, mas não está confirmado no ESTRADA.

**P: As perguntas são as do exame oficial?**
R: Não. São perguntas reescritas para o ESTRADA, para treino, e não as do exame oficial.
Origem: REGRAS (as perguntas são reescritas); ESPEC §1.3. · Estado: Em vigor (princípio editorial).
Nota interna: não afirmar que o conteúdo já foi validado por um profissional; a especificação (§9) prevê essa revisão, mas não está confirmada.

## 3. Tempo disponível

**P: Quanto tempo tenho para cada simulado?**
R: Tens 60 minutos, contados desde o início. O relógio aparece sempre no ecrã.
Origem: REGRAS; ESPEC §1.2; APK A3; CÓDIGO (`config.js`). · Estado: Em vigor.

**P: O que acontece quando o tempo acaba?**
R: O simulado termina e é submetido automaticamente com as respostas que deste.
Origem: REGRAS; ESPEC §1.2; APK A3; CÓDIGO. · Estado: Em vigor.

**P: Posso terminar antes de o tempo acabar?**
R: Sim. Quando respondes à última pergunta, podes terminar e ver o resultado sem esperar pelo fim do relógio.
Origem: REGRAS («submeter quando o candidato terminar as 25 perguntas»); CÓDIGO. · Estado: Em vigor. Ver dúvida D3.

**P: Quanto tempo tenho, em média, por pergunta?**
R: Cerca de 2 minutos e 24 segundos (60 minutos a dividir por 25 perguntas). Lê com atenção, mas vai controlando o relógio.
Origem: EDITORIAL (cálculo a partir de REGRAS). · Estado: Editorial.

## 4. Avaliação e aprovação

**P: Como é calculada a nota?**
R: Cada resposta certa vale 0,8 valores, até ao máximo de 20. As respostas erradas e as perguntas em branco valem zero; não há desconto por erro.
Origem: REGRAS; ESPEC §8; CÓDIGO (`config.js`). · Estado: Em vigor.

**P: Qual é a nota para ficar aprovado?**
R: 18 valores ou mais, o que corresponde a 23 respostas certas (18,4 valores). Com 22 certas, a nota é 17,6 e o resultado é reprovado. Este é o critério de treino do ESTRADA.
Origem: REGRAS; ESPEC §8. · Estado: Em vigor (resultado em texto; o semáforo é por implementar, FE-002).
Nota interna: o APK usa outro critério (A7); ver dúvida D1. Esta resposta segue `REGRAS.md`.

**P: O que mostra o resultado?**
R: A nota em valores, o número de respostas certas, erradas e em branco e o estado final (aprovado ou reprovado). Quando o semáforo estiver activo, a luz verde indica aprovado e a vermelha indica reprovado, sempre junto da nota.
Origem: REGRAS; CÓDIGO; APK A6. · Estado: nota, contagens e estado em texto: Em vigor; semáforo: Decidido, por implementar (FE-002).

**P: O que acontece às perguntas em branco?**
R: Contam como «em branco», valem zero e aparecem separadas das erradas no resultado.
Origem: REGRAS («contabilizar também as perguntas em branco»); CÓDIGO; APK A7 (no APK contam como erros). · Estado: Em vigor.

## 5. Revisão das respostas

**P: Posso rever o simulado depois de o submeter?**
R: Sim. Depois do resultado, a acção «Rever exame» deixa-te percorrer todas as perguntas, pela mesma ordem em que as viste.
Origem: REGRAS; APK A6, A8 (botão «Revisão»). · Estado: Decidido, por implementar (FE-002). O site ainda não tem revisão.

**P: O que vejo na revisão?**
R: Para cada pergunta: o enunciado e a imagem, a alternativa que escolheste, a resposta correcta e uma explicação. As perguntas sem resposta ficam assinaladas.
Origem: REGRAS; APK A8 (a revisão do APK mostra as respostas coloridas; não se identificou explicação em texto). · Estado: Decidido, por implementar (FE-002).

**P: Vejo a explicação mesmo nas perguntas que acertei?**
R: Sim. Também as perguntas certas têm explicação, para consolidares o que já sabes.
Origem: REGRAS; CÓDIGO (o Simulado 1 tem explicação em todas as perguntas, verificado com `scripts/validar-exames.js`). · Estado: Decidido, por implementar (FE-002).

## 6. Preparação para o exame de condução

**P: Como devo usar os simulados para me preparar?**
R: Faz o simulado completo, dentro do tempo e sem ajuda. Depois revê todas as perguntas, sobretudo as erradas e as em branco, e lê as explicações. Mais tarde repete o simulado e compara a nota; só então passa ao seguinte.
Origem: EDITORIAL (assente no fluxo decidido em REGRAS). · Estado: Editorial. A parte da revisão só se aplica depois da FE-002.

**P: Quando estarei preparado?**
R: Uma boa referência é teres 23 respostas certas ou mais, de forma consistente, em simulados diferentes, e saberes explicar porque é que cada resposta está certa. Os simulados não substituem o estudo do Código da Estrada.
Origem: EDITORIAL (a partir do limiar de REGRAS). · Estado: Editorial.

**P: Passar no simulado garante passar no exame de condução?**
R: Não. O tempo, a pontuação e o limiar do ESTRADA são regras internas de treino, e não as regras oficiais do exame. O ESTRADA não é um serviço oficial nem promete aprovação. Para as regras oficiais, consulta a tua escola de condução ou a entidade competente.
Origem: ESPEC §1.2–1.3; REGRAS (limiar interno). · Estado: Em vigor (princípio).

**P: Onde estudo o Código da Estrada e os sinais?**
R: Por agora, o ESTRADA não inclui o texto do Código da Estrada nem um guia de sinais: ajuda-te a treinar com perguntas e explicações. Para estudar a matéria, usa o Código da Estrada em vigor e o material da tua escola de condução.
Origem: CÓDIGO (o site só tem início, simulados, planos e resultado); APK A10 (o APK trazia PDFs de sinais e do Código; o `LEIAME.md` diz que o site não serve conteúdo original). · Estado: Em vigor (limitação actual).

## 7. Utilização da plataforma

**P: Preciso de criar conta?**
R: Não. Hoje usas os simulados disponíveis sem te registares. As contas e a verificação por telefone estão previstas, mas ainda não existem.
Origem: CÓDIGO (não há páginas de conta); ESPEC FR-01, FR-02. · Estado: sem conta: Em vigor; contas: Planeado.

**P: Quanto custa usar o ESTRADA?**
R: Os 3 simulados gratuitos não têm custo. Os restantes estão reservados a planos pagos. Na página «Planos» vês o preço, a validade, o número de simulados, os anúncios e o atendimento de cada plano.
Origem: REGRAS; `config.js` (fonte de verdade dos preços, que não se copiam para aqui). · Estado: Em vigor (informação dos planos); a adesão está na pergunta seguinte.

**P: Já posso assinar e pagar um plano?**
R: Ainda não. A página «Planos» mostra as opções, mas a adesão e os pagamentos não estão activos nesta versão.
Origem: CÓDIGO (aviso em `public/assinaturas/planos.js`); `HISTORICO.md` (FE-004). · Estado: Em vigor (aviso).

**P: O ESTRADA mostra anúncios?**
R: Neste momento o site não mostra anúncios. O modelo previsto tem anúncios nos planos Free e semanais (em menor número nos semanais) e nenhum nos planos mensais. Os anúncios nunca interrompem um simulado em andamento.
Origem: ESPEC §11; `config.js`; CÓDIGO (o `index.html` não carrega scripts de anúncios). · Estado: Planeado, não activo. O APK tem anúncios (A9), mas isso não é uma regra do ESTRADA.

**P: O ESTRADA guarda o meu histórico?**
R: Hoje guarda, no teu navegador, um resumo das últimas tentativas (simulado, certas e nota) e mostra a última na página inicial. Não há conta: se limpares os dados do navegador ou mudares de telemóvel, esse registo perde-se. O histórico completo e a evolução por tema estão previstos, mas ainda não existem.
Origem: CÓDIGO (armazenamento local, até 20 tentativas); ESPEC FR-11; APK A11 (também guarda localmente). · Estado: registo local: Em vigor; histórico completo: Planeado.

**P: Funciona no telemóvel?**
R: Sim. O ESTRADA abre no navegador do telemóvel, sem instalar nada. Não há aplicação nas lojas.
Origem: ESPEC §1.1, §1.3 (web responsiva; aplicação nativa fora do âmbito inicial); CÓDIGO (`index.html` com viewport). · Estado: Em vigor. A verificação visual em várias larguras de ecrã ainda está em curso (FE-001).

**P: Preciso de internet?**
R: Sim. O ESTRADA é um site e precisa de ligação à internet para abrir. O funcionamento offline completo não está disponível.
Origem: APK A9 (mensagem de falha de ligação); ESPEC §1.3 (offline completo fora do âmbito inicial); CÓDIGO (não há service worker). · Estado: Em vigor.

## Temas do APK sem equivalente confirmado no ESTRADA

Não devem entrar nas perguntas frequentes enquanto não existirem no ESTRADA.

- **Treino de sinais** (A10): o ESTRADA não tem esta área. `docs/referencia-sinais.md` é só referência interna.
- **PDFs de sinais e do Código da Estrada** (A10): o `LEIAME.md` determina que o site não serve conteúdo do APK.
- **Anúncio com recompensa antes do resultado** (A9): a especificação (§11) não admite anúncios que interrompam o simulado nem que escondam a nota.
- **Navegação livre entre perguntas, botão «Terminar» com confirmação e botão «voltar» desactivado** (A2, A4, A5): ver D3.

## Dúvidas para o dono do projecto

Nenhuma destas dúvidas foi decidida neste documento. Onde houve conflito, as respostas seguem `REGRAS.md`.

- **D1 — Limiar de aprovação.** O APK aprova com 18 acertos (média 14 em 20, A7). `REGRAS.md` e a especificação aprovam com 18 valores, ou seja, 23 certas. As respostas deste documento seguem `REGRAS.md`. Confirmar que a diferença em relação ao APK é intencional.
- **D2 — «Modo estudo».** A especificação (§1.2, §8, FR-06), a página inicial («explicação a cada resposta») e o código actual mostram a explicação logo após cada resposta. `REGRAS.md` diz que não se revela correcção durante o exame e que «o modo de estudo mantém-se». Falta decidir se existe um modo de estudo à parte e como se acede a ele. Por isso, este documento não explica o «modo de estudo».
- **D3 — Navegação e fecho do simulado.** O APK deixa navegar entre as 25 perguntas, rever respostas e terminar a qualquer momento (com confirmação). No ESTRADA actual cada resposta fica fechada ao tocar e não há botão «anterior». `REGRAS.md` e a FE-002 não definem se se pode voltar atrás, alterar respostas ou terminar sem responder a todas. Este documento só afirma o que está definido.
- **D4 — Rótulos do resultado.** `REGRAS.md` usa «APROVADO» e «REPROVADO»; a especificação (§8) e o site usam «Aprovado» e «Não aprovado». As respostas usam aprovado/reprovado, como em `REGRAS.md`. Confirmar se a FE-002 uniformiza os rótulos.
- **D5 — Categoria de carta.** A especificação (§19) deixa a categoria e o programa por confirmar. Por isso, nenhuma resposta diz para que categoria de carta os simulados preparam.
- **D6 — Retomar uma tentativa interrompida.** Hoje a tentativa perde-se ao sair da página. A especificação prevê o prazo calculado no servidor (FR-07), mas não diz se a tentativa pode ser retomada. A resposta «Posso parar e continuar mais tarde?» descreve só o comportamento actual.
- **D7 — Canal de suporte.** A especificação (§10.8, §19) exige definir os canais de atendimento antes do lançamento. Não se encontrou nenhum nos ficheiros consultados, por isso não há pergunta sobre como contactar o suporte.

## Manutenção

- Quando a **FE-002** for concluída, passar para «Em vigor» as respostas marcadas «Decidido, por implementar (FE-002)» e retirar a nota interna da pergunta sobre o feedback durante o simulado.
- Quando entrarem novos simulados, rever «Quantos simulados existem e quais são gratuitos?» e «Como começo um simulado?».
- Quando a adesão a planos, os anúncios ou as contas passarem a existir, actualizar as respostas marcadas «Planeado».
- Se algum preço ou plano mudar, nada a alterar aqui: os valores não estão copiados neste documento.
