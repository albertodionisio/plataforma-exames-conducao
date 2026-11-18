# Vercel: variáveis de ambiente, estado depois de corrigir (2026-11-18, 14:22)

Imagem: `2026-11-18_vercel-variaveis-estado-final.png`. Não mostra valores secretos (cadeado, valores escondidos). Substitui o print das 14:14, que foi apagado: nesse havia uma entrada em Production que o dono já removeu.

Conteúdo: Vercel, projecto da equipa `jjb18`, Settings > Environment Variables. Duas variáveis, ambas só em **Preview**, para a branch `feat/firebase-full-migration`:
1. `FIREBASE_SERVICE_ACCOUNT_JSON`: Preview, "Updated 1m ago".
2. `PHONE_AUTH_PEPPER`: Preview, "Added 1d ago".

Não há nenhuma entrada em Production.

Aviso da Vercel no fundo: "Updated Environment Variable successfully. A new deployment is needed for changes to take effect." (botões Dismiss e Redeploy).

## Próximo passo
- Fazer um novo deploy **de Preview da branch `feat/firebase-full-migration`** (Redeploy desse deploy, não de Production) para as variáveis entrarem em vigor.
- Depois verificar o login no endereço da branch (alias `...git-feat-firebase-full-3be547-jjb18.vercel.app`, já autorizado no Firebase Authentication).
- Os valores das variáveis são segredos: nunca no chat nem no repositório.
