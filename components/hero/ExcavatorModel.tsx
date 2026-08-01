'use client';

import { Component, Suspense, useEffect, useMemo, type ReactNode } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { createLogoTexture } from './logoTexture';

export const MODEL_URL = '/models/aureon-s5.glb';

/** Target length in world units (metres) so both models frame identically. */
const TARGET_LENGTH = 5.1;

/* ------------------------------------------------------------------ */
/* Asset probing                                                       */
/* ------------------------------------------------------------------ */

/**
 * Resolved by `next.config.mjs` from the filesystem at build time, so a missing
 * model costs nothing at runtime — no probe request, no 404 in the console.
 */
const HAS_GLB_MODEL = process.env.NEXT_PUBLIC_HAS_GLB_MODEL === '1';

/* ------------------------------------------------------------------ */
/* Error boundary                                                      */
/* ------------------------------------------------------------------ */

class ModelErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[AUREON] GLB model failed to load, using the built-in model.', error);
    }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/* ------------------------------------------------------------------ */
/* Materials                                                           */
/* ------------------------------------------------------------------ */

function useMaterials() {
  return useMemo(() => {
    const body = new THREE.MeshStandardMaterial({
      color: '#3A3E45',
      metalness: 0.85,
      roughness: 0.35,
      envMapIntensity: 0.55,
    });
    const bodyDark = new THREE.MeshStandardMaterial({
      color: '#25282D',
      metalness: 0.8,
      roughness: 0.5,
      envMapIntensity: 0.4,
    });
    const track = new THREE.MeshStandardMaterial({
      color: '#1B1D21',
      metalness: 0.45,
      roughness: 0.8,
      envMapIntensity: 0.35,
    });
    const gold = new THREE.MeshStandardMaterial({
      color: '#D4AF37',
      metalness: 0.95,
      roughness: 0.28,
      envMapIntensity: 1.1,
    });
    const piston = new THREE.MeshStandardMaterial({
      color: '#C9B173',
      metalness: 1,
      roughness: 0.15,
      envMapIntensity: 1.2,
    });
    const glass = new THREE.MeshStandardMaterial({
      color: '#0B0D10',
      metalness: 0.6,
      roughness: 0.1,
      transparent: true,
      opacity: 0.72,
    });
    const display = new THREE.MeshBasicMaterial({ color: '#D4AF37' });
    return { body, bodyDark, track, gold, piston, glass, display };
  }, []);
}

/* ------------------------------------------------------------------ */
/* Bucket profile                                                      */
/* ------------------------------------------------------------------ */

function useBucketGeometry() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0.66, 0.06);
    shape.lineTo(0.72, -0.28);
    shape.quadraticCurveTo(0.6, -0.68, 0.16, -0.72);
    shape.quadraticCurveTo(-0.05, -0.5, 0, 0);

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.66,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.015,
      bevelSegments: 1,
      curveSegments: 6,
    });
    geometry.translate(0, 0, -0.33);
    return geometry;
  }, []);
}

/* ------------------------------------------------------------------ */
/* Fallback model, built from primitives                               */
/* ------------------------------------------------------------------ */

function Track({ z, material }: { z: number; material: THREE.Material }) {
  return (
    <group position={[0, 0, z]}>
      <mesh castShadow receiveShadow material={material} position={[0, 0.42, 0]}>
        <boxGeometry args={[2.9, 0.5, 0.46]} />
      </mesh>
      {[-1.45, 1.45].map((x) => (
        <mesh key={x} material={material} position={[x, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.46, 18]} />
        </mesh>
      ))}
      {/* Roller line */}
      <mesh material={material} position={[0, 0.2, 0]}>
        <boxGeometry args={[2.6, 0.12, 0.5]} />
      </mesh>
    </group>
  );
}

/**
 * Low-poly stand-in for the real machine. Proportions follow the published S5
 * dimensions so the camera choreography reads the same with either model.
 */
