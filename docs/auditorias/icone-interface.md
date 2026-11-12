# Auditoria de ícones e símbolos da interface

- **Tarefa:** FE-003
- **Sessão:** ChatGPT-FE003
- **Data:** 2026-11-12
- **Estado deste levantamento:** auditoria parcial, apenas de leitura; nenhuma interface foi alterada.
- **Objectivo:** identificar emojis usados como elementos visuais e preparar substituições coerentes, sem interferir em ficheiros reservados por outras tarefas.

## 1. Ficheiros verificados

| Ficheiro | SHA consultado | Resultado |
|---|---|---|
| `index.html` | `6f4e67df97c425df64085627f453e25a76423362` | Nenhum emoji encontrado. |
| `app.js` | `09eec4bdbaf2a9422ec6e2a32c280a9c657b4785` | Nenhum emoji propriamente dito; existem dois símbolos textuais usados como marcadores de correcção. |
| `styles.css` | `61674013eebd574f82447be65c4bdfa7344ddace` | Nenhum emoji encontrado. |
| `icons/icon-192.png` | `27cbf49d745d3bfa10758a6e1f6bfd260d364735` | Ficheiro de ícone PWA referenciado pelo manifesto; existência confirmada. |
| `icons/icon-512.png` | `ff3a47b0d0bccd10108e333ed288b76b3d76d294` | Ficheiro de ícone PWA referenciado pelo manifesto; existência confirmada. |

O manifesto `manifest.webmanifest` referencia os dois PNG para instalação/PWA. A presença destes ficheiros não demonstra, por si só, que exista um conjunto de ícones de interface reutilizável. A auditoria visual dos próprios PNG e o inventário completo do directório `icons/` ficam por fazer.

## 2. Ocorrências encontradas

### `app.js`

- Linha 83: o carácter `✓` é acrescentado à alternativa correcta.
- Linha 84: o carácter `✗` é acrescentado à alternativa escolhida incorrectamente.

Estes caracteres são símbolos Unicode, não emojis propriamente ditos. Ainda assim, são elementos visuais de correcção e devem ser revistos quando o fluxo de resultado/revisão for implementado. A correcção imediata actualmente presente nestas linhas também deve ser tratada na tarefa FE-002, que é responsável pelo fluxo de avaliação; não foi alterada nesta auditoria.

### Componente de assinaturas

Foi observado, adicionalmente, que `public/assinaturas/planos.js` usa `✓` como marcador textual de benefício confirmado. É um símbolo, não um emoji. O componente pertence ao trabalho FE-004 e não foi alterado.

## 3. Recomendações para a implementação

1. Não substituir símbolos por emojis diferentes.
2. Quando a interface precisar de indicar estado correcto/incorrecto, usar ícones SVG simples, com significado claro e acompanhados de texto quando necessário; não depender apenas da cor.
3. Para benefícios dos planos, usar o mesmo conjunto visual de ícones, mantendo tamanho, espessura e alinhamento consistentes.
4. Manter os ícones PWA de 192 px e 512 px separados dos ícones funcionais da interface.
5. Antes de implementar, inventariar visualmente todos os elementos de `icons/` e confirmar se podem ser reutilizados sem criar inconsistências.

## 4. Limites e coordenação

Esta fase foi deliberadamente limitada à leitura. No estado consultado, `app.js` está reservado por DADOS-001 e `styles.css` por FE-001. A tarefa FE-004 também tem trabalho em curso no componente de assinaturas. Por isso, não foram alterados `index.html`, `app.js`, `styles.css`, `public/assinaturas/planos.js` nem quaisquer imagens.

A auditoria não encontrou emojis nos três ficheiros principais de texto analisados. A tarefa FE-003 **não está concluída**: falta inventário visual integral da pasta de ícones, decisão final sobre os marcadores simbólicos e implementação das substituições autorizadas, seguida de validação em telemóvel.
