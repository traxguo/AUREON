'use client';

import { Component, Suspense, useEffect, useMemo, type ReactNode } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { createLogoTexture } from './logoTexture';

export const MODEL_URL = '/models/aureon-s5.glb';

/** Target length in world units (metres) so both models frame identically. */
const TARGET_LENGTH = 5.1;

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
/* Geometry helpers                                                    */
/* ------------------------------------------------------------------ */

/**
 * Box with chamfered edges.
 *
 * Real machines have no perfectly sharp arrises — plate is folded, welds are
 * dressed. A hard `boxGeometry` reads as a toy; a chamfer catches the key
 * light along every edge and is what makes the silhouette read as steel.
 */
function chamferedBox(width: number, height: number, depth: number, bevel = 0.035) {
  const w = Math.max(width / 2 - bevel, 0.001);
  const h = Math.max(height / 2 - bevel, 0.001);

  const shape = new THREE.Shape();
  shape.moveTo(-w, -h - bevel);
  shape.lineTo(w, -h - bevel);
  shape.lineTo(w + bevel, -h);
  shape.lineTo(w + bevel, h);
  shape.lineTo(w, h + bevel);
  shape.lineTo(-w, h + bevel);
  shape.lineTo(-w - bevel, h);
  shape.lineTo(-w - bevel, -h);
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(depth - bevel * 2, 0.001),
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 1,
    curveSegments: 1,
  });
  geometry.translate(0, 0, -(depth - bevel * 2) / 2 - bevel);
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Tapered structural member — deep at the pivot, shallow at the tip, like a
 * fabricated box-section boom. Built as a profile in XY, extruded across Z.
 */
function taperedMember(
  length: number,
  rootHeight: number,
  tipHeight: number,
  width: number,
  curve = 0,
) {
  const shape = new THREE.Shape();
  const r = rootHeight / 2;
  const t = tipHeight / 2;

  shape.moveTo(0, -r);
  shape.quadraticCurveTo(length * 0.5, -r - curve, length, -t);
  shape.lineTo(length, t);
  shape.quadraticCurveTo(length * 0.5, r - curve * 0.35, 0, r);
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: width,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 1,
    curveSegments: 8,
  });
  geometry.translate(0, 0, -width / 2);
  geometry.computeVertexNormals();
  return geometry;
}

/** Track frame profile: flat on top, radiused at both ends like a real chain run. */
function trackShape(length: number, radius: number, width: number) {
  const half = length / 2 - radius;
  const shape = new THREE.Shape();
  shape.absarc(-half, 0, radius, Math.PI / 2, -Math.PI / 2, true);
  shape.lineTo(half, -radius);
  shape.absarc(half, 0, radius, -Math.PI / 2, Math.PI / 2, true);
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: width,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 1,
    curveSegments: 12,
  });
  geometry.translate(0, 0, -width / 2);
  geometry.computeVertexNormals();
  return geometry;
}

/* ------------------------------------------------------------------ */
/* Materials                                                           */
/* ------------------------------------------------------------------ */

function useMaterials() {
  return useMemo(() => {
    const body = new THREE.MeshStandardMaterial({
      color: '#474C55',
      metalness: 0.82,
      roughness: 0.34,
      envMapIntensity: 0.75,
    });
    const bodyDark = new THREE.MeshStandardMaterial({
      color: '#2E3238',
      metalness: 0.78,
      roughness: 0.48,
      envMapIntensity: 0.6,
    });
    const track = new THREE.MeshStandardMaterial({
      color: '#212429',
      metalness: 0.5,
      roughness: 0.72,
      envMapIntensity: 0.5,
    });
    const rubber = new THREE.MeshStandardMaterial({
      color: '#0F1113',
      metalness: 0.1,
      roughness: 0.95,
      envMapIntensity: 0.2,
    });
    const gold = new THREE.MeshStandardMaterial({
      color: '#D4AF37',
      metalness: 0.95,
      roughness: 0.26,
      envMapIntensity: 1.15,
    });
    const chrome = new THREE.MeshStandardMaterial({
      color: '#C9CDD2',
      metalness: 1,
      roughness: 0.08,
      envMapIntensity: 1.3,
    });
    const glass = new THREE.MeshPhysicalMaterial({
      color: '#0A0D11',
      metalness: 0.2,
      roughness: 0.06,
      transmission: 0,
      transparent: true,
      opacity: 0.62,
      envMapIntensity: 1.4,
    });
    const lamp = new THREE.MeshBasicMaterial({ color: '#FFF3D6' });
    const display = new THREE.MeshBasicMaterial({ color: '#D4AF37' });
    return { body, bodyDark, track, rubber, gold, chrome, glass, lamp, display };
  }, []);
}

