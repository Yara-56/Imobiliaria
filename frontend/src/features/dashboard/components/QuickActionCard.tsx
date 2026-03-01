import { 
    Box, Flex, HStack, VStack, Heading, Text, Button, Center, 
    defineStyle 
  } from "@chakra-ui/react";
  import { motion } from "framer-motion";
  import { LuUserPlus, LuZap, LuArrowRight } from "react-icons/lu";
  
  // Criamos um componente animado "puro" que o Chakra aceita como 'as'
  const MotionDiv = motion.div;
  
  export const QuickActionCard = ({ title, description, onClick }: any) => (
    <Box
      as={MotionDiv} // Usamos o componente do motion aqui
      // @ts-ignore - Ignoramos o erro de tipagem apenas nestas props do motion
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      mb={10}
      p="2px"
      bgGradient="to-r"
      gradientFrom="blue.500"
      gradientTo="purple.500"
      borderRadius="3xl"
      shadow="2xl"
    >
      <Flex bg="white" borderRadius="3xl" p={8} align="center" justify="space-between">
        {/* ... restante do seu código interno igual ... */}
        <HStack gap={6}>
          <Center bg="blue.50" color="blue.600" w={16} h={16} borderRadius="2xl">
            <LuUserPlus size={32} />
          </Center>
          <VStack align="start" gap={0}>
            <HStack color="orange.400" gap={1}>
              <LuZap size={14} fill="currentColor" />
              <Text fontSize="xs" fontWeight="black">SUGESTÃO IA</Text>
            </HStack>
            <Heading size="md" fontWeight="800" color="gray.800">{title}</Heading>
            <Text color="gray.500" fontSize="sm">{description}</Text>
          </VStack>
        </HStack>
        <Button 
          colorPalette="blue" 
          size="xl" 
          borderRadius="2xl" 
          onClick={onClick}
          _hover={{ transform: "translateX(5px)" }}
        >
          ADICIONAR <LuArrowRight style={{ marginLeft: "10px" }} />
        </Button>
      </Flex>
    </Box>
  );