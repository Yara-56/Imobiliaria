"use client"

import { 
  Flex, Box, Text, Stack, Heading, 
  Input, Button, VStack, Circle, Container
} from "@chakra-ui/react";
import { useState } from "react";
import { LuArrowRight, LuCheck, LuFingerprint, LuMail, LuLock } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import api from "@/core/api/api"; 
import { toaster } from "@/components/ui/toaster"; // Padrão v3 para notificações
import { InputGroup } from "@/components/ui/input-group"; // Componente corrigido

export default function LoginPage() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toaster.create({ 
        title: "Campos obrigatórios", 
        description: "Por favor, insira seu e-mail e senha.",
        type: "warning" 
      });
      return;
    }

    try {
      setIsLoading(true);
      // Chamada para o backend rodando na porta 3001
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      // Armazenamento seguro para o Interceptor do Axios
      localStorage.setItem("imobisys_token", token);
      localStorage.setItem("imobisys_user", JSON.stringify(user));

      toaster.create({ 
        title: `Bem-vinda, ${user.name}!`, 
        type: "success" 
      });

      // Redirecionamento para a dashboard protegida
      navigate("/dashboard"); 
    } catch (error: any) {
      toaster.create({ 
        title: "Falha na autenticação", 
        description: error.message || "E-mail ou senha incorretos.", 
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex 
      minH="100vh" w="100vw" bg="#020617" 
      position="relative" overflow="hidden" align="center"
    >
      {/* 🔮 Background Effects (Cybersecurity Style) */}
      <Circle 
        size="800px" bg="blue.900" position="absolute" 
        top="-300px" left="-200px" filter="blur(140px)" opacity="0.4" 
      />
      <Box 
        w="500px" h="500px" bg="purple.900" position="absolute" 
        bottom="-100px" right="-50px" filter="blur(120px)" opacity="0.3" borderRadius="full"
      />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <Flex 
          w="full" minH="700px" 
          bg="rgba(15, 23, 42, 0.7)" 
          backdropFilter="blur(20px)"
          borderRadius="40px" 
          border="1px solid rgba(255, 255, 255, 0.1)"
          shadow="2xl"
          overflow="hidden"
          direction={{ base: "column", md: "row" }}
        >
          
          {/* Lado Esquerdo: Branding */}
          <Flex 
            flex={1} p={{ base: 10, md: 20 }} 
            direction="column" justify="center"
            bgGradient="to-br" 
            gradientFrom="blue.900" 
            gradientTo="transparent"
          >
            <VStack align="start" gap={10}>
              <Flex 
                align="center" justify="center"
                boxSize="70px" bg="blue.500" borderRadius="22px" 
                shadow="0 0 40px rgba(59, 130, 246, 0.5)"
              >
                <LuFingerprint size={38} color="white" />
              </Flex>
              
              <Box>
                <Heading size="3xl" color="white" fontWeight="900" mb={6} letterSpacing="-2px">
                  Imobi<Text as="span" color="blue.400">Sys</Text>
                </Heading>
                <Text fontSize="xl" color="slate.400" lineHeight="tall">
                  Gestão imobiliária enterprise <br /> com foco em cibersegurança.
                </Text>
              </Box>

              <VStack align="start" gap={4}>
                {["Acesso Multi-tenant", "Logs de Auditoria", "Dados Criptografados"].map((item) => (
                  <Flex key={item} align="center" gap={3} color="blue.200" fontWeight="600" fontSize="sm">
                    <LuCheck size={16} color="#60A5FA" />
                    {item}
                  </Flex>
                ))}
              </VStack>
            </VStack>
          </Flex>

          {/* Lado Direito: Formulário */}
          <Flex 
            flex={1} bg="rgba(255, 255, 255, 0.02)" 
            p={{ base: 10, md: 24 }} align="center"
            borderLeft="1px solid rgba(255, 255, 255, 0.05)"
          >
            <Stack gap={10} w="full">
              <Box>
                <Text color="blue.400" fontWeight="bold" letterSpacing="0.2em" mb={2}>PORTAL DO COLABORADOR</Text>
                <Heading size="xl" fontWeight="800" color="white" letterSpacing="-1px">
                  Bem-vinda de volta
                </Heading>
              </Box>

              <Stack gap={6}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="slate.500" mb={3} ml={1}>E-MAIL CORPORATIVO</Text>
                  {/* ✅ Usando a sintaxe v3 com startElement */}
                  <InputGroup startElement={<LuMail color="#475569" />}>
                    <Input 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@imobiliaria.com" 
                      bg="rgba(0, 0, 0, 0.2)" 
                      border="1px solid rgba(255, 255, 255, 0.1)"
                      h="64px" 
                      borderRadius="18px" 
                      color="white"
                      _focus={{ borderColor: "blue.500", bg: "rgba(0, 0, 0, 0.4)" }}
                    />
                  </InputGroup>
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="slate.500" mb={3} ml={1}>SENHA DE ACESSO</Text>
                  <InputGroup startElement={<LuLock color="#475569" />}>
                    <Input 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      bg="rgba(0, 0, 0, 0.2)" 
                      border="1px solid rgba(255, 255, 255, 0.1)"
                      h="64px" 
                      borderRadius="18px" 
                      color="white"
                      _focus={{ borderColor: "blue.500", bg: "rgba(0, 0, 0, 0.4)" }}
                    />
                  </InputGroup>
                </Box>

                <Button 
                  loading={isLoading} // Propriedade v3
                  size="xl" h="70px" bg="blue.500" color="white" 
                  borderRadius="20px" fontWeight="800" fontSize="lg"
                  _hover={{ bg: "blue.400", transform: "scale(1.02)" }}
                  onClick={handleLogin}
                >
                  ACESSAR PAINEL <LuArrowRight size={22} style={{ marginLeft: '12px' }} />
                </Button>
              </Stack>
            </Stack>
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
}