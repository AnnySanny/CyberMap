import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";

export default function NodeSphere({ position, cluster, severity, raw, onSelect, selectedId }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  const isSelected = raw.id === selectedId;

  const colors = ["#ff4444", "#44ff44", "#4444ff", "#ffaa00"];
  const baseColor = colors[cluster % colors.length];
  const hoverColor = "#ffffff";

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // target scale
    const target = hovered ? 1.4 : isSelected ? 1.2 : 1;

    meshRef.current.scale.x += (target - meshRef.current.scale.x) * 5 * delta;
    meshRef.current.scale.y = meshRef.current.scale.x;
    meshRef.current.scale.z = meshRef.current.scale.x;

    // pulse ONLY if this one is selected
    if (isSelected) {
      const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.05;
      meshRef.current.scale.x += pulse;
      meshRef.current.scale.y += pulse;
      meshRef.current.scale.z += pulse;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelect(raw)}
        style={{ cursor: "pointer" }}
      >
        <sphereGeometry args={[0.25 + (severity || 1) * 0.05, 32, 32]} />
        <meshStandardMaterial
          color={hovered ? hoverColor : baseColor}
          emissive={hovered ? hoverColor : baseColor}
          emissiveIntensity={hovered ? 0.9 : isSelected ? 0.5 : 0.25}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      <Text
        position={[0, 0.6, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {raw.type}
      </Text>
    </group>
  );
}
