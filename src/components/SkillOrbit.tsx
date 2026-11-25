import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { Skill } from '../data/skills'
import { RatingRing } from './RatingRing'

interface Props {
  skills: Skill[]
  selectedId: string | null
  onSelect: (id: string) => void
  radius: number
  reducedMotion: boolean
}

const CYAN = new THREE.Color('#5fe3ff')
const AMBER = new THREE.Color('#ffb547')
const tmp = new THREE.Vector3()

/** Shortest signed distance between two angles */
function angleDelta(from: number, to: number) {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from))
}

export function SkillOrbit({ skills, selectedId, onSelect, radius, reducedMotion }: Props) {
  const spin = useRef<THREE.Group>(null)
  const labels = useRef<(HTMLDivElement | null)[]>([])
  const cores = useRef<(THREE.Mesh | null)[]>([])
  const [hovered, setHovered] = useState<string | null>(null)

  const angles = useMemo(
    () => skills.map((_, i) => (i / skills.length) * Math.PI * 2),
    [skills],
  )

  const ringPoints = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius))
    }
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [radius])

  useFrame((state, delta) => {
    const g = spin.current
    if (!g) return
    const selIndex = skills.findIndex((s) => s.id === selectedId)

    if (selIndex >= 0) {
      // bring the chosen skill round to the front, just left of the story panel
      const target = angles[selIndex] - Math.PI / 2 + 0.5
      g.rotation.y += angleDelta(g.rotation.y, target) * Math.min(1, delta * 3)
    } else if (!hovered && !reducedMotion) {
      g.rotation.y += delta * 0.07
    }

    // dim and shrink labels on the far side of the ring
    skills.forEach((s, i) => {
      const core = cores.current[i]
      const label = labels.current[i]
      if (!core) return
      core.getWorldPosition(tmp)
      const front = THREE.MathUtils.clamp((tmp.z + radius) / (2 * radius), 0, 1)
      const active = s.id === selectedId || s.id === hovered
      const pulse = reducedMotion ? 1 : 1 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.12
      core.scale.setScalar((active ? 1.6 : 1) * pulse * (0.7 + front * 0.4))
      if (label) {
        label.style.opacity = String(active ? 1 : 0.3 + front * 0.7)
        label.style.transform = `scale(${0.82 + front * 0.22})`
        label.style.zIndex = String(Math.round(front * 100))
      }
    })
  })

  return (
    <group rotation={[0.2, 0, 0]}>
      <group ref={spin}>
        <lineLoop geometry={ringPoints}>
          <lineBasicMaterial color={CYAN} transparent opacity={0.28} />
        </lineLoop>
        {skills.map((s, i) => {
          const a = angles[i]
          const pos: [number, number, number] = [Math.cos(a) * radius, 0, Math.sin(a) * radius]
          return (
            <group key={s.id} position={pos}>
              <mesh ref={(m) => { cores.current[i] = m }}>
                <sphereGeometry args={[0.035, 16, 16]} />
                <meshBasicMaterial color={s.locked ? AMBER : CYAN} toneMapped={false} />
              </mesh>
              <Html center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
                <div
                  ref={(el) => { labels.current[i] = el }}
                  className="orbit-label"
                  style={{ pointerEvents: 'auto' }}
                >
                  <button
                    type="button"
                    className={`orbit-chip${s.locked ? ' is-locked' : ''}${s.id === selectedId ? ' is-active' : ''}`}
                    onClick={() => onSelect(s.id)}
                    onPointerEnter={() => setHovered(s.id)}
                    onPointerLeave={() => setHovered(null)}
                    onFocus={() => setHovered(s.id)}
                    onBlur={() => setHovered(null)}
                    aria-label={`${s.name}, rated ${s.rating} out of 100${s.locked ? ', still unlocking' : ''}. Open story`}
                  >
                    <RatingRing value={s.rating} size={34} locked={s.locked} />
                    <span>{s.name}</span>
                  </button>
                </div>
              </Html>
            </group>
          )
        })}
      </group>
    </group>
  )
}
