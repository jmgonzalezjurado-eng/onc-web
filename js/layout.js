/* ============================================================================
   layout.js — Header y footer compartidos (fuente única de verdad)
   ----------------------------------------------------------------------------
   Cada página incluye:
     <div data-include="header"></div>   ... contenido ...   <div data-include="footer"></div>
     <script src="{ruta}/js/layout.js" defer></script>
   Este script inyecta markup + estilos + comportamiento antes del primer
   pintado (va con `defer` y opera de forma síncrona), así que no hay parpadeo.

   Rutas: en las plantillas se escriben relativas a la raíz del sitio con el
   token {{root}}. Aquí se calcula la raíz a partir de la URL de este propio
   script (que siempre vive en {root}js/layout.js), de modo que funciona igual
   en la raíz, dentro de /publicaciones/ y bajo el subdirectorio de GitHub Pages.

   Navegación: en la home (donde existen las <section> destino) los enlaces del
   menú no navegan: hacen preventDefault y emiten el evento `niif:navigate`
   ({detail:{sec}}), que index.html escucha para el barrido entre secciones.
   En el resto de páginas los mismos enlaces navegan de forma normal a
   index.html#seccion.
   ========================================================================== */
(function () {
  "use strict";

  var self = document.currentScript ||
             document.querySelector('script[src*="layout.js"]');
  var ROOT = new URL("..", self.src).href;   // -> ".../"  (raíz del sitio, con barra)

  /* -------------------------------------------------------------- plantillas */
  var HEADER = `
<header class="nav">
  <a class="brand" href="{{root}}index.html#inicio" data-sec="inicio" aria-label="Inicio">
    <img src="{{root}}img/logo-header.svg" alt="Espacio NIIF Loyola">
  </a>
  <nav class="menu-esc" aria-label="Principal">
    <a href="{{root}}index.html#inicio" data-sec="inicio">Inicio</a>
    <a href="{{root}}index.html#publicaciones" data-sec="publicaciones">Publicaciones</a>
    <a href="{{root}}index.html#equipo" data-sec="equipo">Equipo</a>
    <a href="{{root}}index.html#contacto" data-sec="contacto">Contacto</a>
  </nav>
  <button class="burger" id="burger" aria-label="Abrir menú" aria-expanded="false"><span></span><span></span><span></span></button>
</header>
<div class="linea-marco"></div>
<nav class="menu-movil" id="menu-movil" aria-label="Principal">
  <button class="menu-movil__cerrar" id="menu-cerrar" aria-label="Cerrar menú">&times;</button>
  <a href="{{root}}index.html#inicio" data-sec="inicio">Inicio</a>
  <a href="{{root}}index.html#publicaciones" data-sec="publicaciones">Publicaciones</a>
  <a href="{{root}}index.html#equipo" data-sec="equipo">Equipo</a>
  <a href="{{root}}index.html#contacto" data-sec="contacto">Contacto</a>
</nav>`;

  var FOOTER = `
<div class="linea-marco"></div>
<footer class="foot">
  <div class="foot__grid">
    <div class="foot__cel foot__logos">
      <div class="logos-fila">
        <img src="{{root}}img/logo-loyola.svg" alt="Universidad Loyola">
        <img src="{{root}}img/logo-gobierno.svg" alt="Gobierno de España · Ministerio de Economía, Comercio y Empresa">
        <img src="{{root}}img/logo-icac.svg" alt="ICAC — Instituto de Contabilidad y Auditoría de Cuentas">
      </div>
    </div>
    <div class="foot__cel foot__fecyt">
      <p class="micro">Con la colaboración de</p>
      <img src="{{root}}img/logo-fecyt.svg" alt="FECYT — Fundación Española para la Ciencia y la Tecnología">
    </div>
    <div class="foot__cel foot__legal">
      <div class="legal-links">
        <button data-legal="aviso">Aviso legal</button>
        <button data-legal="privacidad">Política de privacidad</button>
        <button data-legal="cookies">Política de cookies</button>
      </div>
      <div class="foot__gasp">
        <a href="https://thegasp.eu" target="_blank" rel="noopener">Diseñado por<b>THE GASP COMPANY®</b></a>
      </div>
    </div>
  </div>
</footer>`;

  var MODAL = `
<div class="modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="modal-t">
  <div class="modal__box">
    <div class="modal__head"><h2 id="modal-t"></h2><button class="modal__x" id="modal-x" aria-label="Cerrar">&times;</button></div>
    <div class="modal__body" id="modal-b"></div>
  </div>
</div>`;

  var CSS = `
/* ===== MARCO ===== */
.linea-marco{ flex:none; height:var(--linea); background:var(--line); margin:0 var(--sangria); }

/* ===== HEADER ===== */
.nav{ flex:none; height:var(--nav-h); display:flex; align-items:center; justify-content:space-between;
  padding:0 var(--marco); gap:1rem; z-index:60; }
.brand{ display:flex; align-items:center; flex:none; }
.brand img{ height:clamp(1.5rem,2.4vh,2rem); width:auto; display:block; }

.menu-esc{ display:flex; gap:clamp(1rem,2.4vw,2.4rem); flex:none; }
.menu-esc a{ position:relative; text-decoration:none; padding:.4rem 0; font-weight:600; font-size:.82rem;
  letter-spacing:.14em; text-transform:uppercase; color:var(--muted); }
.menu-esc a::after{ content:""; position:absolute; left:0; right:0; bottom:-2px; height:2px; background:var(--teal);
  transform:scaleX(0); transform-origin:left; transition:transform .25s ease; }
.menu-esc a:hover{ color:var(--ink); }
.menu-esc a[aria-current="page"]{ color:var(--ink); }
.menu-esc a[aria-current="page"]::after{ transform:scaleX(1); }

.burger{ display:none; flex:none; width:2.6rem; height:2.6rem; flex-direction:column; justify-content:center;
  gap:5px; background:none; border:0; cursor:pointer; padding:0; z-index:110; }
.burger span{ display:block; height:2px; width:1.7rem; background:var(--ink); transition:transform .3s ease, opacity .2s ease; }
.nav-abierto .burger span:nth-child(1){ transform:translateY(7px) rotate(45deg); }
.nav-abierto .burger span:nth-child(2){ opacity:0; }
.nav-abierto .burger span:nth-child(3){ transform:translateY(-7px) rotate(-45deg); }

.menu-movil{ position:fixed; inset:0; z-index:100; background:var(--ink); color:var(--paper);
  display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1.4rem;
  opacity:0; visibility:hidden; transition:opacity .3s ease; }
.nav-abierto .menu-movil{ opacity:1; visibility:visible; }
.menu-movil a{ text-decoration:none; color:#cdd8e4; font-weight:700; font-size:clamp(1.4rem,6vw,2.2rem);
  letter-spacing:.06em; text-transform:uppercase; }
.menu-movil a:hover, .menu-movil a[aria-current="page"]{ color:#fff; }
.menu-movil__cerrar{ position:absolute; top:1.2rem; right:var(--marco); background:none; border:0;
  color:var(--paper); font-size:2rem; line-height:1; cursor:pointer; }
.menu-movil :focus-visible{ outline-color:#fff; }

@media (max-width:820px){
  .menu-esc{ display:none; }
  .burger{ display:inline-flex; }
}
@media (min-width:821px){
  .menu-movil{ display:none; }
}

/* ===== FOOTER ===== */
.foot{ flex:none; min-height:var(--foot-h); z-index:20; }
.foot__grid{ display:grid; grid-template-columns:1.7fr 1fr 1.35fr; }
.foot__cel{ position:relative; display:flex; align-items:center; padding:.7rem var(--marco); min-height:var(--foot-h); }
.foot__cel + .foot__cel::before{ content:""; position:absolute; left:0; top:.9rem; bottom:.9rem; width:1px; background:rgba(0,0,0,.22); }
.foot__logos .logos-fila{ display:flex; align-items:center; flex-wrap:wrap; gap:clamp(.6rem,2vw,1.1rem); width:100%; }
.logos-fila img{ max-height:1.9rem; max-width:100%; width:auto; }
.foot__fecyt{ flex-direction:column; align-items:flex-start; justify-content:center; gap:.3rem; }
.micro{ margin:0; font-size:.56rem; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); }
.foot__fecyt img{ max-height:2.1rem; width:auto; max-width:14rem; }
.foot__legal{ justify-content:space-between; gap:1rem; }
.foot__legal .legal-links{ display:flex; flex-direction:column; align-items:flex-start; justify-content:center; gap:.25rem; }
.foot__legal button{ background:none; border:0; cursor:pointer; padding:0; font:inherit; font-size:.68rem;
  letter-spacing:.1em; text-transform:uppercase; color:var(--muted); text-align:left; }
.foot__legal button:hover{ color:var(--ink); }
.foot__gasp{ text-align:right; max-width:8.5rem; }
.foot__gasp a{ text-decoration:none; color:var(--muted); font-size:.66rem; letter-spacing:.08em; text-transform:uppercase; line-height:1.4; }
.foot__gasp a:hover{ color:var(--ink); }
.foot__gasp b{ color:var(--ink); font-weight:700; display:block; margin-top:.15rem; }

@media (max-width:820px){
  .foot__grid{ grid-template-columns:1fr; }
  .foot__cel + .foot__cel::before{ display:none; }
  .foot__cel + .foot__cel{ border-top:1px solid rgba(0,0,0,.22); }
}

/* ===== MODAL LEGAL ===== */
.modal{ position:fixed; inset:0; z-index:130; background:rgba(0,0,0,.6); display:none;
  align-items:center; justify-content:center; padding:1.5rem; }
.modal.open{ display:flex; }
.modal__box{ background:var(--paper); border:var(--linea) solid var(--line); max-width:40rem; width:100%; max-height:80vh; overflow:auto; }
.modal__head{ display:flex; justify-content:space-between; align-items:center; padding:1rem 1.3rem; border-bottom:var(--linea) solid var(--line); }
.modal__head h2{ margin:0; font-size:1.1rem; font-weight:700; text-transform:uppercase; }
.modal__x{ background:none; border:0; font-size:1.5rem; line-height:1; cursor:pointer; color:var(--ink); }
.modal__body{ padding:1.3rem; font-size:.9rem; line-height:1.6; color:var(--muted); }

@media (prefers-reduced-motion:reduce){
  .menu-movil{ transition:none; }
}`;

  /* --------------------------------------------------------------- utilidades */
  function tpl(s) { return s.replace(/\{\{root\}\}/g, ROOT); }
  function frag(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content;
  }

  /* ------------------------------------------------------------- inyección */
  var st = document.createElement("style");
  st.id = "niif-layout-css";
  st.textContent = CSS;
  document.head.appendChild(st);

  var mh = document.querySelector('[data-include="header"]');
  if (mh) mh.replaceWith(frag(tpl(HEADER)));

  var mf = document.querySelector('[data-include="footer"]');
  if (mf) mf.replaceWith(frag(tpl(FOOTER)));

  document.body.appendChild(frag(tpl(MODAL)));

  /* ------------------------------------------------- menú hamburguesa / móvil */
  var body = document.body;
  var burger = document.getElementById("burger");
  var btnCerrar = document.getElementById("menu-cerrar");

  function abrirMenu() {
    body.classList.add("nav-abierto");
    if (burger) burger.setAttribute("aria-expanded", "true");
  }
  function cerrarMenu() {
    body.classList.remove("nav-abierto");
    if (burger) burger.setAttribute("aria-expanded", "false");
  }
  if (burger) burger.addEventListener("click", function () {
    body.classList.contains("nav-abierto") ? cerrarMenu() : abrirMenu();
  });
  if (btnCerrar) btnCerrar.addEventListener("click", cerrarMenu);
  document.querySelectorAll("#menu-movil a").forEach(function (a) {
    a.addEventListener("click", cerrarMenu);
  });

  /* -------------------------------------------------- navegación del menú */
  var esHome = !!document.querySelector(".escenario");

  function marcarActivo(sec) {
    document.querySelectorAll(".menu-esc a, .menu-movil a").forEach(function (a) {
      a.setAttribute("aria-current", a.getAttribute("data-sec") === sec ? "page" : "false");
    });
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest(".menu-esc a, .menu-movil a, .brand");
    if (!a) return;
    var sec = a.getAttribute("data-sec");
    if (!sec) return;
    if (document.getElementById(sec)) {          // la sección vive en esta página -> barrido interno
      e.preventDefault();
      cerrarMenu();
      marcarActivo(sec);
      document.dispatchEvent(new CustomEvent("niif:navigate", { detail: { sec: sec } }));
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") cerrarMenu();
  });

  /* ------------------------------------------------------- modal legal */
  var TEXTOS = {
    aviso: ["Aviso legal", "Marcador. Aquí irá el aviso legal del proyecto, como el que ya tienes redactado en la versión actual."],
    privacidad: ["Política de privacidad", "Marcador. Aquí irá la política de privacidad (responsable, datos, derechos RGPD)."],
    cookies: ["Política de cookies", "Marcador. Aquí irá la política de cookies."]
  };
  var modal = document.getElementById("modal");
  function abrirModal(k) {
    var t = TEXTOS[k];
    if (!t || !modal) return;
    document.getElementById("modal-t").textContent = t[0];
    document.getElementById("modal-b").textContent = t[1];
    modal.classList.add("open");
  }
  function cerrarModal() { if (modal) modal.classList.remove("open"); }

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-legal]");
    if (b) { abrirModal(b.getAttribute("data-legal")); return; }
    if (e.target === modal || e.target.id === "modal-x") cerrarModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") cerrarModal();
  });

  /* ------------------------------------ estado inicial de la home (por hash) */
  if (esHome) {
    var sec = location.hash ? location.hash.slice(1) : "";
    if (sec && document.getElementById(sec)) {
      marcarActivo(sec);
      document.dispatchEvent(new CustomEvent("niif:navigate", { detail: { sec: sec } }));
    } else {
      marcarActivo("inicio");
    }
  }
})();
