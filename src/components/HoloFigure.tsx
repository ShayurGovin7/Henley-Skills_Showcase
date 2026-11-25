import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import cutoutUrl from '../assets/hologram/me-cutout.png'
import depthUrl from '../assets/hologram/me-depth.png'
import { buildHologramPoints, type HologramPoints } from '../lib/buildPoints'
import { hologramFragment, hologramVertex } from '../shaders/hologram'

export const FIGURE_HEIGHT = 2.5

const DEEP = new THREE.Color('#0e6f8f')
const BRIGHT = new THREE.Color('#b8f7ff')

interface Props {
  /** changes whenever a skill is selected, to fire a small signal glitch */
  pulseKey: string | null
  reducedMotion: boolean
  onReady?: () => void
}

/** Faint "ghost" of the photo behind the particles, so the face reads clearly */
const ghostVertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`
const ghostFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    vec4 t = texture2D(uMap, vUv);
    float lum = dot(t.rgb, vec3(0.299, 0.587, 0.114));
    float scan = 0.55 + 0.45 * sin(vUv.y * 520.0 - uTime * 6.0);
    float fade = smoothstep(0.0, 0.18, vUv.y);
    gl_FragColor = vec4(uColor * (0.15 + pow(lum, 1.2) * 1.6), t.a * scan * fade * uOpacity);
  }
`

export function HoloFigure({ pulseKey, reducedMotion, onReady }: Props) {
  const [data, setData] = useState<HologramPoints | null>(null)
  const group = useRef<THREE.Group>(null)
  const pointsMat = useRef<THREE.ShaderMaterial>(null)
  const ghostMat = useRef<THREE.ShaderMaterial>(null)
  const glitch = useRef({ value: 0, nextAt: 3 })
  const revealStart = useRef<number | null>(null)
  const { gl, pointer } = useThree()
  const ghostTexture = useLoader(THREE.TextureLoader, cutoutUrl)

  useEffect(() => {
    const small = window.innerWidth < 700
    buildHologramPoints(cutoutUrl, depthUrl, {
      worldHeight: FIGURE_HEIGHT,
      depthScale: 0.55,
      stride: small ? 2 : 1,
    }).then((points) => {
      setData(points)
      onReady?.()
    })
  }, [onReady])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 11 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
      uGlitch: { value: 0 },
      uReveal: { value: 0 },
      uFlicker: { value: 1 },
      uColorDeep: { value: DEEP },
      uColorBright: { value: BRIGHT },
    }),
    [gl],
  )

  const ghostUniforms = useMemo(
    () => ({
      uMap: { value: ghostTexture },
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uColor: { value: new THREE.Color('#5fe3ff') },
    }),
    [ghostTexture],
  )

  // a quick signal glitch whenever the visitor opens a skill
  useEffect(() => {
    if (pulseKey && !reducedMotion) glitch.current.value = 1
  }, [pulseKey, reducedMotion])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    // always write to the live material uniforms
    const u = pointsMat.current?.uniforms
    const gu = ghostMat.current?.uniforms
    if (!data || !u || !gu) return
    if (revealStart.current === null) revealStart.current = t

    // materialise over ~2.4 seconds (instant for reduced motion)
    const reveal = reducedMotion ? 1 : Math.min(1, (t - revealStart.current) / 2.4)
    u.uReveal.value = reveal
    u.uTime.value = t
    gu.uTime.value = t
    gu.uOpacity.value = 0.3 * reveal

    if (!reducedMotion) {
      // random glitch bursts every few seconds
      const g = glitch.current
      if (t > g.nextAt) {
        g.value = 0.6 + Math.random() * 0.4
        g.nextAt = t + 3 + Math.random() * 5
      }
      g.value = Math.max(0, g.value - delta * 4)
      u.uGlitch.value = g.value
      // projector flicker: mostly steady, with brief dips
      u.uFlicker.value = 0.92 + Math.sin(t * 37.0) * 0.03 + (Math.random() < 0.015 ? -0.35 : 0)
    }

    // slow turn plus a little follow of the mouse
    if (group.current) {
      const sway = reducedMotion ? 0 : Math.sin(t * 0.35) * 0.22
      const targetY = sway + pointer.x * 0.25
      const targetX = -pointer.y * 0.08
      group.current.rotation.y += (targetY - group.current.rotation.y) * 0.05
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05
      group.current.position.y = reducedMotion ? 0 : Math.sin(t * 0.8) * 0.025
    }
  })

  if (!data) return null

  return (
    <group ref={group}>
      <mesh position={[0, 0, 0.12]}>
        <planeGeometry args={[data.width, data.height]} />
        <shaderMaterial
          ref={ghostMat}
          vertexShader={ghostVertex}
          fragmentShader={ghostFragment}
          uniforms={ghostUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
          <bufferAttribute attach="attributes-aBrightness" args={[data.brightness, 1]} />
          <bufferAttribute attach="attributes-aEdge" args={[data.edges, 1]} />
          <bufferAttribute attach="attributes-aSeed" args={[data.seeds, 1]} />
          <bufferAttribute attach="attributes-aHeight" args={[data.heights, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={pointsMat}
          vertexShader={hologramVertex}
          fragmentShader={hologramFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
