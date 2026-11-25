/**
 * GLSL shaders for the hologram particles.
 * - Scanlines that crawl upward
 * - Flicker and occasional horizontal "signal tear" glitches
 * - A bottom-to-top materialise scan when the page loads
 */

export const hologramVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uGlitch;   // 0..1 strength of the current glitch burst
  uniform float uReveal;   // 0..1 how much of the figure has materialised

  attribute float aBrightness;
  attribute float aEdge;
  attribute float aSeed;
  attribute float aHeight;

  varying float vBrightness;
  varying float vEdge;
  varying float vHeight;
  varying float vWorldY;
  varying float vVisible;

  float hash(float n) { return fract(sin(n) * 43758.5453123); }

  void main() {
    vec3 p = position;

    // gentle breathing ripple through the projection
    p.z += sin(p.y * 4.0 + uTime * 1.3) * 0.012;

    // signal tear: slice the figure into bands and shove some sideways
    float band = floor((p.y + uTime * 0.7) * 14.0);
    float tear = step(0.82, hash(band + floor(uTime * 12.0)));
    p.x += tear * (hash(band) - 0.5) * 0.22 * uGlitch;

    // per-particle shimmer
    p += (vec3(hash(aSeed * 91.0), hash(aSeed * 37.0), hash(aSeed * 13.0)) - 0.5)
         * 0.006 * (1.0 + sin(uTime * 3.0 + aSeed * 40.0));

    // materialise from the base upward; particles above the scan line scatter
    float edgeOfReveal = uReveal * 1.15;
    vVisible = 1.0 - smoothstep(edgeOfReveal - 0.08, edgeOfReveal, aHeight);
    p.y += (1.0 - vVisible) * (aSeed * 0.6);
    p.x += (1.0 - vVisible) * (hash(aSeed * 7.0) - 0.5) * 0.8;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = uSize * (0.55 + aBrightness * 0.6 + aEdge * 0.5);
    gl_PointSize = size * uPixelRatio / -mv.z;

    vBrightness = aBrightness;
    vEdge = aEdge;
    vHeight = aHeight;
    vWorldY = p.y;
  }
`

export const hologramFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorDeep;
  uniform vec3 uColorBright;
  uniform float uFlicker;

  varying float vBrightness;
  varying float vEdge;
  varying float vHeight;
  varying float vWorldY;
  varying float vVisible;

  void main() {
    // soft round particle
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float soft = 1.0 - smoothstep(0.0, 0.5, d);

    // fine scanlines crawling upward, plus a slow bright sweep
    float scan = 0.62 + 0.38 * sin(vWorldY * 190.0 - uTime * 6.0);
    float sweep = (1.0 - smoothstep(0.0, 0.06, abs(fract(vWorldY * 0.28 - uTime * 0.12) - 0.5))) * 0.9;

    // projection fades out near the base and at the very top
    float fade = smoothstep(0.0, 0.14, vHeight) * (1.0 - smoothstep(0.9, 1.02, vHeight));

    float glow = vBrightness * 0.7 + vEdge * 0.6;
    vec3 color = mix(uColorDeep, uColorBright, clamp(glow, 0.0, 1.0));
    color += sweep * uColorBright * 0.6;

    float alpha = soft * (0.06 + glow * 0.5) * scan * fade * uFlicker * vVisible;
    gl_FragColor = vec4(color * (0.8 + sweep), alpha);
  }
`

/** Soft volumetric beam that rises from the projector base */
export const beamVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const beamFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec2 vUv;
  void main() {
    // brightest at the base (vUv.y = 0), fading up
    float rise = pow(1.0 - vUv.y, 2.2);
    float rays = 0.6 + 0.4 * sin(vUv.x * 60.0 + uTime * 0.8) * sin(vUv.x * 23.0 - uTime * 0.5);
    float alpha = rise * rays * 0.16 * uIntensity;
    gl_FragColor = vec4(uColor, alpha);
  }
`
