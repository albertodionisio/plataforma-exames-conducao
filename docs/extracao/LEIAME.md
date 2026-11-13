# Extracção do banco de perguntas do APK original

Tarefa DADOS-054. Recupera, do APK `original/Codigo_e_Sinais_de_Transito_1_1.apk`, as perguntas dos exames originais **1 a 10**, tal como estão na app, sem as alterar nem adaptar.

## Onde estão os dados no APK
Não há ficheiros de texto nem base de dados. As perguntas estão no código compilado: a classe `Lcom/app/codigoesinaisdetransito/BaseDadosExame;`, método `<init>` (17 289 instruções), constrói cinco arrays com o **mesmo índice** `i` (0 a 749):

| Campo | Conteúdo |
|---|---|
| `exame[i]` | identificador do exame (`exame1` … `exame30`) |
| `pergunta[i]` | enunciado |
| `opcoes[i]` | quatro alternativas (A a D); a D pode estar vazia |
| `respostaCorrecta[i]` | letra da resposta certa |
| `img[i]` | identificador numérico do recurso de imagem (`drawable/exameN_M`) |

O extractor interpreta essas instruções (`const`, `const-string` e `const-string/jumbo`, `new-array`, `aput-object`, `Integer.valueOf`, `iput-object`), sem executar a app. Não há instruções por interpretar.

## Como voltar a executar
```
pip install androguard pillow
python3 tools/extrair_apk.py --exames 1-10          # por omissão
python3 -m unittest tests/test_exames_originais.py -v
```
A saída vai para `original/extraido/`. Voltar a executar gera exactamente os mesmos ficheiros (o teste de reproducibilidade confirma-o).

## O que é gerado (`original/extraido/`)
- `exameN.json`: as 25 perguntas do exame N, pela ordem original.
- `imagens/exameN/exameN_M.jpg`: a imagem de cada pergunta, tal como está no APK.
- `mapeamento.json` e `mapeamento.csv`: de cada pergunta para a sua posição nos arrays, o recurso e o ficheiro de imagem.
- `nao-recuperado.json`: o que não foi recuperado.
- `RELATORIO.md`: contagens por exame, avisos e limitações.
- `ESTADO.json`: exames publicados e se o âmbito (1 a 10) está completo.

## Campos de cada pergunta
`numero` (1 a 25), `indice_global`, `enunciado`, `alternativas` (4 posições A a D, `""` se vazia), `resposta_correcta` e `resposta_correcta_indice`, `imagem` (`recurso_id`, `recurso`, `ficheiro`, `sha256`, dimensões, `provavel_em_branco`), `explicacao` (`null`), `tema` (`null`), `estado`, `avisos`, `origem`.

## Regras seguidas
- A imagem de cada pergunta é a do **mesmo índice** `i` (`img[i]` com `pergunta[i]`). Nunca por semelhança.
- Nada foi inventado: o APK **não tem explicações nem tema**, por isso esses campos ficam `null` e estão registados em `nao-recuperado.json`.
- A resposta certa é a que o APK indica. **A validade legal fica por validar** com o Código da Estrada de Moçambique.
- Os `avisos` são detecções automáticas (alternativa vazia, enunciado repetido, enunciado igual ao da pergunta anterior, imagem quase branca). Alertam, não corrigem.

## Cuidado: enunciados genéricos repetidos
Muitas perguntas sobre sinais usam o mesmo enunciado («O que indica o sinal da imagem?», «O sinal indica:»). Isso está assim no APK. A diferença está na imagem e nas alternativas, por isso a imagem faz parte da pergunta.

## Correcção a uma leitura preliminar
Uma leitura preliminar do APK, feita antes deste extractor, não reconhecia as strings `const-string/jumbo` e repetia o valor anterior em 8 perguntas: exame 1 (pergunta 4), exame 2 (13), exame 4 (5 e 7), exame 8 (3 e 18) e exame 9 (5, 9 e 25). Este extractor corrige isso. Quem tenha usado a leitura preliminar deve voltar a conferir essas perguntas com `original/extraido/`.

## Âmbito
Só os exames 1 a 10. Os exames 11 a 30 ficam para um bloco seguinte: `python3 tools/extrair_apk.py --exames 11-20` (e alargar `AMBITO_DA_TAREFA` no extractor e nos testes).
