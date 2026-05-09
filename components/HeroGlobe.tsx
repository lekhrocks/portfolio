"use client";

import { useMemo, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, Sphere } from "@react-three/drei";
import * as THREE from "three";

/* ─────────────────────────────────────────────────────────
   Generates evenly-distributed points on a sphere via
   the Fibonacci-sphere algorithm.
───────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────
   Slowly rotating wireframe globe with glowing nodes
───────────────────────────────────────────────────────── */
function Globe() {
  const groupRef = useRef<THREE.Group>(null!);
  const radius = 1.6;

  const nodes = useMemo(() => fibonacciSphere(28, radius), []);

  // Pre-compute connection pairs (each node connects to its 2 nearest neighbors)
  const connections = useMemo(() => {
    const pairs: Array<{ from: THREE.Vector3; to: THREE.Vector3; id: string }> = [];
    nodes.forEach((node, i) => {
      const sorted = nodes
        .map((n, j) => ({ n, j, dist: node.distanceTo(n) }))
        .filter(({ j }) => j !== i)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 2);
      sorted.forEach(({ n, j }) => {
        const id = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!pairs.find((p) => p.id === id)) {
          pairs.push({ from: node, to: n, id });
        }
      });
    });
    return pairs;
  }, [nodes]);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.12;
    groupRef.current.rotation.x += delta * 0.04;
  });

  return (
    <group ref={groupRef}>
      {/* Wireframe sphere — Earth/network feel */}
      <Sphere args={[radius, 32, 24]}>
        <meshBasicMaterial
          color="#3b82f6"
          wireframe
          transparent
          opacity={0.12}
        />
      </Sphere>

      {/* Inner glowing core */}
      <Sphere args={[radius * 0.55, 24, 16]}>
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.04} />
      </Sphere>

      {/* Connection lines between nodes */}
      {connections.map((c) => (
        <Line
          key={c.id}
          points={[c.from, c.to]}
          color="#3b82f6"
          opacity={0.25}
          transparent
          lineWidth={1}
        />
      ))}

      {/* Service nodes — glowing dots */}
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
  const colors = ["#3b82f6", "#06b6d4", "#8b5cf6", "#10b981", "#f97316"];
  const color = colors[colorIndex % colors.length];

  // Pulse phase offset per node so they don't all blink together
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime + offset;
    const pulse = 1 + Math.sin(t * 1.5) * 0.25;
    meshRef.current.scale.setScalar(pulse);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.05, 12, 12]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

/* ─────────────────────────────────────────────────────────
   Floating particles around the globe — atmosphere effect
───────────────────────────────────────────────────────── */
function Particles({ count = 200 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.5 + Math.random() * 1.8;
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
    ref.current.rotation.y += delta * 0.02;
    ref.current.rotation.x += delta * 0.01;
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
        size={0.018}
        sizeAttenuation
        transparent
        opacity={0.5}
      />
    </points>
  );
}

/* ─────────────────────────────────────────────────────────
   Main exported component
───────────────────────────────────────────────────────── */
export default function HeroGlobe() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 45 }}
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
