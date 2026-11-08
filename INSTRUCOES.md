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

## Protocolo (a regra anti-duplicação)

1. **Atualizar.** Antes de qualquer coisa: `git pull --rebase`. Leia este ficheiro, todos os `PENDENTE.md` (`find . -name PENDENTE.md -not -path "*/node_modules/*"`) e o fim do `HISTORICO.md`.
2. **Identificar-se.** Use um nome de sessão curto: ferramenta + número (`Claude-1`, `Codex-1`, `ChatGPT-1`). Use sempre o mesmo durante a sessão.
3. **Reservar antes de trabalhar.** Escolha uma tarefa com `Estado: LIVRE`. Mude a linha para
   `Estado: EM CURSO — <sessão> — <data e hora> — ficheiros: <lista>`, faça commit (`claim: GER-001`) e `git push` **imediatamente, antes de mexer no código**.
   - Se o push for recusado: `git pull --rebase`, releia. Se outra sessão já reservou essa tarefa, **escolha outra**. Nunca force o push.
   - Uma sessão trabalha **numa tarefa de cada vez**.
4. **Ficheiros partilhados.** Duas tarefas `EM CURSO` não podem tocar no mesmo ficheiro. `app.js`, `styles.css`, `index.html` e `config.js` são partilhados: antes de reservar, confirme que nenhuma outra tarefa `EM CURSO` os lista. Se listar, escolha outra tarefa ou espere.
5. **Nova tarefa.** Antes de a criar, pesquise a ideia nos `PENDENTE.md` e no `HISTORICO.md` (`grep -ri "palavra" *.md data/exames/*.md`). Se já existe ou já foi feita, **não crie**. Se não existe, use o **próximo número livre** da área. **Um ID nunca é reutilizado**, mesmo depois de concluído.
6. **Concluir.** Quando a tarefa estiver feita e testada: no **mesmo commit** que a implementa, **apague-a do `PENDENTE.md`** e **acrescente uma linha ao `HISTORICO.md`** (ID, data, sessão, o que mudou). A mensagem do commit cita o ID (ex.: `DADOS-001: simulado 2 com 25 perguntas`). Faça push.
7. **Parar a meio.** Se a sessão tiver de parar antes de concluir: volte o estado a `LIVRE`, acrescente uma linha `Parcial:` com o que já foi feito e o que falta, e faça push. Assim outra sessão continua sem repetir.
8. **Reserva esquecida.** Uma tarefa `EM CURSO` há mais de 24 horas sem commit pode ser assumida por outra sessão, **depois de perguntar ao dono**.
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
