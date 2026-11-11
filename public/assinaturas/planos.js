(function () {
  "use strict";

  function elemento(tag, classe, texto) {
    var node = document.createElement(tag);
    if (classe) node.className = classe;
    if (texto !== undefined) node.textContent = texto;
    return node;
  }

  function beneficios(plano) {
    return [
      { titulo: plano.simulados + " simulados", detalhe: "Acesso conforme o plano" },
      { titulo: plano.anuncios === "Sim" ? "Com publicidade" : plano.anuncios === "Reduzida" ? "Publicidade reduzida" : "Sem anúncios", detalhe: "Condição durante a validade" },
      { titulo: plano.suporte === "Prioritário" ? "Atendimento prioritário" : "Atendimento normal", detalhe: "Apoio ao utilizador" },
      { titulo: plano.validade === "Sem limite" ? "Acesso sem limite de tempo" : "Válido por " + plano.validade, detalhe: "Tentativas ilimitadas nos simulados disponíveis" }
    ];
  }

  function renderizar() {
    var raiz = document.getElementById("assinaturas-app");
    if (!raiz) return;
    raiz.replaceChildren();

    var planos = window.APP && Array.isArray(window.APP.planos) ? window.APP.planos : [];
    if (!planos.length) {
      raiz.appendChild(elemento("p", "assinaturas-aviso", "Não foi possível carregar os planos. Tenta novamente mais tarde."));
      return;
    }

    var cabecalho = elemento("header", "assinaturas-cabecalho");
    cabecalho.appendChild(elemento("p", "assinaturas-sobretitulo", "ASSINATURAS E ACESSO"));
    cabecalho.appendChild(elemento("h1", "", "Escolhe o plano certo para ti"));
    cabecalho.appendChild(elemento("p", "assinaturas-intro", "Compara os períodos de acesso e os benefícios de cada opção."));
    raiz.appendChild(cabecalho);

    var formulario = elemento("form", "assinaturas-formulario");
    formulario.addEventListener("submit", function (evento) { evento.preventDefault(); });

    var grupo = elemento("fieldset", "assinaturas-lista");
    grupo.appendChild(elemento("legend", "assinaturas-legenda", "Planos disponíveis"));
    var selecionado = 0;

    planos.forEach(function (plano, indice) {
      var cartao = elemento("article", "plano-cartao" + (indice === 0 ? " plano-gratis" : ""));
      var label = elemento("label", "plano-seleccao");
      var radio = elemento("input");
      radio.type = "radio";
      radio.name = "plano";
      radio.value = String(indice);
      radio.checked = indice === 0;
      radio.setAttribute("aria-label", "Seleccionar plano " + plano.nome);
      radio.addEventListener("change", function () {
        selecionado = indice;
        grupo.querySelectorAll(".plano-cartao").forEach(function (item) { item.classList.remove("plano-escolhido"); });
        cartao.classList.add("plano-escolhido");
        botao.textContent = "Continuar com " + plano.nome;
        aviso.textContent = "";
      });

      var topo = elemento("div", "plano-topo");
      var nome = elemento("h2", "plano-nome", plano.nome);
      var validade = elemento("span", "plano-validade", plano.validade === "Sem limite" ? "Sem prazo de expiração" : "Válido por " + plano.validade);
      topo.appendChild(nome);
      topo.appendChild(validade);

      var preco = elemento("p", "plano-preco", plano.preco);
      var periodicidade = elemento("p", "plano-periodicidade", plano.validade === "Sem limite" ? "Acesso gratuito" : "Pagamento por período de acesso");

      var lista = elemento("ul", "plano-beneficios");
      beneficios(plano).forEach(function (item) {
        var li = elemento("li");
        li.appendChild(elemento("span", "beneficio-visto", "✓"));
        var texto = elemento("span", "beneficio-texto");
        texto.appendChild(elemento("strong", "", item.titulo));
        texto.appendChild(elemento("small", "", item.detalhe));
        li.appendChild(texto);
        lista.appendChild(li);
      });

      label.appendChild(radio);
      label.appendChild(elemento("span", "plano-radio-visual"));
      cartao.appendChild(label);
      cartao.appendChild(topo);
      cartao.appendChild(preco);
      cartao.appendChild(periodicidade);
      cartao.appendChild(lista);
      if (indice === 0) cartao.classList.add("plano-escolhido");
      grupo.appendChild(cartao);
    });

    formulario.appendChild(grupo);
    var acao = elemento("div", "assinaturas-acao");
    var botao = elemento("button", "assinaturas-botao", "Continuar com " + planos[0].nome);
    botao.type = "button";
    var aviso = elemento("p", "assinaturas-aviso", "");
    botao.addEventListener("click", function () {
      var plano = planos[selecionado];
      aviso.textContent = plano.preco === "0 MT"
        ? "O plano Free é gratuito. Os pagamentos dos planos pagos ainda não estão activos nesta versão."
        : "O plano " + plano.nome + " está disponível para consulta. Os pagamentos ainda não estão activos nesta versão.";
    });
    acao.appendChild(botao);
    acao.appendChild(aviso);
    formulario.appendChild(acao);
    raiz.appendChild(formulario);
    raiz.appendChild(elemento("p", "assinaturas-nota", "Os preços e as condições apresentados correspondem aos planos actualmente definidos no ESTRADA."));
  }

  window.renderizarPlanosEstrada = renderizar;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", renderizar);
  else renderizar();
})();