"use client";

import { 
  Flex, Text, Stack, Heading, Input, Button, VStack, Box, SimpleGrid, Circle, Container 
} from "@chakra-ui/react";
import { useState } from "react";
import { LuArrowRight, LuFingerprint, LuMail, LuLock, LuShieldCheck, LuZap } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { toaster } from "@/components/ui/toaster";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState<"FREE" | "PRO">("FREE");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // 🎯 LOGIN CIRÚRGICO: Dados mockados para refletir um Admin de Imobiliária
      const userData = {
        id: "admin-id-yara",
        name: "Yara Oliveira",
        email: email || "admin@imobisys.com",
        role: "admin",
        tenantId: "default-tenant",
        status: "ativo",
        plan: plan,
        limits: plan === "FREE" 
          ? { tenants: 10, properties: 20 } 
          : { tenants: 9999, properties: 9999 }
      };

      const fakeToken = "token-secure-2026";

      // ✅ Autenticação no contexto global
      await login(userData as any, fakeToken); 

      toaster.create({ 
        title: `Bem-vinda, ${userData.name}!`, 
        description: `Painel de Gestão ${plan} ativado.`,
        type: "success" 
      });

      navigate("/admin/dashboard");
    } catch (error) {
      toaster.create({ title: "Erro ao acessar", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="100vh" w="100vw" bg="#020617" align="center" justify="center" position="relative" overflow="hidden">
      {/* Background Decorativo */}
      <Circle size="600px" bg="blue.900" position="absolute" top="-150px" left="-150px" filter="blur(120px)" opacity="0.4" />
      <Circle size="400px" bg="indigo.900" position="absolute" bottom="-100px" right="-100px" filter="blur(100px)" opacity="0.3" />
      
      <Container maxW="md" zIndex={1}>
        <Box 
          as="form"
          onSubmit={handleLogin}
          p={10} 
          bg="rgba(15, 23, 42, 0.8)" 
          borderRadius="3xl" 
          border="1px solid rgba(255,255,255,0.1)" 
          backdropFilter="blur(16px)"
          shadow="2xl"
        >
          <VStack gap={8} align="stretch">
            <VStack gap={2}>
              <LuFingerprint size={48} color="#60A5FA" />
              <Heading size="2xl" color="white" fontWeight="900" letterSpacing="-1px">
                Imobi<Text as="span" color="blue.400">Sys</Text>
              </Heading>
              <Text color="gray.400" fontSize="sm">Acesse sua carteira de imóveis</Text>
            </VStack>

            {/* SELETOR DE PLANOS */}
            <SimpleGrid columns={2} gap={4}>
              <PlanOption 
                active={plan === "FREE"} 
                onClick={() => setPlan("FREE")}
                icon={LuZap}
                label="Trial"
                desc="Básico"
              />
              <PlanOption 
                active={plan === "PRO"} 
                onClick={() => setPlan("PRO")}
                icon={LuShieldCheck}
                label="Pro"
                desc="Ilimitado"
              />
            </SimpleGrid>

            <Stack gap={4}>
              <Box position="relative">
                <Flex align="center" position="absolute" left={4} h="full" color="gray.500" zIndex={2}>
                  <LuMail size={20} />
                </Flex>
                <Input 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="E-mail profissional" 
                  h="60px" ps="52px" bg="whiteAlpha.50" border="1px solid" borderColor="whiteAlpha.200" color="white" borderRadius="xl" 
                  _focus={{ borderColor: "blue.500", bg: "whiteAlpha.100" }}
                />
              </Box>

              <Box position="relative">
                <Flex align="center" position="absolute" left={4} h="full" color="gray.500" zIndex={2}>
                  <LuLock size={20} />
                </Flex>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Senha" 
                  h="60px" ps="52px" bg="whiteAlpha.50" border="1px solid" borderColor="whiteAlpha.200" color="white" borderRadius="xl"
                  _focus={{ borderColor: "blue.500", bg: "whiteAlpha.100" }}
                />
              </Box>

              <Button 
                type="submit"
                loading={isLoading} 
                h="65px" 
                bg="blue.500" color="white" 
                borderRadius="xl" fontSize="md" fontWeight="900"
                _hover={{ bg: "blue.600", transform: "translateY(-2px)" }}
                transition="0.2s"
              >
                ENTRAR NO PAINEL <LuArrowRight style={{ marginLeft: '10px' }} />
              </Button>
            </Stack>
          </VStack>
        </Box>
      </Container>
    </Flex>
  );
}

function PlanOption({ active, onClick, icon: Icon, label, desc }: any) {
  return (
    <Box 
      onClick={onClick}
      cursor="pointer"
      p={4}
      borderRadius="2xl"
      border="2px solid"
      borderColor={active ? "blue.500" : "whiteAlpha.100"}
      bg={active ? "blue.900/40" : "blackAlpha.300"}
      transition="0.3s"
      _hover={{ borderColor: "blue.400" }}
    >
      <Icon color={active ? "#60A5FA" : "#475569"} size={22} />
      <Text color="white" fontWeight="bold" mt={2} fontSize="sm">{label}</Text>
      <Text color="gray.500" fontSize="10px" fontWeight="bold">{desc}</Text>
    </Box>
  );
}