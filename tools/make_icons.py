#!/usr/bin/env python3
"""Generate the extension icons (16, 48, 128 px) with the Python standard library only.

Usage: python3 tools/make_icons.py [output_dir]
Default output directory: icons/ next to the tools/ folder.
"""
import os
import struct
import sys
import zlib

BLUE = (26, 115, 232)
WHITE = (255, 255, 255)


def in_round_rect(x, y, x0, y0, x1, y1, r):
    if x < x0 or x > x1 or y < y0 or y > y1:
        return False
    cx = min(max(x, x0 + r), x1 - r)
    cy = min(max(y, y0 + r), y1 - r)
    return (x - cx) ** 2 + (y - cy) ** 2 <= r * r


def in_circle(x, y, cx, cy, r):
    return (x - cx) ** 2 + (y - cy) ** 2 <= r * r


def in_triangle(x, y, a, b, c):
    def sign(p1, p2, p3):
        return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1])
    p = (x, y)
    d1, d2, d3 = sign(p, a, b), sign(p, b, c), sign(p, c, a)
    has_neg = d1 < 0 or d2 < 0 or d3 < 0
    has_pos = d1 > 0 or d2 > 0 or d3 > 0
    return not (has_neg and has_pos)


def sample(x, y):
    """Return (r, g, b, a) for a point in unit coordinates (0..1)."""
    if not in_round_rect(x, y, 0.0, 0.0, 1.0, 1.0, 0.22):
        return (0, 0, 0, 0)
    color = BLUE
    # the "photo" frame
    if in_round_rect(x, y, 0.18, 0.18, 0.82, 0.64, 0.05):
        color = WHITE
        if in_circle(x, y, 0.34, 0.32, 0.055):
            color = BLUE
        elif in_triangle(x, y, (0.22, 0.60), (0.42, 0.36), (0.62, 0.60)):
            color = BLUE
        elif in_triangle(x, y, (0.48, 0.60), (0.64, 0.42), (0.80, 0.60)):
            color = BLUE
    # two caption lines, the second one shorter, like a credit under the photo
    elif in_round_rect(x, y, 0.18, 0.72, 0.82, 0.79, 0.035):
        color = WHITE
    elif in_round_rect(x, y, 0.18, 0.84, 0.56, 0.91, 0.035):
        color = WHITE
    return color + (255,)


def render(size, ss):
    rows = []
    for py in range(size):
        row = bytearray()
        for px in range(size):
            r = g = b = a = 0
            for sy in range(ss):
                for sx in range(ss):
                    x = (px + (sx + 0.5) / ss) / size
                    y = (py + (sy + 0.5) / ss) / size
                    cr, cg, cb, ca = sample(x, y)
                    r += cr * ca
                    g += cg * ca
                    b += cb * ca
                    a += ca
            n = ss * ss
            if a == 0:
                row += bytes((0, 0, 0, 0))
            else:
                row += bytes((round(r / a), round(g / a), round(b / a), round(a / n)))
        rows.append(bytes(row))
    return rows


def write_png(path, size, rows):
    raw = b"".join(b"\x00" + r for r in rows)

    def chunk(tag, data):
        c = struct.pack(">I", len(data)) + tag + data
        return c + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

    png = b"\x89PNG\r\n\x1a\n"
    png += chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0))
    png += chunk(b"IDAT", zlib.compress(raw, 9))
    png += chunk(b"IEND", b"")
    with open(path, "wb") as f:
        f.write(png)


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(here, "..", "icons")
    os.makedirs(out, exist_ok=True)
    for size, ss in ((16, 8), (48, 6), (128, 4)):
        path = os.path.join(out, f"icon{size}.png")
        write_png(path, size, render(size, ss))
        print("wrote", os.path.normpath(path))


if __name__ == "__main__":
    main()
