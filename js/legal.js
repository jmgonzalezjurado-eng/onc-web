/* =========================================================================
   Banner de cookies + modales legales (aviso legal, privacidad, cookies).
   Se inyecta solo en todas las páginas: basta con incluir este archivo.
   El consentimiento se recuerda en localStorage ("onc_cookies").

   PARA REVISAR LOS TEXTOS: están en el objeto TEXTOS, más abajo.
   ========================================================================= */
(function () {
  "use strict";

  var CLAVE = "onc_cookies";
  var ENTIDAD = "Fundación Universidad Loyola Andalucía";
  var CIF = "G14894158";

  var TEXTOS = {
    aviso: {
      titulo: "Aviso legal",
      html:
        "<h3>Titular del sitio</h3>" +
        "<p>Este sitio web corresponde al proyecto <b>Asesoramiento al ICAC ante las propuestas normativas y decisiones de agenda del IASB y del EFRAG en materia de información financiera</b>, desarrollado por la " + ENTIDAD + " (CIF " + CIF + ").</p>" +
        "<p>El proyecto está financiado por la Fundación Española para la Ciencia y la Tecnología (FECYT), en el marco de la Convocatoria de ayudas para el fomento de la cultura de la innovación pública 2025, y se desarrolla en colaboración con el Instituto de Contabilidad y Auditoría de Cuentas (ICAC).</p>" +
        "<h3>Objeto</h3>" +
        "<p>Este sitio tiene una finalidad divulgativa y de difusión científica. Los contenidos publicados recogen el análisis del equipo investigador sobre los trabajos del IASB y del EFRAG.</p>" +
        "<h3>Naturaleza de los contenidos</h3>" +
        "<p>Los documentos, análisis y opiniones publicados corresponden al equipo investigador y no constituyen asesoramiento contable, jurídico ni financiero, ni representan necesariamente la posición oficial del ICAC, del IASB, del EFRAG ni de las entidades colaboradoras. No deben utilizarse como única base para la toma de decisiones.</p>" +
        "<h3>Propiedad intelectual</h3>" +
        "<p>Los contenidos elaborados por el equipo del proyecto están protegidos por la normativa de propiedad intelectual. Se permite su cita y difusión con fines académicos y profesionales siempre que se indique la fuente y la autoría. Las denominaciones y marcas de terceros que aparecen en el sitio pertenecen a sus respectivos titulares.</p>" +
        "<h3>Enlaces externos</h3>" +
        "<p>El sitio puede incluir enlaces a páginas de terceros (entre otros, IASB, EFRAG, ICAC, AECA o ASEPUC). No se asume responsabilidad sobre sus contenidos ni sobre sus políticas de privacidad.</p>" +
        "<h3>Legislación aplicable</h3>" +
        "<p>Este aviso legal se rige por la legislación española, en particular por la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE).</p>"
    },
    privacidad: {
      titulo: "Política de privacidad",
      html:
        "<h3>Responsable del tratamiento</h3>" +
        "<p>" + ENTIDAD + " (CIF " + CIF + "), responsable del proyecto de asesoramiento científico al ICAC.</p>" +
        "<h3>Datos que se tratan</h3>" +
        "<p>Este sitio es de carácter informativo y <b>no solicita el registro de usuarios</b>. Únicamente se tratan:</p>" +
        "<ul>" +
        "<li>Los datos que el usuario facilite voluntariamente si contacta con el equipo por correo electrónico.</li>" +
        "<li>Datos técnicos de navegación de forma agregada y anónima, en su caso, con fines estadísticos.</li>" +
        "</ul>" +
        "<h3>Finalidad y base jurídica</h3>" +
        "<p>Los datos facilitados se emplean exclusivamente para atender la consulta realizada y, si procede, para la difusión de las novedades del proyecto cuando el usuario lo haya solicitado. La base jurídica es el consentimiento del interesado y el interés legítimo en la difusión científica.</p>" +
        "<h3>Conservación</h3>" +
        "<p>Los datos se conservarán durante el tiempo necesario para atender la solicitud y, posteriormente, durante los plazos legalmente exigibles.</p>" +
        "<h3>Destinatarios</h3>" +
        "<p>No se cederán datos a terceros salvo obligación legal. El alojamiento del sitio puede implicar el tratamiento técnico de datos por parte del proveedor de hosting.</p>" +
        "<h3>Derechos</h3>" +
        "<p>El usuario puede ejercer sus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad dirigiéndose a la " + ENTIDAD + ". Asimismo, puede presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).</p>" +
        "<h3>Normativa</h3>" +
        "<p>Se aplica el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).</p>"
    },
    cookies: {
      titulo: "Política de cookies",
      html:
        "<h3>Qué son las cookies</h3>" +
        "<p>Una cookie es un pequeño archivo de texto que se almacena en el dispositivo del usuario al visitar una página web y que permite recordar información sobre su visita.</p>" +
        "<h3>Cookies que utiliza este sitio</h3>" +
        "<p>Este sitio es estático y no utiliza cookies publicitarias ni de perfilado. En concreto se emplea:</p>" +
        "<ul>" +
        "<li><b>Técnica y necesaria:</b> un dato de almacenamiento local que recuerda que el usuario ha aceptado este aviso, para no volver a mostrarlo. No requiere consentimiento previo y no permite identificar al usuario.</li>" +
        "</ul>" +
        "<p>Si en el futuro se incorporaran cookies analíticas o de terceros (por ejemplo, al insertar vídeos alojados en plataformas externas), se informará en esta política y se recabará el consentimiento cuando sea necesario.</p>" +
        "<h3>Contenido insertado de terceros</h3>" +
        "<p>Las páginas que incluyan vídeos u otros contenidos insertados desde plataformas externas pueden generar cookies propias de dichas plataformas, sujetas a sus respectivas políticas.</p>" +
        "<h3>Gestión</h3>" +
        "<p>El usuario puede configurar su navegador para bloquear o eliminar las cookies y el almacenamiento local. Deshabilitarlos puede afectar al funcionamiento del sitio.</p>" +
        "<h3>Consentimiento</h3>" +
        "<p>Al pulsar «Aceptar» el usuario acepta el uso descrito en esta política. Puede revocar su consentimiento en cualquier momento desde la configuración de su navegador.</p>"
    }
  };

  /* ---------------- Modales ---------------- */

  function crearModal() {
    var ov = document.createElement("div");
    ov.className = "modal-overlay";
    ov.id = "modalOverlay";
    ov.setAttribute("role", "dialog");
    ov.setAttribute("aria-modal", "true");
    ov.setAttribute("aria-labelledby", "modalTitulo");
    ov.innerHTML =
      '<div class="modal">' +
        '<div class="modal__head">' +
          '<h2 id="modalTitulo"></h2>' +
          '<button class="modal__x" type="button" aria-label="Cerrar">&times;</button>' +
        "</div>" +
        '<div class="modal__body" id="modalCuerpo"></div>' +
      "</div>";
    document.body.appendChild(ov);

    ov.addEventListener("click", function (e) { if (e.target === ov) cerrarModal(); });
    ov.querySelector(".modal__x").addEventListener("click", cerrarModal);
    return ov;
  }

  var ultimoFoco = null;

  function abrirModal(clave) {
    var t = TEXTOS[clave];
    if (!t) return;
    var ov = document.getElementById("modalOverlay") || crearModal();
    document.getElementById("modalTitulo").textContent = t.titulo;
    document.getElementById("modalCuerpo").innerHTML = t.html;
    ov.classList.add("open");
    document.body.style.overflow = "hidden";
    ultimoFoco = document.activeElement;
    ov.querySelector(".modal__x").focus();
  }

  function cerrarModal() {
    var ov = document.getElementById("modalOverlay");
    if (!ov) return;
    ov.classList.remove("open");
    document.body.style.overflow = "";
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") cerrarModal();
  });

  /* ---------------- Barra legal del pie ---------------- */

  function inyectarBarraLegal() {
    var pie = document.querySelector(".site-foot");
    if (!pie || pie.querySelector(".legal-bar")) return;

    var barra = document.createElement("div");
    barra.className = "legal-bar";
    barra.innerHTML =
      '<div class="wrap">' +
        '<div class="legal-links">' +
          '<button type="button" data-legal="aviso">Aviso legal</button>' +
          '<span class="sep">·</span>' +
          '<button type="button" data-legal="privacidad">Política de privacidad</button>' +
          '<span class="sep">·</span>' +
          '<button type="button" data-legal="cookies">Política de cookies</button>' +
        "</div>" +
        '<a class="firma" href="https://thegasp.eu" target="_blank" rel="noopener noreferrer">' +
          'Web diseñada por <b>THE GASP COMPANY®</b>' +
        "</a>" +
      "</div>";
    pie.appendChild(barra);
  }

  /* ---------------- Banner de cookies ---------------- */

  function aceptado() {
    try { return window.localStorage.getItem(CLAVE) === "1"; }
    catch (e) { return false; }   // navegación privada con almacenamiento bloqueado
  }

  function guardarAceptado() {
    try { window.localStorage.setItem(CLAVE, "1"); } catch (e) {}
  }

  function inyectarCookies() {
    if (aceptado()) return;

    var caja = document.createElement("div");
    caja.className = "cookies";
    caja.setAttribute("role", "region");
    caja.setAttribute("aria-label", "Aviso de cookies");
    caja.innerHTML =
      '<div class="cookies__fila">' +
        "<p><b>Este sitio utiliza almacenamiento técnico.</b> Solo lo necesario para recordar que has visto este aviso. No usamos cookies publicitarias ni de perfilado.</p>" +
        '<div class="cookies__acciones">' +
          '<button class="cookies__mas" type="button" data-legal="cookies">Más información</button>' +
          '<button class="cookies__ok" type="button">Aceptar</button>' +
          '<button class="cookies__x" type="button" aria-label="Cerrar aviso">&times;</button>' +
        "</div>" +
      "</div>";
    document.body.appendChild(caja);

    // Entrada suave desde abajo
    window.setTimeout(function () {
      caja.classList.add("visible");
      window.requestAnimationFrame(function () { caja.classList.add("entra"); });
    }, 1100);

    function ocultar(recordar) {
      if (recordar) guardarAceptado();
      caja.classList.remove("entra");
      window.setTimeout(function () { caja.remove(); }, 500);
    }

    caja.querySelector(".cookies__ok").addEventListener("click", function () { ocultar(true); });
    caja.querySelector(".cookies__x").addEventListener("click", function () { ocultar(false); });
  }

  /* ---------------- Arranque ---------------- */

  document.addEventListener("DOMContentLoaded", function () {
    inyectarBarraLegal();
    inyectarCookies();

    // Cualquier elemento con data-legal abre su modal
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-legal]");
      if (!b) return;
      e.preventDefault();
      abrirModal(b.getAttribute("data-legal"));
    });
  });
})();
