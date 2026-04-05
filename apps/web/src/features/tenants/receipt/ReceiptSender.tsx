import { Box, Text, VStack, Button, Center } from "@chakra-ui/react";

export default function ReceiptSender() {
  function fakeSend(type: string) {
    alert(`Recibo enviado via ${type}!`);
  }

  return (
    <Center py="40px">
      <VStack gap="28px" w="100%" maxW="520px">
        <Text fontSize="24px" fontWeight="800">
          Enviar Recibo
        </Text>

        <Box
          border="1px solid token(colors.gray.400)"
          borderRadius="16px"
          p="24px"
          w="100%"
        >
          <Text fontSize="16px" mb="16px">Selecione o método de envio:</Text>

          <VStack gap="12px">
            <Button
              w="100%"
              colorScheme="blue"
              onClick={() => fakeSend("E-mail")}
            >
              Enviar por E-mail
            </Button>

            <Button
              w="100%"
              colorScheme="green"
              onClick={() => fakeSend("WhatsApp")}
            >
              Enviar por WhatsApp
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Center>
  );
}