"use client";

import {
  ContactShadows,
  Environment,
  Float,
  OrbitControls,
  RoundedBox,
  Sparkles,
  Text,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import { MathUtils } from "three";

const stagePalette = {
  forward: {
    background: "#050913",
    accent: "#f97316",
    glow: "#fef08a",
  },
  backward: {
    background: "#05131e",
    accent: "#2dd4bf",
    glow: "#a5f3fc",
  },
  none: {
    background: "#090a14",
    accent: "#60a5fa",
    glow: "#dbeafe",
  },
};

function StudioScene({ action, direction, flightRef }) {
  const rigRef = useRef(null);
  const accentRef = useRef(null);
  const shellRef = useRef(null);
  const flyerRef = useRef(null);
  const flyerRingRef = useRef(null);

  const palette = stagePalette[direction] ?? stagePalette.none;

  const target = useMemo(() => {
    const yaw =
      direction === "backward" ? 0.42 : direction === "forward" ? -0.42 : 0;
    const lateral =
      action === "traverse" ? -0.18 : action === "replace" ? 0.22 : 0;
    return { yaw, lateral };
  }, [action, direction]);

  useFrame((state, delta) => {
    if (
      !rigRef.current ||
      !accentRef.current ||
      !shellRef.current ||
      !flyerRef.current ||
      !flyerRingRef.current
    ) {
      return;
    }

    rigRef.current.rotation.y = MathUtils.damp(
      rigRef.current.rotation.y,
      target.yaw,
      4,
      delta,
    );
    rigRef.current.position.x = MathUtils.damp(
      rigRef.current.position.x,
      target.lateral,
      3.5,
      delta,
    );
    rigRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.11;

    accentRef.current.rotation.x += delta * 0.45;
    accentRef.current.rotation.y += delta * 0.9;
    shellRef.current.rotation.z =
      Math.sin(state.clock.elapsedTime * 0.33) * 0.08;

    const flightState = flightRef?.current;
    const isFlying = Boolean(flightState?.active);

    if (isFlying) {
      const t = Math.min(Math.max(flightState.progress, 0), 1);
      const x = -2.7 + 5.4 * t;
      const y = -1.08 + Math.sin(Math.PI * t) * 1.25;
      const z = -0.75 + 1.65 * t;

      flyerRef.current.position.set(x, y, z);
      flyerRef.current.rotation.x = MathUtils.lerp(0, 0.95, t);
      flyerRef.current.rotation.y = MathUtils.lerp(-1.2, 0.08, t);
      flyerRef.current.rotation.z += delta * 4.6;

      flyerRingRef.current.rotation.x = MathUtils.lerp(0.2, 1.7, t);
      flyerRingRef.current.rotation.y += delta * 2.4;
      flyerRingRef.current.material.opacity = MathUtils.lerp(0.7, 0.2, t);
      return;
    }

    const hoverTime = state.clock.elapsedTime;
    flyerRef.current.position.set(
      -2.65,
      -1.06 + Math.sin(hoverTime * 1.75) * 0.1,
      -0.7,
    );
    flyerRef.current.rotation.x = Math.sin(hoverTime * 1.2) * 0.2;
    flyerRef.current.rotation.y = -0.58 + Math.sin(hoverTime * 0.85) * 0.08;
    flyerRef.current.rotation.z += delta * 1.1;

    flyerRingRef.current.rotation.x = 0.6;
    flyerRingRef.current.rotation.y += delta * 0.8;
    flyerRingRef.current.material.opacity = 0.5;
  });

  return (
    <>
      <color attach="background" args={[palette.background]} />
      <fog attach="fog" args={[palette.background, 7, 22]} />

      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 8]} intensity={1.2} />
      <pointLight
        position={[-5, -2, 4]}
        color={palette.accent}
        intensity={2.4}
      />

      <group ref={rigRef}>
        <Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.25}>
          <RoundedBox args={[2.9, 1.7, 0.22]} radius={0.14} smoothness={5}>
            <meshStandardMaterial
              color="#111a2a"
              roughness={0.28}
              metalness={0.3}
            />
          </RoundedBox>
        </Float>

        <Float speed={1.7} rotationIntensity={0.45} floatIntensity={0.5}>
          <mesh ref={accentRef} position={[0.1, 0.18, 0.5]}>
            <torusKnotGeometry args={[0.38, 0.11, 180, 24]} />
            <meshStandardMaterial
              color={palette.accent}
              emissive={palette.glow}
              emissiveIntensity={0.8}
              roughness={0.25}
              metalness={0.7}
            />
          </mesh>
        </Float>

        <Float speed={1.3} rotationIntensity={0.15} floatIntensity={0.15}>
          <mesh ref={shellRef} position={[-0.8, -0.38, -0.2]} scale={0.8}>
            <icosahedronGeometry args={[0.38, 1]} />
            <meshStandardMaterial
              color="#0f172a"
              metalness={0.55}
              roughness={0.3}
            />
          </mesh>
        </Float>

        <Text
          position={[0, -1.1, 0]}
          fontSize={0.17}
          color="#dbeafe"
          letterSpacing={0.08}
          anchorX="center"
          anchorY="middle"
        >
          CREATIVE STUDIO STAGE
        </Text>

        <group ref={flyerRef}>
          <mesh scale={0.18}>
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial
              color="#f8fafc"
              emissive={palette.glow}
              emissiveIntensity={1.25}
              metalness={0.58}
              roughness={0.12}
            />
          </mesh>
          <mesh ref={flyerRingRef} scale={0.4}>
            <torusGeometry args={[0.62, 0.12, 18, 42]} />
            <meshStandardMaterial
              color={palette.accent}
              emissive={palette.accent}
              emissiveIntensity={0.7}
              transparent
              opacity={0.5}
            />
          </mesh>
        </group>
      </group>

      <Sparkles
        count={65}
        size={2.5}
        speed={0.25}
        opacity={0.55}
        scale={[7, 3, 7]}
        color={palette.glow}
      />

      <ContactShadows
        position={[0, -1.25, 0]}
        opacity={0.45}
        scale={8}
        blur={1.5}
        far={4}
      />
      <Environment preset="city" />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={1}
        maxPolarAngle={2}
      />
    </>
  );
}

export function StudioStage({ action, direction, flightRef }) {
  return (
    <div className="stage-canvas">
      <Canvas
        camera={{ position: [0, 0.05, 5.5], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <StudioScene
            action={action}
            direction={direction}
            flightRef={flightRef}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
