"use client";

import { VStack, Heading, Text, Stack, Box, Flex, Input, Button, SimpleGrid } from "@chakra-ui/react";
import { LuMail, LuLock, LuArrowRight, LuZap, LuShieldCheck } from "react-icons/lu";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { toaster } from "@/components/ui/toaster";

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState<"FREE" | "PRO">("FREE"); // Lógica de planos integrada
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulando autenticação com a lógica de planos cirúrgica
      const userData = {
        id: "admin-yara-2026",
        name: "Yara Oliveira",
        email: email || "admin@imobisys.com",
        role: "ADMIN",
        tenantId: "imobi-root",
        plan: plan, // FREE ou PRO
        limits: plan === "FREE" 
          ? { tenants: 10, properties: 20 } 
          : { tenants: 9999, properties: 9999 }
      };

      // Chama o login do seu Context
      await login(userData as any, "token-fake-2026");

      toaster.create({ 
        title: "Acesso liberado!", 
        description: `Plano ${plan} ativado.`,
        type: "success" 
      });
      
      navigate("/admin/dashboard");
    } catch (err) {
      toaster.create({ title: "Erro ao entrar", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      w="full"
      maxW="450px"
      p={10}
      bg="rgba(15, 23, 42, 0.9)" // Glassmorphism escuro
      borderRadius="3xl"
      border="1px solid"
      borderColor="whiteAlpha.200"
      shadow="2xl"
      backdropFilter="blur(16px)"
    >
      <form onSubmit={handleLogin}>
        <VStack align="start" gap={8}>
          <VStack align="start" gap={1}>
            <Heading size="2xl" color="white" fontWeight="900" letterSpacing="tight">
              Imobi<Text as="span" color="blue.400">Sys</Text>
            </Heading>
            <Text color="gray.400" fontSize="sm">
              Selecione o plano e entre na sua conta.
            </Text>
          </VStack>

          {/* SELETOR DE PLANOS INTEGRADO NO FORM */}
          <SimpleGrid columns={2} gap={4} w="full">
            <PlanOption 
              active={plan === "FREE"} 
              onClick={() => setPlan("FREE")}
              icon={LuZap}
              label="Trial"
              desc="10 Inq / 20 Imov"
            />
            <PlanOption 
              active={plan === "PRO"} 
              onClick={() => setPlan("PRO")}
              icon={LuShieldCheck}
              label="Pro"
              desc="Ilimitado"
            />
          </SimpleGrid>

          <Stack gap={4} w="full">
            <Box position="relative">
              <Flex align="center" position="absolute" left={4} h="full" color="gray.500" zIndex={2}>
                <LuMail size={20} />
              </Flex>
              <Input
                placeholder="E-mail"
                h="60px"
                pl="52px"
                bg="whiteAlpha.50"
                border="1px solid"
                borderColor="whiteAlpha.100"
                color="white"
                borderRadius="xl"
                _focus={{ borderColor: "blue.500", bg: "whiteAlpha.100" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Box>

            <Box position="relative">
              <Flex align="center" position="absolute" left={4} h="full" color="gray.500" zIndex={2}>
                <LuLock size={20} />
              </Flex>
              <Input
                type="password"
                placeholder="Senha"
                h="60px"
                pl="52px"
                bg="whiteAlpha.50"
                border="1px solid"
                borderColor="whiteAlpha.100"
                color="white"
                borderRadius="xl"
                _focus={{ borderColor: "blue.500", bg: "whiteAlpha.100" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Box>

            <Button
              type="submit"
              h="65px"
              bg="blue.500"
              color="white"
              borderRadius="xl"
              fontSize="md"
              fontWeight="900"
              loading={isLoading}
              _hover={{ bg: "blue.600", transform: "translateY(-2px)" }}
              transition="0.2s"
            >
              ENTRAR COMO {plan} <LuArrowRight style={{ marginLeft: "10px" }} />
            </Button>
          </Stack>
        </VStack>
      </form>
    </Box>
  );
};

function PlanOption({ active, onClick, icon: Icon, label, desc }: any) {
  return (
    <Box 
      onClick={onClick}
      cursor="pointer"
      p={4}
      borderRadius="2xl"
      border="2px solid"
      borderColor={active ? "blue.500" : "whiteAlpha.100"}
      bg={active ? "blue.900/40" : "blackAlpha.200"}
      transition="0.3s"
      _hover={{ borderColor: "blue.400" }}
    >
      <Icon color={active ? "#60A5FA" : "#475569"} size={22} />
      <Text color="white" fontWeight="bold" mt={2} fontSize="sm">{label}</Text>
      <Text color="gray.500" fontSize="10px">{desc}</Text>
    </Box>
  );
}