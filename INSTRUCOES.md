# INSTRUÇÕES — leia isto primeiro

Ponto de partida para qualquer sessão (pessoa ou IA: Claude, Codex, ChatGPT, Perplexity, etc.) que trabalhe neste repositório.
O dono (Borja) só precisa de enviar o **link do repositório**. Este ficheiro existe para que **nenhuma tarefa seja feita duas vezes**
e para que cada sessão saiba **o que já foi feito, o que está em curso e o que falta**.

| Ficheiro | O que tem | Quando ler |
|---|---|---|
| `INSTRUCOES.md` (este) | Protocolo de trabalho entre sessões | Sempre, primeiro |
| `PENDENTE.md` (raiz) e `data/exames/PENDENTE.md` | **O que falta** e **o que está em curso**, com ID | Sempre, antes de escolher trabalho |
| `HISTORICO.md` | **O que já foi feito** (não é instrução) | Antes de criar uma tarefa nova, para ver se já existe |
| `REGRAS.md` | Regras de negócio, decisões do dono (não reabrir) e regras do repositório | Antes de mexer em preços, planos, nota ou segredos |

## Áreas e IDs

| Área | Ficheiro | Prefixo |
|---|---|---|
| Geral / documentos / vários módulos | `PENDENTE.md` | GER- |
| Interface (index.html, styles.css, app.js) | `PENDENTE.md` (secção Interface) | FE- |
| Dados dos simulados (`data/exames/`) | `data/exames/PENDENTE.md` | DADOS- |

Se surgir uma área nova (por exemplo, servidor), crie um `PENDENTE.md` na pasta certa, escolha um prefixo novo (BE-, etc.) e acrescente-o a esta tabela.

## Estados de uma tarefa (marcar sempre)

Cada tarefa tem sempre um destes três estados. A sessão que mexe numa tarefa é responsável por deixar o estado certo.

| Estado | Significa | Como fica escrito |
|---|---|---|
| **LIVRE** | Ninguém pegou. Pode ser reservada. | `Estado: LIVRE` |
| **EM CURSO** | Reservada por uma sessão. **Ninguém mais toca**, escolha outra tarefa. | `Estado: EM CURSO — <sessão> — <data e hora> — ficheiros: <lista> — último sinal: <data e hora>` |
| **CONCLUÍDA** | Feita e testada. | Sai do `PENDENTE.md` e entra no `HISTORICO.md` com a palavra CONCLUÍDA, no mesmo commit |

**Se uma sessão parar a meio (limite atingido, sem aviso):** a tarefa continua `EM CURSO` e fica protegida. As outras sessões **não a tocam e escolhem outra**. É o comportamento certo: evita duas pessoas a mexer no mesmo ficheiro.

**Para a tarefa não ficar presa para sempre:**
- A sessão que trabalha atualiza o `último sinal` em cada commit e push.
- Se o `último sinal` tem mais de 24 horas, outra sessão **não assume sozinha**: avisa o dono (Borja) e pergunta. Só com a autorização dele assume.
- Ao assumir: muda a linha para o seu nome e a hora, lê a linha `Parcial:` e o `git log` dos ficheiros listados, e continua de onde parou, sem refazer.
- **Enviar por blocos.** Uma sessão não consegue ver quanto falta para o seu limite e pode parar sem aviso. Por isso, cada bloco pequeno que ficar pronto e testado é logo enviado (commit e push) e o `último sinal` é atualizado. O que não foi enviado perde-se se a sessão parar.

## GitHub como fonte de verdade e verificação directa

Todas as sessões que trabalham neste projecto consultam o mesmo repositório GitHub. O GitHub é a fonte principal e verificável do estado real do projecto; a memória da conversa, mensagens anteriores ou afirmações de outra sessão não substituem a consulta ao repositório.

