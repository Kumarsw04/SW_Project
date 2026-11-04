import { Box, Text } from "@react-three/drei";
import type { RoomData } from "./types/building.types";

interface RoomProps {
  room: RoomData;
  selected?: boolean;
}

export default function Room({
  room,
  selected = false,
}: RoomProps) {
  const [width, depth] = room.size;
  const [x, z] = room.position;

  return (
    <group position={[x, 0, z]}>
      {/* Room floor */}
      <Box
        args={[width, 0.035, depth]}
        position={[0, 0.11, 0]}
      >
        <meshStandardMaterial
          color={selected ? "#e8c578" : "#303b42"}
          roughness={0.8}
        />
      </Box>

      {/* Room label */}
      <Text
        position={[0, 0.18, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={Math.min(0.17, width * 0.09, depth * 0.09)}
        maxWidth={width * 0.9}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        {room.name}
      </Text>
    </group>
  );
}