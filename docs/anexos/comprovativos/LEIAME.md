# Comprovativos

Capturas de ecrã enviadas pelo dono (Borja) como **comprovativo** do estado real do Firebase, para qualquer sessão (Claude, ChatGPT) as consultar. Não são tarefas nem decisões: o que for decidido regista-se em `REGRAS.md`, `PENDENTE.md` e `HISTORICO.md`.

- **Projecto Firebase:** `plataforma-exames-conducao`, plano Spark (sem custos), consola Authentication.
- **Data das capturas:** 2026-11-26, entre as 13:57 e as 14:00 (hora de Maputo).
- **Privacidade:** o repositório é público. Na captura 01 foram escondidas as colunas «Identificador» (e-mails e telefones) e «UID do usuário». Nas outras não há dados pessoais.
- O site é estático: estes ecrãs mostram a configuração do Firebase, não ficheiros do repositório.

| Ficheiro | O que mostra |
|---|---|
| `..._01-usuarios-ocultado.jpg` | Separador **Usuários**: 10 utilizadores (1 a 10 de 10), criados entre 16 e 20 de Novembro. A maioria entra com o fornecedor Google; alguns também com e-mail/senha; um só com e-mail/senha; uma linha sem fornecedor visível. Aviso do Firebase sobre o fim do suporte a Dynamic Links (autenticação por link de e-mail em apps móveis e Cordova no OAuth de apps da Web). |
| `..._02-metodo-de-login.jpg` | Separador **Método de login**: **E-mail/senha** ativado e **Google** ativado. A autenticação multifator por SMS aparece como recurso avançado que exige upgrade (Identity Platform). |
| `..._03-modelo-verificacao-de-email.jpg` | **Modelos**: e-mail «Verificação de endereço de e-mail». Remetente `noreply@plataforma-exames-conducao.firebaseapp.com`, nome do remetente «não fornecido», assunto «Verify your email for %APP_NAME%». |
| `..._04-modelo-redefinicao-de-senha.jpg` | **Modelos**: e-mail «Redefinição de senha». Assunto «Reset your password for %APP_NAME%». |
| `..._05-modelo-alteracao-de-email.jpg` | **Modelos**: e-mail «Alteração de endereço de e-mail». Assunto «Your sign-in email was changed for %APP_NAME%». |
| `..._06-modelo-notificacao-mfa.jpg` | **Modelos**: «Notificação de registro da autenticação multifator». Assunto «You've added 2 step verification to your %APP_NAME% account.» |
| `..._07-uso.jpg` | Separador **Uso**: utilizadores activos por dia (pico de 6), por mês (10, acumulado, período de facturação de 1 de Nov a 1 de Dez) e uso de SMS (nenhum dado). |

## Observações para quem for usar isto
- Nas capturas 03 a 06, o **idioma do modelo está em inglês**: os e-mails de verificação, redefinição de senha e alteração de e-mail saem em inglês. O modelo de verificação por SMS também existe na lista, sem estar aberto.
- O **nome do remetente não está definido** («não fornecido»); o endereço é o `noreply` do domínio `firebaseapp.com`.
- Estes pontos descrevem só o que as capturas mostram. Não foram confirmados no Firebase por nenhuma sessão.
