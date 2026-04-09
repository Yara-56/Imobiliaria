import { Box, Text, VStack, Button, Center } from "@chakra-ui/react.js";

export default function DocumentReview() {
  // Visual mock
  const docs = [
    { name: "RG - Frente", status: "Pendente" },
    { name: "RG - Verso", status: "Pendente" },
    { name: "CPF", status: "Aprovado" },
  ];

  return (
    <Center py="40px">
      <VStack gap="28px" w="100%" maxW="540px">
        <Text fontSize="24px" fontWeight="800">Revisão de Documentos</Text>

        {docs.map((doc) => (
          <Box
            key={doc.name}
            border="1px solid token(colors.gray.400)"
            p="20px"
            borderRadius="16px"
            w="100%"
          >
            <Text fontSize="18px" fontWeight="600">{doc.name}</Text>
            <Text fontSize="14px" color="token(colors.gray.500)">
              Status: {doc.status}
            </Text>

            <VStack gap="10px" mt="16px">
              <Button colorScheme="green" w="100%">Aprovar</Button>
              <Button colorScheme="red" w="100%">Rejeitar</Button>
            </VStack>
          </Box>
        ))}
      </VStack>
    </Center>
  );
}