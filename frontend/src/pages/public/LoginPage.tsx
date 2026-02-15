import React, { useState } from "react";
import { 
  Box, Container, VStack, Heading, Text, Input, Button, 
  Field, Link, HStack, Icon, Image, useToast 
} from "@chakra-ui/react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Lock, Mail, ArrowRight, Building2 } from "lucide-react";
import { useAuth } from "@/core/providers/AuthProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // Usando seu contexto de autenticação
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Integração com sua lógica de autenticação do projeto
      await login(email, password);
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Erro ao entrar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box bg="gray.950" minH="100vh" display="flex" alignItems="center" justifyContent="center" p={4}>
      {/* Efeito de luz de fundo similar à HomePage */}
      <Box 
        position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)"
        w="600px" h="600px" bgGradient="radial(blue.500/10, transparent 70%)" 
        filter="blur(80px)" zIndex={0}
      />

      <Container maxW="md" zIndex={1}>
        <VStack spacing={8} w="full">
          {/* Logo e Título */}
          <VStack spacing={2} textAlign="center">
            <Icon as={Building2} boxSize={10} color="blue.500" />
            <Heading size="2xl" fontWeight="black" color="white">
              Imobi<Text as="span" color="blue.500">Sys</Text>
            </Heading>
            <Text color="gray.400">Entre para gerenciar sua imobiliária</Text>
          </VStack>

          {/* Card de Login */}
          <Box 
            w="full" p={8} bg="gray.900" borderRadius="3xl" 
            border="1px solid" borderColor="whiteAlpha.100" shadow="2xl"
          >
            <form onSubmit={handleLogin} style={{ width: "100%" }}>
              <VStack spacing={5}>
                {/* Campo de Email */}
                <Box w="full">
                  <Text mb={2} fontSize="sm" fontWeight="medium" color="gray.300">E-mail Profissional</Text>
                  <HStack bg="whiteAlpha.50" borderRadius="xl" px={4} border="1px solid" borderColor="whiteAlpha.100" _focusWithin={{ borderColor: "blue.500" }}>
                    <Mail size={18} color="#64748b" />
                    <Input 
                      type="email" 
                      placeholder="exemplo@imobiliaria.com" 
                      variant="unstyled" 
                      h="50px"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </HStack>
                </Box>

                {/* Campo de Senha */}
                <Box w="full">
                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.300">Senha</Text>
                    <Link as={RouterLink} to="/forgot-password" fontSize="xs" color="blue.400">Esqueceu a senha?</Link>
                  </HStack>
                  <HStack bg="whiteAlpha.50" borderRadius="xl" px={4} border="1px solid" borderColor="whiteAlpha.100" _focusWithin={{ borderColor: "blue.500" }}>
                    <Lock size={18} color="#64748b" />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      variant="unstyled" 
                      h="50px"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </HStack>
                </Box>

                <Button 
                  type="submit" 
                  colorPalette="blue" 
                  size="lg" 
                  w="full" 
                  h="55px" 
                  borderRadius="xl"
                  loading={isLoading}
                  _hover={{ transform: "translateY(-2px)" }}
                  transition="all 0.2s"
                >
                  Entrar no Sistema <ArrowRight size={18} style={{ marginLeft: '10px' }} />
                </Button>
              </VStack>
            </form>
          </Box>

          {/* Footer do Login */}
          <Text color="gray.500" fontSize="sm">
            Não tem uma conta?{" "}
            <Link as={RouterLink} to="/register" color="blue.400" fontWeight="bold">
              Solicite acesso agora
            </Link>
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}