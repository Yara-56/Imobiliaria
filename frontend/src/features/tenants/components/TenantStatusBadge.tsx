"use client";

import { Badge, Flex, Icon } from "@chakra-ui/react";
import { 
  LuCircleCheck, 
  LuCircleX, 
  LuClock, 
  LuCircleAlert,
  LuCircleMinus
} from "react-icons/lu";
import { TenantStatus } from "../types/tenant";

interface TenantStatusBadgeProps {
  status: TenantStatus;
}

export const TenantStatusBadge = ({ status }: TenantStatusBadgeProps) => {
  const statusConfig = {
    ACTIVE:    { label: "Ativo",     color: "green",  icon: LuCircleCheck  },
    SUSPENDED: { label: "Suspenso",  color: "red",    icon: LuCircleX      },
    PENDING:   { label: "Pendente",  color: "orange", icon: LuClock        },
    INACTIVE:  { label: "Inativo",   color: "gray",   icon: LuCircleMinus  },
  };

  const config = statusConfig[status] || { label: "Erro", color: "gray", icon: LuCircleAlert };

  return (
    <Badge 
      colorPalette={config.color} 
      variant="surface" 
      borderRadius="full"
      px={3}
      py={1}
      display="inline-flex"
      alignItems="center"
      gap={2}
    >
      <Icon as={config.icon} boxSize="14px" />
      <Flex as="span" fontWeight="bold" fontSize="10px" textTransform="uppercase">
        {config.label}
      </Flex>
    </Badge>
  );
};