/* ------------------------------------------------------------------ */
/* Sub-assemblies                                                      */
/* ------------------------------------------------------------------ */

/** A hydraulic ram: barrel, gland, polished rod and two eye ends. */
function Cylinder({
  length,
  radius,
  extension = 0.45,
  materials,
}: {
  length: number;
  radius: number;
  extension?: number;
  materials: ReturnType<typeof useMaterials>;
}) {
  const barrel = length * (1 - extension);
  const rod = length * extension;

  return (
    <group>
      <mesh material={materials.bodyDark} position={[barrel / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[radius, radius, barrel, 16]} />
      </mesh>
      {/* Gland nut */}
      <mesh material={materials.gold} position={[barrel, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[radius * 1.12, radius * 1.12, 0.05, 16]} />
      </mesh>
      {/* Polished rod */}
      <mesh
        material={materials.chrome}
        position={[barrel + rod / 2, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[radius * 0.55, radius * 0.55, rod, 12]} />
      </mesh>
      {/* Eye ends */}
      {[0, barrel + rod].map((x) => (
        <mesh key={x} material={materials.bodyDark} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius * 0.75, radius * 0.32, 6, 12]} />
        </mesh>
      ))}
    </group>
  );
}

/** Undercarriage: frame, sprocket, idler, rollers and moulded chain. */
function Track({
  z,
  materials,
}: {
  z: number;
  materials: ReturnType<typeof useMaterials>;
}) {
  const frame = useMemo(() => trackShape(3.0, 0.3, 0.44), []);
  const shoe = useMemo(() => chamferedBox(0.2, 0.06, 0.5, 0.015), []);

  useEffect(() => {
    const f = frame;
    const s = shoe;
    return () => {
      f.dispose();
      s.dispose();
    };
  }, [frame, shoe]);

  // Chain shoes wrapped around the perimeter of the frame profile.
  const shoes = useMemo(() => {
    const items: Array<{ x: number; y: number; rot: number }> = [];
    const half = 3.0 / 2 - 0.3;
    const radius = 0.3;
    const step = 0.235;

    for (let x = -half; x <= half; x += step) {
      items.push({ x, y: -radius, rot: 0 });
      items.push({ x, y: radius, rot: 0 });
    }
    for (let i = 0; i < 7; i++) {
      const angle = -Math.PI / 2 + (i / 6) * Math.PI;
      items.push({
        x: half + Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        rot: angle + Math.PI / 2,
      });
      items.push({
        x: -half - Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        rot: -angle - Math.PI / 2,
      });
    }
    return items;
  }, []);

  return (
    <group position={[0, 0.42, z]}>
      {/* Chain */}
      {shoes.map((s, i) => (
        <mesh
          key={i}
          geometry={shoe}
          material={materials.rubber}
          position={[s.x, s.y, 0]}
          rotation={[0, 0, s.rot]}
        />
      ))}

      {/* Frame between the chain runs */}
      <mesh geometry={frame} material={materials.track} scale={[0.97, 0.9, 0.82]} />

      {/* Sprocket and idler */}
      {[-1.2, 1.2].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh material={materials.track} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.46, 16]} />
          </mesh>
          <mesh material={materials.gold} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.09, 0.022, 6, 14]} />
          </mesh>
        </group>
      ))}

      {/* Bottom rollers */}
      {[-0.62, 0, 0.62].map((x) => (
        <mesh key={x} material={materials.track} position={[x, -0.19, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.42, 12]} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Fallback model                                                      */
/* ------------------------------------------------------------------ */

export function FallbackExcavator({ logoTexture }: { logoTexture: THREE.Texture | null }) {
  const m = useMaterials();

  const geo = useMemo(
    () => ({
      carBody: chamferedBox(2.5, 0.72, 1.78, 0.06),
      counterweight: chamferedBox(0.52, 0.82, 1.66, 0.09),
      hood: chamferedBox(1.34, 0.2, 1.62, 0.05),
      cab: chamferedBox(0.98, 1.02, 0.96, 0.05),
      deck: chamferedBox(2.42, 0.24, 1.72, 0.04),
      blade: chamferedBox(0.17, 0.5, 1.94, 0.04),
      gprHousing: chamferedBox(1.34, 0.15, 0.86, 0.03),
      boom: taperedMember(2.3, 0.42, 0.3, 0.34, 0.16),
      arm: taperedMember(1.5, 0.3, 0.22, 0.26, 0.08),
      step: chamferedBox(0.34, 0.05, 0.28, 0.015),
    }),
    [],
  );

  const bucket = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0.66, 0.07);
    shape.lineTo(0.73, -0.26);
    shape.quadraticCurveTo(0.62, -0.68, 0.17, -0.73);
    shape.quadraticCurveTo(-0.05, -0.5, 0, 0);

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.66,
      bevelEnabled: true,
      bevelThickness: 0.022,
      bevelSize: 0.022,
      bevelSegments: 2,
      curveSegments: 10,
    });
    geometry.translate(0, 0, -0.33);
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  useEffect(
    () => () => {
      Object.values(geo).forEach((g) => g.dispose());
      bucket.dispose();
    },
    [geo, bucket],
  );

  const boomAngle = 0.58;
  const armAngle = -1.5;
  const bucketAngle = -0.95;

  return (
    <group>
      {/* ---------------- undercarriage ---------------- */}
      <Track z={0.75} materials={m} />
      <Track z={-0.75} materials={m} />

      <mesh geometry={geo.deck} material={m.bodyDark} position={[0, 0.74, 0]} />

      {/* GPR array slung between the tracks */}
      <group position={[1.15, 0.26, 0]}>
        <mesh geometry={geo.gprHousing} material={m.bodyDark} />
        <mesh material={m.gold} position={[0, -0.085, 0]}>
          <boxGeometry args={[1.38, 0.018, 0.9]} />
        </mesh>
        {[-0.42, 0, 0.42].map((z) => (
          <mesh key={z} material={m.gold} position={[0, -0.05, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.028, 0.028, 1.3, 8]} />
          </mesh>
        ))}
      </group>

      {/* Dozer blade with push arms */}
      <group position={[1.72, 0.4, 0]}>
        <mesh geometry={geo.blade} material={m.bodyDark} />
        {[-0.6, 0.6].map((z) => (
          <mesh key={z} material={m.bodyDark} position={[-0.3, -0.06, z]} rotation={[0, 0, 0.16]}>
            <boxGeometry args={[0.62, 0.12, 0.14]} />
          </mesh>
        ))}
        <mesh material={m.gold} position={[0.09, -0.24, 0]}>
          <boxGeometry args={[0.05, 0.05, 1.9]} />
        </mesh>
      </group>

      {/* ---------------- slew ring ---------------- */}
      <mesh material={m.bodyDark} position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.82, 0.86, 0.12, 32]} />
      </mesh>
      <mesh material={m.gold} position={[0, 0.965, 0]}>
        <torusGeometry args={[0.8, 0.022, 8, 40]} />
      </mesh>

      {/* ---------------- upper structure ---------------- */}
      <mesh geometry={geo.carBody} material={m.body} position={[-0.2, 1.3, 0]} castShadow />
      <mesh geometry={geo.counterweight} material={m.bodyDark} position={[-1.42, 1.25, 0]} castShadow />
      <mesh geometry={geo.hood} material={m.body} position={[-0.75, 1.74, 0]} />

      {/* Louvres on the engine hood */}
      {[-1.05, -0.9, -0.75, -0.6, -0.45].map((x) => (
        <mesh key={x} material={m.bodyDark} position={[x, 1.845, 0]}>
          <boxGeometry args={[0.05, 0.012, 1.4]} />
        </mesh>
      ))}

      {/* Exhaust stack */}
      <group position={[-0.28, 1.86, -0.62]}>
        <mesh material={m.bodyDark}>
          <cylinderGeometry args={[0.055, 0.065, 0.3, 12]} />
        </mesh>
        <mesh material={m.chrome} position={[0, 0.17, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.05, 12]} />
        </mesh>
      </group>

      {/* Handrail along the walkway */}
      {[0.86, -0.86].map((z) => (
        <group key={z} position={[-0.9, 0, z]}>
          {[-0.3, 0.3].map((x) => (
            <mesh key={x} material={m.gold} position={[x, 1.78, 0]}>
              <cylinderGeometry args={[0.016, 0.016, 0.24, 8]} />
            </mesh>
          ))}
          <mesh material={m.gold} position={[0, 1.9, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.016, 0.016, 0.66, 8]} />
          </mesh>
        </group>
      ))}

      {/* Access step */}
      <mesh geometry={geo.step} material={m.bodyDark} position={[0.6, 1.0, 0.92]} />

      {/* Livery panels */}
      {logoTexture &&
        [0.895, -0.895].map((z) => (
          <mesh key={z} position={[-0.35, 1.31, z]} rotation={[0, z > 0 ? 0 : Math.PI, 0]}>
            <planeGeometry args={[1.5, 0.58]} />
            <meshBasicMaterial map={logoTexture} transparent toneMapped={false} />
          </mesh>
        ))}

      {/* ---------------- cab ---------------- */}
      <group position={[0.28, 0, 0.42]}>
        <mesh geometry={geo.cab} material={m.body} position={[0, 2.16, 0]} castShadow />

        {/* Glazing, inset so the pillars read */}
        <mesh material={m.glass} position={[0.5, 2.2, 0]}>
          <boxGeometry args={[0.03, 0.8, 0.82]} />
        </mesh>
        <mesh material={m.glass} position={[0, 2.2, 0.48]}>
          <boxGeometry args={[0.86, 0.8, 0.03]} />
        </mesh>
        <mesh material={m.glass} position={[0, 2.2, -0.48]}>
          <boxGeometry args={[0.86, 0.8, 0.03]} />
        </mesh>

        {/* A-pillar and roof cap */}
        <mesh material={m.bodyDark} position={[0, 2.68, 0]}>
          <boxGeometry args={[1.0, 0.05, 0.98]} />
        </mesh>
        <mesh material={m.gold} position={[0.5, 2.68, 0]}>
          <boxGeometry args={[0.03, 0.03, 0.96]} />
        </mesh>

        {/* Cab display glow */}
        <mesh material={m.display} position={[0.36, 2.05, 0.2]} rotation={[0, 0.35, 0]}>
          <planeGeometry args={[0.15, 0.09]} />
        </mesh>

        {/* Work lights */}
        {[-0.3, 0.3].map((z) => (
          <group key={z} position={[0.42, 2.6, z]}>
            <mesh material={m.bodyDark}>
              <cylinderGeometry args={[0.055, 0.055, 0.07, 10]} />
            </mesh>
            <mesh material={m.lamp} position={[0.045, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <circleGeometry args={[0.04, 10]} />
            </mesh>
          </group>
        ))}

        {/* GNSS antennas */}
        {[-0.3, 0.3].map((z) => (
          <group key={z} position={[-0.2, 2.74, z]}>
            <mesh material={m.bodyDark}>
              <cylinderGeometry args={[0.02, 0.02, 0.08, 8]} />
            </mesh>
            <mesh material={m.gold} position={[0, 0.06, 0]}>
              <cylinderGeometry args={[0.075, 0.06, 0.045, 14]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ---------------- work group ---------------- */}
      <group position={[0.95, 1.35, 0]} rotation={[0, 0, boomAngle]}>
        {/* Boom foot */}
        <mesh material={m.bodyDark} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.17, 0.17, 0.42, 14]} />
        </mesh>
        <mesh geometry={geo.boom} material={m.body} castShadow />

        {/* Boom cylinders, one each side */}
        {[0.3, -0.3].map((z) => (
          <group key={z} position={[0.1, -0.36, z]} rotation={[0, 0, 0.3]}>
            <Cylinder length={1.35} radius={0.075} extension={0.4} materials={m} />
          </group>
        ))}

        {/* Hose run along the top of the boom */}
        <mesh material={m.bodyDark} position={[1.15, 0.21, 0.1]} rotation={[0, 0, Math.PI / 2 - 0.02]}>
          <cylinderGeometry args={[0.022, 0.022, 2.2, 6]} />
        </mesh>

        <group position={[2.3, 0, 0]} rotation={[0, 0, armAngle]}>
          {/* Boom–arm knuckle */}
          <mesh material={m.bodyDark} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.32, 14]} />
          </mesh>
          <mesh geometry={geo.arm} material={m.body} castShadow />

          {/* Arm cylinder sits on top of the boom, driving the arm */}
          <group position={[-0.55, 0.34, 0]} rotation={[0, 0, -0.42]}>
            <Cylinder length={1.05} radius={0.06} extension={0.42} materials={m} />
          </group>

          <group position={[1.5, 0, 0]} rotation={[0, 0, bucketAngle]}>
            {/* Bucket linkage */}
            <mesh material={m.bodyDark} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.28, 12]} />
            </mesh>
            <mesh material={m.bodyDark} position={[0.16, 0.2, 0]} rotation={[0, 0, 0.9]}>
              <boxGeometry args={[0.34, 0.06, 0.16]} />
            </mesh>

            <mesh geometry={bucket} material={m.body} castShadow />

            {/* Cutting edge and teeth */}
            <mesh material={m.gold} position={[0.43, -0.73, 0]} rotation={[0, 0, 0.12]}>
              <boxGeometry args={[0.5, 0.045, 0.68]} />
            </mesh>
            {[-0.25, -0.083, 0.083, 0.25].map((z) => (
              <mesh key={z} material={m.gold} position={[0.63, -0.75, z]} rotation={[0, 0, 0.12]}>
                <coneGeometry args={[0.045, 0.17, 4]} />
              </mesh>
            ))}
            {/* Wear strips on the bucket back */}
            {[-0.18, 0.18].map((z) => (
              <mesh key={z} material={m.bodyDark} position={[0.3, -0.36, z]} rotation={[0, 0, -0.5]}>
                <boxGeometry args={[0.62, 0.03, 0.09]} />
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
