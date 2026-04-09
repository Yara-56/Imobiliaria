// components/PortfolioHealth.tsx
import { 
    Box, 
    Text, 
    VStack, 
    HStack, 
    Badge, 
    SimpleGrid // <--- Adicionado aqui para resolver o erro ts(2304)
  } from "@chakra-ui/react.js";
  import { motion } from "framer-motion";
  
  export const PortfolioHealth = () => {
    const occupancy = 85;
  
    return (
      <Box bg="white" p={8} borderRadius="3xl" border="1px solid" borderColor="gray.100" shadow="sm">
        <VStack align="start" gap={6}>
          <HStack justify="space-between" w="full">
            <Text fontWeight="800" color="gray.700">Saúde do Portfólio</Text>
            <Badge colorPalette="blue" variant="solid" borderRadius="full">Premium</Badge>
          </HStack>
          
          <Box w="full">
            <HStack justify="space-between" mb={2}>
              <Text fontSize="xs" color="gray.500" fontWeight="bold">TAXA DE OCUPAÇÃO</Text>
              <Text fontSize="xs" fontWeight="900" color="blue.600">{occupancy}%</Text>
            </HStack>
            
            <Box h="12px" w="full" bg="blue.50" borderRadius="full" overflow="hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${occupancy}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ 
                  height: '100%', 
                  backgroundColor: '#3182ce', 
                  borderRadius: 'inherit' 
                }}
              />
            </Box>
          </Box>
  
          <SimpleGrid columns={2} gap={4} w="full">
            <VStack align="start" gap={0}>
              <Text fontSize="2xl" fontWeight="900" color="gray.800">18</Text>
              <Text fontSize="10px" color="gray.400" fontWeight="bold">ALUGADOS</Text>
            </VStack>
            <VStack align="start" gap={0}>
              <Text fontSize="2xl" fontWeight="900" color="gray.800">03</Text>
              <Text fontSize="10px" color="gray.400" fontWeight="bold">DISPONÍVEIS</Text>
            </VStack>
          </SimpleGrid>
        </VStack>
      </Box>
    );
  };