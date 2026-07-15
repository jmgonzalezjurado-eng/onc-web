/* =========================================================================
   Renderiza el "registro" de contenido, anima el filtrado y gestiona los
   botones de compartir y descargar.
   Todo el contenido vive en /data/documentos.js — este archivo solo lo dibuja.
   ========================================================================= */
(function () {
  "use strict";

  var MESES = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];

  // Iconos en línea (heredan el color del botón)
  var ICON_SHARE = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/></svg>';
  var ICON_DL    = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v12"/><path d="m7 11 5 5 5-5"/><path d="M5 21h14"/></svg>';

  function fechaLegible(iso) {
    var p = iso.split("-");
    return p[2] + " " + MESES[parseInt(p[1], 10) - 1] + " " + p[0];
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function prefiereMenosMovimiento() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function fila(item) {
    var compartir =
      '<button type="button" class="acc acc--share js-compartir" ' +
        'data-pagina="' + esc(item.pagina) + '" data-titulo="' + esc(item.titulo) + '" ' +
        'aria-label="Compartir: ' + esc(item.titulo) + '">' +
        ICON_SHARE + "<span>Compartir</span></button>";

    var descargar = item.pdf
      ? '<a class="acc acc--pdf" href="' + esc(item.pdf) + '" download ' +
          'aria-label="Descargar PDF: ' + esc(item.titulo) + '">' + ICON_DL + "<span>Descargar</span></a>"
      : "";

    return (
      '<div class="registro__fila">' +
        '<span class="registro__fecha">' + fechaLegible(item.fecha) + "</span>" +
        '<span class="registro__cat" data-cat="' + esc(item.categoria) + '">' + esc(item.catLabel) + "</span>" +
        '<span class="registro__titulo"><a href="' + esc(item.pagina) + '">' + esc(item.titulo) + "</a>" +
          '<span class="registro__resumen">' + esc(item.resumen) + "</span>" +
        "</span>" +
        '<span class="registro__acciones">' + compartir + descargar + "</span>" +
      "</div>"
    );
  }

  // ---- Tarjetas (casos y entrevistas): cuadrado de imagen, título y fecha ----
  function tarjeta(item) {
    var estilo = item.imagen
      ? ' style="background-image:url(\'' + esc(item.imagen) + '\')"'
      : "";
    var vacia = item.imagen ? "" : ' data-vacia="si"';
    return (
      '<a class="tarjeta" href="' + esc(item.pagina) + '">' +
        '<div class="tarjeta__img"' + vacia + estilo + ' role="img" aria-label="' + esc(item.titulo) + '"></div>' +
        '<div class="tarjeta__cuerpo">' +
          '<h3 class="tarjeta__titulo">' + esc(item.titulo) + "</h3>" +
          '<p class="tarjeta__fecha">' + fechaLegible(item.fecha) + "</p>" +
        "</div>" +
      "</a>"
    );
  }

  function ordenar(lista) {
    return lista.slice().sort(function (a, b) { return a.fecha < b.fecha ? 1 : -1; });
  }

  function html(lista) {
    if (!lista.length) return '<p class="vacio">Aún no hay publicaciones en esta sección.</p>';
    return ordenar(lista).map(fila).join("");
  }

  // Render directo (carga inicial, sin animación)
  function render(contenedor, lista) {
    contenedor.innerHTML = html(lista);
  }

  // Render animado (al filtrar): desvanece, intercambia y hace entrar las filas
  // de forma escalonada. Muy sutil.
  function renderAnimado(contenedor, lista) {
    if (prefiereMenosMovimiento()) { render(contenedor, lista); return; }

    contenedor.classList.add("registro--saliendo");
    window.setTimeout(function () {
      contenedor.innerHTML = html(lista);
      contenedor.classList.remove("registro--saliendo");
      var filas = contenedor.querySelectorAll(".registro__fila");
      for (var i = 0; i < filas.length; i++) {
        filas[i].style.animationDelay = (i * 45) + "ms";
        filas[i].classList.add("registro__fila--entra");
      }
    }, 170);
  }

  // Compartir: usa el diálogo nativo si existe (móvil y navegadores modernos);
  // si no, abre el compositor de LinkedIn con la URL de la página del documento.
  function compartir(paginaRel, titulo) {
    var url;
    try { url = new URL(paginaRel, window.location.href).href; }
    catch (e) { url = paginaRel; }

    if (navigator.share) {
      navigator.share({ title: titulo, url: url }).catch(function () {});
    } else {
      window.open(
        "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(url),
        "_blank", "noopener,noreferrer,width=600,height=680"
      );
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var datos = window.CONTENIDO || [];

    document.querySelectorAll("[data-registro]").forEach(function (cont) {
      var seccion = cont.getAttribute("data-registro");           // documento | caso | entrevista | todos
      var limite  = parseInt(cont.getAttribute("data-limite") || "0", 10);

      var base = seccion === "todos"
        ? datos
        : datos.filter(function (d) { return d.seccion === seccion; });

      if (limite > 0) base = ordenar(base).slice(0, limite);

      render(cont, base);  // carga inicial sin animación

      var grupo = document.querySelector('[data-filtros="' + seccion + '"]');
      if (grupo) {
        grupo.addEventListener("click", function (e) {
          var btn = e.target.closest(".filtro");
          if (!btn) return;
          grupo.querySelectorAll(".filtro").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
          btn.setAttribute("aria-pressed", "true");
          var cat = btn.getAttribute("data-cat");
          var filtrada = cat === "todas" ? base : base.filter(function (d) { return d.categoria === cat; });
          renderAnimado(cont, filtrada);   // filtrado con transición suave
        });
      }
    });

    // ---- Contenedores de TARJETAS (portada: casos y entrevistas) ----
    document.querySelectorAll("[data-tarjetas]").forEach(function (cont) {
      var seccion = cont.getAttribute("data-tarjetas");
      var limite  = parseInt(cont.getAttribute("data-limite") || "0", 10);

      var lista = datos.filter(function (d) { return d.seccion === seccion; });
      lista = ordenar(lista);
      if (limite > 0) lista = lista.slice(0, limite);

      cont.innerHTML = lista.length
        ? lista.map(tarjeta).join("")
        : '<p class="vacio">Aún no hay publicaciones en esta sección.</p>';
    });

    // Delegación global para los botones de compartir
    document.addEventListener("click", function (e) {
      var btn = e.target.closest(".js-compartir");
      if (!btn) return;
      e.preventDefault();
      compartir(btn.getAttribute("data-pagina"), btn.getAttribute("data-titulo") || document.title);
    });
  });
})();
