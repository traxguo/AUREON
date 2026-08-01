'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import ExcavatorModel from './ExcavatorModel';
import Subsurface from './Subsurface';
import SonarRings, { SonarEmitter } from './SonarRings';
import {
  damp,
  easeInOutCubic,
  heroProgress,
  PHASES,
  range,
  smoothstep,
} from './heroProgress';

/* ------------------------------------------------------------------ */
/* Camera choreography                                                 */
/* ------------------------------------------------------------------ */

type Keyframe = {
  p: number;
  pos: [number, number, number];
  target: [number, number, number];
};

/**
 * The camera path, keyed to scroll progress:
 * arrival high and wide → close on the side panel where the logo sits →
 * down to ground level for the scan → back out for the closing statement.
 */
const KEYFRAMES: Keyframe[] = [
  { p: 0.0, pos: [6.9, 4.7, 7.9], target: [0.4, 1.2, 0] },
  { p: 0.15, pos: [5.7, 3.1, 6.2], target: [0.4, 1.3, 0] },
  { p: 0.32, pos: [1.3, 1.9, 5.3], target: [-0.25, 1.32, 0.15] },
  { p: 0.46, pos: [6.4, 2.8, 8.0], target: [0.3, -0.4, 0] },
  { p: 0.62, pos: [7.3, 2.1, 8.7], target: [0.3, -0.85, 0] },
  { p: 0.8, pos: [11.6, 4.7, 11.6], target: [0.4, -0.7, 0] },
  { p: 1.0, pos: [13.6, 6.2, 13.2], target: [0.4, -0.5, 0] },
];

/**
 * The keyframes above are framed for a landscape viewport. A perspective
 * camera holds its *vertical* field of view, so a portrait phone sees far less
 * horizontally and the machine spills out of frame. Pulling the camera back by
 * the ratio of the reference aspect to the real one restores the intended
 * horizontal coverage at any shape of screen.
 */
const REFERENCE_ASPECT = 1.6;
const MAX_ASPECT_PULLBACK = 2.4;

function aspectPullback(aspect: number): number {
  if (!Number.isFinite(aspect) || aspect <= 0) return 1;
  return THREE.MathUtils.clamp(REFERENCE_ASPECT / aspect, 1, MAX_ASPECT_PULLBACK);
}

function sampleKeyframes(p: number, out: { pos: THREE.Vector3; target: THREE.Vector3 }) {
  let index = 0;
  while (index < KEYFRAMES.length - 2 && p > KEYFRAMES[index + 1].p) index++;

  const a = KEYFRAMES[index];
  const b = KEYFRAMES[index + 1];
  const t = easeInOutCubic(range(p, a.p, b.p));

  out.pos.set(
    THREE.MathUtils.lerp(a.pos[0], b.pos[0], t),
    THREE.MathUtils.lerp(a.pos[1], b.pos[1], t),
    THREE.MathUtils.lerp(a.pos[2], b.pos[2], t),
  );
  out.target.set(
    THREE.MathUtils.lerp(a.target[0], b.target[0], t),
    THREE.MathUtils.lerp(a.target[1], b.target[1], t),
    THREE.MathUtils.lerp(a.target[2], b.target[2], t),
  );
}

function CameraRig({ still }: { still: boolean }) {
  const { camera, size } = useThree();
  const desired = useMemo(
    () => ({ pos: new THREE.Vector3(), target: new THREE.Vector3() }),
    [],
  );
  const current = useRef(new THREE.Vector3(...KEYFRAMES[0].pos));
  const lookAt = useRef(new THREE.Vector3(...KEYFRAMES[0].target));

  const pullback = aspectPullback(size.width / size.height);

  useFrame((_, delta) => {
    sampleKeyframes(heroProgress.value, desired);

    // Keep the look-at point on the machine while the camera backs off.
    desired.pos.sub(desired.target).multiplyScalar(pullback).add(desired.target);

    // Damping keeps fast scroll flicks from snapping the camera.
    const lambda = still ? 100 : 6.5;
    const dt = Math.min(delta, 0.05);
    current.current.set(
      damp(current.current.x, desired.pos.x, lambda, dt),
      damp(current.current.y, desired.pos.y, lambda, dt),
      damp(current.current.z, desired.pos.z, lambda, dt),
    );
    lookAt.current.set(
      damp(lookAt.current.x, desired.target.x, lambda, dt),
      damp(lookAt.current.y, desired.target.y, lambda, dt),
      damp(lookAt.current.z, desired.target.z, lambda, dt),
    );

    camera.position.copy(current.current);
    camera.lookAt(lookAt.current);
  });

  return null;
}

/* ------------------------------------------------------------------ */
/* Machine turntable                                                   */
/* ------------------------------------------------------------------ */

