import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import NodeSphere from "./NodeSphere";
import transformData from "../utils/transformData";
import { Line } from "@react-three/drei";
export default function CyberScene({
  incidents,
  edges = [],
  showEdges = true,
  showLabels = true,
  onSelect,
}) {
  const points = transformData(incidents);

  const pointMap = Object.fromEntries(points.map((p) => [p.raw.id, p]));

  return (
    <Canvas
      camera={{ position: [0, 5, 12], fov: 55 }}
      style={{ background: "#0A0F1F" }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#4ab8ff" />
      <pointLight position={[-10, -5, -10]} intensity={0.5} color="#1e3a8a" />

      <fog attach="fog" args={["#0A0F1F", 10, 40]} />
      <OrbitControls enableDamping dampingFactor={0.1} />

      {/* сцена */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshBasicMaterial color="#112233" opacity={0.25} transparent />
      </mesh>

      <gridHelper
        args={[80, 60, "#173b6c", "#1d4ed8"]}
        position={[0, -1.49, 0]}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.45, 0]}>
        <circleGeometry args={[25, 6]} />
        <meshBasicMaterial
          color="#3fb6ff"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* === EDGES === */}
      {showEdges &&
        edges.map((edge, i) => {
          const a = pointMap[edge.source];
          const b = pointMap[edge.target];
          if (!a || !b) return null;

          return (
            <Line
              key={i}
              points={[a.position, b.position]}
              color={edge.clusterA === edge.clusterB ? "#4ab8ff" : "#ffaa00"}
              transparent
              opacity={Math.min(edge.weight, 0.8)}
              lineWidth={1}
            />
          );
        })}

      {/* === NODES === */}
      {points.map((point) => (
<NodeSphere
  key={point.id}
  position={point.position}
  cluster={point.cluster}
  severity={point.severity}
  raw={point.raw}
  showLabel={showLabels}
  onSelect={onSelect}
/>

      ))}
    </Canvas>
  );
}
