#!/usr/bin/env python3
"""Genera las imágenes para compartir enlaces (Open Graph, 1200×630).

  python3 tools/og.py            # todas: home + cada publicaciones/*.html
  python3 tools/og.py <slug>…    # solo esas publicaciones

Lee de cada página de publicaciones/ la categoría (.cat), el título (<h1>) y la
fecha (.fecha), y compone la imagen con la portada img/<slug>-portada.jpg.
Salida: img/og/<slug>.png (y img/og/home.png). Requiere Google Chrome.
"""
import html, os, re, subprocess, sys, tempfile

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SALIDA = os.path.join(RAIZ, "img", "og")

CSS = """
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
*{ box-sizing:border-box; margin:0; }
html,body{ width:1200px; height:630px; overflow:hidden; background:#fff; }
body{ font-family:"IBM Plex Sans",system-ui,sans-serif; color:#13395d; position:relative; }
.marco{ position:absolute; inset:28px; border:2px solid #13395d; }
.franja{ position:absolute; left:28px; top:28px; bottom:28px; width:14px; background:#00a9af; }
.txt{ position:absolute; left:92px; top:76px; bottom:76px; display:flex; flex-direction:column; }
.logo{ height:30px; width:auto; align-self:flex-start; }
.cat{ margin-top:auto; font-size:20px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#00a9af; }
h1{ margin-top:14px; font-weight:700; line-height:1.12; letter-spacing:-.01em; }
.fecha{ margin-top:18px; font-size:24px; color:#3c5a82; }
.pie{ margin-top:auto; font-size:20px; font-weight:500; letter-spacing:.04em; color:#3c5a82; }
.portada{ position:absolute; right:92px; top:50%; transform:translateY(-50%); max-height:502px; max-width:380px;
  border:1px solid #c9d3df; box-shadow:0 18px 40px rgba(19,57,93,.22); }
.logos{ display:flex; align-items:center; justify-content:space-between; margin-top:auto; }
.logos img{ height:40px; width:auto; }
.logos img.icac{ height:28px; }
"""

def pagina(cuerpo):
    return f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>{cuerpo}</body></html>'

def url(ruta):
    return "file://" + os.path.join(RAIZ, ruta)

def tam_titulo(t):
    n = len(t)
    return 54 if n <= 34 else 46 if n <= 60 else 40 if n <= 90 else 34

def publicacion(slug):
    src = open(os.path.join(RAIZ, "publicaciones", slug + ".html"), encoding="utf-8").read()
    saca = lambda pat: html.unescape(re.sub(r"<[^>]+>", "", re.search(pat, src, re.S).group(1))).strip()
    cat = saca(r'<p class="cat">(.*?)</p>')
    titulo = saca(r"<h1[^>]*>(.*?)</h1>")
    fecha = re.sub(r"\s*·\s*\d+\s+páginas\s*$", "", saca(r'<p class="fecha">(.*?)</p>'))
    e = html.escape
    return pagina(f"""
<div class="marco"></div><div class="franja"></div>
<div class="txt" style="right:{1200 - 700}px">
  <img class="logo" src="{url('img/logo-niif.svg')}">
  <p class="cat">{e(cat)}</p>
  <h1 style="font-size:{tam_titulo(titulo)}px">{e(titulo)}</h1>
  <p class="fecha">{e(fecha)}</p>
  <p class="pie">espacioniif.es</p>
</div>
<img class="portada" src="{url('img/' + slug + '-portada.jpg')}">""")

def home():
    return pagina(f"""
<div class="marco"></div><div class="franja"></div>
<div class="txt" style="right:92px; width:1016px">
  <img class="logo" style="height:52px" src="{url('img/logo-niif.svg')}">
  <h1 style="font-size:58px; margin-top:auto">Seguimiento y análisis de la<br>normativa contable internacional</h1>
  <p class="fecha">Universidad Loyola Andalucía · espacioniif.es</p>
  <div class="logos">
    <img src="{url('img/logo-loyola.svg')}">
    <img src="{url('img/logo-gobierno.svg')}">
    <img class="icac" src="{url('img/logo-icac.svg')}">
    <img src="{url('img/logo-fecyt.svg')}">
  </div>
</div>""")

def render(doc, destino):
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False, encoding="utf-8") as f:
        f.write(doc)
    try:
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                        "--allow-file-access-from-files", "--force-device-scale-factor=1",
                        "--window-size=1200,630", "--virtual-time-budget=5000",
                        "--screenshot=" + destino, "file://" + f.name],
                       check=True, capture_output=True)
    finally:
        os.unlink(f.name)
    print("✓", os.path.relpath(destino, RAIZ))

if __name__ == "__main__":
    os.makedirs(SALIDA, exist_ok=True)
    slugs = sys.argv[1:]
    if not slugs:
        render(home(), os.path.join(SALIDA, "home.png"))
        slugs = sorted(f[:-5] for f in os.listdir(os.path.join(RAIZ, "publicaciones")) if f.endswith(".html"))
    for s in slugs:
        render(publicacion(s), os.path.join(SALIDA, s + ".png"))
