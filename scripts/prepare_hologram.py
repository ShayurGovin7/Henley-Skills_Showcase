"""
prepare_hologram.py
-------------------
Turns any portrait photo into the two images the hologram needs:

  src/assets/hologram/me-cutout.png  -> the person with the background removed
  src/assets/hologram/me-depth.png   -> a soft "depth map" (white = closer to viewer)

Usage (from the project root):
    pip install "rembg[cpu]" pillow numpy scipy
    python scripts/prepare_hologram.py path/to/your-photo.jpg

Then restart `npm run dev` and the hologram will use the new photo.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps
from rembg import new_session, remove
from scipy import ndimage

OUT_DIR = Path(__file__).resolve().parent.parent / "src" / "assets" / "hologram"
TARGET_WIDTH = 440  # smaller = fewer particles = faster on phones


def boost_contrast(cutout: Image.Image) -> Image.Image:
    """Even out the light on the person so dark hair, beards and suits still glow."""
    alpha = cutout.split()[-1]
    rgb = cutout.convert("RGB")
    person = alpha.point(lambda v: 255 if v > 128 else 0)
    evened = ImageOps.equalize(rgb, mask=person)
    rgb = Image.blend(rgb, evened, 0.5)
    rgb = ImageEnhance.Brightness(rgb).enhance(1.1)
    out = rgb.convert("RGBA")
    out.putalpha(alpha)
    return out


def main(photo_path: str) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # 1. Remove the background
    photo = Image.open(photo_path).convert("RGB")
    session = new_session("isnet-general-use")
    cutout = remove(photo, session=session)

    # 2. Crop tightly around the person, with a little breathing room
    alpha = np.array(cutout.split()[-1])
    alpha[alpha < 40] = 0  # drop faint edge noise
    ys, xs = np.nonzero(alpha)
    pad = 20
    box = (
        max(xs.min() - pad, 0),
        max(ys.min() - pad, 0),
        min(xs.max() + pad, cutout.width),
        min(ys.max() + pad, cutout.height),
    )
    cutout = cutout.crop(box)
    cutout = boost_contrast(cutout)
    alpha = np.array(cutout.split()[-1]).astype(np.float32) / 255.0

    # 3. Build a depth map.
    #    Distance from the silhouette edge gives a rounded "pillow" shape,
    #    and a touch of brightness adds facial relief (nose, beard, brim).
    inside = alpha > 0.5
    dist = ndimage.distance_transform_edt(inside)
    dist = np.sqrt(dist / (dist.max() + 1e-6))  # rounder falloff
    lum = np.array(cutout.convert("L")).astype(np.float32) / 255.0
    depth = 0.8 * dist + 0.2 * lum * inside
    depth = depth / (depth.max() + 1e-6)
    depth_img = Image.fromarray((depth * 255).astype(np.uint8)).filter(
        ImageFilter.GaussianBlur(radius=3)
    )

    # 4. Resize both to the same working size
    scale = TARGET_WIDTH / cutout.width
    size = (TARGET_WIDTH, round(cutout.height * scale))
    cutout.resize(size, Image.LANCZOS).save(OUT_DIR / "me-cutout.png", optimize=True)
    depth_img.resize(size, Image.LANCZOS).save(OUT_DIR / "me-depth.png", optimize=True)
    print(f"Saved hologram assets ({size[0]}x{size[1]}) to {OUT_DIR}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("Usage: python scripts/prepare_hologram.py path/to/photo.jpg")
    main(sys.argv[1])