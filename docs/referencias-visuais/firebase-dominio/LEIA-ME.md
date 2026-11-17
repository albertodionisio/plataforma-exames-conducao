# Prints: domínio não autorizado no Firebase Authentication (2026-11-17)

- `01-login-dominio-nao-autorizado.jpg`: página de login do preview Vercel (`...4cvmm3-jjb18.vercel.app`) a mostrar "Este domínio ainda não está autorizado no Firebase Authentication."
- `02-firebase-dominios-autorizados.jpg`: Firebase Console > Authentication > Configurações > Domínios autorizados. Só estão: localhost, plataforma-exames-conducao.firebaseapp.com, plataforma-exames-conducao.web.app e o alias `plataforma-exames-conducao-git-feat-firebase-full-3be547-jjb18.vercel.app`.

Leitura: o preview aberto no telemóvel tem um URL diferente (o de cada deploy, com hash). Esse URL não está na lista. Solução: abrir o alias da branch que já está autorizado, ou adicionar o domínio do deploy em "Adicionar domínio".
