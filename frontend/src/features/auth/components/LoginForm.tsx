"use client"

import { 
  Box, Button, Heading, Input, Stack, Text, VStack, Flex 
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuMail, LuLock, LuArrowRight } from "react-icons/lu";
import { useAuth } from "../../../core/hooks/useAuth";
import { toaster } from "../../../core/components/ui/toaster";

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (email === "admin@imobisys.com" && password === "123456") {
        login({ id: "1", name: "Yara", email, role: "ADMIN" }, "token-fake");
        
        toaster.create({
          title: "Bem-vinda de volta!",
          description: "Acesso autorizado com sucesso.",
          type: "success",
        });

        navigate("/admin/dashboard");
      } else {
        throw new Error("E-mail ou senha incorretos.");
      }
    } catch (error: any) {
      toaster.create({
        title: "Falha no acesso",
        description: error.message,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box 
      w="full" 
      maxW="420px" 
      p={10} 
      borderRadius="3xl" 
      bg="rgba(255, 255, 255, 0.03)" 
      backdropFilter="blur(20px)"
      border="1px solid rgba(255, 255, 255, 0.1)"
      boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)"
    >
      <form onSubmit={handleSubmit}>
        <VStack align="start" gap={1} mb={8}>
          <Heading size="2xl" fontWeight="black" color="white" letterSpacing="tighter">
            Imobi<Text as="span" color="blue.400">Sys</Text>
          </Heading>
          <Text color="whiteAlpha.600" fontSize="sm">Gestão de ativos de alto padrão.</Text>
        </VStack>

        <Stack gap={4}>
          <Box position="relative">
            <Flex align="center" position="absolute" left={4} h="full" color="whiteAlpha.400" zIndex={2}>
              <LuMail size={18} />
            </Flex>
            <Input 
              placeholder="E-mail" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              bg="whiteAlpha.100" 
              border="none" 
              color="white"
              h="56px"
              pl="48px"
              _focus={{ bg: "whiteAlpha.200", ring: "2px", ringColor: "blue.500" }}
            />
          </Box>

          <Box position="relative">
            <Flex align="center" position="absolute" left={4} h="full" color="whiteAlpha.400" zIndex={2}>
              <LuLock size={18} />
            </Flex>
            <Input 
              type="password"
              placeholder="Senha" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              bg="whiteAlpha.100" 
              border="none" 
              color="white"
              h="56px"
              pl="48px"
              _focus={{ bg: "whiteAlpha.200", ring: "2px", ringColor: "blue.500" }}
            />
          </Box>

          <Button 
            type="submit"
            colorPalette="blue" 
            size="xl" 
            h="60px"
            borderRadius="xl"
            fontWeight="bold"
            mt={4}
            loading={isLoading}
            _hover={{ transform: "translateY(-2px)", boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }}
          >
            Acessar Painel <LuArrowRight style={{ marginLeft: "8px" }} />
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

// ✅ ESTA LINHA É A CHAVE PARA RESOLVER O ERRO TS(2322) NAS ROTAS:
export default LoginForm;