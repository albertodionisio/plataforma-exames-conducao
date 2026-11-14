# Exame 5 — mapa de rastreabilidade (DADOS-006)

Exame de origem: Exame 5 do aplicativo original (`original/Codigo_e_Sinais_de_Transito_1_1.apk`, classe `BaseDadosExame`). As 25 perguntas do ESTRADA seguem a mesma ordem das 25 do APK, com adaptação leve: enunciado completo sem depender de imagem sempre que possível, quatro alternativas e explicação.

## Resumo

| Ponto | Resultado |
|---|---|
| Perguntas | 25, na ordem do APK |
| Resposta correcta mantida | 25 de 25 (a letra mudou onde se reordenaram as alternativas) |
| Perguntas do APK com só 3 alternativas | 14 (foi acrescentada uma 4.ª alternativa errada em cada uma) |
| Distribuição das respostas correctas (A / B / C / D) | 6 / 6 / 7 / 6 |
| Perguntas com imagem no ESTRADA | 11: 2, 3, 8, 9, 12, 14, 19, 20, 21, 24, 25 |
| Imagens de sinais | 8, extraídas do `sinais.pdf` (A54, D79, E12, E25, E52, G62, J12, M3) |
| Fotografias copiadas do APK | 3 (perguntas 8, 20 e 21), as que são necessárias para responder |
| Validação automática | `node scripts/validar-exames.js`: 0 problemas |
| Perguntas repetidas noutros exames do repositório | nenhuma (comparação com os exames publicados à data) |

## Fontes

- Perguntas, alternativas, resposta certa e ficheiro de imagem: bytecode do APK (`classes.dex`, classe `BaseDadosExame`). A pergunta N do Exame 5 liga à imagem `res/drawable/exame5_N.jpg` pelo mesmo índice.
- Sinais: `assets/sinais.pdf` do APK (código, designação e página lidos visualmente; o PDF não tem texto extraível). Ver também `docs/referencia-sinais.md`.
- Regras legais: `assets/codigodeestrada.pdf` do APK (Código da Estrada de Moçambique). Foram lidos os artigos indicados em cada pergunta. Não se fez validação jurídica consolidada nem se confirmaram alterações posteriores ao texto do APK.

## Mapa das 25 perguntas

### Pergunta 1 — Manutenção do veículo

- **APK:** «Com que frequência deve verificar o condutor a pressão dos pneus do seu veículo?» (exame5, pergunta 1).
- **Imagem no APK:** Fotografia: pessoa a verificar a pressão de um pneu (exame5_1.jpg).
- **Imagem no ESTRADA:** Não usada: ilustrativa, a pergunta responde-se sem ela.
- **Resposta certa no APK:** B) Duas vezes por mês, quando os pneu estão frios.
- **Resposta certa no ESTRADA:** C) Duas vezes por mês, com os pneus frios.
- **Alternativas:** as 4 do APK, com adaptação leve.
- **Base:** Não consta do Código. Recomendação técnica do original (verificação periódica, com os pneus frios).

### Pergunta 2 — Sinais de indicação

- **APK:** «O que indica o sinal?» (exame5, pergunta 2).
- **Imagem no APK:** Sinal J12 «Cascata» (exame5_2.jpg).
- **Imagem no ESTRADA:** public/sinais/J12-cascata.png (PDF, pág. 47, Quadro X)
- **Resposta certa no APK:** B) .Cascata
- **Resposta certa no ESTRADA:** A) Cascata.
- **Alternativas:** as 3 do APK, com adaptação leve, e uma 4.ª acrescentada (ver nota).
- **Base:** Sinal J12 do `sinais.pdf`: «Cascata».
- **Nota:** No APK a alternativa certa vem com um ponto inicial («.Cascata»), gralha corrigida. 4.ª alternativa acrescentada: «Praia» (J5).

### Pergunta 3 — Sinais de perigo

