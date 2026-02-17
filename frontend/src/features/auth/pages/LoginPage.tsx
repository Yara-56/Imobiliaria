"use client"

import { 
  Flex, Box, Text, Stack, Heading, 
  Input, Button, VStack, Circle, Container 
} from "@chakra-ui/react";
import { LuArrowRight, LuCheck, LuFingerprint } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <Flex 
      minH="100vh" 
      w="100vw" 
      bg="#f8fafc" 
      position="relative" 
      overflow="hidden"
      align="center"
    >
      {/* 🟢 Elementos de fundo para profundidade visual */}
      <Circle 
        size="600px" bg="blue.100" position="absolute" 
        top="-200px" right="-100px" filter="blur(100px)" opacity="0.5" 
      />
      <Circle 
        size="400px" bg="cyan.100" position="absolute" 
        bottom="-100px" left="-50px" filter="blur(80px)" opacity="0.4" 
      />

      <Container maxW="container.lg" position="relative" zIndex={1}>
        <Flex 
          w="full" 
          minH="600px" 
          bg="white" 
          borderRadius={{ base: "40px", md: "60px" }} 
          shadow="0 50px 100px -20px rgba(0,0,0,0.12)"
          overflow="hidden"
          direction={{ base: "column", md: "row" }}
        >
          
          {/* 🚀 Lado de Impacto (Dinâmico) */}
          <Flex 
            flex={1} 
            bg="blue.600" 
            p={{ base: 10, md: 16 }} 
            direction="column" 
            justify="center"
            bgGradient="to-br" 
            gradientFrom="blue.600" 
            gradientTo="blue.800"
          >
            <VStack align="start" gap={8}>
              <Box p={4} bg="whiteAlpha.200" borderRadius="2xl" backdropFilter="blur(10px)">
                <LuFingerprint size={32} color="white" />
              </Box>
              
              <Box>
                <Heading size="2xl" color="white" fontWeight="900" lineHeight="1.1" mb={4}>
                  O futuro da <br /> 
                  sua imobiliária.
                </Heading>
                <Text fontSize="lg" color="blue.100" opacity={0.9}>
                  Acesse a plataforma de gestão mais fluida do mercado.
                </Text>
              </Box>

              <Stack direction="row" gap={4}>
                <Flex align="center" gap={2} color="white" fontSize="xs" fontWeight="black" letterSpacing="widest">
                  <LuCheck size={14} /> INTUITIVO
                </Flex>
                <Flex align="center" gap={2} color="white" fontSize="xs" fontWeight="black" letterSpacing="widest">
                  <LuCheck size={14} /> RÁPIDO
                </Flex>
              </Stack>
            </VStack>
          </Flex>

          {/* 🔐 Lado do Login (Fácil Leitura) */}
          <Flex flex={1.2} bg="white" p={{ base: 10, md: 20 }} align="center">
            <Stack gap={10} w="full">
              <Box>
                <Heading size="xl" fontWeight="900" color="gray.800" mb={2} letterSpacing="tighter">
                  Entrar no sistema
                </Heading>
                <Text color="gray.400" fontWeight="medium">
                  Seja bem-vinda ao seu novo workspace.
                </Text>
              </Box>

              <Stack gap={6}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="blue.600" mb={2} ml={1} letterSpacing="wider">
                    E-MAIL
                  </Text>
                  <Input 
                    placeholder="email@imobiliaria.com" 
                    bg="gray.50" border="2px solid" borderColor="transparent"
                    h="60px" px={6} borderRadius="20px" fontSize="md"
                    _focus={{ borderColor: "blue.500", bg: "white", shadow: "none" }}
                    transition="all 0.3s"
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="blue.600" mb={2} ml={1} letterSpacing="wider">
                    SENHA
                  </Text>
                  <Input 
                    type="password" placeholder="••••••••" 
                    bg="gray.50" border="2px solid" borderColor="transparent"
                    h="60px" px={6} borderRadius="20px"
                    _focus={{ borderColor: "blue.500", bg: "white", shadow: "none" }}
                    transition="all 0.3s"
                  />
                </Box>

                <Button 
                  size="xl" h="64px" bg="blue.600" color="white" 
                  borderRadius="22px" fontWeight="black" fontSize="md"
                  _hover={{ transform: "translateY(-2px)", shadow: "xl", bg: "blue.700" }}
                  onClick={() => {
                    localStorage.setItem("token", "active");
                    navigate("/admin/dashboard");
                  }}
                >
                  ACESSAR PAINEL <LuArrowRight size={20} style={{ marginLeft: '8px' }} />
                </Button>
              </Stack>
            </Stack>
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
}