- **Consultar directamente:** quando o dono perguntar pelo último commit, por alterações, ficheiros, estado de uma tarefa, histórico, branch ou Pull Request, consulte o GitHub naquele momento. Apresente apenas dados confirmados no repositório (SHA, mensagem, autor, data, ficheiros, estado e link, conforme disponíveis).
- **Não adivinhar:** nunca invente nem deduza um commit, alteração, reserva ou conclusão. Se não conseguir consultar o GitHub, diga claramente que não conseguiu verificar; não responda como se tivesse confirmado.
- **Confirmar depois de escrever:** uma chamada de escrita ou uma mensagem de sucesso não basta para afirmar que a alteração ficou publicada. Depois de cada commit/push, volte a consultar o GitHub e confirme o commit e o conteúdo remoto. Só então comunique que foi publicado.
- **Visibilidade comum:** qualquer sessão pode escolher qualquer tarefa LIVRE, independentemente da ferramenta utilizada. Não há tarefas atribuídas previamente a Claude, ChatGPT, Perplexity ou outra ferramenta.
- **Respeitar reservas:** uma tarefa EM CURSO pertence à sessão indicada e não pode ser escolhida, editada ou continuada por outra sessão sem autorização do dono, conforme as regras de tarefa parada.
- **Acesso insuficiente:** sessões sem acesso efectivo de leitura podem apenas trabalhar com informação fornecida; sessões sem escrita não reservam nem publicam tarefas. Devem declarar essa limitação e entregar o resultado ao dono ou a uma sessão com permissões.

## Reserva concorrente — impedir duas sessões de escolherem a mesma tarefa

A alteração de LIVRE para EM CURSO é uma reserva partilhada e tem de ser confirmada no GitHub antes de começar qualquer trabalho.

1. Actualize a cópia local e consulte novamente a versão mais recente de todos os ficheiros PENDENTE.md.
2. Escolha uma tarefa LIVRE e confirme que nenhum commit recente já a reservou ou concluiu.
3. Altere apenas essa tarefa para EM CURSO, identificando a sessão, data/hora, ficheiros e último sinal.
4. Publique imediatamente a reserva antes de editar os ficheiros de trabalho.
5. **Confirme a reserva lendo novamente o PENDENTE.md directamente no GitHub.** Só prossiga se a tarefa aparecer EM CURSO com a identificação da sua sessão.
6. Se o commit/push for recusado por conflito, se a versão remota tiver mudado ou se outra sessão tiver reservado primeiro, actualize e releia o estado. Não force a escrita nem continue nessa tarefa; escolha outra que continue LIVRE.
7. Se duas sessões tentarem reservar ao mesmo tempo, a primeira alteração aceite pelo GitHub vence. A segunda tem de falhar na actualização por versão desactualizada ou detectar a reserva já publicada; nunca pode sobrescrever a reserva vencedora.
8. Depois de reservar, volte a verificar o estado remoto antes de cada novo bloco de trabalho, especialmente se tiver passado algum tempo ou recebido indicação de conflito.
9. Uma tarefa só fica CONCLUÍDA quando a remoção de PENDENTE.md, a entrada no HISTORICO.md e as alterações correspondentes estiverem publicadas e confirmadas no GitHub.

**Importante:** ler uma tarefa como LIVRE não a reserva. A reserva só existe depois de a alteração ser aceite e confirmada no GitHub. Não basta escrever EM CURSO apenas na cópia local.

## Conferir o texto com o histórico (git log)

Os ficheiros `PENDENTE.md` e `HISTORICO.md` são a regra, mas o `git log` é a prova do que realmente aconteceu. Uma sessão não se fia só no que está escrito.

- **No início de cada sessão:** `git pull --rebase`, depois `git log --oneline -20`. Confirme que o que o `HISTORICO.md` diz estar concluído aparece nos commits (o commit cita o ID), e que nenhuma tarefa do `PENDENTE.md` já foi feita num commit sem ter sido apagada.
- **Antes de reservar uma tarefa:** `git log --oneline --all -- <ficheiros da tarefa>` e `grep` do ID nos commits. Se já há commits dessa tarefa, leia-os antes de decidir.
- **Ao assumir uma tarefa `EM CURSO` parada** (com autorização do dono): veja no `git log` o que a sessão anterior chegou a enviar, compare com a linha `Parcial:` e continue só do que falta.
- **Se o texto e os commits não coincidirem** (por exemplo, tarefa concluída nos commits mas ainda no `PENDENTE.md`, ou o contrário): não adivinhe. Diga ao dono o que encontrou, e só depois corrija os ficheiros.

## Protocolo (a regra anti-duplicação)

1. **Atualizar.** Antes de qualquer coisa: `git pull --rebase`. Leia este ficheiro, todos os `PENDENTE.md` (`find . -name PENDENTE.md -not -path "*/node_modules/*"`) e o fim do `HISTORICO.md`.
2. **Identificar-se.** Use um nome de sessão curto: ferramenta + número (`Claude-1`, `Codex-1`, `ChatGPT-1`). Use sempre o mesmo durante a sessão.
3. **Reservar antes de trabalhar.** Escolha uma tarefa com `Estado: LIVRE`. Mude a linha para
   `Estado: EM CURSO — <sessão> — <data e hora> — ficheiros: <lista> — último sinal: <data e hora>`, faça commit (`claim: GER-001`) e `git push` **imediatamente, antes de mexer no código**.
   - Se o push for recusado: `git pull --rebase`, releia. Se outra sessão já reservou essa tarefa, **escolha outra**. Nunca force o push.
   - Uma sessão trabalha **numa tarefa de cada vez**.
