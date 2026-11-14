# Exame 8 — mapa de rastreabilidade (DADOS-009)

Conteúdo adaptado das 25 perguntas recuperadas em `original/extraido/exame8.json`. Imagens copiadas sem alteração de `original/extraido/imagens/exame8/` para `public/exames/exame8/`. Modelo seguido: `data/exames/exame4.js` e `docs/referencias-exames/exame4-mapeamento.md`.

## Fontes de referência

- `original/extraido/exame8.json`: enunciados, alternativas, chave do APK e associação de imagens.
- `original/referencia/codigodeestrada.pdf`: Código da Estrada de Moçambique; referências de artigos indicadas na tabela.
- `original/referencia/sinais.pdf`: Regulamento/quadros de sinais; referências de sinais indicadas na tabela.
- Informação institucional actual do INATRO para a pergunta 8.
- As explicações são pedagógicas e não citam artigos. As referências legais e os códigos dos sinais ficam apenas neste mapa.

## Estado da validação do conteúdo

- 25 perguntas, cada uma com quatro alternativas preenchidas e uma resposta correcta.
- Distribuição das respostas correctas: **A=7, B=6, C=6, D=6**.
- Nenhuma resposta correcta é a única alternativa mais longa.
- Não foram incluídos valores de multas.
- Não há números de artigos nos enunciados nem nas explicações.
- As 25 imagens originais estão associadas às perguntas correspondentes e copiadas para `public/exames/exame8/`.
- As imagens de sinais foram mantidas quando legíveis; não foi redesenhado nenhum sinal de memória.

## Execução da validação automática

- Workflow GitHub Actions `43595306116`, no commit `42a54f03f4045df9ea5f7c8d51519d3d0a17f7ce`: a verificação de sintaxe JavaScript e o teste de assinaturas passaram. O teste geral `scripts/testar-fluxo.js` falhou na primeira asserção porque `config.js` tem `modoTesteAcessoPago=true`, enquanto o teste existente espera `false`. Por causa dessa falha, `scripts/validar-exames.js` e o build Netlify foram ignorados. A configuração de acesso não foi alterada, pois está fora do escopo DADOS-009 e mantém o regime temporário de testes definido pelo dono.
- A validação estrutural directa do Exame 8 confirmou 25 perguntas, quatro alternativas preenchidas, índices correctos válidos, distribuição A7/B6/C6/D6, nenhuma resposta correcta como única mais longa, sintaxe do ficheiro e presença das 25 imagens. Isto não substitui a execução do validador oficial nem o teste no navegador.

## Repetições encontradas e adaptações

- **Pergunta 1:** o conteúdo de classificação da manobra de derrapagem já aparece no Exame 5, pergunta 13. Foi transformada numa situação de segurança sobre como reagir ao observar essa manobra, sem repetir a pergunta de classificação.
- **Pergunta 9:** tema de fadiga próximo do Exame 4. Foi aplicada a uma viagem longa e ao efeito sobre reacção e distância de paragem.
- **Pergunta 16:** tema próximo do Exame 3, pergunta 18. Foi focada a instabilidade do velocípede e a necessidade de espaço lateral.
- **Pergunta 17:** tema próximo da pergunta 5. Foi reformulada para avaliar a entrada quando a rotunda está livre e não exige paragem desnecessária; a pergunta 5 continua a avaliar quem tem prioridade quando já há veículos no interior.
- **Pergunta 19:** definição de visibilidade reduzida já aparece no Exame 1, pergunta 9. Foi convertida numa situação prática de nevoeiro com visibilidade limitada a 40 metros.
- **Pergunta 21:** tema próximo do Exame 1, pergunta 13. Foi convertida numa situação de inversão numa rua movimentada, com pouca visibilidade e espaço limitado.
- **Pergunta 10:** o APK pergunta por uma hora exacta de eliminação do álcool. Como o Código não estabelece um tempo universal e a eliminação varia entre pessoas, a pergunta foi reformulada para avaliar a decisão segura de não conduzir com base numa estimativa de horas.

## Mapa das 25 perguntas

