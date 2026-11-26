# Vercel: nova variável de ambiente FIREBASE_SERVICE_ACCOUNT_JSON (2026-11-18, 14:05)

Imagem: `2026-11-18_vercel-nova-variavel-firebase-service-account.png`. Não mostra nenhum valor secreto: o campo "Value" está vazio ("Enter a value").

Conteúdo: Vercel, projecto da equipa `jjb18`, Settings > Environment Variables, janela "Add Environment Variable".
- **Key (nome):** `FIREBASE_SERVICE_ACCOUNT_JSON`.
- **Value:** vazio no print.
- **Note (opcional):** "Firebase Admin SDK - Preview".
- **Environments:** o campo aparece com "Production" e a lista aberta é a de **branches de Preview**. Nenhuma está marcada no print. As branches listadas: `feat/cache-dupla-estrada`, `feat/firebase-firestore-foundation`, `feat/firebase-full-migration`, `test/chatgpt-write-access-2026-11-13`, `test/integracao-chatgpt`, `teste-acesso-claude`, `teste-acesso-claude-2`.

## Para quem for guiar o dono (ChatGPT)
- O valor desta variável é o ficheiro JSON da conta de serviço do Firebase Admin. **É um segredo.** Nunca colar no chat, nunca guardar no repositório. Só vai para o campo "Value" da Vercel.
- A nota diz "Preview": a ideia é ter a variável só em Preview, e só para a branch `feat/firebase-full-migration`. Confirmar com o dono que está em **Preview** e não em **Production** (o campo mostra "Production" por defeito).
- Marcar a variável como **Sensitive** se a Vercel oferecer.
- Depois de guardar, é preciso um novo deploy da branch para a variável entrar em vigor.
- Não é preciso apagar nem mexer nas branches de teste para isto.
