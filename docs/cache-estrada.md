# Cache individual e partilhado do ESTRADA

## Cache individual (por navegador e utilizador do dispositivo)

O estado de uma tentativa em curso continua a ser guardado no armazenamento local do navegador pela aplicação: exame, pergunta actual, respostas e prazo absoluto. O histórico e as preferências também usam chaves locais próprias. Esta camada não depende de credenciais nem de um serviço externo.

- O estado de uma tentativa é isolado por exame e permanece no mesmo navegador/perfil.
- O prazo absoluto evita reiniciar os 60 minutos após actualizar ou reabrir a página.
- O histórico/preferências são locais; não sincronizam automaticamente entre dispositivos nem depois de limpar os dados do navegador.
- O armazenamento local não deve ser usado para segredos, tokens, palavras-passe ou dados de pagamento.
- O armazenamento do navegador não é uma cópia de segurança; a limpeza do site, modo privado ou políticas do dispositivo podem apagá-lo.

## Cache partilhado de recursos estáticos

O Service Worker usa a Cache API do navegador com uma versão identificada. O cache é partilhado apenas entre páginas da mesma origem no mesmo perfil do navegador; não é uma base de dados comum entre pessoas ou dispositivos.

- Recursos estáticos da própria origem (scripts, estilos, imagens e fontes) podem ser reutilizados.
- Navegação usa rede primeiro e a cópia local da página como fallback offline.
- A actualização do Service Worker elimina versões antigas da cache.
- O número de entradas é limitado para evitar crescimento indefinido.
- Vercel e Netlify enviam cabeçalhos que impedem manter HTML e Service Worker desactualizados e permitem cache de longo prazo para recursos versionados.

## Exclusões de segurança

Nunca são colocados na cache partilhada pedidos de API, autenticação, Firebase/Firestore, pagamentos, callbacks, webhooks, pedidos com Authorization ou recursos de outras origens. Respostas com Set-Cookie ou Cache-Control: no-store também não são guardadas.

## Activação e teste

O Service Worker só é registado em HTTPS ou localhost. Em desenvolvimento HTTP numa rede local, o navegador não o activa. Executar:

```sh
node scripts/testar-cache.js
node scripts/build-netlify.js
```

Após a primeira visita online, os recursos estáticos elegíveis ficam disponíveis na cache do navegador. Uma primeira visita sem Internet não consegue descarregar a aplicação completa. Não há credenciais, API keys, Firebase Storage, plano pago ou ligação externa necessária para esta implementação.
