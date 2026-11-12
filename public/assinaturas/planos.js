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

    var aviso = elemento("p", "assinaturas-aviso", "");
    aviso.id = "assinaturas-aviso";
    aviso.setAttribute("role", "status");
    aviso.setAttribute("aria-live", "polite");

    function seleccionar(indice) {
      grupo.querySelectorAll(".plano-cartao").forEach(function (cartao) {
        cartao.classList.remove("plano-escolhido");
      });
      var escolhido = grupo.querySelector("#estrada-plano-" + indice);
      if (escolhido) {
        escolhido.checked = true;
        escolhido.closest(".plano-cartao").classList.add("plano-escolhido");
      }
      aviso.textContent = "";
    }

    planos.forEach(function (plano, indice) {
      var cartao = elemento("article", "plano-cartao" + (indice === 0 ? " plano-escolhido" : ""));
      var radio = elemento("input");
      radio.type = "radio";
      radio.id = "estrada-plano-" + indice;
      radio.name = "plano";
      radio.value = String(indice);
      radio.checked = indice === 0;
      radio.setAttribute("aria-label", "Seleccionar plano " + plano.nome);
      radio.addEventListener("change", function () { seleccionar(indice); });

      var conteudo = elemento("label", "plano-conteudo");
      conteudo.htmlFor = radio.id;
      var topo = elemento("span", "plano-topo");
      var nome = elemento("span", "plano-nome", plano.nome);
      nome.setAttribute("role", "heading");
      nome.setAttribute("aria-level", "2");
      topo.appendChild(nome);
      topo.appendChild(elemento("span", "plano-validade", plano.validade === "Sem limite" ? "Sem prazo de expiração" : "Válido por " + plano.validade));
      conteudo.appendChild(topo);
      conteudo.appendChild(elemento("span", "plano-preco", plano.preco));
      conteudo.appendChild(elemento("span", "plano-periodicidade", plano.validade === "Sem limite" ? "Acesso gratuito" : "Pagamento por período de acesso"));

      var tituloBeneficios = elemento("h3", "plano-beneficios-titulo", "Incluído neste plano");
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

      var botao = elemento("button", "assinaturas-botao", "Aderir ao plano " + plano.nome);
      botao.type = "button";
      botao.addEventListener("click", function () {
        seleccionar(indice);
        aviso.textContent = plano.preco === "0 MT"
          ? "O plano Free é gratuito. A adesão aos planos pagos ainda não está disponível nesta versão."
          : "O plano " + plano.nome + " foi seleccionado. A adesão e os pagamentos ainda não estão activos nesta versão.";
      });

      cartao.appendChild(radio);
      cartao.appendChild(conteudo);
      cartao.appendChild(tituloBeneficios);
      cartao.appendChild(lista);
      cartao.appendChild(botao);
      grupo.appendChild(cartao);
    });

    formulario.appendChild(grupo);
    formulario.appendChild(aviso);
    raiz.appendChild(formulario);
    raiz.appendChild(elemento("p", "assinaturas-nota", "Os preços e as condições apresentados correspondem aos planos actualmente definidos no ESTRADA."));
  }

  window.renderizarPlanosEstrada = renderizar;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", renderizar);
  else renderizar();
})();
