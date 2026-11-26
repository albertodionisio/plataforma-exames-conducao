# ePay: passo 4 "Links" de um produto (2026-11-18, 22:09)

Imagens (foto de perfil e endereços tapados, o repositório é público):
- `2026-11-18_epay-produto-links-1-passo4.png`
- `2026-11-18_epay-produto-links-2-checkout-e-coprodutor.png`

Foram tapados o endereço da página do produto e o código do link de checkout (o código serve para pagar). Não mostram chaves nem segredos.

Conteúdo: `painel.epay.co.mz/products/...`, assistente do produto, agora no **passo 4 "Links"** (passos: 1 Informação, 2 Preço, 3 Depois da compra, 4 Links).

## Imagem 1
- Aviso: "Está em rascunho: o link não vende e o produto não aparece na montra."
- **Página do produto:** endereço do tipo `epay.co.mz/@...` com botão "Copiar link". "É este que se partilha: mostra o produto e tem o botão de comprar."
- **Links de checkout:** botão "Gerar link". Existe um link `checkout.epay.co.mz/c/<código>`, com ícones de imprimir, copiar e apagar.
- **Preço apresentado no checkout: 150,00 MZN.**
- **Co-produtor:** campos de email de quem co-produz e percentagem (50 por defeito), botão "Convidar". Quem co-produz recebe essa percentagem em TODAS as vendas do produto. Não usar sem decisão do dono.

## Imagem 2
- Repete a secção "Links de checkout" e o "Co-produtor".
- **Zona de perigo:** "Apagar produto" (o produto sai das listagens e o checkout deixa de funcionar; ficheiros e capa são apagados, o nome e o histórico de vendas ficam). Não mexer.

## Leitura
- O produto tem **preço de 150,00 MZN** no checkout, mas **continua em rascunho**, logo o link ainda não vende.
- Para a plataforma ligar ao pagamento, o dono ainda tem de decidir como (link de checkout, ou a API da ePay) e de pôr o produto à venda.
- Preços e planos são decisão do dono. Os links de pagamento reais não vão para o repositório.
