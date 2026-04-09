import { Box, Text, VStack, HStack, Progress, Badge } from "@chakra-ui/react.js";

export const OccupancyTracker = () => (
  <Box bg="white" p={8} borderRadius="3xl" border="1px solid" borderColor="gray.100" shadow="sm">
    <VStack align="start" gap={6}>
      <HStack justify="space-between" w="full">
        <Text fontWeight="bold" color="gray.700">Taxa de Ocupação</Text>
        <Badge colorPalette="blue" variant="subtle">85%</Badge>
      </HStack>
      
      <Box w="full">
        <HStack justify="space-between" mb={2}>
          <Text fontSize="xs" color="gray.500">Imóveis Alugados</Text>
          <Text fontSize="xs" fontWeight="bold">17/20</Text>
        </HStack>
        {/* Usando o componente de progresso do Chakra v3 */}
        <Box h="10px" w="full" bg="blue.50" borderRadius="full" overflow="hidden">
            <Box h="full" w="85%" bg="blue.500" borderRadius="full" />
        </Box>
      </Box>

      <Text fontSize="xs" color="gray.400 italic">
        * 3 imóveis em processo de vistoria.
      </Text>
    </VStack>
  </Box>
);