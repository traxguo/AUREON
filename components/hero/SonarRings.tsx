'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { heroProgress, PHASES, range, smoothstep } from './heroProgress';

type SonarRingsProps = {
  count?: number;
  maxRadius?: number;
  /** Seconds per full expansion of one ring. */
  period?: number;
  /** Freeze the rings at a representative frame (reduced motion). */
  still?: boolean;
};

/**
 * Concentric radar pulses spreading out from under the tracks, along the
 * ground plane. Rings are driven by the clock rather than by scroll so the
 * pulse keeps its own rhythm while the visitor scrubs.
 */
export function SonarRings({
  count = 4,
  maxRadius = 9,
  period = 3.4,
  still = false,
}: SonarRingsProps) {
  const group = useRef<THREE.Group>(null);
  const meshes = useRef<THREE.Mesh[]>([]);

  // A very thin band so it stays hairline-thin once scaled up.
  const geometry = useMemo(() => new THREE.RingGeometry(1, 1.014, 96), []);
  const materials = useMemo(
    () =>
      Array.from(
        { length: count },
        () =>
          new THREE.MeshBasicMaterial({
            color: '#D4AF37',
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide,
            depthWrite: false,
            toneMapped: false,
          }),
      ),
    [count],
  );

  useFrame(({ clock }) => {
    const p = heroProgress.value;

    // Fade in as the scan phase opens, out again as the sequence releases.
    const intensity =
      smoothstep(PHASES.recognition[1] - 0.02, PHASES.scan[0] + 0.04, p) *
      (1 - smoothstep(PHASES.release[0], PHASES.release[0] + 0.08, p));

    if (group.current) group.current.visible = intensity > 0.001;
    if (intensity <= 0.001) return;

    const time = still ? period * 0.45 : clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const mesh = meshes.current[i];
      if (!mesh) continue;

      const phase = ((time / period) + i / count) % 1;
      const radius = 0.7 + phase * maxRadius;
      mesh.scale.setScalar(radius);

      const material = materials[i];
      // Bright at birth, damped as it travels outward.
      material.opacity = Math.pow(1 - phase, 1.7) * 0.85 * intensity;
    }
  });

  return (
    <group ref={group} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
      {materials.map((material, i) => (
        <mesh
          key={i}
          ref={(node) => {
            if (node) meshes.current[i] = node;
          }}
          geometry={geometry}
          material={material}
          renderOrder={2}
        />
      ))}
    </group>
  );
}

/** The emitter itself: a small pulsing disc under the GPR array. */
export function SonarEmitter() {
  const material = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    if (!material.current) return;
    const p = heroProgress.value;
    const gate = range(p, PHASES.scan[0] - 0.02, PHASES.scan[0] + 0.06);
    const pulse = 0.35 + 0.3 * Math.sin(clock.getElapsedTime() * 3.2);
    material.current.opacity = gate * pulse * (1 - range(p, PHASES.release[0], 0.94));
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.15, 0.012, 0]} renderOrder={2}>
      <circleGeometry args={[0.55, 32]} />
      <meshBasicMaterial
        ref={material}
        color="#D4AF37"
        transparent
        opacity={0}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

export default SonarRings;
