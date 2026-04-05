import { 
  Box, 
  Text, 
  HStack, 
  VStack, 
  Badge, 
  Icon
} from "@chakra-ui/react";
import { IconType } from "react-icons";

interface KPICardProps {
  label: string;
  value: string | number | undefined;
  trend?: string;
  icon: IconType;
  colorPalette?: string;
}

/**
 * KPICard - Componente de métrica otimizado para Chakra v3
 * Exportação nomeada para garantir compatibilidade com a Dashboard
 */
export const KPICard = ({ 
  label, 
  value, 
  trend = "+0%", 
  icon: IconComponent,
  colorPalette = "blue" 
}: KPICardProps) => {
  
  const isPositive = trend.includes("+");

  return (
    <Box
      position="relative"
      p={6}
      bg="white" // Mudei para white para combinar com o fundo gray.50 da sua dashboard
      borderRadius="2xl"
      border="1px solid"
      borderColor="gray.100"
      overflow="hidden"
      boxShadow="sm"
      transition="all 0.3s cubic-bezier(.4,0,.2,1)"
      _hover={{ 
        transform: "translateY(-4px)", 
        borderColor: `${colorPalette}.400`,
        boxShadow: "md"
      }}
    >
      <VStack align="start" gap={4}>
        <HStack w="full" justify="space-between">
          <Box 
            p={2} 
            bg={`${colorPalette}.50`} 
            borderRadius="lg" 
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={IconComponent} boxSize="20px" color={`${colorPalette}.600`} />
          </Box>
          
          <Badge 
            variant="subtle" 
            colorPalette={isPositive ? "green" : "red"} 
            borderRadius="full"
            px={2}
          >
            {trend}
          </Badge>
        </HStack>

        <VStack align="start" gap={0}>
          <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase">
            {label}
          </Text>
          <Text fontSize="2xl" color="gray.800" fontWeight="900" letterSpacing="tight">
            {value ?? "---"}
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
};