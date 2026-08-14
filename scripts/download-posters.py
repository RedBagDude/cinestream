#!/usr/bin/env python3
"""Descarga los PÓSTERS reales desde Wikipedia para el modo demo de CineStream.

Estrategia fiable (v3):
  - Películas -> imagen `| image =` del infobox del artículo (siempre es el póster).
  - Series    -> imagen del infobox del artículo de la temporada 1 (póster de la
                 temporada), o del artículo principal si es una miniserie.
  - Dark      -> artículo en Wikipedia en alemán (la versión en inglés solo tiene logo).

Los pósters se usan únicamente como material de demostración (uso legítimo);
al añadir NEXT_PUBLIC_TMDB_API_KEY la app usa los pósters reales de TMDB.

Uso: python scripts/download-posters.py
"""
import io
import json
import os
import re
import time
import urllib.parse
import urllib.request

from PIL import Image, ImageEnhance, ImageFilter

# (id, título del artículo con el póster, lang)
ITEMS = [
    (1, "Inception", "en"),
    (2, "The Dark Knight", "en"),
    (3, "Interstellar (film)", "en"),
    (4, "The Matrix", "en"),
    (5, "Parasite (2019 film)", "en"),
    (6, "The Godfather", "en"),
    (7, "Pulp Fiction", "en"),
    (8, "Fight Club", "en"),
    (9, "Forrest Gump", "en"),
    (10, "Gladiator (2000 film)", "en"),
    (11, "Dune (2021 film)", "en"),
    (12, "Mad Max: Fury Road", "en"),
    (13, "La La Land", "en"),
    (14, "Get Out", "en"),
    (15, "A Quiet Place", "en"),
    (16, "The Shining (film)", "en"),
    (17, "Whiplash (2014 film)", "en"),
    (18, "Spirited Away", "en"),
    (19, "Coco (2017 film)", "en"),
    (20, "Breaking Bad (season 1)", "en"),
    (21, "Game of Thrones (season 1)", "en"),
    (22, "Stranger Things (season 1)", "en"),
    (23, "Chernobyl (miniseries)", "en"),
    (24, "Dark (Fernsehserie)", "de"),
    (25, "The Office (American season 1)", "en"),
]

# Fallback a TMDB (el CDN de imágenes es público) para títulos sin póster en Wikipedia.
# 'Dark' solo tiene logo en en/de.wikipedia; aquí se usa su póster real de TMDB.
TMDB_URLS = {
    24: "https://media.themoviedb.org/t/p/w500/hRP7N2uI0pokxnkcMFONoOZnxbv.jpg",
}

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "mock")
UA = "CineStreamDemo/1.0 (github.com/RedBagDude)"


def api_base(lang):
    return f"https://{lang}.wikipedia.org/w/api.php"


def api_json(lang, params, retries=6):
    url = f"{api_base(lang)}?{urllib.parse.urlencode(params)}"
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=40) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < retries - 1:
                time.sleep(4 * (attempt + 1))
                continue
            raise
        except Exception:
            if attempt < retries - 1:
                time.sleep(4 * (attempt + 1))
                continue
            raise
    return {}


def download(url, retries=5):
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < retries - 1:
                time.sleep(4 * (attempt + 1))
                continue
            raise
        except Exception:
            if attempt < retries - 1:
                time.sleep(4 * (attempt + 1))
                continue
            raise


def infobox_image(lang, title):
    data = api_json(lang, {
        "action": "query", "prop": "revisions", "rvprop": "content",
        "rvslots": "main", "titles": title, "redirects": "1",
        "format": "json", "formatversion": "2",
    })
    for page in data.get("query", {}).get("pages", []):
        content = page.get("revisions", [{}])[0].get("slots", {}).get("main", {}).get("content", "")
        m = re.search(r"\|\s*image\s*=\s*([^|\n]+)", content, re.IGNORECASE)
        if m:
            fname = re.sub(r"<!--.*?-->", "", m.group(1)).replace("File:", "").strip()
            return fname
    return None


def file_url_size(lang, filename):
    data = api_json(lang, {
        "action": "query", "titles": f"File:{filename}",
        "prop": "imageinfo", "iiprop": "url|size", "iiurlwidth": "800",
        "format": "json",
    })
    for page in data.get("query", {}).get("pages", {}).values():
        for info in page.get("imageinfo", []):
            return (info.get("thumburl") or info.get("url"), info.get("width", 0), info.get("height", 0))
    return None


def make_backdrop(poster_path, out_path, size=(1280, 720)):
    img = Image.open(poster_path).convert("RGB")
    w, h = size
    scale = max(w / img.width, h / img.height)
    nw, nh = int(img.width * scale + 0.5), int(img.height * scale + 0.5)
    img = img.resize((nw, nh), Image.LANCZOS)
    left, top = (nw - w) // 2, (nh - h) // 2
    img = img.crop((left, top, left + w, top + h))
    img = img.filter(ImageFilter.GaussianBlur(24))
    img = ImageEnhance.Brightness(img).enhance(0.45)
    img.save(out_path, "JPEG", quality=82)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    for item_id, title, lang in ITEMS:
        poster_path = os.path.join(OUT_DIR, f"poster-{item_id}.jpg")
        backdrop_path = os.path.join(OUT_DIR, f"backdrop-{item_id}.jpg")
        try:
            fname = infobox_image(lang, title)
            if not fname:
                turl = TMDB_URLS.get(item_id)
                if turl:
                    raw = download(turl)
                    img = Image.open(io.BytesIO(raw)).convert("RGB")
                    img.save(poster_path, "JPEG", quality=90)
                    make_backdrop(poster_path, backdrop_path)
                    print(f"[{item_id:02d}] OK (TMDB) {img.width}x{img.height}  {title}")
                else:
                    print(f"[{item_id:02d}] SIN IMAGEN   {title}")
                time.sleep(2)
                continue
            fs = file_url_size(lang, fname)
            if not fs:
                print(f"[{item_id:02d}] SIN URL      {title} ({fname})")
                time.sleep(2)
                continue
            url, w, h = fs
            if fname.lower().endswith(".svg") or h < w:
                print(f"[{item_id:02d}] NO PÓSTER    {title} -> {fname} ({w}x{h})")
                time.sleep(2)
                continue
            raw = download(url)
            img = Image.open(io.BytesIO(raw)).convert("RGB")
            img.save(poster_path, "JPEG", quality=90)
            make_backdrop(poster_path, backdrop_path)
            print(f"[{item_id:02d}] OK {img.width}x{img.height}  {fname}")
        except Exception as e:
            print(f"[{item_id:02d}] ERROR {type(e).__name__}: {e}  {title}")
        time.sleep(2)


if __name__ == "__main__":
    main()
