import { Box, Text, VStack, Center } from "@chakra-ui/react";

export default function OCRPreview() {
  // Mock visual — depois integramos com o backend
  const ocr = {
    name: "Fulano de Tal",
    cpf: "000.000.000-00",
    address: "Rua das Flores, 123",
    birth: "01/01/1990",
  };

  return (
    <Center py="40px">
      <VStack gap="24px" w="100%" maxW="520px">
        <Text fontSize="24px" fontWeight="800">Dados Extraídos do Documento</Text>

        <Box
          w="100%"
          border="1px solid token(colors.gray.400)"
          borderRadius="16px"
          p="24px"
        >
          <VStack align="start" gap="12px">
            <Text><strong>Nome:</strong> {ocr.name}</Text>
            <Text><strong>CPF:</strong> {ocr.cpf}</Text>
            <Text><strong>Endereço:</strong> {ocr.address}</Text>
            <Text><strong>Nascimento:</strong> {ocr.birth}</Text>
          </VStack>
        </Box>
      </VStack>
    </Center>
  );
}