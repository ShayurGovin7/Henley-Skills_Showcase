import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { beamFragment, beamVertex } from '../shaders/hologram'

const CYAN = new THREE.Color('#5fe3ff')

/** The emitter disc on the floor and the soft beam of light it throws upward */
export function ProjectorBase({ y, reducedMotion }: { y: number; reducedMotion: boolean }) {
  const ringA = useRef<THREE.Mesh>(null)
  const ringB = useRef<THREE.Mesh>(null)
  const beamMat = useRef<THREE.ShaderMaterial>(null)
  const beamUniforms = useMemo(
    () => ({ uTime: { value: 0 }, uColor: { value: CYAN }, uIntensity: { value: 1 } }),
    [],
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const u = beamMat.current?.uniforms
    if (!u) return
    u.uTime.value = t
    if (reducedMotion) return
    if (ringA.current) ringA.current.rotation.z = t * 0.4
    if (ringB.current) ringB.current.rotation.z = -t * 0.25
    u.uIntensity.value = 0.9 + Math.sin(t * 2.1) * 0.1
  })

  return (
    <group position={[0, y, 0]}>
      {/* beam: an open cone, wider at the top */}
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[1.35, 0.62, 2.9, 64, 1, true]} />
        <shaderMaterial
          ref={beamMat}
          vertexShader={beamVertex}
          fragmentShader={beamFragment}
          uniforms={beamUniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* emitter disc */}
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <circleGeometry args={[0.62, 64]} />
          <meshBasicMaterial color="#0b3a4d" transparent opacity={0.85} />
        </mesh>
        <mesh ref={ringA} position={[0, 0, 0.002]}>
          <ringGeometry args={[0.58, 0.62, 64, 1, 0, Math.PI * 1.6]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.9} toneMapped={false} />
        </mesh>
        <mesh ref={ringB} position={[0, 0, 0.003]}>
          <ringGeometry args={[0.42, 0.44, 64, 1, 0, Math.PI * 1.2]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.6} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, 0.001]}>
          <ringGeometry args={[0.9, 0.905, 96]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.25} />
        </mesh>
        <mesh position={[0, 0, 0.004]}>
          <circleGeometry args={[0.16, 48]} />
          <meshBasicMaterial color="#d6fbff" toneMapped={false} />
        </mesh>
      </group>

      {/* dust caught in the beam */}
      {!reducedMotion && (
        <Sparkles
          count={70}
          scale={[2.2, 2.8, 1.4]}
          position={[0, 1.4, 0]}
          size={1.6}
          speed={0.25}
          opacity={0.5}
          color="#9ff3ff"
        />
      )}
    </group>
  )
}
