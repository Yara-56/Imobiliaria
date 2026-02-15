import React, { useState } from "react";
import { 
  Box, VStack, Heading, Text, Input, Button, Center, 
  Icon, Container, InputElement, Group, Float, HStack 
} from "@chakra-ui/react";
import { Eye, EyeOff, Lock, Mail, Zap } from "lucide-react";
import { useAuth } from "@/core/contexts/AuthContext";
import { toast } from "sonner";

export default function LoginPage() {
  const { login } = useAuth(); // Sincronizado com o seu AuthContext
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.warning("Segurança ImobiSys: Preencha todos os campos.");
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
    } catch (error) {
      // O erro já é disparado via toast dentro do AuthContext
      console.error("Falha na autenticação:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Center h="100vh" bg="gray.950" position="relative" overflow="hidden">
      {/* Camadas de profundidade visual (Glows Atmosféricos) */}
      <Box 
        position="absolute" top="-15%" left="-5%" w="800px" h="800px" 
        bgGradient="radial(blue.600/10, transparent 70%)" filter="blur(120px)" borderRadius="full" 
      />
      <Box 
        position="absolute" bottom="-20%" right="-5%" w="700px" h="700px" 
        bgGradient="radial(purple.600/10, transparent 70%)" filter="blur(120px)" borderRadius="full" 
      />

      <Container maxW="md" zIndex={1}>
        <VStack 
          as="form" onSubmit={handleLogin}
          p={12} gap={8} borderRadius="50px"
          bg="rgba(10, 10, 10, 0.7)"
          border="1px solid" borderColor="whiteAlpha.100"
          backdropFilter="blur(40px)"
          boxShadow="0 40px 100px -20px rgba(0, 0, 0, 0.8)"
          _hover={{ borderColor: "whiteAlpha.300" }}
          transition="all 0.5s ease"
        >
          {/* Badge de Segurança (Corrigido com asChild) */}
          <HStack 
            bg="blue.500/10" px={4} py={1} borderRadius="full" 
            border="1px solid" borderColor="blue.500/30" gap={2}
          >
            <Icon asChild color="blue.400">
              <Zap size={12} fill="currentColor" />
            </Icon>
            <Text fontSize="10px" fontWeight="black" color="blue.400" letterSpacing="0.2em">
              ACESSO PROTEGIDO
            </Text>
          </HStack>

          {/* Header de Branding */}
          <VStack gap={0}>
            <Heading 
              size="4xl" letterSpacing="tighter" fontWeight="900" 
              bgGradient="to-b" gradientFrom="white" gradientTo="gray.500" bgClip="text"
            >
              IMOBI<Text as="span" color="blue.500">SYS</Text>
            </Heading>
            <Text color="gray.500" fontSize="xs" fontWeight="bold" letterSpacing="widest">
              MANAGEMENT & SECURITY
            </Text>
          </VStack>

          <VStack w="full" gap={6}>
            {/* Campo E-mail */}
            <Box w="full">
              <Group w="full">
                <InputElement pointerEvents="none" ml={2}>
                  <Mail size={20} color="#3182ce" />
                </InputElement>
                <Input 
                  placeholder="E-mail de acesso"
                  color="white" // Garante texto branco no tema escuro
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  bg="gray.950" 
                  _placeholder={{ color: "gray.700" }}
                  border="1px solid" borderColor="whiteAlpha.200"
                  _focus={{ borderColor: "blue.500", ring: "4px", ringColor: "blue.500/10" }}
                  h="65px" borderRadius="24px" pl="52px"
                />
              </Group>
            </Box>

            {/* Campo Senha */}
            <Box w="full">
              <Group w="full">
                <InputElement pointerEvents="none" ml={2}>
                  <Lock size={20} color="#3182ce" />
                </InputElement>
                <Input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Chave mestre"
                  color="white" // Garante texto branco no tema escuro
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  bg="gray.950" 
                  _placeholder={{ color: "gray.700" }}
                  border="1px solid" borderColor="whiteAlpha.200"
                  _focus={{ borderColor: "blue.500", ring: "4px", ringColor: "blue.500/10" }}
                  h="65px" borderRadius="24px" pl="52px"
                />
                <Float placement="middle-end" mr={4}>
                  <Icon 
                    asChild cursor="pointer" color="gray.600" _hover={{ color: "white" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </Icon>
                </Float>
              </Group>
              <Text fontSize="xs" color="blue.500" mt={4} textAlign="right" fontWeight="black" cursor="pointer">
                RECUPERAR ACESSO
              </Text>
            </Box>

            {/* Botão de Autenticação Brutalista */}
            <Button 
              type="submit" w="full" bg="blue.600" color="white"
              h="65px" borderRadius="24px" fontWeight="black" fontSize="lg"
              loading={isLoading}
              _hover={{ bg: "blue.500", transform: "translateY(-2px)", boxShadow: "0 20px 40px -10px rgba(49, 130, 206, 0.5)" }}
              transition="all 0.3s"
            >
              AUTENTICAR
            </Button>
          </VStack>

          <Text fontSize="9px" color="gray.800" fontWeight="bold" letterSpacing="0.3em">
            © 2026 FUNDAÇÃO SÃO FRANCISCO XAVIER
          </Text>
        </VStack>
      </Container>
    </Center>
  );
}