- **APK:** «O que indica o sinal de perigo?» (exame5, pergunta 3).
- **Imagem no APK:** Fotografia: sinal de passagem de nível com dois X e painel luminoso, ao fundo (exame5_3.jpg).
- **Imagem no ESTRADA:** public/sinais/D79-local-passagem-nivel-sem-guarda-duas-ou-mais-vias.png (PDF, pág. 24, Quadro IV)
- **Resposta certa no APK:** B) Passagem de nível sem guarda com duas ou mais vias.
- **Resposta certa no ESTRADA:** D) Local de passagem de nível sem guarda com duas ou mais vias.
- **Alternativas:** as 3 do APK, com adaptação leve, e uma 4.ª acrescentada (ver nota).
- **Base:** Sinal D79 do `sinais.pdf`: «Local de passagem de nível sem guarda com duas ou mais vias».
- **Nota:** A fotografia mostra o sinal D79 por baixo de um painel luminoso. Como no Exame 1 (pergunta 4), o sinal foi extraído do PDF. A alternativa certa usa a designação oficial do PDF (no APK: «Passagem de nível sem guarda com duas ou mais vias»). 4.ª alternativa acrescentada: «Aproximação de passagem de nível».

### Pergunta 4 — Iluminação

- **APK:** «Quando se devem utilizar as luzes de estrada?» (exame5, pergunta 4).
- **Imagem no APK:** Fotografia: painel de instrumentos com o indicador azul de luzes de estrada (exame5_4.jpg).
- **Imagem no ESTRADA:** Não usada: ilustrativa.
- **Resposta certa no APK:** A) Quando a iluminação não permite uma boa visibilidade e não cause encandeamento aos outros utentes.
- **Resposta certa no ESTRADA:** B) Quando a iluminação não permite uma boa visibilidade e não causam encandeamento aos outros utentes.
- **Alternativas:** as 4 do APK, com adaptação leve.
- **Base:** Código da Estrada, arts. 60.º e 61.º (luzes e condições de utilização).
- **Também no APK:** a mesma pergunta e resposta aparecem no exame 28 do APK. Quem fizer esse exame deve evitar repeti-la.

### Pergunta 5 — Velocidade e travagem

- **APK:** «Salvo no caso de perigo iminente, que deve fazer o condutor se tem que diminuir subitamente a velocidade do veículo?» (exame5, pergunta 5).
- **Imagem no APK:** Fotografia: estrada com camiões parados à esquerda (exame5_5.jpg).
- **Imagem no ESTRADA:** Não usada: ilustrativa.
- **Resposta certa no APK:** C) Certificar-se que não resulta perigoso, nomeadamente para os condutores dos veículos que o sigam.
- **Resposta certa no ESTRADA:** D) Certificar-se de que daí não resulta perigo para os outros utentes, nomeadamente para os condutores que o seguem.
- **Alternativas:** as 4 do APK, com adaptação leve.
- **Base:** Código da Estrada, art. 29.º, n.º 2.
- **Também no APK:** a mesma pergunta e resposta aparecem no exame 28 do APK. Quem fizer esse exame deve evitar repeti-la.
- **Nota:** «Salvo no caso de perigo iminente» passou a «Salvo em caso de perigo iminente» e a pergunta passou a «antes de diminuir subitamente a velocidade», para ficar completa sem a imagem.

### Pergunta 6 — Deveres do condutor

- **APK:** «O que entende-se por dever?» (exame5, pergunta 6).
- **Imagem no APK:** Fotografia: pessoas junto a camiões e semáforo (exame5_6.jpg).
- **Imagem no ESTRADA:** Não usada: ilustrativa.
- **Resposta certa no APK:** C) A obrigação moral de proceder de acordo com as normas e a consciência.
- **Resposta certa no ESTRADA:** C) A obrigação moral de proceder de acordo com as normas e a consciência.
- **Alternativas:** as 3 do APK, com adaptação leve, e uma 4.ª acrescentada (ver nota).
- **Base:** Não consta do Código. Definição moral do original.
- **Também no APK:** a mesma pergunta e resposta aparecem nos exames 21, 28 do APK. Quem fizer esses exames deve evitar repeti-la.
- **Nota:** 4.ª alternativa acrescentada.

### Pergunta 7 — Primeiros socorros

