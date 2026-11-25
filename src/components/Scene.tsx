import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bloom, ChromaticAberration, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import type { Skill } from '../data/skills'
import { FIGURE_HEIGHT, HoloFigure } from './HoloFigure'
import { ProjectorBase } from './ProjectorBase'
import { SkillOrbit } from './SkillOrbit'

interface Props {
  skills: Skill[]
  selectedId: string | null
  onSelect: (id: string) => void
  onReady: () => void
  reducedMotion: boolean
}

// created once so the post-processing chain is not rebuilt on every render
const CA_OFFSET = new THREE.Vector2(0.0012, 0.0008)

/** Screen-shape presets: phones get a smaller rig and a tighter orbit */
function layoutFor(width: number, height: number) {
  const aspect = width / height
  if (aspect < 0.75) return { camZ: 5.2, scale: 0.55, radius: 1.4, narrow: true }
  if (aspect < 1.1) return { camZ: 6.2, scale: 0.8, radius: 1.9, narrow: false }
  // shorter laptop screens: shrink a little so the orbit clears the corner text
  return { camZ: 5.4, scale: height < 820 ? 0.86 : 1, radius: 2.05, narrow: false }
}

/** Everything inside the 3D canvas */
function Stage({ skills, selectedId, onSelect, onReady, reducedMotion }: Props) {
  const { camera, size } = useThree()
  const rig = useRef<THREE.Group>(null)
  const layout = layoutFor(size.width, size.height)

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    cam.position.set(0, 0.35, layout.camZ)
    cam.lookAt(0, -0.05, 0)
    cam.updateProjectionMatrix()
  }, [camera, layout.camZ])

  // when a story opens: slide left on wide screens, lift up on phones
  useFrame((_, delta) => {
    const g = rig.current
    if (!g) return
    const open = selectedId !== null
    const tx = open && !layout.narrow ? -1.35 : 0
    const ty = open && layout.narrow ? 0.85 : 0
    const k = Math.min(1, delta * 4)
    g.position.x += (tx - g.position.x) * k
    g.position.y += (ty - g.position.y) * k
    g.scale.setScalar(layout.scale)
  })

  return (
    <group ref={rig}>
      <Suspense fallback={null}>
        <HoloFigure pulseKey={selectedId} reducedMotion={reducedMotion} onReady={onReady} />
      </Suspense>
      <ProjectorBase y={-FIGURE_HEIGHT / 2 - 0.12} reducedMotion={reducedMotion} />
      <group position={[0, -0.35, 0]}>
        <SkillOrbit
          skills={skills}
          selectedId={selectedId}
          onSelect={onSelect}
          radius={layout.radius}
          reducedMotion={reducedMotion}
        />
      </group>
    </group>
  )
}

export function Scene(props: Props) {
  return (
    <Canvas
      className="scene-canvas"
      dpr={[1, 2]}
      camera={{ fov: 38, position: [0, 0.35, 5.4] }}
      gl={{ antialias: false, alpha: true }}
    >
      <Stage {...props} />
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur intensity={0.85} luminanceThreshold={0.18} luminanceSmoothing={0.35} radius={0.65} />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={CA_OFFSET}
          radialModulation={false}
          modulationOffset={0}
        />
        <Noise opacity={0.05} premultiply />
        <Vignette eskil={false} offset={0.2} darkness={0.75} />
      </EffectComposer>
    </Canvas>
  )
}
