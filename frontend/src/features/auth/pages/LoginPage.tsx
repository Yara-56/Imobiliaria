"use client"

import { 
  Flex, Text, Stack, Heading, 
  Input, Button, VStack, Circle, Container
} from "@chakra-ui/react";
import { useState } from "react";
import { LuArrowRight, LuFingerprint, LuMail, LuLock } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toaster } from "@/components/ui/toaster";
import { InputGroup } from "@/components/ui/input-group";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const fakeUser: any = {
        id: "admin-id-yara",
        name: "Administradora Yara",
        email: email || "admin@admin.com",
        role: "admin",
        tenantId: "default",
        status: "ativo"
      };
      
      const fakeToken = "token-de-emergencia-liberado-v2026";
      
      // Salva no Contexto e LocalStorage
      login(fakeUser, fakeToken); 

      toaster.create({ title: "Acesso Liberado!", type: "success" });
      navigate("/admin/dashboard"); 
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="100vh" w="100vw" bg="#020617" align="center" justify="center" position="relative">
      <Circle size="600px" bg="blue.900" position="absolute" top="-150px" left="-150px" filter="blur(120px)" opacity="0.4" />
      <Container maxW="md" zIndex={1}>
        <Stack gap={8} p={10} bg="rgba(15, 23, 42, 0.8)" borderRadius="3xl" border="1px solid rgba(255,255,255,0.15)" backdropFilter="blur(12px)">
          <VStack gap={2}>
            <LuFingerprint size={48} color="#60A5FA" />
            <Heading size="2xl" color="white" fontWeight="900">Imobi<Text as="span" color="blue.400">Sys</Text></Heading>
          </VStack>
          <Stack gap={5}>
            <InputGroup startElement={<LuMail color="#94A3B8" />}>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" h="60px" bg="blackAlpha.500" color="white" borderRadius="15px" />
            </InputGroup>
            <InputGroup startElement={<LuLock color="#94A3B8" />}>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" h="60px" bg="blackAlpha.500" color="white" borderRadius="15px" />
            </InputGroup>
            <Button loading={isLoading} onClick={handleLogin} size="xl" h="65px" bg="blue.500" color="white" borderRadius="18px" fontWeight="900">
              ACESSAR PAINEL <LuArrowRight style={{ marginLeft: '10px' }} />
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Flex>
  );
}