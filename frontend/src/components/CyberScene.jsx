import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import NodeSphere from "./NodeSphere";
import transformData from "../utils/transformData";

export default function CyberScene({ incidents, onSelect }) {
  const points = transformData(incidents);

  return (
    <Canvas
      camera={{ position: [0, 5, 12], fov: 55 }}
      style={{ background: "#0A0F1F" }}   // 🔥 кібер-темний фон
    >

      {/* Light */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color={"#4ab8ff"} />
      <pointLight position={[-10, -5, -10]} intensity={0.5} color={"#1e3a8a"} />

      {/* Fog — кібер-ефект глибини */}
      <fog attach="fog" args={["#0A0F1F", 10, 40]} />

      <OrbitControls enableDamping dampingFactor={0.1} />

      {/* НЕОН-ПЛОЩИНА */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshBasicMaterial
          color="#112233"
          opacity={0.25}
          transparent
        />
      </mesh>

      {/* НЕОН-СІТКА GRID */}
      <gridHelper
        args={[80, 60, "#173b6c", "#1d4ed8"]}
        position={[0, -1.49, 0]}
      />

      {/* НЕОН-ГЕКСАГОНАЛЬНЕ КІЛЬЦЕ (як у кіберсистемах) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.45, 0]}>
        <circleGeometry args={[25, 6]} />
        <meshBasicMaterial
          color="#3fb6ff"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* НЕВЕЛИКІ ПАРТІКЛИ-ДАНІ */}
      {Array.from({ length: 40 }).map((_, i) => (
        <mesh key={i} position={[
          (Math.random() - 0.5) * 30,
          Math.random() * 5 + 1,
          (Math.random() - 0.5) * 30
        ]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#4ab8ff" opacity={0.5} transparent />
        </mesh>
      ))}

      {/* Рендер сфер інцидентів */}
      {points.map(point => (
        <NodeSphere
          key={point.id}
          position={point.position}
          cluster={point.cluster}
          severity={point.severity}
          raw={point.raw}
          onSelect={onSelect}
        />
      ))}

    </Canvas>
  );
}
