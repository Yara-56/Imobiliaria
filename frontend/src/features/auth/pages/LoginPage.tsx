"use client"

import { 
  Flex, Box, Text, Stack, Heading, 
  Input, Button, VStack, Circle, Container
} from "@chakra-ui/react";
import { useState } from "react";
import { LuArrowRight, LuFingerprint, LuMail, LuLock } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import api from "@/core/api/api"; 
import { useAuth } from "@/context/AuthContext"; //
import { toaster } from "@/components/ui/toaster"; //
import { InputGroup } from "@/components/ui/input-group"; //

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Conecta com seu estado global
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toaster.create({ title: "Campos obrigatórios", type: "warning" });
      return;
    }

    try {
      setIsLoading(true);
      // Chamada para o seu Node.js na porta 3001
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      // ✅ Resolve o bug de "não ver nada": Atualiza o contexto global
      login(user, token); 

      toaster.create({ title: `Bem-vinda, ${user.name}!`, type: "success" });
      navigate("/admin/dashboard"); 
    } catch (error: any) {
      toaster.create({ 
        title: "Erro de acesso", 
        description: error.response?.data?.message || "Verifique suas credenciais", 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="100vh" w="100vw" bg="#020617" align="center" justify="center" position="relative" overflow="hidden">
      {/* Efeitos de fundo */}
      <Circle size="600px" bg="blue.900" position="absolute" top="-150px" left="-150px" filter="blur(120px)" opacity="0.4" />

      <Container maxW="md" zIndex={1}>
        <Stack 
          gap={8} p={10} bg="rgba(15, 23, 42, 0.8)" 
          borderRadius="3xl" border="1px solid rgba(255,255,255,0.15)" backdropFilter="blur(12px)"
        >
          <VStack gap={2}>
            <LuFingerprint size={48} color="#60A5FA" />
            <Heading size="2xl" color="white" fontWeight="900" letterSpacing="-1px">
              Imobi<Text as="span" color="blue.400">Sys</Text>
            </Heading>
            {/* ✅ CORRIGIDO: Texto mais claro para leitura */}
            <Text color="slate.300" fontWeight="medium" textAlign="center">
              Gestão Imobiliária Segura
            </Text>
          </VStack>

          <Stack gap={5}>
            <Box>
              <Text fontSize="xs" fontWeight="bold" color="blue.300" mb={2} ml={1}>E-MAIL CORPORATIVO</Text>
              <InputGroup startElement={<LuMail color="#94A3B8" />}>
                <Input 
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com" h="60px" bg="blackAlpha.500" 
                  border="1px solid rgba(255,255,255,0.2)" color="white" borderRadius="15px"
                  _placeholder={{ color: "slate.500" }} _focus={{ borderColor: "blue.400", bg: "blackAlpha.600" }}
                />
              </InputGroup>
            </Box>

            <Box>
              <Text fontSize="xs" fontWeight="bold" color="blue.300" mb={2} ml={1}>SENHA DE ACESSO</Text>
              <InputGroup startElement={<LuLock color="#94A3B8" />}>
                <Input 
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" h="60px" bg="blackAlpha.500" 
                  border="1px solid rgba(255,255,255,0.2)" color="white" borderRadius="15px"
                  _placeholder={{ color: "slate.500" }} _focus={{ borderColor: "blue.400" }}
                />
              </InputGroup>
            </Box>

            <Button 
              loading={isLoading} onClick={handleLogin}
              size="xl" h="65px" bg="blue.500" color="white" borderRadius="18px" 
              fontWeight="900" fontSize="lg" _hover={{ bg: "blue.400", transform: "translateY(-2px)" }}
              transition="all 0.2s"
            >
              ACESSAR PAINEL <LuArrowRight style={{ marginLeft: '10px' }} />
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Flex>
  );
}