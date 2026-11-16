# Anexos

Pasta para ficheiros de apoio enviados pelo dono (capturas de ecrã, imagens, etc.), só para consulta por qualquer sessão (Claude, ChatGPT, outras).
Não são tarefas nem decisões: o que for decidido regista-se em `REGRAS.md`, `PENDENTE.md` e `HISTORICO.md`.

## Conteúdo
- `2026-11-11_resposta-claude-GER-008_parte1.jpg` a `parte3.jpg`: capturas, por ordem de leitura, da resposta do Claude ao concluir a GER-008 (decisão técnica do backend na OCI). O documento completo está em `docs/architecture/DECISAO_BACKEND_OCI.md`.
- `2026-11-16_firebase-dominios-autorizados.jpg`: captura do dono (telemóvel, 16/11/2026 11:46) da consola Firebase, Authentication → Configurações → Domínios autorizados. Mostra 4 domínios: `localhost` (Default), `plataforma-exames-conducao.firebaseapp.com` (Default), `plataforma-exames-conducao.web.app` (Default) e `plataforma-exames-conducao-git-feat-firebase-full-3be547-jjb18.vercel.app` (Custom, o Preview da branch `feat/firebase-full`). Relaciona-se com BE-002 (migração para Firebase) e FE-012 (login ao escolher um exame): o pendente de BE-002 diz «autorizar no Firebase o domínio de produção e Preview». O Preview já aparece autorizado; não aparece nenhum domínio de produção da Vercel. Não mostra segredos.
