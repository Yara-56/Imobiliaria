"use client"

import { VStack, Heading, Text, Stack, Box, Flex, Input, Button } from "@chakra-ui/react";
import { LuMail, LuLock, LuArrowRight } from "react-icons/lu";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toaster } from "@/components/ui/toaster";

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@imobisys.com" && password === "123456") {
      login({ id: "1", name: "Yara", email, role: "ADMIN" }, "token-fake");
      toaster.create({ title: "Acesso liberado!", type: "success" });
      navigate("/admin/dashboard");
    } else {
      toaster.create({ title: "Erro", description: "Dados inválidos", type: "error" });
    }
  };

  return (
    <Box 
      w="full" 
      maxW="400px" 
      p={10} 
      bg="gray.900" 
      borderRadius="3xl" 
      border="1px solid" 
      borderColor="whiteAlpha.100"
      shadow="2xl"
    >
      <form onSubmit={handleLogin}>
        <VStack align="start" gap={6}>
          <VStack align="start" gap={1}>
            <Heading size="xl" color="white" letterSpacing="tight">Acessar Painel</Heading>
            <Text color="gray.500" fontSize="sm">Digite suas credenciais de administrador.</Text>
          </VStack>

          <Stack gap={4} w="full">
            <Box position="relative">
              <Flex align="center" position="absolute" left={4} h="full" color="gray.600">
                <LuMail size={20} />
              </Flex>
              <Input 
                placeholder="E-mail" 
                h="56px" pl="48px" bg="whiteAlpha.50" border="none" color="white"
                _focus={{ bg: "whiteAlpha.100", ring: "2px", ringColor: "blue.500" }}
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </Box>

            <Box position="relative">
              <Flex align="center" position="absolute" left={4} h="full" color="gray.600">
                <LuLock size={20} />
              </Flex>
              <Input 
                type="password" placeholder="Senha" 
                h="56px" pl="48px" bg="whiteAlpha.50" border="none" color="white"
                _focus={{ bg: "whiteAlpha.100", ring: "2px", ringColor: "blue.500" }}
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </Box>

            <Button 
              type="submit" h="60px" colorPalette="blue" borderRadius="xl" fontSize="md" fontWeight="bold"
            >
              Entrar no Sistema <LuArrowRight style={{ marginLeft: '8px' }} />
            </Button>
          </Stack>
        </VStack>
      </form>
    </Box>
  );
};