- **APK:** «Para auxiliar uma vítima de um acidente rodoviário, deve dar-lhe alimentos ou bebidas?» (exame5, pergunta 7).
- **Imagem no APK:** Fotografia: pessoa a prestar socorro a uma vítima deitada (exame5_7.jpg).
- **Imagem no ESTRADA:** Não usada: ilustrativa.
- **Resposta certa no APK:** C) Não.
- **Resposta certa no ESTRADA:** A) Não, não se deve dar nada de comer nem de beber à vítima.
- **Alternativas:** as 4 do APK, com adaptação leve.
- **Base:** Não consta do Código. Regra geral de primeiros socorros do original.
- **Também no APK:** a mesma pergunta e resposta aparecem no exame 28 do APK. Quem fizer esse exame deve evitar repeti-la.
- **Nota:** Não se deve dar comida ou bebida a um sinistrado. A alternativa certa foi reescrita para dizer o que fazer («Não, não se deve dar nada...»).

### Pergunta 8 — Marcas rodoviárias

- **APK:** «A que grupo pertence a marca rodoviária branca?» (exame5, pergunta 8).
- **Imagem no APK:** Fotografia: estrada com linha amarela à esquerda e linhas brancas ao longo da faixa (exame5_8.jpg).
- **Imagem no ESTRADA:** public/cenas/exame5-pergunta-08-marca-rodoviaria-branca.jpg (cópia da fotografia do APK)
- **Resposta certa no APK:** A) Marcas longitudinais.
- **Resposta certa no ESTRADA:** C) Marcas longitudinais.
- **Alternativas:** as 3 do APK, com adaptação leve, e uma 4.ª acrescentada (ver nota).
- **Base:** `sinais.pdf`, Quadro XIV (marcas longitudinais, pág. 58) e Quadro XVI (marcas reguladoras do estacionamento e paragem, pág. 63).
- **Também no APK:** a mesma pergunta e resposta aparecem no exame 28 do APK. Quem fizer esse exame deve evitar repeti-la.
- **Nota:** A imagem é necessária: a pergunta pede para identificar a marca que se vê. 4.ª alternativa acrescentada: «Marcas reguladoras do estacionamento e paragem».

### Pergunta 9 — Sinais de proibição

- **APK:** «O que deve fazer o condutor perante o sinal?» (exame5, pergunta 9).
- **Imagem no APK:** Fotografia: sinal circular com «80» à beira da estrada (exame5_9.jpg).
- **Imagem no ESTRADA:** public/sinais/E12-proibicao-exceder-velocidade.png (PDF, pág. 26, Quadro V)
- **Resposta certa no APK:** C) Circular a uma velocidade que vá até os 80 km/h.
- **Resposta certa no ESTRADA:** B) Circular a uma velocidade que vá até aos 80 km/h.
- **Alternativas:** as 3 do APK, com adaptação leve, e uma 4.ª acrescentada (ver nota).
- **Base:** Sinal E12 do `sinais.pdf`: «Proibição de exceder a velocidade de....Km/h».
- **Nota:** O sinal da fotografia é pequeno e distante. Como no Exame 1 (pergunta 4), usou-se o sinal do PDF. 4.ª alternativa acrescentada: velocidade mínima de 80 km/h (sinal F1).

### Pergunta 10 — Segurança do condutor

- **APK:** «Num automóvel, é obrigatório a utilização de cintos de segurança:» (exame5, pergunta 10).
- **Imagem no APK:** Fotografia: pessoa a colocar o cinto de segurança (exame5_10.jpg).
- **Imagem no ESTRADA:** Não usada: ilustrativa.
- **Resposta certa no APK:** C) Dentro e fora das localidades.
- **Resposta certa no ESTRADA:** A) Dentro e fora das localidades.
- **Alternativas:** as 3 do APK, com adaptação leve, e uma 4.ª acrescentada (ver nota).
- **Base:** Código da Estrada, art. 87.º, n.º 1 (uso do cinto) e art. 146.º (contravenção média).
- **Também no APK:** a mesma pergunta e resposta aparecem no exame 28 do APK. Quem fizer esse exame deve evitar repeti-la.
- **Nota:** 4.ª alternativa acrescentada: «Apenas nas auto-estradas».

### Pergunta 11 — Prioridade

