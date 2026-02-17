import { Badge } from "@chakra-ui/react";

interface TenantStatusBadgeProps {
  status: "active" | "inactive";
}

/**
 * ✅ Componente especializado para exibir o status do inquilino.
 * Utiliza o sistema de 'colorPalette' da v3 para garantir acessibilidade.
 */
export const TenantStatusBadge = ({ status }: TenantStatusBadgeProps) => {
  const isActive = status === "active";

  return (
    <Badge 
      colorPalette={isActive ? "green" : "red"} 
      variant="surface" 
      borderRadius="full"
      px={3}
      py={0.5}
      textTransform="capitalize"
      fontWeight="bold"
    >
      {isActive ? "Ativo" : "Inativo"}
    </Badge>
  );
};