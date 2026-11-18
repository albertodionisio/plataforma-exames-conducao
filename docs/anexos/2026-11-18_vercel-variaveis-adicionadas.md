# Vercel: lista de variáveis de ambiente depois de adicionar (2026-11-18, 14:14)

Imagem: `2026-11-18_vercel-variaveis-adicionadas.png`. Não mostra valores secretos (as variáveis aparecem com cadeado, valores escondidos).

Conteúdo: Vercel, projecto da equipa `jjb18`, Settings > Environment Variables. Três entradas:
1. `FIREBASE_SERVICE_ACCOUNT_JSON`, ambiente **Production**, "Added just now".
2. `FIREBASE_SERVICE_ACCOUNT_JSON`, ambiente **Preview**, branch `feat/firebase-full-migration`, "Added just now".
3. `PHONE_AUTH_PEPPER`, ambiente Preview, branch `feat/firebase-full-migration`, "Added 1d ago".

Aviso da Vercel no fundo: "Added Environment Variable successfully. A new deployment is needed for changes to take effect." (botões Dismiss e Redeploy).

## Atenção para quem guiar o dono
- A entrada 1 (**Production**) provavelmente não era a intenção: a nota da variável diz "Firebase Admin SDK - Preview". A chave de administrador do Firebase não deve estar em Production enquanto a branch `feat/firebase-full-migration` não for para `main` e não houver autorização do dono. Recomendação: o dono apagar a entrada de Production (menu "..." > Remove) e deixar só a de Preview.
- A entrada 2 (Preview, só para `feat/firebase-full-migration`) é a pretendida.
- Para as variáveis entrarem em vigor é preciso um novo deploy da branch (Redeploy). O deploy deve ser de Preview, não de Production.
- Os valores destas variáveis são segredos e nunca vão para o chat nem para o repositório.
