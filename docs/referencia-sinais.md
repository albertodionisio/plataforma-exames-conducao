# Catálogo de referência dos sinais — ESTRADA

- **Tarefa:** GER-006 · **Sessão:** Claude-GER006 · **Data:** 2026-11-12
- **Âmbito:** os sinais que já aparecem como imagem nas perguntas do ESTRADA (Simulado 1, `data/exames/exame1.js`), conferidos com o PDF oficial de sinais.
- **Natureza:** documento de referência. Não altera imagens, perguntas nem código.

## 1. Fontes e método

| Fonte | Caminho | Uso |
|---|---|---|
| PDF oficial de sinais (69 páginas) | `assets/sinais.pdf`, dentro de `original/Codigo_e_Sinais_de_Transito_1_1.apk` | Código, designação e página de cada sinal |
| Imagens das perguntas do APK | `res/drawable/exame1_N.jpg`, dentro do mesmo APK | Comparação com o que o aplicativo original mostra |
| Imagens do ESTRADA | `public/sinais/` | Imagem usada nos simulados |
| Perguntas do ESTRADA | `data/exames/exame1.js` | Onde cada imagem é usada |

- O PDF **não tem texto extraível** (os códigos e designações estão desenhados). Cada código e designação foi **lido visualmente** numa página renderizada a 130 dpi. Uma só sessão fez a leitura; não houve segunda leitura independente.
- As páginas indicadas são as **páginas físicas do PDF** (1 a 69), não uma numeração impressa.
- O «quadro» de cada sinal é o da última página com título de quadro (por exemplo, as págs. 55 e 56 continuam o Quadro XIII, cujo título está na pág. 53).
- As designações estão copiadas **tal como no PDF**, incluindo a grafia («direcção», «Pré-advertência»). Nenhuma foi trocada por sinónimo.
- A comparação das imagens foi **visual** (forma, símbolos, texto e cores). Não foram feitas medições de proporção nem de cor.
- Nada do APK foi copiado para o repositório.

**Estados usados**

| Estado | Significado |
|---|---|
| CONFIRMADO | Código, designação e imagem conferem com o PDF. |
| CONFIRMADO COM NOTA | Confere, mas há um pormenor a registar (secção 4). |
| DIVERGENTE | Há uma diferença entre PDF, imagem ou texto da pergunta (secção 4). |

## 2. Catálogo dos sinais usados no ESTRADA

| Código | Designação (como no PDF) | Pág. PDF | Quadro no PDF | Imagem no ESTRADA | Pergunta (Simulado 1) | Estado |
|---|---|---|---|---|---|---|
| A17 | Controlo policial por pirilampos | 4 | II — Sinais temporários, Perigo (título na pág. 3) | `public/sinais/A17-controlo-policial-por-pirilampos.svg` (existe também `.png` no mesmo nome) | 1 | CONFIRMADO COM NOTA (D4) |
| D16 | Ponte móvel | 21 | IV — Sinais de perigo | `public/sinais/D16-ponte-movel.png` | 16 | CONFIRMADO |
| E1 | Trânsito proibido | 26 | V — Sinais de prescrição absoluta, Sinais de proibição | `public/sinais/E1-transito-proibido.png` | 10 | CONFIRMADO |
| E47 | Trânsito proibido a peões, animais e veículos não automóveis | 28 | V — Sinais de prescrição absoluta, Sinais de proibição | `public/sinais/E47-transito-proibido-peoes-animais-veiculos-nao-automoveis.png` | 21 | CONFIRMADO |
| G11 | Área reservada para automóveis ligeiros | 35 | VII — Sinais de indicação, Sinais de informação | `public/sinais/G11-area-reservada-automoveis-ligeiros.png` | 4 | CONFIRMADO COM NOTA (D3) |
| H4 | Pré-advertência da direcção de saída | 41 | VIII — Sinais de simples indicação (título na pág. 40); a pág. 41 tem o subtítulo «Sinais de direcção» | `public/sinais/H4-pre-advertencia-direccao-de-saida.png` | 17 | CONFIRMADO COM NOTA (D5) |
| N34 | Via com portagem a....m | 56 | XIII — Sinais combinados | `public/sinais/N34-via-com-portagem.png` | 25 | DIVERGENTE (D2) |
| N5 (nome do ficheiro) | Paragem proibida a veículos que transportam substâncias perigosas | 55 (como **N21**) e 57 (como **N’5**) | XIII — Sinais combinados (pág. 55); «Sinais com painéis adicionais» (pág. 57) | `public/sinais/N5-paragem-proibida-substancias-perigosas.png` | 14 | DIVERGENTE (D1) |

