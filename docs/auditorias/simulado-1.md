# Auditoria comparativa do Simulado 1

- **Tarefa:** GER-005 · **Sessão:** Claude-GER005 · **Data:** 2026-11-11
- **Âmbito:** as 25 perguntas de `data/exames/exame1.js` (ESTRADA) comparadas com o Exame 1 do aplicativo original (`original/Codigo_e_Sinais_de_Transito_1_1.apk`).
- **Estado:** auditoria concluída em GER-005. O dono aprovou as correcções em 2026-11-11 e foram aplicadas na tarefa DADOS-052 (secção 7). O resultado das secções 2 a 6 mostra o estado **antes** das correcções.

## 1. Como foi feito

1. Li os dados do Exame 1 directamente do código do APK (`classes.dex`, classe `BaseDadosExame`): 25 perguntas com alternativas, letra da resposta indicada e imagem (`exame1_1` a `exame1_25`). Essa extracção ficou fora do repositório; este relatório descreve as perguntas originais por resumo e não as copia.
2. Comparei cada pergunta com a versão do ESTRADA: objectivo, alternativas, resposta indicada, imagem e explicação.
3. Verifiquei as regras contra o texto do Código da Estrada incluído no APK (`assets/codigodeestrada.pdf`), citando o artigo.
4. Comparei as imagens lado a lado (12 perguntas com imagem), incluindo o sinal A17 do ficheiro redesenhado.

## 2. Resumo

| Resultado | Perguntas | Quantidade |
|---|---|---|
| Manter | 1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21, 22, 23, 24 | 22 |
| Melhorar | 5, 15 | 2 |
| Corrigir | 25 | 1 |
| Substituir | nenhuma | 0 |

- **Objectivo preservado em 25 de 25.** Nenhuma pergunta mudou de tema ou de resposta em relação ao original. A única mudança de formulação é a pergunta 1, que passa de identificar o sinal para dizer o que o condutor deve esperar; o objectivo continua a ser reconhecer o sinal.
- **Resposta indicada coincide com o original em 25 de 25** (comparada pelo conteúdo, não pela letra: o ESTRADA reordena as alternativas).
- **Regras verificadas no Código da Estrada:** perguntas 2, 5, 6, 8, 9, 12, 13, 18, 19, 20, 22, 23 e 24 conferem com o texto legal (artigos na tabela da secção 4).
- **Um erro real:** pergunta 25, a imagem do ESTRADA mostra 400 m, e a explicação e uma alternativa falam em 300 m (secção 5).

## 3. Tipos de pergunta: original e ESTRADA

| Tipo | Perguntas | Quantidade | Preservado? |
|---|---|---|---|
| Identificação de sinal (sinal isolado ou em cena) | 1, 4, 10, 14, 16, 17, 21, 25 | 8 | Sim |
| Interpretação de imagem, marca ou gesto | 7, 15 | 2 | Sim |
| Regra, dever ou situação prática | 3, 5, 6, 11, 12, 13, 19, 20, 22, 24 | 10 | Sim |
| Definição ou valor legal (classe, distância, limite, prazo) | 2, 8, 9, 18, 23 | 5 | Sim |

- O Exame 1 original não tem perguntas de cenário complexo. A mais próxima de uma situação prática é a 5 (passagem estreita).
- **Estrutura das alternativas:** 16 das 25 perguntas originais têm só 3 alternativas e 9 têm 4. O ESTRADA tem sempre 4. As alternativas acrescentadas foram verificadas contra o Código nas perguntas 5, 6, 8, 9, 12, 13, 18, 19, 20, 22, 23 e 24: nenhuma delas é correcta por acidente.
- **Posição da resposta correcta:** original A 7, B 6, C 10, D 2; ESTRADA A 9, B 4, C 7, D 5. O ESTRADA está mais equilibrado e usa melhor a alternativa D.
- **Alternativa mais longa:** a resposta correcta é a mais comprida em 12 de 25 no original e em 13 de 25 no ESTRADA. Não houve agravamento, mas é um padrão que um candidato atento pode usar para adivinhar; vale equilibrar nos próximos simulados.

## 4. Pergunta a pergunta

Legenda: **M** manter · **Me** melhorar · **C** corrigir. Os resumos do original são paráfrases.

