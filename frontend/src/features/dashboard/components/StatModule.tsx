import { 
    Box, 
    Text, 
    HStack, 
    VStack, 
    Badge, 
    Image
  } from "@chakra-ui/react"; // ✅ Icon e Float removidos para limpar o erro ts(6133)
  
  // Interface rigorosa para evitar erros de tipagem no StatsSection
  interface StatModuleProps {
    label: string;
    value: string | number;
    trend: string;
    icon: string;
    color?: string;
  }
  
  /**
   * StatModule - Um componente de métrica sênior para o ImobiSys.
   */
  export const StatModule = ({ 
    label, 
    value, 
    trend, 
    icon, 
    color = "blue.500" 
  }: StatModuleProps) => {
    
    const isPositive = trend.includes("+");
  
    return (
      <Box
        position="relative"
        p={6}
        bg="gray.800"
        borderRadius="2xl"
        border="1px solid"
        borderColor="whiteAlpha.100"
        overflow="hidden"
        transition="all 0.2s"
        _hover={{ transform: "translateY(-4px)", borderColor: "whiteAlpha.300" }}
      >
        {/* Brilho sutil ao fundo */}
        <Box
          position="absolute"
          top="-10%"
          right="-5%"
          w="100px"
          h="100px"
          bg={color}
          filter="blur(50px)"
          opacity="0.15"
          pointerEvents="none"
        />
  
        <VStack align="start" gap={4}>
          <HStack w="full" justify="space-between">
            <Box 
              p={2} 
              bg="whiteAlpha.50" 
              borderRadius="lg" 
              border="1px solid" 
              borderColor="whiteAlpha.100"
            >
              <Image 
                src={icon} 
                boxSize="24px" 
                alt={label} 
                filter="brightness(0) invert(1)" 
              />
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
            <Text fontSize="sm" color="gray.400" fontWeight="medium">
              {label}
            </Text>
            <Text fontSize="2xl" color="white" fontWeight="bold" letterSpacing="tight">
              {value}
            </Text>
          </VStack>
        </VStack>
      </Box>
    );
  };