(function () {
  "use strict";
  var CHAVE_TEMA="estrada.tema";
  var botoesTema=Array.prototype.slice.call(document.querySelectorAll("[data-theme-choice]"));
  var estadoTema=document.getElementById("estado-tema");
  function temaGuardado(){try{return localStorage.getItem(CHAVE_TEMA)==="dark"?"dark":"light";}catch(e){return "light";}}
  function aplicarTema(tema,guardar){tema=tema==="dark"?"dark":"light";document.documentElement.setAttribute("data-theme",tema);document.documentElement.style.colorScheme=tema;var meta=document.querySelector("meta[name=theme-color]");if(meta)meta.setAttribute("content",tema==="dark"?"#111a29":"#14284b");botoesTema.forEach(function(b){b.setAttribute("aria-pressed",String(b.getAttribute("data-theme-choice")===tema));});if(estadoTema)estadoTema.textContent="Tema "+(tema==="dark"?"escuro":"claro")+" seleccionado. A preferência fica guardada neste dispositivo.";if(guardar){try{localStorage.setItem(CHAVE_TEMA,tema);}catch(e){if(estadoTema)estadoTema.textContent="Tema alterado nesta página, mas não foi possível guardar a preferência neste dispositivo.";}}}
  aplicarTema(temaGuardado(),false);
  botoesTema.forEach(function(b){b.addEventListener("click",function(){aplicarTema(b.getAttribute("data-theme-choice"),true);});});
  window.addEventListener("storage",function(e){if(e.key===CHAVE_TEMA)aplicarTema(e.newValue,false);});


  // DEF-003: notificações locais, sem push nem pedidos automáticos de permissão.
  var CHAVE_NOTIFICACOES = "estrada.notificacoes.ativas";
  var estadoNotificacoes = document.getElementById("estado-notificacoes");
  var activarNotificacoes = document.getElementById("activar-notificacoes");
  var desactivarNotificacoes = document.getElementById("desactivar-notificacoes");
  var testarNotificacao = document.getElementById("testar-notificacao");

  function notificacoesGuardadas() {
    try { return localStorage.getItem(CHAVE_NOTIFICACOES) === "true"; }
    catch (e) { return false; }
  }

  function actualizarEstadoNotificacoes(mensagem) {
    if (!estadoNotificacoes) return;
    var seguro = window.isSecureContext;
    var suportado = seguro && "Notification" in window;
    var permissao = suportado ? Notification.permission : "unsupported";
    var activo = notificacoesGuardadas() && permissao === "granted";
    if (mensagem) estadoNotificacoes.textContent = mensagem;
    else if (!seguro) estadoNotificacoes.textContent = "Indisponível: o navegador exige uma ligação segura (HTTPS) para apresentar notificações.";
    else if (!("Notification" in window)) estadoNotificacoes.textContent = "Este navegador não suporta notificações.";
    else if (permissao === "denied") estadoNotificacoes.textContent = "Permissão bloqueada no navegador. Altera-a nas definições do site para poderes activar.";
    else if (permissao === "default") estadoNotificacoes.textContent = "Ainda não autorizadas. Só será pedido acesso quando tocares em «Activar notificações».";
    else if (activo) estadoNotificacoes.textContent = "Notificações autorizadas e activas neste dispositivo.";
    else estadoNotificacoes.textContent = "O navegador autorizou notificações, mas os avisos do ESTRADA estão desactivados.";
    if (activarNotificacoes) activarNotificacoes.hidden = !suportado || (permissao === "granted" && activo);
    if (desactivarNotificacoes) desactivarNotificacoes.hidden = !activo;
    if (testarNotificacao) testarNotificacao.hidden = !activo;
  }

  if (activarNotificacoes) activarNotificacoes.addEventListener("click", async function () {
    if (!window.isSecureContext || !("Notification" in window)) {
      actualizarEstadoNotificacoes();
      return;
    }
    try {
      var permissao = Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
      if (permissao === "granted") {
        try { localStorage.setItem(CHAVE_NOTIFICACOES, "true"); }
        catch (e) { actualizarEstadoNotificacoes("A permissão foi concedida, mas não foi possível guardar a preferência neste dispositivo."); return; }
        actualizarEstadoNotificacoes("Notificações activadas. Podes enviar uma notificação de teste.");
      } else if (permissao === "denied") {
        actualizarEstadoNotificacoes("Permissão recusada. Para voltar a permitir, altera a autorização nas definições do navegador.");
      } else {
        actualizarEstadoNotificacoes("Pedido não autorizado. As notificações continuam desactivadas.");
      }
    } catch (e) {
      actualizarEstadoNotificacoes("Não foi possível pedir autorização ao navegador.");
    }
  });

  if (desactivarNotificacoes) desactivarNotificacoes.addEventListener("click", function () {
    try { localStorage.setItem(CHAVE_NOTIFICACOES, "false"); }
    catch (e) { actualizarEstadoNotificacoes("Não foi possível guardar a preferência neste dispositivo."); return; }
    actualizarEstadoNotificacoes("Avisos do ESTRADA desactivados neste dispositivo. A permissão do navegador não foi revogada.");
  });

  if (testarNotificacao) testarNotificacao.addEventListener("click", function () {
    if (!("Notification" in window) || Notification.permission !== "granted" || !notificacoesGuardadas()) {
      actualizarEstadoNotificacoes();
      return;
    }
    try {
      new Notification("ESTRADA", { body: "As notificações estão activas neste dispositivo." });
      actualizarEstadoNotificacoes("Notificação de teste enviada.");
    } catch (e) {
      actualizarEstadoNotificacoes("O navegador não conseguiu apresentar a notificação de teste.");
    }
  });

  window.addEventListener("focus", function () { actualizarEstadoNotificacoes(); });
  actualizarEstadoNotificacoes();

  // DEF-005: apresentar apenas os dados reais já persistidos pelo fluxo de exames.
  var listaHistorico = document.getElementById("historico-exames");
  var resumoProgresso = document.getElementById("resumo-progresso");
  var atalhoUltimoResultado = document.getElementById("atalho-ultimo-resultado");

  function lerHistoricoLocal() {
    try {
      var dados = JSON.parse(localStorage.getItem("hist") || "[]");
      if (!Array.isArray(dados)) return [];
      return dados.filter(function (item) {
        return item && Number.isFinite(Number(item.n)) &&
          Number.isFinite(Number(item.certas)) &&
          Number.isFinite(Number(item.total)) &&
          Number.isFinite(Number(item.nota)) &&
          Number(item.total) > 0;
      }).slice(0, 20);
    } catch (e) {
      return null;
    }
  }

  function elemento(tag, classe, texto) {
    var el = document.createElement(tag);
    if (classe) el.className = classe;
    if (texto !== undefined) el.textContent = texto;
    return el;
  }

  function actualizarAprendizagem() {
    if (!listaHistorico || !resumoProgresso) return;
    var historico = lerHistoricoLocal();
    listaHistorico.textContent = "";
    resumoProgresso.textContent = "";
    if (historico === null) {
      listaHistorico.appendChild(elemento("p", "estado-vazio", "Não foi possível ler o histórico guardado neste navegador. Verifica as permissões de armazenamento do site."));
      return;
    }
    if (!historico.length) {
      resumoProgresso.appendChild(elemento("p", "estado-vazio", "Ainda não existem exames concluídos neste dispositivo."));
      listaHistorico.appendChild(elemento("p", "estado-vazio", "Quando terminares um exame, o respectivo resumo aparecerá aqui."));
    } else {
      var soma = 0, melhor = 0, aprovados = 0, examesUnicos = {};
      historico.forEach(function (item) {
        var nota = Number(item.nota);
        soma += nota;
        melhor = Math.max(melhor, nota);
        if (nota >= 18) aprovados++;
        examesUnicos[String(Number(item.n))] = true;
      });
      var metricas = [
        ["Tentativas", String(historico.length)],
        ["Exames praticados", String(Object.keys(examesUnicos).length)],
        ["Média", (soma / historico.length).toFixed(1).replace(".", ",") + "/20"],
        ["Melhor nota", melhor.toFixed(1).replace(".", ",") + "/20"],
        ["Aprovações", String(aprovados)]
      ];
      metricas.forEach(function (par) {
        var cartao = elemento("div", "metrica-progresso");
        cartao.appendChild(elemento("span", "metrica-rotulo", par[0]));
        cartao.appendChild(elemento("strong", "metrica-valor", par[1]));
        resumoProgresso.appendChild(cartao);
      });
      historico.forEach(function (item, indice) {
        var nota = Number(item.nota);
        var aprovado = nota >= 18;
        var linha = elemento("article", "item-historico");
        var topo = elemento("div", "historico-topo");
        topo.appendChild(elemento("strong", "", "Exame " + Number(item.n)));
        topo.appendChild(elemento("span", aprovado ? "estado-aprovacao aprovado" : "estado-aprovacao reprovado", aprovado ? "Aprovado" : "Reprovado"));
        linha.appendChild(topo);
        linha.appendChild(elemento("p", "historico-detalhe", Number(item.certas) + " certas em " + Number(item.total) + " perguntas"));
        linha.appendChild(elemento("p", "historico-nota", nota.toFixed(1).replace(".", ",") + " / 20 valores"));
        linha.appendChild(elemento("small", "historico-data", "Registo local " + (indice + 1) + " · sem data guardada"));
        listaHistorico.appendChild(linha);
      });
    }
    if (atalhoUltimoResultado) {
      var disponivel = false;
      try {
        var ultima = JSON.parse(sessionStorage.getItem("ultima") || "null");
        disponivel = !!(ultima && ultima.res && Number.isFinite(Number(ultima.n)));
      } catch (e) {}
      atalhoUltimoResultado.textContent = "";
      atalhoUltimoResultado.hidden = !disponivel;
      if (disponivel) {
        var link = elemento("a", "", "Abrir o último resultado desta sessão");
        link.href = "../../#/resultado";
        atalhoUltimoResultado.appendChild(link);
        atalhoUltimoResultado.appendChild(document.createTextNode(" · a revisão completa só fica recuperável enquanto os dados da sessão existirem."));
      }
    }
  }
  actualizarAprendizagem();
  window.addEventListener("storage", function (e) {
    if (e.key === "hist" || e.key === null) actualizarAprendizagem();
  });

  var links = Array.prototype.slice.call(
    document.querySelectorAll(".atalhos a[href^='#']")
  );

  function actualizarAtalho() {
    var hash = window.location.hash;
    links.forEach(function (link) {
      if (link.getAttribute("href") === hash) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      window.requestAnimationFrame(actualizarAtalho);
    });
  });

  window.addEventListener("hashchange", actualizarAtalho);
  actualizarAtalho();
})();
