# Guia de escrita das perguntas e explicações

Vale para **todos** os exames (APK ou conteúdo original). A regra de fundo está em `REGRAS.md` («Finalidade dos exames e forma das perguntas»); este guia diz como a aplicar. Exemplos de referência: Exames 1–30, 34 e 35.

## Regra do dono (não reabrir)

- **Nunca** escrever «Segundo o Código da Estrada…», «De acordo com o artigo…» ou citar artigos, n.os ou alíneas, nem na pergunta nem nas alternativas nem na explicação.
- A pergunta é **sempre uma situação** do dia-a-dia; a explicação ensina o que fazer e porquê. Os artigos ficam só no mapa de cada exame.
- Este guia pode ser corrigido e completado por qualquer sessão: quando o dono der uma nova indicação sobre o estilo, acrescentá-la aqui e registar no `HISTORICO.md`.

## A ideia

O exame treina e ensina. Pergunta-se **a situação que o artigo trata**, nunca o artigo. O candidato lê uma cena concreta, decide o que fazer, e na revisão percebe porquê.

## Pergunta (enunciado)

- Abre com uma **situação do dia-a-dia**: quem, onde, o que acontece. Ex.: «Um camião avariado ocupa parte de uma estrada estreita e dois carros chegam de lados opostos. Quem deve dar passagem?»
- Termina com uma pergunta clara (o que deve fazer? pode fazê-lo? o que indica?).
- **Não** usar «Segundo o Código da Estrada…», «De acordo com o artigo…», «nos termos da lei…», nem números de artigos, alíneas ou n.os.
- Evitar definições secas («O que é a ultrapassagem?»). Se for preciso testar um conceito, pô-lo numa cena («Um motociclista que seguia atrás de uma camioneta passa para diante dela. Que manobra fez?»).
- Moçambique circula **pela esquerda**: confirmar sempre o sentido das manobras (ultrapassagem pela direita, afastar-se para a esquerda ao ser ultrapassado, etc.).
- Uma pergunta, uma ideia. Sem armadilhas de linguagem nem dupla negação.
- Não repetir cenas entre exames. Se a mesma regra voltar, mudar a situação e o ângulo.

## Alternativas

- Quatro alternativas, uma só correcta, todas plausíveis para quem não estudou.
- As erradas são **erros reais** (o que muita gente pensa), não absurdos nem piadas.
- **Extensão equilibrada:** a correcta não deve ser a mais comprida (meta: a única mais longa em, no máximo, 6 de 25). Se for preciso, encurtar a certa ou completar as erradas com uma cláusula natural.
- **Posição da correcta equilibrada:** 25 perguntas = A7/B6/C6/D6 (ou equivalente), sem padrão cíclico (ABCDABCD…).
- Evitar «todas as anteriores», «nenhuma das anteriores» e opções que se contradizem de forma óbvia.

## Explicação (mostrada na revisão)

- 2 a 3 frases curtas, linguagem simples.
- Diz **o que fazer e porquê**, na situação em causa, e, quando ajuda, **porque é que a tentação errada falha**. Ex.: «Quem tem o obstáculo à frente é quem precisa de sair da sua faixa, e por isso espera ou abranda… O tamanho do veículo ou a ordem de chegada não mudam isso.»
- **Não citar artigos, n.os nem «Art.»**. Também não valores de multas.
- Não repetir a resposta letra a letra; ensinar o raciocínio.

## Onde ficam os artigos

Só em `docs/referencias-exames/exameN-mapeamento.md`: uma linha por pergunta com tema, artigo/n.º, página do PDF (quando existir) e imagem. Se a pergunta mudar de regra, actualizar a linha.

## Imagens e sinais

- Pergunta sobre sinal ou situação visível leva imagem; a `descricao` descreve o que se vê, sem dar a resposta.
- Sinal em fraca qualidade: extrair do `original/referencia/sinais.pdf`.
- Exames de conteúdo original sem imagem usam `imagem: null`.

## Antes de fechar um exame

1. `node scripts/validar-exames.js` (estrutura).
2. `node scripts/auditar-estilo.js N` (artigos = 0, «Segundo o Código» = 0, certa+longa ≤ 6, posições equilibradas).
3. Ler 5 perguntas ao acaso como se fosse candidato: percebe-se a cena? A explicação ensina?
4. Actualizar o mapa, remover a tarefa do `PENDENTE.md` e registar no `HISTORICO.md` no mesmo commit.