function Machine({ still }: { still: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const p = heroProgress.value;

    // Free rotation on arrival, easing to a locked heading that presents the
    // side panel — and therefore the logo — square to the camera.
    const drifting = -0.62 + (still ? 0.4 : clock.getElapsedTime() * 0.11);
    const lock = smoothstep(PHASES.arrival[1], 0.32, p);
    group.current.rotation.y = drifting * (1 - lock);
  });

  return (
    <group ref={group}>
      <ExcavatorModel />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Ground                                                              */
/* ------------------------------------------------------------------ */

function Ground() {
  const surface = useRef<THREE.MeshStandardMaterial>(null);
  const grid = useRef<THREE.GridHelper>(null);

  const gridHelper = useMemo(() => {
    const helper = new THREE.GridHelper(64, 64, '#D4AF37', '#4A4026');
    const material = helper.material as THREE.LineBasicMaterial;
    material.transparent = true;
    material.opacity = 0;
    material.depthWrite = false;
    return helper;
  }, []);

  useEffect(() => () => gridHelper.dispose(), [gridHelper]);

  useFrame(() => {
    const p = heroProgress.value;

    // The surface turns translucent as the radar resolves what is beneath it.
    const dissolve = smoothstep(PHASES.scan[0] + 0.02, PHASES.scan[0] + 0.12, p);
    const restore = smoothstep(PHASES.release[0] + 0.02, 0.96, p);
    const transparency = dissolve * (1 - restore);

    if (surface.current) {
      surface.current.opacity = 1 - transparency * 0.8;
    }

    const material = gridHelper.material as THREE.LineBasicMaterial;
    material.opacity = transparency * 0.6;
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow renderOrder={0}>
        <planeGeometry args={[64, 64]} />
        <meshStandardMaterial
          ref={surface}
          color="#191B1F"
          metalness={0.15}
          roughness={0.92}
          transparent
          opacity={1}
          depthWrite={false}
        />
      </mesh>
      <primitive ref={grid} object={gridHelper} position={[0, -0.008, 0]} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Atmosphere                                                          */
/* ------------------------------------------------------------------ */

function Atmosphere() {
  const fog = useRef<THREE.FogExp2>(null);
  const scanLight = useRef<THREE.PointLight>(null);
  const { size } = useThree();

  // Exponential fog is measured in world units, so a narrow viewport — which
  // pushes the camera back — would otherwise swallow the machine in haze.
  // Thinning the fog by the same factor keeps the look identical on a phone.
  const pullback = aspectPullback(size.width / size.height);

  useFrame(() => {
    const p = heroProgress.value;

    if (fog.current) {
      // Haze on arrival, clearing through the middle, closing at the end.
      const clearing = smoothstep(0.02, 0.2, p);
      const closing = smoothstep(0.9, 1, p);
      fog.current.density = (0.052 - clearing * 0.032 + closing * 0.13) / pullback;
    }

    if (scanLight.current) {
      const gate =
        range(p, PHASES.scan[0], PHASES.scan[0] + 0.08) *
        (1 - range(p, PHASES.release[0], 0.95));
      scanLight.current.intensity = gate * 9;
    }
  });

  return (
    <>
      <fogExp2 ref={fog} attach="fog" args={['#0D0D0D', 0.052]} />
      <ambientLight intensity={1.35} color="#868E98" />
      <directionalLight
        position={[7, 10, 6]}
        intensity={3.9}
        color="#FFF6E2"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={30}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[-8, 4, -5]} intensity={1.1} color="#5D6874" />
      {/* Rim light that separates the machine from the dark ground */}
      <directionalLight position={[-3, 2.5, 7]} intensity={1.25} color="#C4CCD6" />
      {/* Gold underglow that comes up with the radar */}
      <pointLight ref={scanLight} position={[1.2, -0.6, 0]} color="#D4AF37" intensity={0} distance={16} />
    </>
  );
}

/**
 * Reflections for the metallic bodywork, built from emissive planes rather than
 * a preset HDRI: brushed metal at metalness 0.85 renders as flat black without
 * something to reflect, and a preset would mean fetching an HDR from a CDN.
 * Rendered once (`frames={1}`) into a small cube map — negligible cost.
 */
function StudioEnvironment() {
  return (
    <Environment resolution={256} frames={1} background={false}>
      {/* Broad soft key overhead */}
      <Lightformer form="rect" intensity={1.6} color="#F2EFE6" scale={[14, 8, 1]} position={[0, 9, 2]} rotation={[-Math.PI / 2, 0, 0]} />
      {/* Warm side panel, camera-left */}
      <Lightformer form="rect" intensity={1.1} color="#FFF1D4" scale={[8, 6, 1]} position={[9, 4, 5]} rotation={[0, -Math.PI / 3, 0]} />
      {/* Cool fill opposite, to keep the shadow side readable */}
      <Lightformer form="rect" intensity={0.55} color="#7E8B99" scale={[9, 6, 1]} position={[-9, 3, -4]} rotation={[0, Math.PI / 2.6, 0]} />
      {/* Low gold bounce — the only colour in the reflections */}
      <Lightformer form="rect" intensity={0.5} color="#D4AF37" scale={[10, 2, 1]} position={[0, -1.5, 7]} rotation={[Math.PI / 2.2, 0, 0]} />
    </Environment>
  );
}

/* ------------------------------------------------------------------ */

export type HeroSceneProps = {
  mobile?: boolean;
  still?: boolean;
  onReady?: () => void;
};

export function HeroScene({ mobile = false, still = false, onReady }: HeroSceneProps) {
  return (
    <Canvas
      dpr={mobile ? [1, 1.5] : [1, 2]}
      shadows={!mobile}
      frameloop="always"
      gl={{
        antialias: !mobile,
        powerPreference: 'high-performance',
        alpha: false,
      }}
      camera={{ fov: 38, near: 0.1, far: 140, position: KEYFRAMES[0].pos }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        onReady?.();
      }}
    >
      <color attach="background" args={['#0D0D0D']} />
      <StudioEnvironment />
      <Atmosphere />
      <CameraRig still={still} />
      <Machine still={still} />
      <Ground />
      <Subsurface mobile={mobile} />
      <SonarRings count={mobile ? 3 : 4} maxRadius={mobile ? 7.5 : 9} still={still} />
      <SonarEmitter />
    </Canvas>
  );
}

export default HeroScene;
