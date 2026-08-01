'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import { landCoordinates } from '@/data/worldMask';
import type { Site } from '@/data/sites';
import { GLOBE_RADIUS, easeInOutCubic, latLngToVector3, rotationForPoint, shortestAngle } from './geo';

const GOLD = '#D4AF37';
const GOLD_DIM = '#8C7527';
const FOCUS_MS = 800;
const AUTO_ROTATE_SPEED = 0.3;
const MAX_PITCH = 1.05;

/* ------------------------------------------------------------------ */
/* Dot-matrix land                                                     */
/* ------------------------------------------------------------------ */

function LandPoints({ density }: { density: number }) {
  const { geometry, material } = useMemo(() => {
    const coords = landCoordinates(density);
    const positions = new Float32Array(coords.length * 3);
    coords.forEach(([lng, lat], i) => {
      const point = latLngToVector3(lat, lng, GLOBE_RADIUS * 1.004);
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
    });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Land reads as lit coastline against empty ocean, so the dots sit close to
    // the bone tone rather than the muted silver used for body copy.
    const mat = new THREE.PointsMaterial({
      color: '#F3F1EA',
      size: density > 1 ? 0.03 : 0.02,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return { geometry: geo, material: mat };
  }, [density]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  return <points geometry={geometry} material={material} />;
}

/* ------------------------------------------------------------------ */
/* Markers                                                             */
/* ------------------------------------------------------------------ */

type PinProps = {
  site: Site;
  selected: boolean;
  isNearest: boolean;
  onSelect: (site: Site) => void;
  onHover: (site: Site | null) => void;
};

function Pin({ site, selected, isNearest, onSelect, onHover }: PinProps) {
  const primary = site.tier === 'primary';
  const color = primary ? GOLD : GOLD_DIM;
  const baseOpacity = primary ? 1 : 0.55;

  const position = useMemo(() => latLngToVector3(site.lat, site.lng), [site.lat, site.lng]);
  const quaternion = useMemo(
    () =>
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        position.clone().normalize(),
      ),
    [position],
  );

  const head = useRef<THREE.Mesh>(null);
  const pulse = useRef<THREE.Mesh>(null);
  const pulseMaterial = useRef<THREE.MeshBasicMaterial>(null);

  // Offset the pulse so the ten markers do not breathe in unison.
  const phase = useMemo(() => Math.random(), []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const beat = (time * 0.5 + phase) % 1;

    if (pulse.current && pulseMaterial.current) {
      const scale = 1 + beat * 2.6;
      pulse.current.scale.set(scale, scale, scale);
      pulseMaterial.current.opacity = (1 - beat) * 0.5 * baseOpacity;
    }
    if (head.current) {
      const breathe = 1 + Math.sin(time * 2.4 + phase * 6.283) * 0.18;
      head.current.scale.setScalar(selected ? breathe * 1.5 : breathe);
    }
  });

  return (
    <group position={position} quaternion={quaternion}>
      {/* Beam of light rising off the surface */}
      <mesh position={[0, 0.11, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.22, 6]} />
        <meshBasicMaterial color={color} transparent opacity={baseOpacity * 0.75} depthWrite={false} />
      </mesh>

      {/* Pulsing head */}
      <mesh ref={head} position={[0, 0.24, 0]}>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={baseOpacity} toneMapped={false} />
      </mesh>

      {/* Ring spreading at the base */}
      <mesh ref={pulse} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <ringGeometry args={[0.026, 0.032, 32]} />
        <meshBasicMaterial
          ref={pulseMaterial}
          color={color}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Static collar marking the machine nearest the visitor */}
      {isNearest && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
          <ringGeometry args={[0.062, 0.07, 40]} />
          <meshBasicMaterial color={GOLD} transparent opacity={0.85} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      )}

      {/* Selection collar */}
      {selected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
          <ringGeometry args={[0.045, 0.052, 40]} />
          <meshBasicMaterial color={GOLD} transparent opacity={1} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      )}

      {/* Generous invisible hit area — the visible pin is too small to tap */}
      <mesh
        position={[0, 0.16, 0]}
        onPointerDown={(event: ThreeEvent<PointerEvent>) => event.stopPropagation()}
        onClick={(event: ThreeEvent<MouseEvent>) => {
          event.stopPropagation();
          onSelect(site);
        }}
        onPointerOver={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation();
          onHover(site);
        }}
        onPointerOut={() => onHover(null)}
      >
        <sphereGeometry args={[0.075, 8, 8]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Rotating globe                                                      */
/* ------------------------------------------------------------------ */

type GlobeBodyProps = {
  sites: Site[];
  selectedId: string | null;
  nearestId: string | null;
  density: number;
  onSelect: (site: Site) => void;
  onHover: (site: Site | null) => void;
  onEmptyClick: (screen: { x: number; y: number }) => void;
};

function GlobeBody({
  sites,
  selectedId,
  nearestId,
  density,
  onSelect,
  onHover,
  onEmptyClick,
}: GlobeBodyProps) {
  const group = useRef<THREE.Group>(null);

  // Open on Europe and North Africa: it is where the primary sites are, and
  // the Atlantic gives the dot matrix an empty edge to read against.
  const initial = useMemo(() => rotationForPoint(latLngToVector3(32, 18)), []);

  const state = useRef({
    rotX: initial.x,
    rotY: initial.y,
    dragging: false,
    lastX: 0,
    lastY: 0,
    moved: 0,
    idleUntil: 0,
    focus: null as null | { from: { x: number; y: number }; delta: { x: number; y: number }; start: number },
  });

  // Focus the selected pin.
  useEffect(() => {
    if (!selectedId) return;
    const site = sites.find((s) => s.id === selectedId);
    if (!site) return;

    const target = rotationForPoint(latLngToVector3(site.lat, site.lng));
    const current = state.current;
    current.focus = {
      from: { x: current.rotX, y: current.rotY },
      delta: {
        x: THREE.MathUtils.clamp(target.x, -MAX_PITCH, MAX_PITCH) - current.rotX,
        y: shortestAngle(current.rotY, target.y),
      },
      start: performance.now(),
    };
  }, [selectedId, sites]);

  useFrame((_, delta) => {
    const current = state.current;
    const now = performance.now();

    if (current.focus) {
      const t = easeInOutCubic((now - current.focus.start) / FOCUS_MS);
      current.rotX = current.focus.from.x + current.focus.delta.x * t;
      current.rotY = current.focus.from.y + current.focus.delta.y * t;
      if (t >= 1) {
        current.focus = null;
        // Hold still for a moment before drifting again.
        current.idleUntil = now + 2500;
      }
    } else if (!current.dragging && now > current.idleUntil) {
      current.rotY += AUTO_ROTATE_SPEED * delta * 0.35;
    }

    if (group.current) {
      group.current.rotation.x = current.rotX;
      group.current.rotation.y = current.rotY;
    }
  });

  /* ---- drag to rotate ---- */
  useEffect(() => {
    const onUp = () => {
      state.current.dragging = false;
      state.current.idleUntil = performance.now() + 2500;
    };
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, []);

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    const current = state.current;
    current.dragging = true;
    current.moved = 0;
    current.lastX = event.clientX;
    current.lastY = event.clientY;
    current.focus = null;
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    const current = state.current;
    if (!current.dragging) return;
    const dx = event.clientX - current.lastX;
    const dy = event.clientY - current.lastY;
    current.lastX = event.clientX;
    current.lastY = event.clientY;
    current.moved += Math.abs(dx) + Math.abs(dy);
    current.rotY += dx * 0.005;
    current.rotX = THREE.MathUtils.clamp(current.rotX + dy * 0.005, -MAX_PITCH, MAX_PITCH);
  };

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    // Ignore the click that ends a drag.
    if (state.current.moved > 6) return;
    onEmptyClick({ x: event.clientX, y: event.clientY });
  };

  return (
    <group ref={group}>
      {/* Body: dark enough to read as empty space, opaque enough to hide the
          far side's dots. Also the drag surface and the empty-region target. */}
      <mesh
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onClick={handleClick}
      >
        <sphereGeometry args={[GLOBE_RADIUS, 48, 32]} />
        <meshBasicMaterial color="#16181B" />
      </mesh>

      <LandPoints density={density} />

      {sites.map((site) => (
        <Pin
          key={site.id}
          site={site}
          selected={site.id === selectedId}
          isNearest={site.id === nearestId}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */

export type GlobeProps = {
  sites: Site[];
  selectedId: string | null;
  nearestId: string | null;
  mobile?: boolean;
  /** Stop rendering while the section is off screen. */
  active?: boolean;
  onSelect: (site: Site) => void;
  onHover: (site: Site | null) => void;
  onEmptyClick: (screen: { x: number; y: number }) => void;
};

export function Globe({
  sites,
  selectedId,
  nearestId,
  mobile = false,
  active = true,
  onSelect,
  onHover,
  onEmptyClick,
}: GlobeProps) {
  const [grabbing, setGrabbing] = useState(false);

  return (
    <Canvas
      dpr={mobile ? [1, 1.5] : [1, 2]}
      frameloop={active ? 'always' : 'never'}
      camera={{ fov: 32, position: [0, 0, 7.6], near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ cursor: grabbing ? 'grabbing' : 'grab', touchAction: 'pan-y' }}
      onPointerDown={() => setGrabbing(true)}
      onPointerUp={() => setGrabbing(false)}
      onPointerLeave={() => setGrabbing(false)}
    >
      <ambientLight intensity={1} />
      <GlobeBody
        sites={sites}
        selectedId={selectedId}
        nearestId={nearestId}
        density={mobile ? 2 : 1}
        onSelect={onSelect}
        onHover={onHover}
        onEmptyClick={onEmptyClick}
      />
    </Canvas>
  );
}

export default Globe;
