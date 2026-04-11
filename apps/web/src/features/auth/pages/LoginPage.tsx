"use client";

import {
  Flex,
  Text,
  Stack,
  Heading,
  Input,
  Button,
  VStack,
  Box,
  SimpleGrid,
  Container,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuArrowRight, LuMail, LuLock, LuShieldCheck, LuZap } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { toaster } from "@/components/ui/toaster.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState<"FREE" | "PRO">("FREE");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email } as any, "token");

      toaster.create({
        title: "Bem-vinda ao HomePlux 🚀",
        description: `Plano ${plan} ativo`,
        type: "success",
      });

      navigate("/admin/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)"
    >
      <Container maxW="md">
        <Box
          as="form"
          onSubmit={handleLogin}
          p={10}
          borderRadius="3xl"
          bg="rgba(255,255,255,0.8)"
          backdropFilter="blur(12px)"
          border="1px solid rgba(0,0,0,0.05)"
          boxShadow="0 20px 40px rgba(0,0,0,0.08)"
        >
          <VStack gap={8} align="stretch">

            {/* HEADER */}
            <VStack align="start" gap={2}>
              <Heading size="xl" fontWeight="900" color="gray.800">
                Home<Text as="span" color="blue.500">Plux</Text>
              </Heading>
              <Text color="gray.500" fontSize="sm">
                Gerencie seus imóveis com simplicidade
              </Text>
            </VStack>

            {/* PLANOS */}
            <SimpleGrid columns={2} gap={3}>
              <PlanOption
                active={plan === "FREE"}
                onClick={() => setPlan("FREE")}
                icon={LuZap}
                label="Trial"
              />
              <PlanOption
                active={plan === "PRO"}
                onClick={() => setPlan("PRO")}
                icon={LuShieldCheck}
                label="Pro"
              />
            </SimpleGrid>

            {/* INPUTS */}
            <Stack gap={4}>
              <ModernInput
                icon={LuMail}
                placeholder="E-mail"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
              />

              <ModernInput
                icon={LuLock}
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
              />

              {/* BOTÃO */}
              <Button
                type="submit"
                loading={loading}
                disabled={!email || !password}
                h="56px"
                borderRadius="xl"
                bg="blue.500"
                color="white"
                fontWeight="bold"
                transition="0.2s"
                _hover={{
                  bg: "blue.600",
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 20px rgba(59,130,246,0.3)",
                }}
                _active={{ transform: "scale(0.97)" }}
              >
                Entrar
                <LuArrowRight style={{ marginLeft: 8 }} />
              </Button>
            </Stack>
          </VStack>
        </Box>
      </Container>
    </Flex>
  );
}

/* INPUT MODERNO */
function ModernInput({ icon: Icon, ...props }: any) {
  return (
    <Box position="relative">
      <Box
        position="absolute"
        left="14px"
        top="50%"
        transform="translateY(-50%)"
        color="gray.400"
      >
        <Icon size={18} />
      </Box>

      <Input
        {...props}
        h="56px"
        pl="42px"
        borderRadius="xl"
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        transition="0.2s"
        _focus={{
          borderColor: "blue.400",
          boxShadow: "0 0 0 3px rgba(59,130,246,0.15)",
        }}
      />
    </Box>
  );
}

/* PLAN CARD */
function PlanOption({ active, onClick, icon: Icon, label }: any) {
  return (
    <Box
      onClick={onClick}
      cursor="pointer"
      p={4}
      borderRadius="xl"
      border="1px solid"
      borderColor={active ? "blue.500" : "gray.200"}
      bg={active ? "blue.50" : "white"}
      transition="0.2s"
      _hover={{
        borderColor: "blue.400",
        transform: "translateY(-2px)",
      }}
    >
      <Icon size={20} color={active ? "#3B82F6" : "#94A3B8"} />
      <Text mt={2} fontWeight="semibold" fontSize="sm">
        {label}
      </Text>
    </Box>
  );
}