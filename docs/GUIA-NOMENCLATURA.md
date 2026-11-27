# Guia de nomenclatura oficial — ESTRADA

Este documento define os nomes a utilizar de forma consistente na interface Web, na aplicação móvel, nas mensagens, na ajuda e na documentação do produto.

## Regra central

**Designação oficial das avaliações: exame/exames.** Cada avaliação deve ser apresentada como «Exame 1», «Exame 2» e assim sucessivamente. As unidades dentro de um exame chamam-se «perguntas» e as opções chamam-se «alternativas de resposta».

Não usar «teste», «prova» ou «simulado» como nome da avaliação do ESTRADA. As palavras «teste» e «testes» continuam permitidas em contexto técnico de desenvolvimento, controlo de qualidade, scripts, testes automatizados e ambientes de validação; não são nomes de funcionalidades para o utilizador.

## Nomes oficiais por área

| Área / elemento | Nome oficial |
|---|---|
| Página principal | Início |
| Catálogo | Exames |
| Cada avaliação | Exame 1, Exame 2, … |
| Unidade de avaliação | Pergunta |
| Opções de resposta | Alternativas de resposta |
| Acção de responder | Seleccionar resposta |
| Classificação final | Resultado do exame |
| Revisão pedagógica | Rever exame |
| Lista de resultados anteriores | Histórico de exames |
| Consulta da legislação rodoviária | Código da Estrada |
| Consulta da sinalização | Sinais de Trânsito |
| Oferta comercial | Planos |
| Página de preferências | Definições |
| Área de credenciais e segurança | Conta e segurança |
| Início de sessão | Entrar |
| Criação de conta | Criar conta |
| Fim de sessão | Terminar sessão |
| Gestão comercial | Subscrição e pagamentos |
| Registo de cobranças | Histórico de pagamentos |
| Área de apoio | Ajuda e suporte |
| Conteúdo de ajuda | Perguntas frequentes |
| Contacto de atendimento | Contactar suporte |
| Comunicação de falhas | Reportar um problema |
| Preferências de alertas | Notificações neste dispositivo |
| Posição inferior ainda sem função | Pendente |

## Aplicação das regras

- Usar os nomes completos «Código da Estrada» e «Sinais de Trânsito» nos rótulos, títulos e nomes acessíveis, mesmo quando o destino técnico da rota tiver um identificador abreviado.
- Usar «Conta e segurança» nas definições; não alternar com «Minha conta» para a mesma secção.
- Usar «Histórico de exames» para o histórico das avaliações e «Histórico de pagamentos» apenas para transacções. Não confundir os dois.
- Manter «Pendente» apenas como rótulo da posição reservada na navegação inferior enquanto não existir uma função aprovada. Não atribuir destino ou comportamento por iniciativa própria.
- Os nomes acima identificam conceitos e destinos; não autorizam criar funcionalidades que ainda não estejam implementadas. Quando uma função estiver indisponível, a interface deve informar isso claramente.
- Preservar rotas, nomes de ficheiros, variáveis, propriedades, identificadores de API e termos técnicos quando a sua alteração puder quebrar compatibilidade. A nomenclatura visível ao utilizador pode ser diferente do identificador interno.
- Aplicar português claro e consistente, mantendo a variante linguística já adoptada no produto.

## Verificação

Antes de concluir alterações de interface ou documentação, pesquisar os termos alternativos no contexto visível ao utilizador, rever títulos, botões, menus, mensagens e acessibilidade (`aria-label`/`title`) e executar os testes relevantes. Referências históricas e termos técnicos não devem ser reescritos apenas para uniformizar a linguagem apresentada ao utilizador.