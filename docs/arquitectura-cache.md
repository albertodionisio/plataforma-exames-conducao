# Arquitectura de cache do ESTRADA

## Objectivo

Usar duas camadas complementares para os conteúdos públicos dos exames:

1. **Cache partilhada (CDN do alojamento):** distribui os mesmos ficheiros estáticos de perguntas e multimédia a vários utilizadores. A cópia pode ser servida pelo ponto de presença da CDN sem voltar à origem em cada pedido.
2. **Cache individual (Service Worker/Cache API):** conserva no dispositivo os ficheiros que esse navegador já recebeu, permitindo abertura mais rápida e utilização offline enquanto a cópia estiver disponível.

## Política inicial

| Conteúdo | Cache local | Cache partilhada/CDN |
|---|---:|---:|
| Scripts de perguntas e alternativas em `data/exames/exameN.js` | 30 dias, com revalidação em segundo plano | 30 dias |
| Imagens e PDFs públicos em `public/` | 365 dias, com revalidação em segundo plano | 365 dias |
| Interface (HTML/CSS/JS base) | Cache de apoio com tentativa de rede primeiro | Revalidada pelo alojamento |
| Autenticação, perfil, respostas, resultados e histórico | Não guardar pelo Service Worker | Nunca partilhar |

Os prazos são máximos de validade, não uma garantia de retenção física. O navegador pode limpar a cache por pressão de armazenamento; a CDN pode remover cópias por gestão interna. O Service Worker tenta revalidar conteúdos em segundo plano quando estes são pedidos e conserva a cópia anterior se o dispositivo estiver offline.

## Fluxo de funcionamento

1. O navegador pede um ficheiro público do exame.
2. Se existir cópia local válida, ela é apresentada imediatamente.
3. Em segundo plano, o Service Worker pede a versão ao alojamento; a CDN pode responder a partir da cache partilhada.
4. Se a versão mudou, a cópia local é substituída.
5. Se não existir cópia local, o ficheiro é descarregado, entregue e guardado no dispositivo.
6. Se não houver rede, a última cópia local é usada quando disponível.

## Relação com Firebase e quotas

**Não se deve contar uma abertura de exame como exactamente uma leitura Firestore.** A contagem do Firestore depende dos documentos efectivamente lidos. Nesta arquitectura, as perguntas e alternativas continuam a ser ficheiros públicos estáticos servidos pela CDN, e não documentos consultados directamente no Firestore. Assim, a consulta desses ficheiros não consome leituras Firestore.

Firebase deverá guardar dados privados/individuais (conta, progresso e resultados) quando a migração de autenticação e backend for executada. Esses dados não entram na CDN nem na cache pública.

Uma CDN pode reduzir pedidos à origem e transferência de origem, mas cada entrega aos utilizadores continua a contar para as quotas de pedidos/tráfego do fornecedor CDN. A primeira carga também pode ser atendida pela origem. Não existe garantia de uma única cópia física global: a CDN pode manter cópias em regiões diferentes.

## Actualização e publicação

- Perguntas: TTL inicial de 30 dias.
- Imagens/PDF: TTL inicial de 365 dias.
- Os deployments Netlify invalidam/revalidam o conteúdo publicado; os nomes e URLs dos ficheiros devem manter-se estáveis e o deploy deve ser testado.
- A revalidação em segundo plano permite obter conteúdo actualizado sem bloquear a abertura quando a cópia local ainda é válida.
- Não colocar nesta cache tokens, sessões, dados de conta, respostas, notas ou histórico.

## Activação e validação

- O Service Worker só funciona em HTTPS (ou localhost).
- Confirmar no navegador que `service-worker.js` está registado e que os caches `estrada-cache-exames-v1` e `estrada-cache-media-v1` recebem ficheiros.
- Testar primeiro acesso online, segundo acesso, modo offline, ficheiro expirado, actualização após novo deploy e logout.
- A quota física da Cache API é gerida pelo navegador/dispositivo; não existe um limite universal de MB/GB definido por esta aplicação.
- Esta implementação usa o CDN do Netlify, porque o repositório actual contém `netlify.toml` e o build publica em `dist/`. Não presume que a Vercel esteja a servir a versão actualmente publicada.

## Limites conhecidos desta primeira entrega

- O catálogo actual inclui scripts dos exames no HTML, pelo que o navegador pode pedir vários scripts durante o carregamento inicial; a cache local passa a reutilizar esses pedidos nas visitas seguintes.
- Esta camada não migra Supabase Auth para Firebase e não cria dados/colecções Firebase. Isso é uma tarefa separada, necessária para migrar autenticação e dados pessoais sem interromper as contas existentes.
