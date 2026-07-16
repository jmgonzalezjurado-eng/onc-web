/* =========================================================================
   FUENTE ÚNICA DE CONTENIDO
   Cada entrada de aquí aparece automáticamente en el registro, en las
   tarjetas y en la portada. Para publicar algo nuevo:
     1) Copia una plantilla de /documentos/ y edítala (esa es la página
        que se comparte en LinkedIn, con sus propias etiquetas).
     2) Añade UNA entrada nueva a esta lista, arriba del todo.
     3) Sube el PDF a /pdf/ y, en casos y entrevistas, la imagen a /img/.
   Campos:
     seccion    "documento" | "caso" | "entrevista"
     categoria  solo para documentos: "resumen-niif" | "carta-comentario"
                | "working-paper" | "presentacion" | "otros"
     fecha      "AAAA-MM-DD"  (ordena solo, más reciente primero)
     titulo, resumen  texto
     pagina     ruta a la página HTML individual
     pdf        ruta al PDF ("" si no tiene)
     imagen     SOLO casos y entrevistas: ruta a la imagen cuadrada
                (recomendado 800x800 px). Déjala en "" y saldrá un
                marcador gris hasta que tengas la definitiva.
   ========================================================================= */

window.CONTENIDO = [

  /* ---------- DOCUMENTOS ---------- */
  {
    seccion: "documento",
    categoria: "resumen-niif",
    catLabel: "Resumen NIIF",
    fecha: "2026-05-01",
    titulo: "Análisis Ejecutivo Mayo 2026",
    resumen: "Novedades en materia de información financiera de la Fundación NIIF en el mes de mayo.",
    pagina: "documentos/2026-05-analisis-ejecutivo-mayo.html",
    pdf: "pdf/Comentario_IASB_Mayo_2026.pdf"
  },
  {
    seccion: "documento",
    categoria: "resumen-niif",
    catLabel: "Resumen NIIF",
    fecha: "2026-01-15",
    titulo: "Resumen de la reunión del IASB — enero 2026",
    resumen: "Síntesis de las decisiones y deliberaciones del Consejo del IASB en su reunión mensual.",
    pagina: "documentos/2026-01-resumen-niif-enero.html",
    pdf: "pdf/2026-01-resumen-niif-enero.pdf"
  },
  {
    seccion: "documento",
    categoria: "carta-comentario",
    catLabel: "Carta de comentario",
    fecha: "2025-12-10",
    titulo: "Comentarios al Exposure Draft sobre gestión dinámica de riesgos",
    resumen: "Borrador de carta de comentario del equipo dirigida al IASB sobre el proyecto de Dynamic Risk Management.",
    pagina: "documentos/ejemplo-carta.html",
    pdf: ""
  },
  {
    seccion: "documento",
    categoria: "working-paper",
    catLabel: "Working paper",
    fecha: "2025-11-20",
    titulo: "Convergencia del PGC con la NIIF 16: análisis preliminar",
    resumen: "Documento de trabajo sobre las implicaciones de la revisión de arrendamientos en la normativa nacional.",
    pagina: "documentos/ejemplo-working-paper.html",
    pdf: ""
  },

  /* ---------- CASOS ---------- */
  {
    seccion: "caso",
    categoria: "otros",
    catLabel: "Caso",
    fecha: "2025-11-05",
    titulo: "Reconocimiento de ingresos en contratos de larga duración",
    resumen: "Aplicación comentada de la NIIF 15 a un supuesto de ingeniería y construcción.",
    pagina: "documentos/ejemplo-caso.html",
    pdf: "",
    imagen: ""
  },
  {
    seccion: "caso",
    categoria: "otros",
    catLabel: "Caso",
    fecha: "2025-10-02",
    titulo: "Arrendamientos con opción de renovación: juicio y estimación",
    resumen: "Cómo se determina el plazo del arrendamiento bajo NIIF 16 en un supuesto de red comercial.",
    pagina: "documentos/ejemplo-caso.html",
    pdf: "",
    imagen: ""
  },
  {
    seccion: "caso",
    categoria: "otros",
    catLabel: "Caso",
    fecha: "2025-09-12",
    titulo: "Deterioro de activos financieros: pérdida esperada en la práctica",
    resumen: "Supuesto de aplicación del modelo de pérdida esperada de la NIIF 9 en una cartera comercial.",
    pagina: "documentos/ejemplo-caso.html",
    pdf: "",
    imagen: ""
  },

  /* ---------- ENTREVISTAS ---------- */
  {
    seccion: "entrevista",
    categoria: "otros",
    catLabel: "Entrevista",
    fecha: "2025-10-15",
    titulo: "La voz de los preparadores ante las novedades del IASB",
    resumen: "Conversación con responsables de políticas contables sobre el proceso de consulta.",
    pagina: "documentos/ejemplo-entrevista.html",
    pdf: "",
    imagen: ""
  },
  {
    seccion: "entrevista",
    categoria: "otros",
    catLabel: "Entrevista",
    fecha: "2025-09-20",
    titulo: "Qué espera el auditor de la nueva normativa de presentación",
    resumen: "Perspectiva de los departamentos técnicos sobre los estados financieros primarios.",
    pagina: "documentos/ejemplo-entrevista.html",
    pdf: "",
    imagen: ""
  },
  {
    seccion: "entrevista",
    categoria: "otros",
    catLabel: "Entrevista",
    fecha: "2025-08-28",
    titulo: "Los usuarios de la información financiera toman la palabra",
    resumen: "Analistas de crédito y bursátiles opinan sobre las prioridades de la agenda del IASB.",
    pagina: "documentos/ejemplo-entrevista.html",
    pdf: "",
    imagen: ""
  }
];
