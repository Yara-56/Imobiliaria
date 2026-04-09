import { Box, VStack, HStack, Text, Icon, Button } from "@chakra-ui/react.js";
// Trocamos LuAlertCircle por LuTriangleAlert ou LuInfo
import { LuTriangleAlert, LuArrowRight } from "react-icons/lu";

export const PendingActions = () => (
  <Box bg="orange.50" p={6} borderRadius="3xl" border="1px solid" borderColor="orange.100">
    <VStack align="start" gap={4}>
      <HStack gap={3}>
        {/* Ícone atualizado aqui */}
        <Icon as={LuTriangleAlert} color="orange.500" boxSize={5} />
        <Text fontWeight="800" color="orange.800" fontSize="sm">AÇÕES REQUERIDAS</Text>
      </HStack>
      
      <VStack align="start" gap={3} w="full">
        <HStack justify="space-between" w="full" bg="white" p={3} borderRadius="2xl" shadow="sm">
          <Text fontSize="xs" fontWeight="bold" color="gray.600">3 Vistorias atrasadas</Text>
          <Button size="xs" variant="ghost" colorPalette="orange">
            Resolver <LuArrowRight size={12} style={{ marginLeft: '4px' }} />
          </Button>
        </HStack>
      </VStack>
    </VStack>
  </Box>
);