4. **Ficheiros partilhados.** Duas tarefas `EM CURSO` não podem tocar no mesmo ficheiro. `app.js`, `styles.css`, `index.html` e `config.js` são partilhados: antes de reservar, confirme que nenhuma outra tarefa `EM CURSO` os lista. Se listar, escolha outra tarefa ou espere.
5. **Nova tarefa.** Antes de a criar, pesquise a ideia nos `PENDENTE.md` e no `HISTORICO.md` (`grep -ri "palavra" *.md data/exames/*.md`). Se já existe ou já foi feita, **não crie**. Se não existe, use o **próximo número livre** da área. **Um ID nunca é reutilizado**, mesmo depois de concluído.
6. **Concluir.** Quando a tarefa estiver feita e testada: no **mesmo commit** que a implementa, **apague-a do `PENDENTE.md`** e **acrescente uma linha ao `HISTORICO.md`** com a palavra CONCLUÍDA (ID, data, sessão, o que mudou). A mensagem do commit cita o ID (ex.: `DADOS-001: simulado 2 com 25 perguntas`). Faça push.
7. **Parar a meio.** Se a sessão tiver de parar antes de concluir: volte o estado a `LIVRE`, acrescente uma linha `Parcial:` com o que já foi feito e o que falta, e faça push. Assim outra sessão continua sem repetir.
8. **Reserva parada.** Uma tarefa `EM CURSO` com o `último sinal` há mais de 24 horas pode ser assumida por outra sessão, **só depois de perguntar ao dono** (ver "Estados de uma tarefa").
9. **Sessões sem permissão de escrita no GitHub** (por exemplo, Perplexity ou um chat sem Git): trabalham como pesquisa e rascunho. Não reservam tarefas. Entregam o resultado ao dono, que o passa a uma sessão com acesso para integrar usando este protocolo.
10. **Testar.** Abrir `index.html` no navegador e confirmar que não há erros antes de cada push. Nunca publicar código quebrado.
11. **Commits pequenos e descritivos**, sempre com o ID da tarefa. Antes de cada push: `git status`, branch certa, `git diff`, nenhum segredo.
12. **Dúvida em dinheiro, preços, planos, nota ou apagar dados: perguntar ao dono antes.**

## Formato de cada tarefa

```
## GER-001 — Título curto
- Estado: LIVRE
- Pedido: o que o dono quer, nas palavras dele.
- Onde mexer: caminhos prováveis.
- Pronto quando: como saber que está certo (critérios que dá para testar).
- Cuidados: o que NÃO misturar.
```

Se `PENDENTE.md` ficar vazio, mantenha o cabeçalho e a linha "Nenhuma instrução pendente.".

## Prioridade global do projecto — terminar e lançar

A prioridade definida pelo dono é concluir o produto ESTRADA e lançá-lo. Todas as sessões devem respeitar a sequência registada em `REGRAS.md`:

1. Avançar na conclusão dos 50 simulados.
2. Completar e integrar o conjunto de funcionalidades previsto para o produto.
3. Deixar cada componente funcional e testável ou, quando depender de credenciais, aprovações ou serviços externos, tecnicamente preparado e com os passos de activação documentados.
4. Depois de concluído esse âmbito, executar a auditoria global, testes completos, correcções e estabilização.
5. Preparar e efectuar o lançamento Android.

**Regra de ritmo:** não transformar melhorias não críticas, ajustes cosméticos ou auditorias globais antecipadas em bloqueios ao avanço. Registe-os para a fase de auditoria e prossiga para a próxima tarefa disponível. Isto não dispensa testes mínimos por entrega nem a correcção imediata de erros factuais, falhas de segurança, perda de dados ou regressões graves.

Cada sessão deve proteger o trabalho já concluído, fazer verificações proporcionais para não o quebrar e indicar honestamente o que está implementado, integrado, testado, apenas preparado ou efectivamente activo. Não declarar o projecto concluído antes dos 50 simulados, das funcionalidades obrigatórias, da auditoria global e dos requisitos de lançamento estarem tratados.
