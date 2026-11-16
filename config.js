// Configuração central. O nome é provisório: mudar só aqui.
window.APP = {
  nome: "ESTRADA",
  slogan: "Exames de condução em Moçambique",
  // Configuração pública da aplicação Web Firebase (a apiKey do Firebase é identificador público).
  // O domínio Vercel é usado como authDomain através do proxy /__/auth configurado em vercel.json.
  firebase: {
    apiKey: "AIzaSyBTkZuf3RabULuWA9mFQDIqUBbvMHUBQSI",
    authDomain: (window.location && /\\.vercel\\.app$/i.test(window.location.hostname)) ? window.location.hostname : "plataforma-exames-conducao.firebaseapp.com",
    projectId: "plataforma-exames-conducao",
    storageBucket: "plataforma-exames-conducao.firebasestorage.app",
    messagingSenderId: "779881429626",
    appId: "1:779881429626:web:43dd5919d69995c72119c3"
  },
  googleOAuthEnabled: true,
  totalExames: 51,
  gratuitos: 3,
  perguntasPorExame: 25,
  minutos: 60,
  valorPorResposta: 0.8,
  limiar: 18,
  // Modo temporário: todos os exames disponíveis ficam abertos para testes, sem pagamentos.
  // Desactivar apenas com autorização do dono antes da abertura comercial.
  modoTesteAcessoPago: true,
  examesAbertosTeste: [1, 51],
  planos: [
    { nome: "Free", preco: "0 MT", validade: "Sem limite", exames: "3 fixos", anuncios: "Sim", suporte: "Normal" },
    { nome: "Semanal Básico", preco: "50 MT", validade: "7 dias", exames: "25", anuncios: "Reduzida", suporte: "Normal" },
    { nome: "Semanal Completo", preco: "80 MT", validade: "7 dias", exames: "50", anuncios: "Reduzida", suporte: "Normal" },
    { nome: "Mensal Básico", preco: "80 MT", validade: "30 dias", exames: "25", anuncios: "Sem anúncios", suporte: "Prioritário" },
    { nome: "Mensal Completo", preco: "150 MT", validade: "30 dias", exames: "50", anuncios: "Sem anúncios", suporte: "Prioritário" }
  ]
};
