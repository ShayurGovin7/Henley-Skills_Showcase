/**
 * Reads the cut-out photo + depth map and converts every visible pixel
 * into a 3D particle. This is what makes the hologram a real 3D object
 * built from your photo, rather than a flat image or a video.
 */

export interface HologramPoints {
  positions: Float32Array // xyz per particle
  brightness: Float32Array // 0..1 how bright the particle glows
  edges: Float32Array // 0..1 how strongly the particle sits on a feature edge
  seeds: Float32Array // random 0..1 per particle, drives shimmer
  heights: Float32Array // 0 (bottom) .. 1 (top), drives the reveal scan
  width: number // world units
  height: number // world units
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Could not load ${src}`))
    img.src = src
  })
}

function pixels(img: HTMLImageElement): Uint8ClampedArray {
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(img, 0, 0)
  return ctx.getImageData(0, 0, img.width, img.height).data
}

export async function buildHologramPoints(
  cutoutUrl: string,
  depthUrl: string,
  options: { worldHeight: number; depthScale: number; stride: number },
): Promise<HologramPoints> {
  const [cutoutImg, depthImg] = await Promise.all([loadImage(cutoutUrl), loadImage(depthUrl)])
  const w = cutoutImg.width
  const h = cutoutImg.height
  const rgba = pixels(cutoutImg)
  const depth = pixels(depthImg)

  // Luminance of every pixel (used for brightness and edge detection)
  const lum = new Float32Array(w * h)
  for (let i = 0; i < w * h; i++) {
    lum[i] = (0.299 * rgba[i * 4] + 0.587 * rgba[i * 4 + 1] + 0.114 * rgba[i * 4 + 2]) / 255
  }

  // Sobel edge strength: makes eyes, smile, beard and hat brim read clearly
  const edgeAt = (x: number, y: number) => {
    const L = (xx: number, yy: number) =>
      lum[Math.min(h - 1, Math.max(0, yy)) * w + Math.min(w - 1, Math.max(0, xx))]
    const gx = -L(x - 1, y - 1) - 2 * L(x - 1, y) - L(x - 1, y + 1) + L(x + 1, y - 1) + 2 * L(x + 1, y) + L(x + 1, y + 1)
    const gy = -L(x - 1, y - 1) - 2 * L(x, y - 1) - L(x + 1, y - 1) + L(x - 1, y + 1) + 2 * L(x, y + 1) + L(x + 1, y + 1)
    return Math.min(1, Math.sqrt(gx * gx + gy * gy) * 1.6)
  }

  const scale = options.worldHeight / h
  const pos: number[] = []
  const bright: number[] = []
  const edge: number[] = []
  const seed: number[] = []
  const heightArr: number[] = []

  const step = options.stride
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      // jitter the sample slightly so the grid pattern disappears
      const sx = Math.min(w - 1, Math.floor(x + Math.random() * step))
      const sy = Math.min(h - 1, Math.floor(y + Math.random() * step))
      const i = sy * w + sx
      const alpha = rgba[i * 4 + 3] / 255
      if (alpha < 0.35) continue

      const d = depth[i * 4] / 255
      pos.push((sx - w / 2) * scale, (h / 2 - sy) * scale, d * options.depthScale)
      // lift dark areas (beard, shirt) so they still project, keep highlights bright
      bright.push(0.1 + 0.9 * Math.pow(lum[i], 1.15))
      edge.push(edgeAt(sx, sy))
      seed.push(Math.random())
      heightArr.push(1 - sy / h)
    }
  }

  return {
    positions: new Float32Array(pos),
    brightness: new Float32Array(bright),
    edges: new Float32Array(edge),
    seeds: new Float32Array(seed),
    heights: new Float32Array(heightArr),
    width: w * scale,
    height: h * scale,
  }
}