| Nº | Tema / competência avaliada | Fonte legal ou técnica | Resposta APK | Resposta ESTRADA | Imagem e observação |
|---:|---|---|:---:|:---:|---|
| 1 | Manobras perigosas na via pública | Art. 147, n.º 1, al. c) | C | A | exame8_1.jpg. Reformulada para atitude segura perante manobras exibicionistas; evita repetir a pergunta de classificação do Exame 5, pergunta 13. |
| 2 | Definição de cruzamento | Anexo I — Glossário, definição de «Cruzamento» | C | C | exame8_2.jpg. Chave mantida. |
| 3 | Área reservada para táxis | Regulamento de Sinais, quadro VII — G13 | A | A | exame8_3.jpg. Chave mantida; o sinal corresponde a área reservada para táxis, não a parque de estacionamento (G14). |
| 4 | Controlo de tráfego adiante | Regulamento de Sinais, quadro II — A14 | B | B | exame8_4.jpg. Chave mantida. |
| 5 | Cedência de passagem na rotunda | Art. 39, n.º 1, al. d) | A | D | exame8_5.jpg. Conteúdo correcto do APK reposicionado em D: quem entra na rotunda cede passagem a quem já circula nela. |
| 6 | Limite de álcool no ar expirado e no sangue | Art. 81, n.º 3 | B | B | exame8_6.jpg. Chave confirmada; unidades mantidas conforme o texto do Código consultado. |
| 7 | Via rápida temporariamente interrompida | Regulamento de Sinais — sinal temporário de informação «Via rápida temporariamente interrompida» | C | C | exame8_7.jpg. Chave mantida; a natureza temporária decorre da sinalização temporária. |
| 8 | Funções actuais do INATRO | Estatuto/atribuições do INATRO; fiscalização de escolas de condução | B | D | exame8_8.jpg. O APK usa a designação antiga INATTER. Actualizado para INATRO, entidade actualmente responsável pela fiscalização das escolas de condução e coordenação da segurança rodoviária. |
| 9 | Fadiga, reacção e distância de paragem | Segurança rodoviária — efeitos da fadiga | C | A | exame8_9.jpg. Aplicada a uma situação de condução; evita repetir literalmente a pergunta sobre sonolência do Exame 4. |
| 10 | Álcool e regresso à condução | Segurança rodoviária — metabolismo do álcool; sem tempo universal fixado no Código | C | C | exame8_10.jpg. A pergunta original pedia uma hora exacta de eliminação. Reformulada para não apresentar como universal uma estimativa que varia entre pessoas; a chave APK não valida a hora. |
| 11 | Desvio da fila de trânsito para a esquerda | Regulamento de Sinais, quadro XI — L5 | A | B | exame8_11.jpg. Chave mantida em conteúdo; posição alterada para B. |
| 12 | Velocidade e distância de segurança | Art. 20, n.º 1 | D | D | exame8_12.jpg. Chave mantida. |
| 13 | Mudança de direcção para a esquerda | Art. 46, n.º 1 | B | A | exame8_13.jpg. Chave mantida em conteúdo; posição alterada para A. |
| 14 | Ergonomia do veículo | Conceito geral de ergonomia e adaptação do equipamento ao utilizador | C | C | exame8_14.jpg. Chave mantida. |
| 15 | Raquetas e bandeirolas de sinalização | Regulamento de Sinais, art. 13, n.º 4, al. a) — A64 | C | B | exame8_15.jpg. Chave mantida em conteúdo; posição alterada para B. |
| 16 | Instabilidade dos velocípedes e espaço lateral | Segurança rodoviária — vulnerabilidade dos velocípedes | C | D | exame8_16.jpg. Reformulada para focar a instabilidade do velocípede e a necessidade de espaço lateral; evita repetir literalmente a pergunta do Exame 3, pergunta 18. |
| 17 | Cedência de passagem na entrada da rotunda | Art. 39, n.º 1, al. d) | B | A | exame8_17.jpg. A resposta B do APK está correcta em conteúdo; a pergunta foi adaptada para avaliar a entrada quando a rotunda está livre, sem repetir a pergunta 5, e a alternativa correcta foi reposicionada em A. |
| 18 | Via de sentido único | Regulamento de Sinais, quadro VII — G86 | A | C | exame8_18.jpg. Chave do APK corrigida: o sinal quadrado de informação indica via de sentido único, não obrigação de seguir em frente. |
| 19 | Visibilidade reduzida ou insuficiente | Art. 28 | A | B | exame8_19.jpg. Reformulada como situação prática com visibilidade de 40 metros; evita repetir literalmente a definição do Exame 1, pergunta 9. |
| 20 | Distância de segurança e imobilização | Art. 20, n.º 1 | B | D | exame8_20.jpg. Chave mantida em conteúdo; posição alterada para D. |
| 21 | Inversão do sentido de marcha | Art. 47, n.os 1 e 2 | A | A | exame8_21.jpg. Aplicada a uma rua movimentada, com pouca visibilidade e espaço limitado; evita repetir a pergunta do Exame 1 sobre inversão em auto-estrada. |
| 22 | Fim da fila de trânsito à esquerda | Regulamento de Sinais — sinal de perigo D57 | C | C | exame8_22.jpg. Chave mantida; sinal triangular de aviso de fim da fila à esquerda. |
| 23 | Trânsito proibido a veículos que transportam substâncias perigosas | Regulamento de Sinais, quadro V — E36 | C | B | exame8_23.jpg. Chave mantida em conteúdo; posição alterada para B. |
| 24 | Sinalização luminosa em manutenção | Regulamento de Sinais, quadro II — A62/A63 | A | D | exame8_24.jpg. Chave mantida em conteúdo; posição alterada para D. |
| 25 | Fumo excessivo em motor Diesel | Manutenção mecânica geral — sistema de injecção/combustão | A | A | exame8_25.jpg. Chave mantida; explicação orienta para verificação técnica, sem atribuir uma causa única. |

## Notas sobre as chaves do APK

- As colunas «Resposta APK» e «Resposta ESTRADA» registam separadamente a chave recuperada e a resposta validada/adaptada.
- A posição das alternativas no ESTRADA foi reorganizada para obter uma distribuição equilibrada e não previsível. A letra final não tem de coincidir com a letra original.
- Na pergunta 8, a designação INATTER do APK foi actualizada para INATRO, nome da entidade actualmente responsável.
- Na pergunta 18, a chave A do APK foi rejeitada: a imagem representa uma via de sentido único, não uma obrigação de seguir em frente.
- Na pergunta 17, a chave B do APK foi mantida em conteúdo: a pergunta foi reformulada para avaliar quando a entrada da rotunda está livre e não exige paragem desnecessária.
