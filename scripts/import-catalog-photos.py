"""Download reviewed Commons photos (requires Pillow). --check runs offline."""
import argparse
import hashlib
import html
import json
import sys
import time
import urllib.error
import urllib.request
from io import BytesIO
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
FRONT = ROOT / 'seapedia-frontend/public/images/products'
BACK = ROOT / 'seapedia-backend/public/images/products'
MANIFEST = FRONT / 'sources.json'

def fetch(url):
    for attempt in range(3):
        try:
            request = urllib.request.Request(url, headers={'User-Agent': 'SEAPEDIA-Portfolio/1.0 (educational catalog; attribution included)'})
            with urllib.request.urlopen(request, timeout=45) as response:
                return response.read()
        except urllib.error.HTTPError as error:
            if error.code not in (429, 503) or attempt == 2:
                raise
            time.sleep(min(int(error.headers.get('Retry-After', '30')), 60))

def credits(photos):
    e = html.escape
    rows = []
    for photo in photos:
        rows.append(f'<tr><td><img src="/images/products/{e(photo["file"])}" width="88" height="88" loading="lazy" alt=""><a href="{e(photo["source_url"])}">{e(photo["title"])}</a></td><td>{e(photo["author"])}</td><td><a href="{e(photo["license_url"] or photo["source_url"])}">{e(photo["license"])}</a></td></tr>')
    page = '''<!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Kredit Foto Produk — SEAPEDIA</title><style>body{font:16px/1.6 system-ui;color:#102a43;margin:0;background:#f8fafc}main{max-width:1000px;margin:auto;padding:32px 20px}a{color:#075b91;text-underline-offset:3px}h1{line-height:1.2}table{border-collapse:collapse;width:100%;background:white}th,td{text-align:left;border-bottom:1px solid #cbd5e1;padding:14px;overflow-wrap:anywhere}td:first-child{width:55%}img{object-fit:contain;display:block;margin-bottom:8px}a:focus-visible{outline:3px solid #075b91;outline-offset:3px}@media(max-width:600px){th,td{padding:8px;font-size:13px}}</style>
<main><a href="/products">Kembali ke katalog</a><h1>Kredit foto produk</h1><p>Foto katalog demo SEAPEDIA diambil dari Wikimedia Commons. Nama, harga, stok, kemasan, dan penjual adalah data simulasi; foto merupakan ilustrasi jenis produk, bukan dokumentasi stok penjual.</p><p>Setiap foto diubah ukurannya, dikonversi ke WebP, dan diberi ruang tepi persegi tanpa memotong objek. Tidak ada foto yang dibuat dengan AI pada pembaruan ini. Adaptasi foto tetap mengikuti lisensi masing-masing, termasuk ketentuan ShareAlike bila berlaku. Pembuat foto tidak berafiliasi dengan SEAPEDIA.</p><table><thead><tr><th scope="col">Foto dan sumber asli</th><th scope="col">Pembuat</th><th scope="col">Lisensi</th></tr></thead><tbody>'''
    page += ''.join(rows) + '</tbody></table><p>Diakses 31 Oktober 2026. <a href="/images/products/sources.json">Metadata foto (JSON)</a>.</p></main></html>\n'
    (ROOT / 'seapedia-frontend/public/photo-credits.html').write_text(page, encoding='utf-8')

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    parser.add_argument('--only', nargs='+', help='Refresh only these manifest filenames')
    args = parser.parse_args()
    photos = json.loads(MANIFEST.read_text(encoding='utf-8'))
    products = json.loads((ROOT / 'seapedia-backend/database/data/demo-products.json').read_text(encoding='utf-8'))
    expected = {Path(product['image_url']).name for product in products}
    assert expected == {photo['file'] for photo in photos}, 'Catalog/photo manifest mismatch'
    assert len(photos) == len(expected), 'Duplicate photo records'
    BACK.mkdir(parents=True, exist_ok=True)
    for photo in photos:
        assert Path(photo['file']).name == photo['file'], 'Unsafe filename'
        assert photo['license'] and photo['author'] and photo['source_url'], 'Missing attribution'
        target = FRONT / photo['file']
        if not args.check and (not args.only or photo['file'] in args.only):
            image = ImageOps.exif_transpose(Image.open(BytesIO(fetch(photo['download_url'])))).convert('RGB')
            image = ImageOps.pad(image, (800, 800), color='#f5f7fa', method=Image.Resampling.LANCZOS)
            image.save(target, 'WEBP', quality=82, method=6)
            (BACK / photo['file']).write_bytes(target.read_bytes())
            photo['sha256'] = hashlib.sha256(target.read_bytes()).hexdigest()
            photo['bytes'] = target.stat().st_size
            MANIFEST.write_text(json.dumps(photos, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
            print(photo['file'], photo['bytes'], flush=True)
            time.sleep(1)
        digest = hashlib.sha256(target.read_bytes()).hexdigest()
        assert digest == photo['sha256'], f'Hash mismatch: {target}'
        assert (BACK / photo['file']).read_bytes() == target.read_bytes(), f'Backend mirror mismatch: {target}'
        with Image.open(target) as image:
            assert image.size == (800, 800) and image.format == 'WEBP'
    if not args.check:
        credits(photos)
    print(f'OK: {len(photos)} photos; {sum(p["bytes"] for p in photos):,} bytes per application.')

if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    main()
