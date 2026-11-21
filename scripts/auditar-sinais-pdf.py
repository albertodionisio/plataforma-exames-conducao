#!/usr/bin/env python3
"""Render the official traffic-sign PDF into reviewable contact sheets and page images.

This is an audit helper only. It does not modify the source PDF or application files.
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


def render_page(page: fitz.Page, dpi: int) -> Image.Image:
    scale = dpi / 72.0
    pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
    return Image.frombytes("RGB", (pix.width, pix.height), pix.samples)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dpi", type=int, default=160, help="DPI for individual page previews")
    parser.add_argument("--contact-dpi", type=int, default=100, help="DPI before contact-sheet resizing")
    parser.add_argument("--columns", type=int, default=4)
    parser.add_argument("--rows", type=int, default=3)
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
        "pages": [],
    }

    for index, page in enumerate(doc):
        number = index + 1
        full = render_page(page, args.dpi)
        full_path = pages_dir / f"page-{number:03d}.jpg"
        full.save(full_path, "JPEG", quality=92, optimize=True)

        thumb = render_page(page, args.contact_dpi)
        thumb.thumbnail((cell_w - 20, cell_h - 55), Image.Resampling.LANCZOS)
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
            page = doc[index]
            thumb = render_page(page, args.contact_dpi)
            thumb.thumbnail((cell_w - 20, cell_h - 55), Image.Resampling.LANCZOS)
            col = offset % args.columns
            row = offset // args.columns
            x = col * cell_w
            y = row * cell_h
            draw.text((x + 12, y + 8), f"PÁGINA {index + 1}", fill="black", font=font)
            px = x + (cell_w - thumb.width) // 2
            py = y + 34
            sheet.paste(thumb, (px, py))
            draw.rectangle((x, y, x + cell_w - 1, y + cell_h - 1), outline="#bbbbbb", width=1)
        name = f"contact-{first + 1:03d}-{last:03d}.jpg"
        sheet.save(OUT / name, "JPEG", quality=90, optimize=True)

    (OUT / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"PDF: {len(doc)} páginas")
    print(f"Contact sheets: {(len(doc) + per_sheet - 1) // per_sheet}")
    print(f"Output: {OUT}")


if __name__ == "__main__":
    main()
