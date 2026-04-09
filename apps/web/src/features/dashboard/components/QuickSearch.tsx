import { Box, Flex, Input, Icon, Kbd } from "@chakra-ui/react.js";
import { LuSearch } from "react-icons/lu";

export const QuickSearch = () => (
  <Box mb={8} w="full" maxW="500px">
    <Flex
      align="center"
      bg="white"
      px={4}
      borderRadius="2xl"
      shadow="sm"
      border="1px solid"
      borderColor="gray.100"
      _focusWithin={{ borderColor: "blue.400", shadow: "md" }}
      transition="all 0.2s"
    >
      <Icon as={LuSearch} color="gray.400" boxSize={5} mr={3} />

      <Input
        border="none"
        outline="none"
        _focus={{ ring: 0 }}
        bg="transparent"
        placeholder="Buscar inquilino, imóvel ou contrato..."
        _placeholder={{ color: "gray.400", fontSize: "sm" }}
        fontSize="md"
        h="45px"
        flex="1"
      />

      <Kbd
        ml={2}
        display={{ base: "none", md: "inline-block" }}
        py={1} px={2}
        borderRadius="md"
        bg="gray.50"
        color="gray.500"
        fontSize="10px"
        fontWeight="bold"
      >
        ⌘ K
      </Kbd>
    </Flex>
  </Box>
);
