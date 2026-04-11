"use client";

import { Badge, Icon, Span } from "@chakra-ui/react";
import { 
  LuCircleCheck, 
  LuCircleX, 
  LuClock, 
  LuCircleAlert,
  LuCircleMinus
} from "react-icons/lu";
import { TenantStatus } from "../types/tenant.enums";

interface TenantStatusBadgeProps {
  status: TenantStatus;
}

export const TenantStatusBadge = ({ status }: TenantStatusBadgeProps) => {
  // Mapeamento profissional de cores e ícones
  // ✅ DICA: Usei chaves que aceitam tanto Maiúsculas quanto Minúsculas para evitar erros
  const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    ACTIVE:    { label: "Ativo",     color: "green",  icon: LuCircleCheck  },
    active:    { label: "Ativo",     color: "green",  icon: LuCircleCheck  },
    SUSPENDED: { label: "Suspenso",  color: "red",    icon: LuCircleX      },
    suspended: { label: "Suspenso",  color: "red",    icon: LuCircleX      },
    PENDING:   { label: "Pendente",  color: "orange", icon: LuClock        },
    pending:   { label: "Pendente",  color: "orange", icon: LuClock        },
    INACTIVE:  { label: "Inativo",   color: "gray",   icon: LuCircleMinus  },
    inactive:  { label: "Inativo",   color: "gray",   icon: LuCircleMinus  },
  };

  // Busca a configuração ou define um padrão de erro "limpo"
  const config = statusConfig[status as string] || { 
    label: "Desconhecido", 
    color: "gray", 
    icon: LuCircleAlert 
  };

  return (
    <Badge 
      colorPalette={config.color} 
      variant="surface" // Variant surface na v3 já traz um fundo suave e texto na cor do tema
      borderRadius="full"
      px={3}
      py={1}
      display="inline-flex"
      alignItems="center"
      gap={1.5}
      border="1px solid"
      borderColor={`${config.color}.200/30`}
    >
      {/* ✅ Ícone com cor suave do tema */}
      <Icon as={config.icon} boxSize="12px" />
      
      {/* ✅ Trocamos o Flex por Span para ser mais leve e tiramos o preto pesado */}
      <Span 
        fontWeight="800" 
        fontSize="9px" 
        textTransform="uppercase" 
        letterSpacing="wider"
      >
        {config.label}
      </Span>
    </Badge>
  );
};