Notas de leitura: em N34 os pontos de «a....m» são como estão impressos no PDF; o valor «400 m» no painel inferior é o exemplo desenhado. Na linha do N5, a coluna «Código» repete o nome do ficheiro, que não é o código que o PDF atribui a este sinal na pág. 55.

### Perguntas do Simulado 1 que usam estes sinais

| Pergunta | Tema (no exame) | Sinal | Resposta certa (no exame) |
|---|---|---|---|
| 1 | Sinais de perigo | A17 | Operação de controlo policial com luzes intermitentes |
| 4 | Sinais de informação | G11 | Área reservada para automóveis ligeiros |
| 10 | Sinais de proibição | E1 | Trânsito proibido |
| 14 | Sinais de proibição | N5 / N21 (ver D1) | Paragem proibida a veículos que transportam substâncias perigosas |
| 16 | Sinais de perigo | D16 | A presença de uma ponte móvel |
| 17 | Sinais de informação | H4 | Pré-aviso da direção de saída |
| 21 | Sinais de proibição | E47 | Trânsito proibido a peões, animais e veículos não automóveis |
| 25 | Sinais de informação | N34 | A existência de portagem na via em que segue |

Só o Simulado 1 tinha imagens de sinais à data desta leitura (2026-11-12; `data/exames/` continha apenas `exame1.js`). Quando outros simulados forem publicados, este catálogo deve ganhar uma linha por sinal novo.

## 3. O que foi conferido em cada sinal

| Código | PDF (alta resolução) | Imagem do APK (`exame1_N.jpg`) | Imagem do ESTRADA |
|---|---|---|---|
| A17 | Triângulo de borda vermelha, interior amarelo, círculo azul com anel branco | Triângulo com interior alaranjado e círculo azul | SVG igual ao PDF (interior amarelo) |
| D16 | Triângulo com ponte que se levanta sobre água ondulada | Igual | Igual |
| E1 | Círculo de borda vermelha, vazio | Igual | Igual |
| E47 | Círculo cortado por X com peão, ciclomotor, vaca e carroça | Igual | Igual |
| G11 | Painel azul com automóvel e a letra R | Fotografia de rua com o painel R ao fundo | Painel isolado igual ao PDF |
| H4 | Painel azul com N2, N4, seta de saída e «2 Km», letras brancas | Igual, mas com N2 e N4 a amarelo | Igual ao PDF (letras brancas) |
| N34 | Placa com círculo azul e «T»; painel «400 m» | Fotografia de estrada com a placa «300 m» | Igual ao PDF («400 m») |
| N5 / N21 | Círculo vermelho com «S» cortado; painel com camião de substâncias perigosas | Igual (sinal combinado) | Igual |

## 4. Divergências e pontos por confirmar

**Seguimento (2026-11-12):** D2 está a ser corrigido por DADOS-052 (em curso; reservou `exame1.js` e a imagem do N34). D1 e D3 passam a ser a tarefa DADOS-053 (LIVRE), a começar só depois de DADOS-052 estar concluída, porque ambas editam `exame1.js`. Esta secção descreve o estado à data da leitura e deve ser actualizada quando as correcções forem aplicadas.

**D1 — N5: o PDF usa o mesmo código para sinais diferentes e atribui outros códigos a este sinal.**
- Pág. 53 (Quadro XIII): **N5** = «Travessia de peões» (triângulo com painel «PESSOAS IDOSAS»).
- Pág. 55 (Quadro XIII): **N21** = «Paragem proibida a veículos que transportam substâncias perigosas».
- Pág. 57 («Sinais com painéis adicionais»): **N’5** (com apóstrofo, como impresso) = «Paragem proibida a veículos que transportam substâncias perigosas». Nesta página os códigos são N’1 a N’6.
- O sinal desenhado em `public/sinais/N5-paragem-proibida-substancias-perigosas.png` é o da paragem proibida com substâncias perigosas. Está certo quanto à designação e à imagem, mas o código «N5» do nome do ficheiro **coincide com o código de outro sinal** (pág. 53). O código impresso mais próximo é N’5 (pág. 57); o da pág. 55 é N21.
- **Não escolhi** um código. Decisão pendente do dono: manter o ficheiro, ou renomear e actualizar a referência em `exame1.js` (pergunta 14). Esta tarefa não altera nenhum dos dois.

