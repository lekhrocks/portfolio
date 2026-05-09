"use client";

import { useMemo, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, Sphere, Ring, Torus } from "@react-three/drei";
import * as THREE from "three";

/* Fibonacci-sphere distribution */
function fibonacciSphere(samples: number, radius: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < samples; i++) {
    const y = 1 - (i / (samples - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    points.push(
      new THREE.Vector3(
        Math.cos(theta) * r * radius,
        y * radius,
        Math.sin(theta) * r * radius
      )
    );
  }
  return points;
}

/* Curved arc between two surface points (great-circle slerp) */
function arcPoints(a: THREE.Vector3, b: THREE.Vector3, lift = 1.18, segments = 24) {
  const out: THREE.Vector3[] = [];
  const start = a.clone().normalize();
  const end = b.clone().normalize();
  const omega = start.angleTo(end);
  const sinO = Math.sin(omega);
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    if (omega === 0) {
      out.push(start.clone().multiplyScalar(a.length() * lift));
      continue;
    }
    const f0 = Math.sin((1 - t) * omega) / sinO;
    const f1 = Math.sin(t * omega) / sinO;
    const dir = start.clone().multiplyScalar(f0).add(end.clone().multiplyScalar(f1));
    // Lift to a higher arc at midpoint
    const arcRadius = a.length() * (1 + (lift - 1) * 4 * t * (1 - t));
    out.push(dir.normalize().multiplyScalar(arcRadius));
  }
  return out;
}

function Globe() {
  const groupRef = useRef<THREE.Group>(null!);
  const radius = 1.7;

  const nodes = useMemo(() => fibonacciSphere(34, radius), []);

  // Generate 3 nearest-neighbor connections for each node
  const arcs = useMemo(() => {
    const out: Array<{ pts: THREE.Vector3[]; id: string; colorIdx: number }> = [];
    nodes.forEach((node, i) => {
      const sorted = nodes
        .map((n, j) => ({ n, j, dist: node.distanceTo(n) }))
        .filter(({ j }) => j !== i)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 3);
      sorted.forEach(({ n, j }) => {
        const id = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!out.find((x) => x.id === id)) {
          out.push({ pts: arcPoints(node, n), id, colorIdx: i + j });
        }
      });
    });
    return out;
  }, [nodes]);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.15;
    groupRef.current.rotation.x += delta * 0.05;
  });

  const arcColors = ["#3b82f6", "#06b6d4", "#8b5cf6"];

  return (
    <group ref={groupRef}>
      {/* Main wireframe sphere */}
      <Sphere args={[radius, 36, 28]}>
        <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.18} />
      </Sphere>

      {/* Outer glow shell */}
      <Sphere args={[radius * 1.05, 32, 24]}>
        <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.06} />
      </Sphere>

      {/* Inner soft core */}
      <Sphere args={[radius * 0.5, 24, 16]}>
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.08} />
      </Sphere>

      {/* Equator ring — bright, visible */}
      <Torus args={[radius, 0.008, 16, 64]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.55} />
      </Torus>

      {/* Tilted orbital rings (Saturn-like) */}
      <Ring args={[radius * 1.35, radius * 1.37, 80]} rotation={[Math.PI / 2.3, 0, 0]}>
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.4} side={THREE.DoubleSide} />
      </Ring>
      <Ring args={[radius * 1.55, radius * 1.57, 80]} rotation={[Math.PI / 1.8, 0, Math.PI / 6]}>
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} side={THREE.DoubleSide} />
      </Ring>

      {/* Connection arcs (curved over surface) */}
      {arcs.map((a) => (
        <Line
          key={a.id}
          points={a.pts}
          color={arcColors[a.colorIdx % arcColors.length]}
          opacity={0.45}
          transparent
          lineWidth={1.2}
        />
      ))}

      {/* Service nodes — bigger, brighter, with halo */}
      {nodes.map((p, i) => (
        <PulseNode key={i} position={p} colorIndex={i} />
      ))}
    </group>
  );
}

function PulseNode({
  position,
  colorIndex,
}: {
  position: THREE.Vector3;
  colorIndex: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const haloRef = useRef<THREE.Mesh>(null!);
  const colors = ["#3b82f6", "#06b6d4", "#8b5cf6", "#10b981", "#f97316", "#ec4899"];
  const color = colors[colorIndex % colors.length];

  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (!meshRef.current || !haloRef.current) return;
    const t = state.clock.elapsedTime + offset;
    const pulse = 1 + Math.sin(t * 1.6) * 0.3;
    meshRef.current.scale.setScalar(pulse);
    haloRef.current.scale.setScalar(pulse * 1.6);
    (haloRef.current.material as THREE.MeshBasicMaterial).opacity =
      0.5 - Math.sin(t * 1.6) * 0.25;
  });

  return (
    <group position={position}>
      {/* Halo glow */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} toneMapped={false} />
      </mesh>
      {/* Core dot */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Particles({ count = 280 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.6 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.025;
    ref.current.rotation.x += delta * 0.012;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#94a3b8"
        size={0.022}
        sizeAttenuation
        transparent
        opacity={0.6}
      />
    </points>
  );
}

export default function HeroGlobe() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#3b82f6" />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#8b5cf6" />

      <Suspense fallback={null}>
        <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.3}>
          <Globe />
        </Float>
        <Particles />
      </Suspense>
    </Canvas>
  );
}