export function FallbackExcavator({ logoTexture }: { logoTexture: THREE.Texture | null }) {
  const m = useMaterials();
  const bucketGeometry = useBucketGeometry();

  const boomAngle = 0.58;
  const armAngle = -1.5;
  const bucketAngle = -0.95;

  return (
    <group>
      {/* ---- undercarriage ---- */}
      <Track z={0.75} material={m.track} />
      <Track z={-0.75} material={m.track} />
      <mesh material={m.bodyDark} position={[0, 0.74, 0]}>
        <boxGeometry args={[2.4, 0.24, 1.7]} />
      </mesh>

      {/* GPR array, slung between the tracks ahead of the blade */}
      <group position={[1.15, 0.24, 0]}>
        <mesh material={m.bodyDark}>
          <boxGeometry args={[1.35, 0.14, 0.86]} />
        </mesh>
        <mesh material={m.gold} position={[0, -0.08, 0]}>
          <boxGeometry args={[1.38, 0.02, 0.89]} />
        </mesh>
      </group>

      {/* Dozer blade */}
      <mesh material={m.bodyDark} position={[1.72, 0.4, 0]}>
        <boxGeometry args={[0.16, 0.52, 1.94]} />
      </mesh>

      {/* ---- slew ring ---- */}
      <mesh material={m.gold} position={[0, 0.94, 0]}>
        <cylinderGeometry args={[0.78, 0.82, 0.1, 28]} />
      </mesh>

      {/* ---- upper structure ---- */}
      <mesh castShadow material={m.body} position={[-0.2, 1.29, 0]}>
        <boxGeometry args={[2.5, 0.7, 1.75]} />
      </mesh>
      {/* Counterweight */}
      <mesh material={m.bodyDark} position={[-1.42, 1.24, 0]}>
        <boxGeometry args={[0.5, 0.78, 1.62]} />
      </mesh>
      {/* Engine hood */}
      <mesh material={m.body} position={[-0.75, 1.72, 0]}>
        <boxGeometry args={[1.3, 0.16, 1.6]} />
      </mesh>

      {/* Livery panels */}
      {logoTexture &&
        [0.879, -0.879].map((z) => (
          <mesh key={z} position={[-0.35, 1.3, z]} rotation={[0, z > 0 ? 0 : Math.PI, 0]}>
            <planeGeometry args={[1.5, 0.6]} />
            <meshBasicMaterial map={logoTexture} transparent toneMapped={false} />
          </mesh>
        ))}

      {/* ---- cab ---- */}
      <group position={[0.28, 0, 0.42]}>
        <mesh castShadow material={m.body} position={[0, 2.14, 0]}>
          <boxGeometry args={[0.98, 1.0, 0.94]} />
        </mesh>
        {/* Glazing */}
        <mesh material={m.glass} position={[0.5, 2.18, 0]}>
          <boxGeometry args={[0.02, 0.84, 0.86]} />
        </mesh>
        <mesh material={m.glass} position={[0, 2.18, 0.48]}>
          <boxGeometry args={[0.9, 0.84, 0.02]} />
        </mesh>
        {/* Cab display glow */}
        <mesh material={m.display} position={[0.34, 2.0, 0.2]} rotation={[0, 0.3, 0]}>
          <planeGeometry args={[0.16, 0.1]} />
        </mesh>
        {/* GNSS antennas */}
        {[-0.3, 0.3].map((z) => (
          <mesh key={z} material={m.gold} position={[-0.2, 2.7, z]}>
            <cylinderGeometry args={[0.07, 0.07, 0.06, 12]} />
          </mesh>
        ))}
      </group>

      {/* ---- work group ---- */}
      <group position={[0.95, 1.35, 0]} rotation={[0, 0, boomAngle]}>
        <mesh castShadow material={m.body} position={[1.15, 0, 0]}>
          <boxGeometry args={[2.3, 0.34, 0.36]} />
        </mesh>
        {/* Boom cylinder */}
        <mesh material={m.piston} position={[0.75, -0.3, 0.26]} rotation={[0, 0, -0.25]}>
          <cylinderGeometry args={[0.07, 0.07, 1.2, 12]} />
        </mesh>

        <group position={[2.3, 0, 0]} rotation={[0, 0, armAngle]}>
          <mesh castShadow material={m.body} position={[0.75, 0, 0]}>
            <boxGeometry args={[1.5, 0.26, 0.28]} />
          </mesh>
          {/* Arm cylinder */}
          <mesh material={m.piston} position={[0.42, 0.26, 0]} rotation={[0, 0, 0.18]}>
            <cylinderGeometry args={[0.055, 0.055, 0.9, 12]} />
          </mesh>

          <group position={[1.5, 0, 0]} rotation={[0, 0, bucketAngle]}>
            <mesh castShadow geometry={bucketGeometry} material={m.body} />
            {/* Cutting edge and teeth in gold */}
            <mesh material={m.gold} position={[0.42, -0.72, 0]} rotation={[0, 0, 0.12]}>
              <boxGeometry args={[0.5, 0.05, 0.68]} />
            </mesh>
            {[-0.24, -0.08, 0.08, 0.24].map((z) => (
              <mesh key={z} material={m.gold} position={[0.62, -0.74, z]} rotation={[0, 0, 0.12]}>
                <boxGeometry args={[0.16, 0.04, 0.07]} />
              </mesh>
            ))}
          </group>
        </group>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* GLB variant                                                         */
/* ------------------------------------------------------------------ */

function GltfExcavator() {
  const { scene } = useGLTF(MODEL_URL);

  const prepared = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const scale = size.x > 0 ? TARGET_LENGTH / size.x : 1;
    clone.scale.setScalar(scale);
    // Recentre horizontally and drop the model onto y = 0.
    clone.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);

    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  return <primitive object={prepared} />;
}

/* ------------------------------------------------------------------ */

export function ExcavatorModel() {
  const logoTexture = useMemo(() => createLogoTexture(), []);

  useEffect(() => () => logoTexture?.dispose(), [logoTexture]);

  const fallback = <FallbackExcavator logoTexture={logoTexture} />;

  if (!HAS_GLB_MODEL) return fallback;

  return (
    <ModelErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <GltfExcavator />
      </Suspense>
    </ModelErrorBoundary>
  );
}

export default ExcavatorModel;
