# Exame 15 — mapa de rastreabilidade (DADOS-016)

Conteúdo adaptado das 25 perguntas do Exame 15 extraído do APK de referência, em `original/extraido/exame15.json`. As imagens originais foram preservadas e copiadas para `public/exames/exame15/`. Sessão responsável: Claude-DADOS016, 15-11-2026.

## Fontes e enquadramento

- **Código da Estrada:** Decreto-Lei n.º 1/2011, de 23 de Março (CE). Texto consultado no ficheiro `codigodeestrada.pdf` que acompanha o APK de referência, com os números de artigo conferidos nessa versão.
- **Regulamento de Sinais de Trânsito:** Decreto n.º 51/2009, de 29 de Setembro (RST). Os códigos dos sinais foram confirmados visualmente no catálogo `sinais.pdf` que acompanha o APK (páginas indicadas abaixo).
- **INATRO:** o Instituto Nacional dos Transportes Rodoviários sucedeu ao INATTER (Decreto n.º 47/2021, de 5 de Julho). A pergunta 21 refere os dois nomes.
- **Limite desta revisão:** os artigos indicados devem ser confirmados contra a publicação oficial e eventuais alterações legislativas antes do lançamento comercial. Quando a pergunta é pedagógica ou de segurança geral, isso fica assinalado, e não se declara que seja uma obrigação expressa do Código.

## Estado da validação

- As 25 perguntas do APK foram localizadas, na mesma ordem, e associadas às 25 imagens correspondentes. Cada imagem foi vista e confirmada pelo conteúdo.
- Todas as perguntas têm quatro alternativas preenchidas, uma única resposta correcta e explicação para a revisão. Nenhuma explicação contém números de artigos; as referências legais ficam apenas neste mapa.
- Em 11 perguntas o APK só tinha três alternativas (2, 4, 5, 7, 8, 10, 11, 12, 18, 23, 25); a quarta foi acrescentada como distrator novo, sem alterar o objectivo da pergunta.
- A posição das respostas correctas foi distribuída: **A=6, B=6, C=6, D=7**.
- Auditoria de extensão: a resposta correcta é a única alternativa mais longa em **5 de 25** perguntas, e em nenhuma a diferença para a mais longa das erradas ultrapassa 10 caracteres.
- Comparação com os outros 24 exames existentes (600 perguntas): sem perguntas repetidas. As semelhanças encontradas com o Exame 1 são só o enunciado genérico «O que indica o sinal da imagem?» e correspondem a sinais diferentes (por exemplo, o Exame 1 trata de «paragem proibida» a veículos com substâncias perigosas e este exame do sinal E36, «trânsito proibido»).
- Validador oficial: `node scripts/validar-exames.js` sem problemas. Simulação no navegador (exame 15 carregado sobre a aplicação actual): abre na pergunta 1 de 25, não mostra correcção durante o exame, calcula a nota correctamente (16 certas = 12,8/20) e a revisão mostra as 25 imagens, a resposta do candidato, a resposta correcta e a explicação.

## Alterações de adaptação (todas leves)

- **Pergunta 2:** o enunciado foi completado para dizer o que o sinal proíbe e perguntar quando se aplica; a resposta (de noite) é a do APK.
- **Pergunta 6:** mantida a chave do APK (esquerda, usando a berma). A regra de conduta dos restantes condutores perante um veículo prioritário **não foi localizada** no texto do Código consultado; fica assinalada para validação jurídica. É coerente com a circulação pela esquerda.
- **Pergunta 17:** a opção D do APK era confusa («Não, varia na mesma pessoa») e foi reescrita como «É sempre igual na mesma pessoa, em qualquer situação». A resposta mantém-se.
- **Pergunta 18:** o APK tinha três alternativas; foi acrescentada «Não, porque deve circular no meio da faixa de rodagem». A explicação inclui que, sem passeio, o peão usa a berma (art. 102.º, n.º 1), e que o lado direito se aplica quando tem de ir pela faixa de rodagem (art. 103.º, n.º 3).
- **Pergunta 20:** as alternativas A («Não.») e B («Não, já que existe uma lomba…») do APK diziam o mesmo; a A foi substituída por «Sim, desde que a manobra seja sinalizada com antecedência». A resposta mantém-se (art. 47.º, n.º 2).
- **Pergunta 21:** o APK referia só o INATTER, nome antigo. A resposta correcta passou a dizer «O INATRO, anteriormente INATTER». O papel do INATRO nas escolas de condução deve ser confirmado na publicação oficial.
- **Pergunta 24:** a opção «50 km/h, se tiver reboque» foi mantida como errada: com ou sem reboque, o limite dentro das localidades é 60 km/h (art. 33.º, n.º 1).

## Pontos por validar antes do lançamento

1. **Pergunta 2:** o código do painel adicional (estrelas e lua, período nocturno) não foi localizado no catálogo do APK. A interpretação é visual.
2. **Pergunta 5:** a seta luminosa foi identificada pela imagem; falta o código do RST.
3. **Pergunta 6:** regra legal não localizada (ver acima).
4. **Perguntas 3, 4, 7, 9, 14, 17, 19 e 22:** conhecimento geral ou recomendação de segurança, não transcrições de um artigo do Código.

## Mapa das 25 perguntas

