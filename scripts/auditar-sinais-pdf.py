#!/usr/bin/env python3
"""Audit and extract exact signal crops from the official 69-page PDF.

Page previews are rendered for human review. Signal crops are rendered directly
from the PDF at 600 DPI; no redraw, recolouring, or interpolation is applied.
Crop coordinates are measured on the 160-DPI page previews and converted back
to PDF points before rendering at the requested output DPI.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import fitz
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / "original" / "referencia" / "sinais.pdf"
OUT = ROOT / "artifacts" / "sinais-pdf"
SIGNAL_DIR = ROOT / "public" / "sinais"
PREVIEW_DPI = 160

# filename, physical PDF page, crop box in pixels on a 160-DPI page preview,
# code (None when the PDF prints no code), and exact PDF designation.
CROPS = [
    ("A1-sinal-pdf.png", 3, (60, 270, 370, 600), "A1", "Trabalhos na estrada"),
    ("A18-sinal-pdf.png", 4, (365, 20, 620, 290), "A18", "Visibilidade reduzida"),
    ("A37-sinal-pdf.png", 4, (75, 1560, 335, 1810), "A37", "Subida de inclinação acentuada"),
    ("A45-sinal-pdf.png", 5, (60, 340, 280, 590), "A45", "Travessia de peões"),
    ("A46-sinal-pdf.png", 5, (350, 345, 570, 590), "A46", "Passagem de peões"),
    ("A51-sinal-pdf.png", 5, (675, 640, 890, 890), "A51", "Ponte estreita"),
    ("D1-sinal-pdf.png", 21, (90, 110, 320, 360), "D1", "Sinalização luminosa"),
    ("D14-sinal-pdf.png", 21, (350, 1070, 610, 1350), "D14", "Descida de inclinação acentuada"),
    ("D27-sinal-pdf.png", 22, (650, 400, 900, 680), "D27", "Cruzamento com estrada sem prioridade"),
    ("D62-sinal-pdf.png", 24, (335, 90, 605, 320), "D62", "Visibilidade reduzida"),
    ("D63-sinal-pdf.png", 24, (650, 90, 925, 320), "D63", "Congestionamento de tráfego"),
    ("D68-sinal-pdf.png", 24, (1000, 450, 1270, 700), "D68", "Passagem de nível"),
    ("E3-sinal-pdf.png", 26, (650, 230, 920, 480), "E3", "Trânsito proibido a automóveis ligeiros"),
    ("E19-sinal-pdf.png", 27, (660, 140, 910, 450), "E19", "Trânsito proibido a veículos de peso por eixo superior a ... t"),
    ("E24-sinal-pdf.png", 27, (1010, 560, 1270, 760), "E24", "Proibição de sinais sonoros"),
    ("E36-sinal-pdf.png", 28, (1010, 180, 1270, 440), "E36", "Trânsito proibido a veículos que transportam substâncias perigosas"),
    ("E37-sinal-pdf.png", 28, (40, 560, 350, 850), "E37", "Trânsito proibido a veículos de peso por eixo múltiplo superior a ... t"),
    ("E50-sinal-pdf.png", 29, (340, 180, 590, 450), "E50", "Estacionamento proibido"),
    ("E51-sinal-pdf.png", 29, (660, 180, 910, 470), "E51", "Paragem e estacionamento proibidos"),
    ("F13-sinal-pdf.png", 31, (125, 1420, 355, 1660), "F13", "Pista obrigatória para velocípedes e peões"),
    ("G1-sinal-pdf.png", 35, (80, 230, 220, 500), "G1", "Área reservada para autocarros"),
    ("G27-sinal-pdf.png", 36, (330, 230, 480, 500), "G27", "Parque de estacionamento para autocarros e autocarros médios"),
    ("sem-codigo-area-reservada-veiculos-dimensoes-anormais.png", 14, (318, 1450, 453, 1634), None, "Área reservada para veículos de dimensões anormais"),
    ("sem-codigo-area-reservada-autocarros-excursao.png", 14, (805, 1452, 942, 1635), None, "Área reservada para autocarros de excursão"),
    ("sem-codigo-parque-estacionamento-substancias-perigosas.png", 14, (85, 1445, 223, 1630), None, "Parque de estacionamento para veículos que transportam substâncias perigosas"),
    ("sem-codigo-parque-estacionamento-veiculos-policia.png", 14, (1025, 1452, 1165, 1635), None, "Parque de estacionamento para veículos da polícia"),
    ("sem-codigo-parque-estacionamento-pesados-mercadorias-10t.png", 14, (985, 1125, 1115, 1308), None, "Parque de estacionamento para automóveis pesados de mercadorias de peso total superior a 10 toneladas"),
    ("E28-proibicao-inversao-noite.png", 18, (530, 620, 850, 1060), "E28", "Proibição de inversão do sentido de marcha de noite (painel adicional)"),
    ("sem-codigo-limite-120-km-dia.png", 18, (880, 640, 1240, 1040), None, "Proibição de exceder a velocidade de 120 km/h durante o dia (sinal combinado)"),
]


# Confirmed DADOS-079 replacements. Separate names keep older shared assets intact.
# Exact vector-object bounds in PDF points: page, (x0, y0, x1, y1), code, designation.
DADOS079_CROPS = [
    ("A19-sinal-pdf-600dpi.png", 4, (300.08, 15.07, 424.61, 119.61), "A19", "Congestionamento de tráfego"),
    ("D79-sinal-pdf-600dpi.png", 24, (412.67, 638.91, 541.75, 746.12), "D79", "Local de passagem de nível sem guarda com duas ou mais vias"),
    ("E12-sinal-pdf-600dpi.png", 26, (422.34, 448.79, 547.54, 566.0), "E12", "Proibição de exceder a velocidade de 80 km/h"),
    ("G62-sinal-pdf-600dpi.png", 37, (151.83, 623.66, 208.52, 699.68), "G62", "Área reservada para veículos de emergência"),
    ("E50-sinal-pdf-600dpi.png", 29, (165.18, 98.25, 290.39, 216.0), "E50", "Estacionamento proibido"),
    ("E37-sinal-pdf-600dpi.png", 28, (39.78, 263.12, 164.99, 388.33), "E37", "Proibição de veículos de peso por eixo múltiplo superior a 10 t"),
    ("A51-sinal-pdf-600dpi.png", 5, (291.38, 277.76, 416.58, 383.06), "A51", "Ponte estreita"),
    ("A18-sinal-pdf-600dpi.png", 4, (180.0, 9.0, 301.5, 112.5), "A18", "Visibilidade reduzida"),
    ("A37-sinal-pdf-600dpi.png", 4, (31.5, 697.5, 166.0, 796.5), "A37", "Subida de inclinação acentuada"),
    ("E19-sinal-pdf-600dpi.png", 27, (292.5, 33.75, 416.25, 144.0), "E19", "Trânsito proibido a veículos de peso por eixo superior a 2 t"),
    ("G26-sinal-pdf-600dpi.png", 36, (38.0, 120.0, 100.0, 198.0), "G26", "Área reservada para autocarros e autocarros médios"),
    ("A1-sinal-pdf-600dpi.png", 3, (31.5, 162.0, 171.0, 259.0), "A1", "Trabalhos na estrada"),
    ("A8-sinal-pdf-600dpi.png", 3, (427.5, 318.0, 562.5, 416.25), "A8", "Sinalização luminosa"),
    ("A46-sinal-pdf-600dpi.png", 5, (153.0, 153.0, 283.5, 249.5), "A46", "Passagem de peões"),
    ("E51-sinal-pdf-600dpi.png", 29, (292.5, 94.5, 416.25, 220.5), "E51", "Paragem e estacionamento proibidos"),
]


def render_page(page: fitz.Page, dpi: int) -> Image.Image:
    scale = dpi / 72.0
    pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
    return Image.frombytes("RGB", (pix.width, pix.height), pix.samples)


def render_crop(page: fitz.Page, box_px: tuple[int, int, int, int], dpi: int) -> Image.Image:
    factor = 72.0 / PREVIEW_DPI
    clip = fitz.Rect(
        box_px[0] * factor,
        box_px[1] * factor,
        box_px[2] * factor,
        box_px[3] * factor,
    ) & page.rect
    scale = dpi / 72.0
    pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale), clip=clip, alpha=False)
    return Image.frombytes("RGB", (pix.width, pix.height), pix.samples)

def render_crop_points(page: fitz.Page, box_points: tuple[float, float, float, float], dpi: int) -> Image.Image:
    """Render a crop using exact PDF-point bounds, not preview-pixel estimates."""
    clip = (fitz.Rect(*box_points) + (-1.5, -1.5, 1.5, 1.5)) & page.rect
    scale = dpi / 72.0
    pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale), clip=clip, alpha=False)
    return Image.frombytes("RGB", (pix.width, pix.height), pix.samples)


def vector_clusters(page: fitz.Page, gap: float = 1.5) -> list[fitz.Rect]:
    """Group overlapping/nearby vector paths into individual visual objects."""
    drawings = [d["rect"] for d in page.get_drawings()
                if d["rect"].width >= 2 and d["rect"].height >= 2]
    parents = list(range(len(drawings)))

    def root(i: int) -> int:
        while parents[i] != i:
            parents[i] = parents[parents[i]]
            i = parents[i]
        return i

    def join(a: int, b: int) -> None:
        a, b = root(a), root(b)
        if a != b:
            parents[b] = a

    for i, a in enumerate(drawings):
        for j in range(i):
            b = drawings[j]
            dx = max(b.x0 - a.x1, a.x0 - b.x1, 0)
            dy = max(b.y0 - a.y1, a.y0 - b.y1, 0)
            if dx <= gap and dy <= gap:
                join(i, j)

    groups: dict[int, list[fitz.Rect]] = {}
    for i, rect in enumerate(drawings):
        groups.setdefault(root(i), []).append(rect)

    result = []
    for group in groups.values():
        box = fitz.Rect(group[0])
        for rect in group[1:]:
            box |= rect
        if box.width >= 12 and box.height >= 12:
            result.append(box)
    return sorted(result, key=lambda r: (round(r.y0, 1), round(r.x0, 1)))


def extract_vector_review(doc: fitz.Document, out_dir: Path, dpi: int) -> list[dict]:
    """Render vector-object clusters directly from the PDF for manual matching."""
    review_dir = out_dir / "vector-crops"
    review_dir.mkdir(parents=True, exist_ok=True)
    records = []
    font = ImageFont.load_default()
    cell_w, cell_h, columns = 360, 300, 4

    for page_number in [3, 4, 5, 11, 14, 18, 21, 22, 24, 26, 27, 28, 29, 31, 35, 36]:
        page = doc[page_number - 1]
        page_dir = review_dir / f"page-{page_number:02d}"
        page_dir.mkdir(parents=True, exist_ok=True)
        boxes = vector_clusters(page)
        thumbs = []
        for index, box in enumerate(boxes, 1):
            clip = (box + (-3, -3, 3, 3)) & page.rect
            pix = page.get_pixmap(matrix=fitz.Matrix(dpi / 72, dpi / 72),
                                  clip=clip, alpha=False)
            crop = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
            filename = f"p{page_number:02d}-vector-{index:02d}.png"
            crop.save(page_dir / filename, "PNG", optimize=True)
            records.append({
                "page": page_number, "cluster": index, "file": str((page_dir / filename).relative_to(ROOT)),
                "bbox_points": [round(v, 2) for v in clip],
                "dpi": dpi, "width": crop.width, "height": crop.height,
            })
            thumb = crop.copy()
            thumb.thumbnail((cell_w - 16, cell_h - 44), Image.Resampling.LANCZOS)
            thumbs.append((index, thumb))

        rows = (len(thumbs) + columns - 1) // columns
        sheet = Image.new("RGB", (columns * cell_w, max(1, rows) * cell_h), "white")
        draw = ImageDraw.Draw(sheet)
        for pos, (index, thumb) in enumerate(thumbs):
            x, y = (pos % columns) * cell_w, (pos // columns) * cell_h
            draw.text((x + 8, y + 6), f"P{page_number:02d} · OBJECTO {index:02d}", fill="black", font=font)
            sheet.paste(thumb, (x + (cell_w - thumb.width) // 2, y + 34))
            draw.rectangle((x, y, x + cell_w - 1, y + cell_h - 1), outline="#bbbbbb", width=1)
        sheet.save(out_dir / f"vectors-page-{page_number:02d}.jpg", "JPEG", quality=92, optimize=True)

    return records


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dpi", type=int, default=160, help="DPI for individual page previews")
    parser.add_argument("--contact-dpi", type=int, default=100, help="DPI before contact-sheet resizing")
    parser.add_argument("--crop-dpi", type=int, default=600, help="DPI for signal crops")
    parser.add_argument("--columns", type=int, default=4)
    parser.add_argument("--rows", type=int, default=3)
    parser.add_argument("--extract-crops", action="store_true", help="Extract the legacy confirmed crop list into public/sinais")
    parser.add_argument("--extract-dados079-crops", action="store_true", help="Extract only the four confirmed DADOS-079 crops")
    parser.add_argument("--overwrite-crops", action="store_true", help="Overwrite only the explicitly listed DADOS-079 crop files")
    parser.add_argument("--extract-vector-review", action="store_true", help="Render vector-object crops for visual matching")
    args = parser.parse_args()

    if not PDF.is_file():
        raise SystemExit(f"PDF não encontrado: {PDF}")

    OUT.mkdir(parents=True, exist_ok=True)
    pages_dir = OUT / "pages"
    pages_dir.mkdir(parents=True, exist_ok=True)

    doc = fitz.open(PDF)
    cell_w, cell_h = 460, 660
    per_sheet = args.columns * args.rows
    manifest = {
        "source": "original/referencia/sinais.pdf",
        "page_count": len(doc),
        "individual_preview_dpi": args.dpi,
        "contact_sheet_dpi": args.contact_dpi,
        "crop_dpi": args.crop_dpi,
        "pages": [],
        "crops": [],
        "vector_review": [],
    }

    for index, page in enumerate(doc):
        number = index + 1
        full = render_page(page, args.dpi)
        full_path = pages_dir / f"page-{number:03d}.jpg"
        full.save(full_path, "JPEG", quality=92, optimize=True)
        manifest["pages"].append({
            "page": number,
            "preview": str(full_path.relative_to(ROOT)),
            "width": full.width,
            "height": full.height,
        })

    font = ImageFont.load_default()
    for first in range(0, len(doc), per_sheet):
        sheet = Image.new("RGB", (args.columns * cell_w, args.rows * cell_h), "white")
        draw = ImageDraw.Draw(sheet)
        last = min(first + per_sheet, len(doc))
        for offset, index in enumerate(range(first, last)):
            thumb = render_page(doc[index], args.contact_dpi)
            thumb.thumbnail((cell_w - 20, cell_h - 55), Image.Resampling.LANCZOS)
            col, row = offset % args.columns, offset // args.columns
            x, y = col * cell_w, row * cell_h
            draw.text((x + 12, y + 8), f"PÁGINA {index + 1}", fill="black", font=font)
            px = x + (cell_w - thumb.width) // 2
            sheet.paste(thumb, (px, y + 34))
            draw.rectangle((x, y, x + cell_w - 1, y + cell_h - 1), outline="#bbbbbb", width=1)
        name = f"contact-{first + 1:03d}-{last:03d}.jpg"
        sheet.save(OUT / name, "JPEG", quality=90, optimize=True)

    layout_pages = [3, 4, 5, 11, 14, 18, 21, 22, 24, 26, 27, 28, 29, 31, 35, 36, 37]
    layout = []
    for page_number in layout_pages:
        page = doc[page_number - 1]
        spans = []
        for block in page.get_text("dict").get("blocks", []):
            for line in block.get("lines", []):
                for span in line.get("spans", []):
                    text_value = span.get("text", "").strip()
                    if text_value:
                        spans.append({"text": text_value, "bbox": [round(float(v), 2) for v in span["bbox"]]})
        drawings = []
        for drawing in page.get_drawings():
            rect = drawing["rect"]
            if rect.width >= 18 and rect.height >= 18:
                drawings.append({
                    "bbox": [round(float(v), 2) for v in rect],
                    "fill": drawing.get("fill"),
                    "color": drawing.get("color"),
                    "width": round(float(drawing.get("width") or 0), 2),
                })
        layout.append({"page": page_number, "page_rect": [round(float(v), 2) for v in page.rect], "text_spans": spans, "drawing_rects": drawings})
    (OUT / "layout.json").write_text(json.dumps(layout, ensure_ascii=False, indent=2) + "\\n", encoding="utf-8")
    if args.extract_vector_review:
        manifest["vector_review"] = extract_vector_review(doc, OUT, args.crop_dpi)

    if args.extract_crops:
        SIGNAL_DIR.mkdir(parents=True, exist_ok=True)
        for filename, page_number, box, code, designation in CROPS:
            target = SIGNAL_DIR / filename
            if target.exists() and not args.overwrite_crops:
                raise SystemExit(f"Recusa de sobrescrita: {target}")
            image = render_crop_points(doc[page_number - 1], box, args.crop_dpi)
            image.save(target, "PNG", optimize=True)
            manifest["crops"].append({
                "file": f"public/sinais/{filename}",
                "page": page_number,
                "code": code,
                "designation": designation,
                "dpi": args.crop_dpi,
                "width": image.width,
                "height": image.height,
            })
    if args.extract_dados079_crops:
        SIGNAL_DIR.mkdir(parents=True, exist_ok=True)
        for filename, page_number, box, code, designation in DADOS079_CROPS:
            target = SIGNAL_DIR / filename
            if target.exists() and not args.overwrite_crops:
                raise SystemExit(f"Recusa de sobrescrita: {target}")
            image = render_crop_points(doc[page_number - 1], box, args.crop_dpi)
            image.save(target, "PNG", optimize=True)
            manifest["crops"].append({
                "file": f"public/sinais/{filename}",
                "page": page_number,
                "code": code,
                "designation": designation,
                "dpi": args.crop_dpi,
                "width": image.width,
                "height": image.height,
            })


    if args.extract_dados079_crops:
        # Preserve the existing first-question asset path used by the E2E smoke test.
        source = SIGNAL_DIR / "pdf-p26-x22-y192.png"
        legacy_target = ROOT / "public" / "exames" / "exame30" / "exame30_1.jpg"
        with Image.open(source) as original:
            original.convert("RGB").save(legacy_target, "JPEG", quality=96, subsampling=0, optimize=True)
        manifest["crops"].append({
            "file": "public/exames/exame30/exame30_1.jpg",
            "page": 26,
            "code": "E5",
            "designation": "Trânsito proibido a veículos automóveis e motociclos com carro",
            "source": "public/sinais/pdf-p26-x22-y192.png",
            "format": "JPEG quality 96 for existing E2E-compatible path",
        })


    (OUT / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"PDF: {len(doc)} páginas")
    print(f"Contact sheets: {(len(doc) + per_sheet - 1) // per_sheet}")
    print(f"Recortes novos: {len(manifest['crops'])}")
    print(f"Output: {OUT}")


if __name__ == "__main__":
    main()
