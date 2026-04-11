import { Box, Text, VStack } from "@chakra-ui/react";
import { FiUploadCloud } from "react-icons/fi";

export default function UploadDropzone() {
  return (
    <Box
      border="2px dashed token(colors.gray.400)"
      borderRadius="16px"
      p="32px"
      cursor="pointer"
      _hover={{
        background: "token(colors.gray.100)",
        transition: "0.2s",
      }}
    >
      <VStack gap="8px">
        <FiUploadCloud size={40} />

        <Text fontWeight="600">Arraste os arquivos aqui</Text>

        <Text fontSize="12px" color="token(colors.gray.500)">
          ou clique para selecionar
        </Text>
      </VStack>
    </Box>
  );
}