| Nº | Tema | Fonte principal | Resposta APK | Resposta ESTRADA | Imagem preservada / nota |
|---|---|---|---|---|---|
| 1 | Aderência e travagem | Segurança geral; CE, art. 32.º, n.º 1 (velocidade moderada com aderência precária) | B | D | Piso de aderência reduzida |
| 2 | Sinais de proibição | RST, sinal E28 (pág. 27 do catálogo do APK); painel adicional de estrelas e lua por localizar no catálogo | B | A | Sinal E28 com painel adicional da noite |
| 3 | Fadiga e descanso | Recomendação pedagógica de segurança (pausas); não é regra expressa do Código | C | C | Foto de estrada, decorativa |
| 4 | Luzes e painel de instrumentos | Convenção geral de painéis de instrumentos (azul = luzes de estrada); não localizada no Código | A | B | Painel de instrumentos com indicador azul |
| 5 | Sinalização temporária | Sinalização temporária; identificação visual da seta luminosa; código do RST por localizar | A | D | Viatura com seta luminosa |
| 6 | Veículos prioritários | Regra de conduta dos restantes condutores perante veículo prioritário: não localizada no texto do Código consultado | A | A | Viatura da polícia |
| 7 | Condução defensiva | Segurança geral (condução defensiva) | A | B | Foto de estrada, decorativa |
| 8 | Marcas rodoviárias | RST, marca R3, Quadro XVI, marcas diversas (pág. 64 do catálogo do APK) | C | C | Marca R3 pintada no pavimento |
| 9 | Álcool e condução | Conhecimento geral sobre alcoolemia; não é regra expressa do Código | B | A | Aparelho de teste de alcoolemia |
| 10 | Carga e descarga | CE, art. 56.º, n.º 1 | C | D | Viatura com bagageira aberta |
| 11 | Sinais de perigo | RST, sinal D12, túnel (Quadro IV, pág. 21 do catálogo do APK) | B | B | Sinal D12 |
| 12 | Sinais de indicação | RST, sinal G86, via de sentido único (pág. 39 do catálogo do APK) | A | C | Sinal G86 em foto de rua |
| 13 | Ultrapassagem | CE, art. 43.º, n.º 6 | C | D | Estrada em subida |
| 14 | Álcool e condução | Conhecimento geral sobre álcool e condução; não é transcrição de um artigo | B | A | Condutor a beber ao volante |
| 15 | Segurança de passageiros | CE, art. 87.º, n.os 4–5 (crianças em sistema de retenção homologado) | C | B | Foto de viaturas, decorativa |
| 16 | Estacionamento | CE, art. 51.º, n.º 1, alínea i) (proibido estacionar nos passeios); art. 164.º | B | C | Rua com viaturas estacionadas |
| 17 | Tempo de reacção | Conhecimento geral sobre tempo de reacção; não é transcrição de um artigo | A | A | Foto de estrada, decorativa |
| 18 | Peões | CE, art. 102.º, n.º 1 (berma) e art. 103.º, n.º 3 (lado direito, em relação ao sentido de marcha) | C | D | Peão na berma |
| 19 | Cinto de segurança | Recomendação de segurança sobre a posição do banco; não é regra expressa do Código | C | B | Condutor com cinto |
| 20 | Inversão do sentido de marcha | CE, art. 47.º, n.º 2 (inversão proibida onde a visibilidade é reduzida) | B | C | Estrada com lomba |
| 21 | Entidades e deveres | Decreto n.º 47/2021, de 5 de Julho (cria o INATRO, que sucedeu ao INATTER); CE, art. 147.º, n.º 1, alínea d) | B | A | Agentes de trânsito |
| 22 | Estado do veículo | Conhecimento geral de manutenção; não é regra expressa do Código | B | D | Suspensão e amortecedor |
| 23 | Sinais de proibição | RST, sinal E36 (pág. 28 do catálogo do APK) | A | B | Sinal E36 (`public/sinais/E36-sinal-pdf-600dpi.png`, extraído do PDF oficial a 600 DPI) |
| 24 | Limites de velocidade | CE, art. 33.º, n.º 1 (limites de velocidade, automóveis ligeiros de passageiros e mistos) | C | C | Avenida urbana |
| 25 | Sinais de obrigação | RST, sinal F37, via obrigatória para veículos de dimensões anormais (pág. 33 do catálogo do APK) | A | D | Painel de vias com o sinal F37 |

## Integração na aplicação

O ficheiro `data/exames/exame15.js` é recolhido pelo build estático, que copia todos os `exameN.js`. No momento desta entrega, `index.html` ainda não contém a tag que carrega o Exame 15, e esse ficheiro é partilhado com as tarefas de interface. Por isso o Exame 15 **ainda não aparece no catálogo da aplicação publicada**. A tag `<script src="data/exames/exame15.js"></script>` tem de ser acrescentada antes de `app.js`, por quem coordenar `index.html`.

## Ficheiros e imagens

- Dados: `data/exames/exame15.js`
- Imagens: `public/exames/exame15/exame15_1.jpg` a `exame15_25.jpg`
- Origem extraída: `original/extraido/exame15.json` e `original/extraido/imagens/exame15/`


DADOS-079 (2026-11-22): a imagem da pergunta 23 foi substituída pela extracção oficial do sinal E36 a 600 DPI. O sinal é isolado e corresponde exactamente ao símbolo descrito; o enunciado, opções, resposta e explicação não foram alterados.