"""Builds screenshots/components/00-component-sheet(-light).png from the close-ups."""
import json, os
from PIL import Image, ImageDraw, ImageFont

D = os.path.join(os.path.dirname(__file__), '..', 'screenshots', 'components')
shots = json.load(open(os.path.join(D, 'shots.json')))
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
for cand in ['/usr/share/fonts/truetype/inter/Inter-Medium.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf']:
    if os.path.exists(cand):
        FONT = cand
        break


def build(theme, out):
    bg, fg, sub = ((22, 22, 21), (236, 236, 234), (141, 140, 135)) if theme == 'dark' else ((240, 240, 238), (31, 31, 30), (109, 108, 103))
    items = [s for s in shots if s['theme'] == theme]
    if theme == 'dark':
        items = [s for s in items]
    W, COLS, GAP, TW = 3200, 4, 48, 0
    cw = (W - GAP * (COLS + 1)) // COLS
    f = ImageFont.truetype(FONT, 26)
    ft = ImageFont.truetype(FONT, 44)
    tiles = []
    for s in items:
        im = Image.open(os.path.join(D, s['file'])).convert('RGB')
        sc = min(1.0, cw / im.width, 900 / im.height)
        im = im.resize((max(1, int(im.width * sc)), max(1, int(im.height * sc))), Image.LANCZOS)
        tiles.append((s, im))
    # masonry layout
    heights = [150] * COLS
    pos = []
    for s, im in tiles:
        c = heights.index(min(heights))
        pos.append((c, heights[c]))
        heights[c] += im.height + 54 + GAP
    H = max(heights) + GAP
    sheet = Image.new('RGB', (W, H), bg)
    d = ImageDraw.Draw(sheet)
    d.text((GAP, 50), f"CyberJourney · UI components ({theme} theme)", font=ft, fill=fg)
    for (s, im), (c, y) in zip(tiles, pos):
        x = GAP + c * (cw + GAP)
        d.text((x, y), s['label'], font=f, fill=sub)
        sheet.paste(im, (x, y + 40))
        d.rounded_rectangle([x - 1, y + 39, x + im.width, y + 40 + im.height], radius=6, outline=(54, 54, 52) if theme == 'dark' else (220, 220, 216), width=2)
    sheet.save(os.path.join(D, out), optimize=True)
    print(out, sheet.size)


build('dark', '00-component-sheet.png')
build('light', '00-component-sheet-light.png')
