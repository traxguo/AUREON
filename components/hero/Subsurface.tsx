'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { heroProgress, PHASES, range } from './heroProgress';
import { lineY, subsurfaceLines, type SubsurfaceLine } from './subsurfaceLines';

/** When each line starts resolving, and how long it takes. */
const FIRST_REVEAL = 0.43;
const REVEAL_STAGGER = 0.035;
const REVEAL_DURATION = 0.07;

function BuriedLine({ line }: { line: SubsurfaceLine }) {
  const group = useRef<THREE.Group>(null);

  const { geometry, collarGeometry, solid, wire, collar } = useMemo(() => {
    const base = {
      transparent: true,
      opacity: 0,
      depthWrite: false,
      toneMapped: false,
    } as const;

    return {
      geometry: new THREE.CylinderGeometry(
        line.radius,
        line.radius,
        line.length,
        line.radialSegments,
        line.lengthSegments,
        true,
      ),
      collarGeometry: new THREE.TorusGeometry(line.radius * 1.25, line.radius * 0.1, 6, 16),
      solid: new THREE.MeshBasicMaterial({
        ...base,
        color: line.color,
        side: THREE.DoubleSide,
      }),
      wire: new THREE.MeshBasicMaterial({ ...base, color: line.color, wireframe: true }),
      collar: new THREE.MeshBasicMaterial({ ...base, color: '#D4AF37' }),
    };
  }, [line.color, line.length, line.radius, line.radialSegments, line.lengthSegments]);

  useEffect(
    () => () => {
      geometry.dispose();
      collarGeometry.dispose();
      solid.dispose();
      wire.dispose();
      collar.dispose();
    },
    [geometry, collarGeometry, solid, wire, collar],
  );

  const collarPositions = useMemo(() => {
    const step = line.length / 4;
    return [-1, 0, 1].map((i) => i * step);
  }, [line.length]);

  // Deeper lines return a weaker signal — dimmer wireframe, so the shallow
  // hazards read first and the frame stays legible.
  const signal = 1 - Math.min(0.45, (line.depth / 4) * 0.45);

  const start = FIRST_REVEAL + line.order * REVEAL_STAGGER;
  const restY = lineY(line.depth);

  useFrame(() => {
    const p = heroProgress.value;
    const reveal = range(p, start, start + REVEAL_DURATION);
    const retreat = 1 - range(p, PHASES.release[0] + 0.03, 0.97);
    const value = reveal * retreat;

    if (group.current) {
      group.current.visible = value > 0.002;
      // Lines settle upward into place as the radar resolves them.
      group.current.position.y = restY - (1 - reveal) * 0.5;
    }
    solid.opacity = value * 0.12 * signal;
    wire.opacity = value * 0.55 * signal;
    collar.opacity = value * 0.7 * signal;
  });

  return (
    <group
      ref={group}
      position={[
        line.offset * Math.sin(line.heading),
        restY,
        line.offset * Math.cos(line.heading),
      ]}
    >
      <group rotation={[0, line.heading, 0]}>
        <mesh geometry={geometry} material={solid} rotation={[0, 0, Math.PI / 2]} renderOrder={1} />
        <mesh geometry={geometry} material={wire} rotation={[0, 0, Math.PI / 2]} renderOrder={2} />
        {collarPositions.map((x) => (
          <mesh
            key={x}
            geometry={collarGeometry}
            material={collar}
            position={[x, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
            renderOrder={3}
          />
        ))}
      </group>
    </group>
  );
}

export function Subsurface({ mobile = false }: { mobile?: boolean }) {
  const lines = useMemo(
    () => (mobile ? subsurfaceLines.filter((line) => line.mobile) : subsurfaceLines),
    [mobile],
  );

  return (
    <group>
      {lines.map((line) => (
        <BuriedLine key={line.id} line={line} />
      ))}
    </group>
  );
}

export default Subsurface;
