#!/usr/bin/env python3
"""SEO: sitemap.xml, robots.txt y bloque favicon + canonical + datos estructurados de cada página.

  python3 tools/seo.py

Ejecutar tras añadir o cambiar una publicación. Toma la lista de publicaciones
del array CONTENIDO de index.html (fecha, categoría, rutas) y de cada página su
<title>, <meta name="description"> y <meta name="author"> (autores separados
por ";"). Reescribe en cada página el bloque entre <!-- seo --> y <!-- /seo -->.
"""
import html, json, os, re, subprocess, datetime

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOMINIO = "https://espacioniif.es/"
SITIO = "Espacio NIIF Loyola"
EDITOR = {"@type": "Organization", "name": SITIO, "url": DOMINIO,
          "logo": DOMINIO + "img/icono-512.png",
          "parentOrganization": {"@type": "CollegeOrUniversity", "name": "Universidad Loyola Andalucía",
                                 "url": "https://www.uloyola.es/"}}
ICONOS = """<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32.png">
<link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#13395d">"""
TIPO = {"working-paper": "ScholarlyArticle", "resumen-niif": "Report"}

def leer(ruta):
    return open(os.path.join(RAIZ, ruta), encoding="utf-8").read()

def escribir(ruta, texto):
    open(os.path.join(RAIZ, ruta), "w", encoding="utf-8").write(texto)

def contenido():
    bloque = re.search(r"var CONTENIDO = \[(.*?)\n\];", leer("index.html"), re.S).group(1)
    return [dict(re.findall(r'(\w+):"([^"]*)"', e)) for e in re.findall(r"\{(.*?)\}", bloque, re.S)]

def meta(src, nombre):
    m = re.search(r'<meta name="%s" content="([^"]*)">' % nombre, src)
    return html.unescape(m.group(1)) if m else ""

def ultima_mod(ruta):
    r = subprocess.run(["git", "log", "-1", "--format=%cs", "--", ruta], cwd=RAIZ, capture_output=True, text=True)
    return r.stdout.strip() or datetime.date.today().isoformat()

def pon_bloque(src, bloque):
    bloque = "<!-- seo -->\n" + ICONOS + "\n" + bloque + "\n<!-- /seo -->"
    if "<!-- seo -->" in src:
        return re.sub(r"<!-- seo -->.*?<!-- /seo -->", lambda _: bloque, src, flags=re.S)
    return src.replace("</head>", bloque + "\n</head>", 1)

def ld(datos):
    return '<script type="application/ld+json">\n' + json.dumps(datos, ensure_ascii=False, indent=1) + "\n</script>"

def publicacion(p):
    ruta = p["pagina"]; slug = os.path.basename(ruta)[:-5]; src = leer(ruta)
    titulo = html.unescape(re.search(r"<h1[^>]*>(.*?)</h1>", src, re.S).group(1)).strip()
    url = DOMINIO + ruta
    datos = {"@context": "https://schema.org", "@type": TIPO.get(p["cat"], "Article"),
             "headline": titulo, "description": meta(src, "description"),
             "datePublished": p["fecha"], "dateModified": ultima_mod(ruta), "inLanguage": "es",
             "genre": p["etq"], "url": url, "mainEntityOfPage": url,
             "image": DOMINIO + "img/og/" + slug + ".png",
             "author": [{"@type": "Person", "name": a.strip()} for a in meta(src, "author").split(";") if a.strip()] or EDITOR,
             "publisher": EDITOR,
             "associatedMedia": {"@type": "MediaObject", "contentUrl": DOMINIO + p["pdf"],
                                 "encodingFormat": "application/pdf"},
             "isPartOf": {"@type": "WebSite", "name": SITIO, "url": DOMINIO}}
    miga = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": SITIO, "item": DOMINIO},
        {"@type": "ListItem", "position": 2, "name": titulo, "item": url}]}
    escribir(ruta, pon_bloque(src, f'<link rel="canonical" href="{url}">\n{ld(datos)}\n{ld(miga)}'))
    return url, ultima_mod(ruta)

def home():
    datos = {"@context": "https://schema.org", "@graph": [
        {"@type": "WebSite", "name": SITIO, "url": DOMINIO, "inLanguage": "es",
         "description": meta(leer("index.html"), "description"), "publisher": {"@id": DOMINIO + "#org"}},
        dict(EDITOR, **{"@id": DOMINIO + "#org"})]}
    escribir("index.html", pon_bloque(leer("index.html"), ld(datos)))

if __name__ == "__main__":
    home()
    urls = [(DOMINIO, ultima_mod("index.html"))] + [publicacion(p) for p in contenido()]
    escribir("sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n'
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
             + "".join(f"  <url><loc>{u}</loc><lastmod>{f}</lastmod></url>\n" for u, f in urls)
             + "</urlset>\n")
    escribir("robots.txt", f"User-agent: *\nAllow: /\n\nSitemap: {DOMINIO}sitemap.xml\n")
    print(f"✓ sitemap.xml ({len(urls)} URLs), robots.txt y bloques SEO")
