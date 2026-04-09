import { Badge, HStack, Icon } from "@chakra-ui/react.js";
import { LuCircleCheck, LuClock, LuCircleX } from "react-icons/lu";

interface StatusBadgeProps {
  status: "Pendente" | "Pago" | "Atrasado";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const configs = {
    Pago: { color: "green", icon: LuCircleCheck },
    Pendente: { color: "orange", icon: LuClock },
    Atrasado: { color: "red", icon: LuCircleX },
  };

  const config = configs[status];

  return (
    <Badge
      colorPalette={config.color}
      variant="solid"
      px={3}
      py={1}
      borderRadius="full"
      fontSize="xs"
      fontWeight="black"
    >
      <HStack gap={1.5}>
        <Icon as={config.icon} boxSize={3} />
        <span>{status.toUpperCase()}</span>
      </HStack>
    </Badge>
  );
}