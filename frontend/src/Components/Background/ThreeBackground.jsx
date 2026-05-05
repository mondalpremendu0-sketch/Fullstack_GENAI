import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";

function Blob({ position, scale }) {
  return (
    <Float speed={1.5} floatIntensity={2}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.15}
        />
      </mesh>
    </Float>
  );
}

export default function ThreeBackground() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8] }}
      style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }}
    >
      <ambientLight intensity={1} />

      <Blob position={[-3, 1, -2]} scale={2} />
      <Blob position={[3, -1, -3]} scale={1.5} />
      <Blob position={[0, 2, -4]} scale={2.5} />
      <Blob position={[0, -3, -2]} scale={2} />
    </Canvas>
  );
}