- **APK:** «Entende-se por prioridade de passagem:» (exame5, pergunta 11).
- **Imagem no APK:** Fotografia: cruzamento de ruas com veículos (exame5_11.jpg).
- **Imagem no ESTRADA:** Não usada: ilustrativa.
- **Resposta certa no APK:** B) O direito que o condutor tem de passar em primeiro lugar.
- **Resposta certa no ESTRADA:** D) O direito que o condutor tem de passar em primeiro lugar.
- **Alternativas:** as 3 do APK, com adaptação leve, e uma 4.ª acrescentada (ver nota).
- **Base:** Código da Estrada, art. 38.º, n.º 1.
- **Também no APK:** a mesma pergunta e resposta aparecem no exame 28 do APK. Quem fizer esse exame deve evitar repeti-la.
- **Nota:** 4.ª alternativa acrescentada: obrigação de ceder a quem vem da direita (regra de quem tem prioridade, não definição).

### Pergunta 12 — Sinais de indicação

- **APK:** «O que indica o sinal?» (exame5, pergunta 12).
- **Imagem no APK:** Fotografia: sinal azul com «R» e símbolo, à frente de um edifício (exame5_12.jpg).
- **Imagem no ESTRADA:** public/sinais/G62-area-reservada-veiculos-emergencia.png (PDF, pág. 37, Quadro VII)
- **Resposta certa no APK:** B) Área reservada para veículos de emergência.
- **Resposta certa no ESTRADA:** B) Área reservada para veículos de emergência.
- **Alternativas:** as 3 do APK, com adaptação leve, e uma 4.ª acrescentada (ver nota).
- **Base:** Sinal G62 do `sinais.pdf`: «Área reservada para veículos de emergência».
- **Nota:** Sinal da fotografia identificado pelo símbolo «A» no círculo vermelho. 4.ª alternativa acrescentada: «Área reservada para táxis» (G13).

### Pergunta 13 — Contravenções

- **APK:** «Utilizar o veículo para em via pública, demonstrar ou exibir manobra de arranque brusco, derrapagem ou travagem com deslizamento de pneus, constitui contravenção:» (exame5, pergunta 13).
- **Imagem no APK:** Fotografia: pneu de um carro junto à estrada, com uma marca no pavimento (exame5_13.jpg).
- **Imagem no ESTRADA:** Não usada: ilustrativa.
- **Resposta certa no APK:** C) Grave.
- **Resposta certa no ESTRADA:** C) Grave.
- **Alternativas:** as 3 do APK, com adaptação leve, e uma 4.ª acrescentada (ver nota).
- **Base:** Código da Estrada, art. 147.º, n.º 1, alínea c (contravenção grave).
- **Também no APK:** a mesma pergunta e resposta aparecem nos exames 8, 30 do APK. Quem fizer esses exames deve evitar repeti-la.
- **Nota:** 4.ª alternativa acrescentada.

### Pergunta 14 — Sinais de proibição

- **APK:** «O que indica o sinal circular?» (exame5, pergunta 14).
- **Imagem no APK:** Fotografia: sinal circular com «S» riscado ao lado de um muro (exame5_14.jpg).
- **Imagem no ESTRADA:** public/sinais/E52-paragem-proibida.png (PDF, pág. 29, Quadro V)
- **Resposta certa no APK:** B) Paragem proibida.
- **Resposta certa no ESTRADA:** D) Paragem proibida.
- **Alternativas:** as 3 do APK, com adaptação leve, e uma 4.ª acrescentada (ver nota).
- **Base:** Sinal E52 do `sinais.pdf`: «Paragem proibida».
- **Nota:** Alternativas ajustadas às designações do PDF: «Fim de paragem e estacionamento proibido» (E59). 4.ª alternativa acrescentada: «Paragem e estacionamento proibidos» (E51).

### Pergunta 15 — Fadiga e condução

- **APK:** «Nos dias quentes, é recomendável...» (exame5, pergunta 15).
- **Imagem no APK:** Fotografia: estrada em curva com linha central (exame5_15.jpg).
- **Imagem no ESTRADA:** Não usada: ilustrativa.
- **Resposta certa no APK:** B) Efectuar mais descansos durante uma viagem, porque a fadiga e o sono aparecem mais facilmente.
- **Resposta certa no ESTRADA:** A) Fazer mais pausas, porque o calor aumenta a fadiga e o sono.
- **Alternativas:** as 4 do APK, com adaptação leve.
- **Base:** Não consta do Código. Recomendação do original sobre fadiga e calor.
- **Também no APK:** a mesma pergunta e resposta aparecem nos exames 16, 28 do APK. Quem fizer esses exames deve evitar repeti-la.
- **Nota:** A alternativa certa foi encurtada para não ser sempre a mais longa.