**D2 — N34 (pergunta 25): a imagem não coincide com o texto da pergunta.**
- PDF (pág. 56): designação «Via com portagem a....m»; o exemplo desenhado tem o painel «400 m».
- Imagem do ESTRADA: «400 m» (igual ao PDF).
- Imagem do APK: fotografia com «300 m».
- Texto do ESTRADA: a explicação e uma alternativa falam em 300 m.
- Já registado em `docs/auditorias/simulado-1.md` (secção 5.1). Não corrigi; a decisão (redesenhar com 300 m ou ajustar o texto) é do dono.

**D3 — G11 (pergunta 4): descrição da imagem.** O campo `imagem.descricao` fala de «fila de carros estacionados», que é a fotografia do APK. O ficheiro do ESTRADA mostra só o painel isolado. A imagem está correcta; a descrição não corresponde ao ficheiro. Não alterei `exame1.js`.

**D4 — A17 (pergunta 1): cor.** O PDF tem interior amarelo; a imagem do APK é mais alaranjada. O SVG do ESTRADA segue o PDF. Além disso, o A17 está no Quadro II (sinais **temporários**), embora a pergunta o apresente como «Sinal de perigo». Não identifiquei um sinal equivalente nas páginas de perigo permanentes (21 a 24); não está provado que não exista, e a verificação foi feita em páginas reduzidas.

**D5 — H4 (pergunta 17): duas designações.** O PDF diz «Pré-advertência da direcção de saída»; a pergunta e a resposta do ESTRADA usam «Pré-aviso da direção de saída» (o original do APK usa «Pré-aviso», segundo a auditoria do Simulado 1). Documento as duas; não escolho. O nome do ficheiro («pre-advertencia-direccao-de-saida») segue o PDF, sem o «da».

## 5. Índice dos quadros do PDF

Página onde começa cada quadro. Estes títulos foram lidos nas páginas reduzidas; apenas as 10 páginas do catálogo (4, 21, 26, 28, 35, 41, 53, 55, 56, 57) foram confirmadas em alta resolução.

| Pág. | Quadro / secção |
|---|---|
| 1 | I — Sinais dos agentes reguladores do trânsito |
| 3 | II — Sinais temporários (perigo; proibição, obrigação e informação nas págs. seguintes) |
| 19 | Sinais de informação variável |
| 20 | III — Sinais luminosos |
| 21 | IV — Sinais de perigo (complementares na pág. 25) |
| 26 | V — Sinais de prescrição absoluta (proibição) |
| 31 | VI — Sinais de obrigação |
| 35 | VII — Sinais de indicação (informação) |
| 40 | VIII — Sinais de simples indicação (pré-sinalização e direcção) |
| 46 | IX — Sinais de identificação de localidades e estradas |
| 47 | X — Sinais de interesse turístico |
| 51 | XI — Sinais de afectação de vias |
| 52 | XII — Sinais de cedência de passagem |
| 53 | XIII — Sinais combinados |
| 57 | Sinais com painéis adicionais |
| 58 | XIV — Sinais marcados no pavimento |
| 60 | XV — Marcas transversais |
| 63 | XVI — Marcas reguladoras do estacionamento e paragem |
| 69 | XVII — Sinais dos condutores |

## 6. O que não foi verificado

- Sinais que o ESTRADA ainda não usa em imagens: não foram catalogados.
- Perguntas do Simulado 1 sem imagem de sinal que mencionem sinais só no texto: fora do âmbito.
- O conteúdo legal das designações não foi cruzado com `assets/codigodeestrada.pdf`.
- Cores e proporções exactas das imagens: comparação visual, sem medição.
- A distinção entre N’5 (com apóstrofo) e N5 (sem apóstrofo) baseia-se no que se vê impresso; convém o dono confirmar se o apóstrofo é intencional no documento oficial.
