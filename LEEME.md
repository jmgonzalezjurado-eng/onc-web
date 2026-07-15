# Observatorio de Normalización Contable — guía de la web

Sitio estático (HTML puro). No hay que instalar nada ni compilar. Se sube tal cual
a GitHub y se sirve con GitHub Pages, igual que corelin.es o endiversidad.es.

## Estructura de carpetas

```
/
├── index.html            Portada (incluye la sección Equipo)
├── documentos.html       Registro filtrable de documentos
├── casos.html            Casos prácticos
├── entrevistas.html      Entrevistas
├── css/estilo.css        TODO el diseño (colores y tipos en :root, arriba del archivo)
├── js/registro.js        Pinta el registro y los filtros (no hay que tocarlo)
├── data/documentos.js    ← LA FUENTE ÚNICA DE CONTENIDO. Aquí añades cada mes.
├── documentos/           Una página HTML por documento (lo que se comparte en LinkedIn)
│   ├── _PLANTILLA-documento.html   Plantilla para copiar
│   └── ...
├── pdf/                  Los PDF descargables
└── img/og/og-general.png Tarjeta de previsualización para redes
```

## Publicar un documento nuevo (rutina mensual, ~3 pasos)

1. **Copia la plantilla.** Duplica `documentos/_PLANTILLA-documento.html` y renómbrala
   con un nombre descriptivo y sin espacios ni tildes, p. ej.:
   `documentos/2026-02-carta-arrendamientos.html`
   (Que NO empiece por guion bajo: el guion bajo es solo para la plantilla.)

2. **Edita solo lo marcado con ✏️** dentro de ese archivo: título, descripción, las 4
   etiquetas de LinkedIn (og:...), la categoría, la fecha, la ruta al PDF y el texto.

3. **Añade UNA entrada** al principio de la lista en `data/documentos.js`, copiando el
   formato de las que ya hay. Con eso aparece sola en el registro y en la portada.
   Si el documento lleva PDF, súbelo a la carpeta `/pdf/`.

Luego, el commit de siempre con Claude Code y GitHub Pages lo publica.

## Compartir en LinkedIn

- Comparte la URL de la **página del documento** (la de `/documentos/...`), no la home.
  Cada una tiene su propia tarjeta.
- **Dos reglas que evitan fallos:**
  1. `og:url` y `og:image` deben ser rutas **absolutas** (empezar por `https://`).
     Por eso hay que hacer un buscar-y-reemplazar de `TU-DOMINIO.es` por el dominio real
     en todos los archivos una sola vez, cuando lo tengáis.
  2. LinkedIn **cachea** la previsualización. Si sale antigua, refréscala en
     `https://www.linkedin.com/post-inspector/` pegando la URL.

## Imagen de la tarjeta (og:image)

Por defecto todas las páginas usan `img/og/og-general.png` (la de marca). Es correcto así.
Si quieres una imagen distinta por documento, crea una de **1200×630 px**, súbela a
`img/og/` y cambia la línea `og:image` de esa página.

> Nota: generar una imagen distinta automáticamente por cada documento es lo único que
> requeriría un paso de compilación (Astro). Mientras uses la imagen general, no hace falta.

## Ver la web en tu Mac antes de subir

Como el registro se pinta con JavaScript leyendo un archivo local, ábrela con un
servidor local en lugar de doble clic. En la carpeta de la web, en Terminal:

```
python3 -m http.server
```

y abre `http://localhost:8000` en el navegador.

## Cambiar el nombre del proyecto

El nombre de trabajo es "Observatorio de Normalización Contable". Cuando decidáis el
definitivo, haz un buscar-y-reemplazar en todos los `.html`. Los colores y las tipografías
se cambian solo en `css/estilo.css` (bloque `:root`, arriba del todo).