### Pergunta 16 — Ultrapassagem

- **APK:** «Pode ultrapassar veículos que estejam a ultrapassar outros?» (exame5, pergunta 16).
- **Imagem no APK:** Fotografia: estrada junto ao mar com carros (exame5_16.jpg).
- **Imagem no ESTRADA:** Não usada: ilustrativa.
- **Resposta certa no APK:** B) Não, a menos que não seja necessário utilizar a parte da faixa de rodagem reservada ao trânsito em sentido contrário.
- **Resposta certa no ESTRADA:** C) Não, salvo havendo duas ou mais filas no mesmo sentido e sem invadir a parte da faixa reservada ao trânsito em sentido contrário.
- **Alternativas:** as 4 do APK, com adaptação leve.
- **Base:** Código da Estrada, art. 44.º, n.os 2 e 3.
- **Também no APK:** a mesma pergunta e resposta aparecem no exame 28 do APK. Quem fizer esse exame deve evitar repeti-la.
- **Nota:** A alternativa certa do APK («Não, a menos que não seja necessário utilizar a parte da faixa reservada ao sentido contrário») foi completada com a condição do n.º 3 (duas ou mais filas no mesmo sentido).

### Pergunta 17 — Segurança rodoviária

- **APK:** «A maioria dos acidentes de trânsito são devidos...» (exame5, pergunta 17).
- **Imagem no APK:** Fotografia: camioneta vermelha danificada (exame5_17.jpg).
- **Imagem no ESTRADA:** Não usada: ilustrativa.
- **Resposta certa no APK:** A) Às pessoas.
- **Resposta certa no ESTRADA:** B) Às pessoas (factor humano).
- **Alternativas:** as 4 do APK, com adaptação leve.
- **Base:** Não consta do Código. Afirmação geral do original (factor humano).
- **Também no APK:** a mesma pergunta e resposta aparecem no exame 28 do APK. Quem fizer esse exame deve evitar repeti-la.

### Pergunta 18 — Carta de condução

- **APK:** «A carta de condução, tem tempo de validade?» (exame5, pergunta 18).
- **Imagem no APK:** Fotografia: carta de condução moçambicana (exame5_18.jpg).
- **Imagem no ESTRADA:** Não usada: ilustrativa.
- **Resposta certa no APK:** A) Sim, cinco anos para as categorias A1, A, B, C1 e C.
- **Resposta certa no ESTRADA:** D) Sim: cinco anos para as categorias A1, A, B, C1 e C.
- **Alternativas:** as 4 do APK, com adaptação leve.
- **Base:** Código da Estrada, art. 127.º, n.º 15.
- **Também no APK:** a mesma pergunta e resposta aparecem no exame 28 do APK. Quem fizer esse exame deve evitar repeti-la.
- **Nota:** Alternativas ajustadas à letra do artigo (cinco anos; dois anos para P, D e G).

### Pergunta 19 — Sinais de prescrição

- **APK:** «O que indica o sinal?» (exame5, pergunta 19).
- **Imagem no APK:** Fotografia: sinal circular com setas, junto ao mar (exame5_19.jpg).
- **Imagem no ESTRADA:** public/sinais/M3-dar-prioridade-passagens-estreitas.png (PDF, pág. 52, Quadro XII)
- **Resposta certa no APK:** C) Dar prioridade nas passagens estreitas.
- **Resposta certa no ESTRADA:** A) Dar prioridade nas passagens estreitas.
- **Alternativas:** as 3 do APK, com adaptação leve, e uma 4.ª acrescentada (ver nota).
- **Base:** Sinal M3 do `sinais.pdf`: «Dar prioridade nas passagens estreitas».
- **Nota:** Sinal da fotografia identificado: seta vermelha pequena e seta preta grande dentro de um círculo vermelho. 4.ª alternativa acrescentada: «Trânsito nos dois sentidos».

### Pergunta 20 — Regras de circulação

