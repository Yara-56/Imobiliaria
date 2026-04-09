import { Flex, Text, Box } from "@chakra-ui/react.js";
import { FiFile } from "react-icons/fi";

export default function FileCard({ file }: { file: File }) {
  return (
    <Flex
      justify="space-between"
      align="center"
      borderBottom="1px solid token(colors.gray.300)"
      py="8px"
    >
      <Flex align="center" gap="8px">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="28px"
          h="28px"
          borderRadius="6px"
          background="token(colors.gray.200)"
        >
          <FiFile size={16} />
        </Box>

        <Text fontSize="14px">{file.name}</Text>
      </Flex>

      <Text fontSize="12px" color="token(colors.gray.500)">
        {(file.size / 1024).toFixed(1)} KB
      </Text>
    </Flex>
  );
}