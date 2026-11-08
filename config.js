// Configuração central. O nome é provisório: mudar só aqui.
window.APP = {
  nome: "ESTRADA",
  slogan: "Simulados para o exame de condução em Moçambique",
  totalSimulados: 50,
  gratuitos: 3,
  perguntasPorSimulado: 25,
  minutos: 60,
  valorPorResposta: 0.8,
  limiar: 18,
  planos: [
    { nome: "Free", preco: "0 MT", validade: "Sem limite", simulados: "3 fixos", anuncios: "Sim", suporte: "Normal" },
    { nome: "Semanal Básico", preco: "50 MT", validade: "7 dias", simulados: "25", anuncios: "Reduzida", suporte: "Normal" },
    { nome: "Semanal Completo", preco: "80 MT", validade: "7 dias", simulados: "50", anuncios: "Reduzida", suporte: "Normal" },
    { nome: "Mensal Básico", preco: "80 MT", validade: "30 dias", simulados: "25", anuncios: "Sem anúncios", suporte: "Prioritário" },
    { nome: "Mensal Completo", preco: "150 MT", validade: "30 dias", simulados: "50", anuncios: "Sem anúncios", suporte: "Prioritário" }
  ]
};
