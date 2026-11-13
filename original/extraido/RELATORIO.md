# Relatório de extracção

- APK: `Codigo_e_Sinais_de_Transito_1_1.apk` (sha256 `95d90835006bb68c…`)
- Extractor: `tools/extrair_apk.py v1.0`
- Classe: `Lcom/app/codigoesinaisdetransito/BaseDadosExame;`, método `<init>`: 17289 instruções interpretadas
- Instruções não interpretadas: nenhuma
- Entradas no APK: 750 perguntas em 30 exames
- Âmbito da tarefa: exames 1 a 10; publicados até agora: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] (completo: True)

## Resultado por exame

| Exame | Perguntas | Alternativas vazias | Imagens ligadas | Imagens prováveis em branco | Avisos |
|---|---|---|---|---|---|
| 1 | 25 | 16 | 25 | 0 | {'enunciado_repetido_no_exame': 5, 'enunciado_igual_ao_da_pergunta_anterior': 1} |
| 2 | 25 | 11 | 25 | 0 | {'enunciado_repetido_no_exame': 3} |
| 3 | 25 | 13 | 25 | 0 | {'enunciado_repetido_no_exame': 7, 'enunciado_igual_ao_da_pergunta_anterior': 1} |
| 4 | 25 | 7 | 25 | 0 | — |
| 5 | 25 | 14 | 25 | 0 | {'enunciado_repetido_no_exame': 4} |
| 6 | 25 | 14 | 25 | 0 | {'enunciado_repetido_no_exame': 4} |
| 7 | 25 | 5 | 25 | 0 | {'enunciado_repetido_no_exame': 4} |
| 8 | 25 | 12 | 25 | 0 | {'enunciado_repetido_no_exame': 5} |
| 9 | 25 | 11 | 25 | 0 | {'enunciado_repetido_no_exame': 2} |
| 10 | 25 | 12 | 25 | 0 | {'enunciado_repetido_no_exame': 6, 'enunciado_igual_ao_da_pergunta_anterior': 1} |

## O que não foi recuperado

- **Explicações:** o APK não as contém. O campo `explicacao` fica `null` em todas as perguntas.
- **Tema ou matéria:** o APK não o contém. O campo `tema` fica `null`.
- **Imagens não encontradas:** 0.

## O que fica por validar

- A resposta certa de cada pergunta é a que o APK indica. Não foi confrontada com o Código da Estrada de Moçambique.
- Os avisos (`avisos`) são detecções automáticas objectivas (alternativa vazia, enunciado repetido, imagem quase branca); não substituem a revisão humana.

## Como a imagem foi associada à pergunta

O código do APK guarda cinco arrays com o mesmo índice (`img`, `pergunta`, `opcoes`, `respostaCorrecta`, `exame`). A imagem de uma pergunta é a entrada `img[i]` do mesmo `i` que `pergunta[i]`. Não houve associação por semelhança. O identificador numérico do recurso é convertido no nome do ficheiro (`drawable/exame1_1`) pela tabela de recursos do APK.
