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
    ("A1-sinal-pdf.png", 3, (60, 270, 370, 550), "A1", "Trabalhos na estrada"),
    ("A18-sinal-pdf.png", 4, (335, 60, 620, 260), "A18", "Visibilidade reduzida"),
    ("A37-sinal-pdf.png", 4, (75, 1560, 335, 1740), "A37", "Subida de inclinação acentuada"),
    ("A45-sinal-pdf.png", 5, (60, 340, 280, 540), "A45", "Travessia de peões"),
    ("A46-sinal-pdf.png", 5, (350, 345, 570, 540), "A46", "Passagem de peões"),
    ("A51-sinal-pdf.png", 5, (675, 640, 890, 820), "A51", "Ponte estreita"),
    ("D1-sinal-pdf.png", 21, (90, 110, 320, 320), "D1", "Sinalização luminosa"),
    ("D14-sinal-pdf.png", 21, (350, 1070, 610, 1350), "D14", "Descida de inclinação acentuada"),
    ("D27-sinal-pdf.png", 22, (650, 400, 900, 680), "D27", "Cruzamento com estrada sem prioridade"),
    ("D62-sinal-pdf.png", 24, (335, 90, 605, 320), "D62", "Visibilidade reduzida"),
    ("D63-sinal-pdf.png", 24, (650, 90, 925, 320), "D63", "Congestionamento de tráfego"),
    ("D68-sinal-pdf.png", 24, (1000, 450, 1270, 630), "D68", "Passagem de nível"),
    ("E3-sinal-pdf.png", 26, (650, 230, 920, 520), "E3", "Trânsito proibido a automóveis ligeiros"),
    ("E19-sinal-pdf.png", 27, (660, 200, 910, 480), "E19", "Trânsito proibido a veículos de peso por eixo superior a ... t"),
    ("E24-sinal-pdf.png", 27, (1010, 560, 1270, 760), "E24", "Proibição de sinais sonoros"),
    ("E36-sinal-pdf.png", 28, (1010, 180, 1270, 440), "E36", "Trânsito proibido a veículos que transportam substâncias perigosas"),
    ("E37-sinal-pdf.png", 28, (40, 560, 350, 850), "E37", "Trânsito proibido a veículos de peso por eixo múltiplo superior a ... t"),
    ("E50-sinal-pdf.png", 29, (340, 180, 590, 450), "E50", "Estacionamento proibido"),
    ("E51-sinal-pdf.png", 29, (660, 180, 910, 470), "E51", "Paragem e estacionamento proibidos"),
    ("F13-sinal-pdf.png", 31, (125, 1420, 355, 1660), "F13", "Pista obrigatória para velocípedes e peões"),
    ("G1-sinal-pdf.png", 35, (80, 230, 220, 420), "G1", "Área reservada para autocarros"),
    ("G27-sinal-pdf.png", 36, (330, 230, 480, 420), "G27", "Parque de estacionamento para autocarros e autocarros médios"),
    ("sem-codigo-area-reservada-veiculos-dimensoes-anormais.png", 14, (318, 1450, 453, 1634), None, "Área reservada para veículos de dimensões anormais"),
    ("sem-codigo-area-reservada-autocarros-excursao.png", 14, (805, 1452, 942, 1635), None, "Área reservada para autocarros de excursão"),
    ("sem-codigo-parque-estacionamento-substancias-perigosas.png", 14, (85, 1445, 223, 1630), None, "Parque de estacionamento para veículos que transportam substâncias perigosas"),
    ("sem-codigo-parque-estacionamento-veiculos-policia.png", 14, (1025, 1452, 1165, 1635), None, "Parque de estacionamento para veículos da polícia"),
    ("sem-codigo-parque-estacionamento-pesados-mercadorias-10t.png", 14, (985, 1125, 1115, 1308), None, "Parque de estacionamento para automóveis pesados de mercadorias de peso total superior a 10 toneladas"),
    ("E28-proibicao-inversao-noite.png", 18, (550, 600, 820, 950), "E28", "Proibição de inversão do sentido de marcha de noite (painel adicional)"),
    ("sem-codigo-limite-120-km-dia.png", 18, (880, 640, 1240, 1080), None, "Proibição de exceder a velocidade de 120 km/h durante o dia (sinal combinado)"),
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


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dpi", type=int, default=160, help="DPI for individual page previews")
    parser.add_argument("--contact-dpi", type=int, default=100, help="DPI before contact-sheet resizing")
    parser.add_argument("--crop-dpi", type=int, default=600, help="DPI for signal crops")
    parser.add_argument("--columns", type=int, default=4)
    parser.add_argument("--rows", type=int, default=3)
    parser.add_argument("--extract-crops", action="store_true", help="Extract confirmed crops into public/sinais")
    parser.add_argument("--overwrite-crops", action="store_true", help="Overwrite only the explicitly listed DADOS-079 crop files")
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

    if args.extract_crops:
        SIGNAL_DIR.mkdir(parents=True, exist_ok=True)
        for filename, page_number, box, code, designation in CROPS:
            target = SIGNAL_DIR / filename
            if target.exists() and not args.overwrite_crops:
                raise SystemExit(f"Recusa de sobrescrita: {target}")
            image = render_crop(doc[page_number - 1], box, args.crop_dpi)
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