| Nº | Tipo | Original (resumo) | ESTRADA | Evidência | Resultado |
|---|---|---|---|---|---|
| 1 | Identificação de sinal de perigo | Pergunta o que o sinal indica; a resposta é o controlo policial por pirilampos | Pergunta o que esperar mais à frente; a resposta descreve a operação de controlo policial | Imagem do ESTRADA (A17) igual ao sinal do original (triângulo laranja com círculo azul) | M |
| 2 | Definição (classificação de automóveis) | Ligeiros e pesados | Igual; imagem de rua com ligeiros e camião | Art. 109 n.º 1: automóveis classificam-se em ligeiros (até 3.500 kg e 9 lugares) e pesados | M |
| 3 | Regra de condução defensiva | Não viajar de noite para evitar a fadiga | Igual; imagem de estrada à noite | Não depende de artigo; coerente com o original | M |
| 4 | Identificação de sinal de informação | Área reservada a automóveis ligeiros | Igual; sinal isolado em vez de fotografia da rua | Sinal G11 legível; as alternativas de parque de estacionamento e táxis mantêm-se | M |
| 5 | Regra de prioridade (situação prática) | Recua quem estiver mais perto do local onde o cruzamento é possível | Igual | Art. 41 n.º 4: recua o veículo mais próximo do local onde o cruzamento é possível; em via de inclinação acentuada recua o que sobe, salvo se for manifestamente mais fácil para o que desce. O original tinha uma alternativa sobre a inclinação; o ESTRADA trocou-a por alternativas genéricas | Me |
| 6 | Regra (luzes de perigo) | Usar em imobilização por acidente ou avaria que crie perigo | Igual | Art. 63 n.º 1: as luzes de perigo são para veículos que representam perigo especial | M |
| 7 | Interpretação de marca rodoviária | Marca branca que indica lombas | Faixas pintadas indicam lombas; o enunciado já não refere a cor | Imagem do ESTRADA mostra faixas amarelas e brancas atravessadas na via; ver recomendação | M |
| 8 | Valor legal (classe da contravenção) | Atirar ou abandonar objectos na via é contravenção média | Igual | Art. 146 a): contravenção média | M |
| 9 | Valor legal (distância de visibilidade) | 50 m | Igual (alternativas 25, 50, 100 e 200 m) | Art. 28: pelo menos 50 m | M |
| 10 | Identificação de sinal de proibição | Trânsito proibido | Igual; sinal isolado | Imagem igual (círculo vermelho vazio) | M |
| 11 | Regra de condução defensiva | Maior velocidade aumenta a gravidade das lesões | Igual | Não depende de artigo | M |
| 12 | Regra geral de circulação | Trânsito pela esquerda, junto à berma, a distância segura | Igual; acrescenta «Em Moçambique» | Art. 17 n.º 1: o trânsito faz-se pela esquerda | M |
| 13 | Regra (autoestrada) | Nunca se inverte o sentido de marcha | Igual | Art. 72 n.º 2 c): proibido inverter o sentido de marcha | M |
| 14 | Identificação de sinal de proibição | Paragem proibida a veículos com substâncias perigosas | Igual | Imagem igual (sinal com «S» cortado e painel inferior) | M |
| 15 | Interpretação de gesto do condutor | Braço estendido, movimento vertical: vai reduzir a velocidade | Igual; o enunciado descreve o gesto | Ver secção 5 | Me |
| 16 | Identificação de sinal de perigo | Ponte móvel | Igual | Imagem igual (D16) | M |
| 17 | Identificação de sinal de informação | Pré-aviso da direcção de saída | Igual | Imagem igual (painel N2/N4 com «2 Km») | M |
| 18 | Definição legal | Morte até 30 dias depois do registo do sinistro | Igual | Art. 151 n.º 2: até trinta dias após o registo | M |
| 19 | Regra para peões | Cuidado com a distância e a velocidade dos veículos | Igual | Art. 104 n.º 1: o peão deve certificar-se antes de atravessar. A alternativa com «10 m» é incorrecta: o Código fala em 50 m (n.º 3) | M |
| 20 | Regra de carga | Carga que assegure o equilíbrio do veículo | Igual | Art. 56 n.º 3 a): equilíbrio do veículo parado ou em marcha | M |
| 21 | Identificação de sinal de proibição | Trânsito proibido a peões, animais e veículos não automóveis | Igual | Imagem igual (sinal com peão, ciclomotor, animal e carroça) | M |
| 22 | Regra de ultrapassagem | Proibido imediatamente antes e nas passagens para peões | Igual | Art. 44 n.º 1 e): ultrapassagem proibida imediatamente antes e nas passagens de peões | M |
| 23 | Valor legal (limite de velocidade) | 100 km/h para pesados de passageiros fora das localidades | Igual | Art. 33: pesados de passageiros, 100 km/h fora das localidades | M |
| 24 | Dever do condutor | Obedecer ao sinal de paragem das autoridades | Igual | Art. 11 n.º 1: todos os condutores devem parar quando a autoridade lhes faz sinal | M |
| 25 | Identificação de sinal de informação | Portagem | Igual, mas a imagem e o texto não coincidem | Ver secção 5 | C |