- **APK:** «Nesta estrada de duplo sentido de circulação, como deve circular?» (exame5, pergunta 20).
- **Imagem no APK:** Fotografia: estrada com linhas amarelas junto às bermas e sem linha central (exame5_20.jpg).
- **Imagem no ESTRADA:** public/cenas/exame5-pergunta-20-estrada-duplo-sentido.jpg (cópia da fotografia do APK)
- **Resposta certa no APK:** C) Pela esquerda e mantendo uma distância lateral suficiente para evitar acidentes.
- **Resposta certa no ESTRADA:** B) Pela esquerda, junto à berma, mantendo distância lateral suficiente para evitar acidentes.
- **Alternativas:** as 4 do APK, com adaptação leve.
- **Base:** Código da Estrada, art. 17.º, n.º 1.
- **Também no APK:** a mesma pergunta e resposta aparecem no exame 28 do APK. Quem fizer esse exame deve evitar repeti-la.
- **Nota:** A imagem é necessária: mostra a estrada sem linha ao centro.

### Pergunta 21 — Agentes reguladores do trânsito

- **APK:** «O agente regulador de trânsito, manda:» (exame5, pergunta 21).
- **Imagem no APK:** Fotografia: agente regulador de trânsito de pé numa plataforma, num cruzamento (exame5_21.jpg).
- **Imagem no ESTRADA:** public/cenas/exame5-pergunta-21-agente-regulador.jpg (cópia da fotografia do APK)
- **Resposta certa no APK:** A) Parar o tráfego que venha da retaguarda.
- **Resposta certa no ESTRADA:** C) A paragem do tráfego que venha da retaguarda.
- **Alternativas:** as 3 do APK, com adaptação leve, e uma 4.ª acrescentada (ver nota).
- **Base:** `sinais.pdf`, Quadro I (pág. 1): «Paragem do tráfego que venha da retaguarda».
- **Também no APK:** a mesma pergunta e resposta aparecem no exame 28 do APK. Quem fizer esse exame deve evitar repeti-la.
- **Nota:** A imagem é necessária: o gesto do agente é o que se pergunta. 4.ª alternativa acrescentada.

### Pergunta 22 — Factores do condutor

- **APK:** «O estado emocional do condutor, é um factor de ordem interna, que influência:» (exame5, pergunta 22).
- **Imagem no APK:** Fotografia: carro numa estrada com marcas de pista (exame5_22.jpg).
- **Imagem no ESTRADA:** Não usada: ilustrativa.
- **Resposta certa no APK:** A) O tempo de reacção e a distância de travagem.
- **Resposta certa no ESTRADA:** D) O tempo de reacção e a distância de travagem.
- **Alternativas:** as 3 do APK, com adaptação leve, e uma 4.ª acrescentada (ver nota).
- **Base:** Código da Estrada, art. 29.º, n.º 1 (estado físico e psicológico do condutor). O resto é matéria do original.
- **Também no APK:** a mesma pergunta e resposta aparecem no exame 7 do APK. Quem fizer esse exame deve evitar repeti-la.
- **Nota:** 4.ª alternativa acrescentada.

### Pergunta 23 — Passagens de nível

- **APK:** «Perante uma passagem de nível que não dispuser de protecção ou sinalização, o condutor...» (exame5, pergunta 23).
- **Imagem no APK:** Fotografia: sinal de passagem de nível com dois X e painel luminoso (exame5_23.jpg).
- **Imagem no ESTRADA:** Não usada: ilustrativa (a pergunta é sobre a regra, não sobre o sinal).
- **Resposta certa no APK:** B) Só pode iniciar a travessia depois de se certificar de que não se aproxima um veículo ferroviário.
- **Resposta certa no ESTRADA:** B) Só pode iniciar a travessia depois de se certificar de que não se aproxima nenhum veículo ferroviário.
- **Alternativas:** as 4 do APK, com adaptação leve.
- **Base:** Código da Estrada, art. 67.º, n.º 3.
- **Também no APK:** a mesma pergunta e resposta aparecem no exame 29 do APK. Quem fizer esse exame deve evitar repeti-la.

### Pergunta 24 — Sinais de perigo

- **APK:** «O que indica o sinal?» (exame5, pergunta 24).
- **Imagem no APK:** Fotografia: triângulo temporário no chão, junto a um talude (exame5_24.jpg).
- **Imagem no ESTRADA:** public/sinais/A54-acidente.png (PDF, pág. 5, Quadro II, sinais temporários)
- **Resposta certa no APK:** B) A existência de um acidente na via.
- **Resposta certa no ESTRADA:** A) A existência de um acidente na via.
- **Alternativas:** as 3 do APK, com adaptação leve, e uma 4.ª acrescentada (ver nota).
- **Base:** Sinal A54 do `sinais.pdf`: «Acidente».
- **Nota:** Sinal da fotografia identificado: triângulo amarelo com um veículo de lado. 4.ª alternativa acrescentada: «veículos de obras» (A53).

