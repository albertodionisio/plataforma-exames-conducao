# REGRAS — decisões do dono e regras do repositório

Não reabrir estas decisões sem o dono pedir.

## Produto
- **Designação oficial:** usar «exame/exames» em toda a interface, catálogo, planos, documentação e comunicação da plataforma. Não apresentar o produto como um conjunto de simulados.
- Nome provisório: **ESTRADA**. Muda-se só em `config.js`.
- Exames de condução em Moçambique: 25 perguntas, cronómetro de 60 minutos, sem indicação de certo/errado nem explicação durante a realização; 0,8 valores por resposta certa e limiar de aprovação de 18 valores. Depois da submissão, apresentar resultado final e permitir revisão comentada de todas as perguntas.
- Catálogo de 50 exames; 3 grátis, restantes bloqueados por plano.
- Planos e preços: ficam em `config.js` (Free, Semanal Básico, Semanal Completo, Mensal Básico, Mensal Completo). Alterar preços ou planos só com aprovação do dono.
- As perguntas são reescritas; o site não usa o conteúdo do APK original (esse fica em `original/`, só para consulta).
- **Documento técnico único:** `docs/ESTRADA_Especificacao_Tecnica.md` (especificação técnica com o modelo de assinaturas e monetização dentro). Não existe um segundo documento; qualquer alteração faz-se nele.

## Avaliação e revisão dos exames
- O candidato deve concluir o exame completo antes de ver a classificação. Durante a realização, não revelar se cada alternativa está certa ou errada e não apresentar explicações.
- Submeter quando o candidato terminar as 25 perguntas ou quando o cronómetro chegar a zero. Guardar as respostas seleccionadas e contabilizar também as perguntas em branco.
- No resultado, apresentar nota obtida em valores, número de certas, erradas e em branco, e estado final. Aprovado: nota igual ou superior a 18/20; reprovado: nota inferior a 18/20.
- A indicação visual do resultado deve ser um semáforo gráfico real, com luz verde acesa para APROVADO e luz vermelha acesa para REPROVADO. Mostrar sempre a nota junto do estado; exemplos: 18,4 valores — APROVADO; 17,6 valores — REPROVADO.
- Disponibilizar a acção «Rever exame». A revisão deve preservar a pergunta e a ordem efectivamente apresentadas, a imagem correspondente e a alternativa escolhida pelo candidato; mostrar a resposta correcta e uma explicação pedagógica/contextual clara. Assinalar explicitamente perguntas não respondidas. Mostrar explicação mesmo quando o candidato acertou, para consolidar a aprendizagem.
- Não apresentar feedback de correcção durante o exame. O modo de estudo mantém-se, mas a aprendizagem comentada ocorre depois da submissão, na revisão.

## Interface e identidade visual
- **Não utilizar emojis na interface do ESTRADA.** Substituir emojis usados como elementos visuais por ícones próprios e consistentes, adequados à função e ao local onde aparecem (por exemplo: navegação, acções, categorias, estados e funcionalidades).
- Os ícones devem pertencer a um conjunto visual coerente, manter estilo, espessura e proporções consistentes e ser legíveis em ecrãs pequenos. Usar ícones básicos e reconhecíveis, adequados à função e ao local exacto onde aparecem, com tamanho equilibrado (nem demasiado pequenos nem demasiado grandes). Preferir SVG ou ficheiros de ícones próprios; não usar emojis como substitutos de ícones.
- Não alterar a interface ou ficheiros partilhados reservados por outra tarefa. A remoção/substituição dos emojis deve ser planeada numa tarefa própria, com auditoria dos locais onde aparecem e validação visual em telemóvel.

## Repositório
- **Este repositório é a fonte principal do projecto.** O que for decidido ou concluído regista-se aqui (`PENDENTE.md`, `HISTORICO.md`, `REGRAS.md`).
- **Nunca guardar** aqui: chaves, tokens, passwords nem ficheiros `.env`. O APK original está em `original/` (decisão do dono, 2026-11-09), só como referência de trabalho. Também não escrever segredos em issues, commits ou mensagens de commit.
- Tokens do GitHub: o dono cria um só para este repositório (Contents: Read and write, validade curta). Nenhuma sessão o escreve em ficheiros.
- O banco de perguntas privado só entra quando o repositório for privado (`dados-privados/` está no `.gitignore`).

## Trabalho com várias sessões
- Regras em `INSTRUCOES.md`. Resumo: ler antes, reservar antes de trabalhar, apagar do `PENDENTE.md` e registar no `HISTORICO.md` ao concluir, nunca duplicar.

## Estratégia de execução e lançamento do projecto

A prioridade definida pelo dono é **terminar o ESTRADA e lançá-lo**, avançando de forma contínua até existir uma versão completa, integrada e pronta para utilização. O objectivo não é manter o projecto indefinidamente em ciclos de planeamento ou aperfeiçoamento de módulos isolados.

### Ordem de execução obrigatória

1. **Concluir os 50 exames:** desenvolver e integrar os exames 1 a 50, com perguntas, alternativas, respostas, explicações e imagens correspondentes, respeitando as regras de conteúdo e validação.
2. **Completar o produto:** implementar e integrar as funcionalidades previstas para a aplicação, incluindo experiência de exame, resultados e revisão, contas, assinaturas, pagamentos e os restantes componentes da especificação.
3. **Preparar para funcionamento real:** cada componente deve ficar funcional e testável. Quando a activação depender de credenciais, contratos, aprovação comercial ou serviços externos, deixar a integração tecnicamente preparada, documentada e com os requisitos de activação explícitos. Nunca apresentar uma integração apenas preparada como se estivesse activa.
4. **Auditoria global e estabilização:** depois de concluído o âmbito funcional do produto e os 50 exames, iniciar uma fase coordenada de auditoria integral, testes de ponta a ponta, verificação de segurança, compatibilidade móvel/Android, desempenho, acessibilidade e correcção dos problemas encontrados.
5. **Lançamento:** preparar a versão Android de produção, validar o processo de instalação e actualização, completar os requisitos operacionais e publicar/disponibilizar a aplicação.

### Como avançar sem perder qualidade

- Não interromper continuamente o desenvolvimento para aperfeiçoamentos cosméticos ou auditorias globais prematuras. Registar melhorias não críticas para a fase de auditoria e continuar para a próxima entrega.
- Não adiar verificações essenciais que evitem erros factuais, perda de dados, falhas de segurança, incompatibilidades ou regressões graves. Cada tarefa deve passar os testes mínimos relevantes antes de ser integrada.
- Preservar as funcionalidades já concluídas: alterações novas não podem quebrar o que já funciona. Fazer verificações de regressão proporcionais ao risco, sem transformar cada entrega numa auditoria total.
- Distinguir claramente: implementado, integrado, testado, dependente de configuração externa e efectivamente activo.
- Não declarar o projecto pronto para lançamento enquanto existirem funcionalidades obrigatórias por implementar, exames por concluir ou bloqueios críticos por resolver.
- Todas as sessões devem seguir esta prioridade, consultar o estado real no GitHub e escolher a próxima tarefa disponível sem duplicar trabalho.

**Critério final:** o projecto só é considerado concluído quando os 50 exames e o âmbito funcional acordado estiverem integrados, testados, preparados para operação real, e a auditoria global tiver resolvido ou formalmente identificado todos os bloqueios ao lançamento.