## 5. Observações que exigem acção

### 5.1 Pergunta 25: correcção necessária

- A imagem usada pelo ESTRADA (`N34-via-com-portagem.png`) mostra a placa de distância **400 m**.
- A explicação diz **300 m** e uma alternativa fala em «posto de abastecimento a 300 metros».
- A fotografia do original mostra **300 m**.
- **Proposta:** redesenhar o sinal com 300 m, para ficar igual ao original e coerente com o texto; se preferirem manter 400 m, trocar o 300 por 400 na explicação e na alternativa D. A imagem também aparece cortada na margem direita.

### 5.2 Pergunta 15: melhorar

- No original a imagem mostra o braço com uma seta a indicar o movimento. A imagem do ESTRADA mostra o braço parado, e só o enunciado descreve o movimento.
- O significado do gesto não pôde ser confirmado no texto do Código da Estrada fornecido (só refere que se usa o «gesto regulamentar de braço»). Esta resposta fica, por agora, apoiada só no aplicativo original.
- **Proposta:** confirmar o gesto no regulamento de sinalização e, se possível, acrescentar à imagem uma seta como no original.

### 5.3 Pergunta 5: melhorar a explicação

- O Código também diz que, em vias de inclinação acentuada, recua o veículo que vai a subir (salvo se for claramente mais fácil para o que desce). O ESTRADA retirou a alternativa original sobre a inclinação, o que é defensável porque era ambígua, mas o candidato deixa de ver esta regra.
- **Proposta:** acrescentar uma frase na explicação sobre a regra da inclinação, sem mudar a pergunta.

### 5.4 Pergunta 7: confirmar a imagem

- O original fala de marca rodoviária branca; a fotografia do ESTRADA mostra faixas amarelas e brancas. Confirmar que a imagem deixa ver claramente a lomba, porque uma das alternativas (bandas sonoras) é próxima e pode causar dúvida.

### 5.5 Ortografia

- Os textos do exame ESTRADA usam grafia do Acordo de 1990 («objetos», «reação», «direção»). O Código e o aplicativo original usam a grafia anterior («objectos», «direcção»). Os outros documentos do repositório misturam as duas. Convém o dono decidir uma só e aplicá-la em todos os simulados.

## 6. O que não foi verificado

- Os códigos dos sinais (A17, G11, E1, N5, D16, H4, E47, N34) não foram confirmados contra `assets/sinais.pdf`, porque o ficheiro é sobretudo imagem e o texto extraível não os traz. A comparação foi visual, com o sinal do aplicativo original.
- A correcção das imagens de cena (perguntas 2, 3, 7 e 15) foi avaliada pelo tema, não por direitos de imagem nem origem das fotografias.
- Perguntas 3 e 11 (condução defensiva) não dependem de um artigo do Código; apoiam-se no original.
- Esta auditoria não avalia a lógica de pontuação nem a interface.

## 7. Correcções aplicadas (DADOS-052, 2026-11-12)

| Pergunta | O que foi feito |
|---|---|
| 25 | O sinal `public/sinais/N34-via-com-portagem.png` foi redesenhado com a distância **300 m**, como no original, e agora coincide com o enunciado, a alternativa D e a explicação. Também foram refeitas as bordas direitas da placa e do painel, que estavam cortadas, e retiradas duas linhas finas de recorte. |
| 15 | A imagem `public/cenas/pergunta-15-braco-do-condutor.jpg` ganhou uma seta vermelha de duplo sentido entre as duas posições do braço, como no aplicativo original. A descrição da imagem em `exame1.js` refere a seta. |
| 5 | A explicação passou a incluir a regra da inclinação (Art. 41 n.º 4): numa via de inclinação acentuada recua o veículo que vai a subir, salvo se a manobra for manifestamente mais fácil para o que desce. A pergunta e as alternativas não mudaram. |
| 7 | A imagem foi confirmada: mostra claramente uma lomba. Foi corrigida a descrição da imagem, que dizia «marcas brancas» quando as faixas são amarelas e brancas. |

**Continua em aberto**
- **Grafia:** a escolha entre a grafia de 1990 e a anterior aguarda confirmação do dono (secção 5.5). Não foi alterada nenhuma palavra.
- **Pergunta 15:** o significado do gesto (reduzir a velocidade) continua apoiado só no aplicativo original; falta confirmá-lo no regulamento de sinalização.
- `node scripts/validar-exames.js` passa sem problemas.