### Pergunta 25 — Sinais sonoros

- **APK:** «A utilização dos sinais sonoros é permitida:» (exame5, pergunta 25).
- **Imagem no APK:** Sinal E25 «Fim de proibição de sinais sonoros» (exame5_25.jpg).
- **Imagem no ESTRADA:** public/sinais/E25-fim-proibicao-sinais-sonoros.png (PDF, pág. 27, Quadro V)
- **Resposta certa no APK:** B) Em caso de perigo iminente.
- **Resposta certa no ESTRADA:** C) Em caso de perigo iminente.
- **Alternativas:** as 4 do APK, com adaptação leve.
- **Base:** Código da Estrada, art. 24.º, n.º 3.
- **Também no APK:** a mesma pergunta e resposta aparecem no exame 28 do APK. Quem fizer esse exame deve evitar repeti-la.
- **Nota:** A imagem do APK é o sinal E25 (fim da proibição). A pergunta é sobre a regra e não depende do sinal; manteve-se a imagem por fidelidade ao original e a descrição diz que é ilustrativa.

## Sinais usados, conferidos com o PDF

| Pergunta | Código | Designação (como no PDF) | Pág. PDF | Ficheiro |
|---|---|---|---|---|
| 2 | J12 | Cascata | 47 | `public/sinais/J12-cascata.png` |
| 3 | D79 | Local de passagem de nível sem guarda com duas ou mais vias | 24 | `public/sinais/D79-local-passagem-nivel-sem-guarda-duas-ou-mais-vias.png` |
| 9 | E12 | Proibição de exceder a velocidade de....Km/h | 26 | `public/sinais/E12-proibicao-exceder-velocidade.png` |
| 12 | G62 | Área reservada para veículos de emergência | 37 | `public/sinais/G62-area-reservada-veiculos-emergencia.png` |
| 14 | E52 | Paragem proibida | 29 | `public/sinais/E52-paragem-proibida.png` |
| 19 | M3 | Dar prioridade nas passagens estreitas | 52 | `public/sinais/M3-dar-prioridade-passagens-estreitas.png` |
| 24 | A54 | Acidente | 5 | `public/sinais/A54-acidente.png` |
| 25 | E25 | Fim de proibição de sinais sonoros | 27 | `public/sinais/E25-fim-proibicao-sinais-sonoros.png` |

Os recortes foram feitos a 300 dpi a partir das páginas do PDF, sem a legenda e sem redesenhar. A pág. 5 e a pág. 27 são de quadros diferentes: A54 pertence ao Quadro II (sinais temporários) e E25 ao Quadro V.

## Limites e pontos por confirmar

- **Teste no navegador e registo na aplicação:** o exame ainda não está registado em `index.html` e `app.js`, ficheiros reservados pela DADOS-001. O ficheiro `exame5.js` segue o mesmo formato do Exame 1 e passa na validação automática, mas **não foi testado no navegador**.
- **Perguntas sem base no Código** (1, 6, 7, 15, 17): vêm do original e são orientações técnicas ou gerais. A validade legal não foi confirmada.
- **Pergunta 25:** a imagem E25 (fim de proibição) é ilustrativa e pode induzir em erro; ficou como no original. Decisão do dono: manter, trocar pelo sinal E24 («Proibição de sinais sonoros») ou retirar a imagem.
- **Pergunta 3:** a designação certa foi alinhada com o PDF («Local de passagem de nível...»); o APK dizia «Passagem de nível...».
- **Respostas legais:** a pergunta 16 foi completada com a condição do art. 44.º, n.º 3 do Código. O APK tinha uma versão mais curta da mesma resposta.
- **Fotografias não usadas:** 14 imagens do APK ficaram de fora por serem ilustrativas (perguntas 1, 4, 5, 6, 7, 10, 11, 13, 15, 16, 17, 18, 22 e 23). Continuam no APK; se o dono quiser fotografias em todas as perguntas, é uma tarefa à parte.
