import React, { useState } from "react";
import { 
  Box, Container, VStack, Heading, Text, Input, Button, 
  Link, HStack, Icon, Field, Center
} from "@chakra-ui/react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Lock, Mail, ArrowRight, Building2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/core/providers/AuthProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Erro na autenticação:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box 
      bg="gray.950" 
      minH="100vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center" 
      p={4} 
      position="relative" 
      overflow="hidden"
    >
      {/* Glow de fundo */}
      <Box 
        position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" 
        w="600px" h="600px" bgGradient="radial(blue.600/15, transparent 70%)" 
        filter="blur(80px)" zIndex={0} 
      />

      <Container maxW="md" zIndex={1}>
        <VStack gap={8} w="full">
          
          {/* Logo */}
          <VStack gap={3} textAlign="center">
            <Center bg="blue.500" p={3} borderRadius="2xl" shadow="0 0 20px rgba(49, 130, 206, 0.4)">
              <Icon as={Building2} boxSize={8} color="white" />
            </Center>
            <VStack gap={0}>
              <Heading size="3xl" fontWeight="black" color="white" letterSpacing="tight">
                Imobi<Text as="span" color="blue.500">Sys</Text>
              </Heading>
              <Text color="gray.500" fontWeight="medium">Acesse sua imobiliária</Text>
            </VStack>
          </VStack>

          <Box 
            w="full" p={{ base: 6, md: 10 }} 
            bg="whiteAlpha.50" 
            backdropFilter="blur(10px)" 
            borderRadius="3xl" 
            borderWidth="1px" 
            borderColor="whiteAlpha.100" 
            shadow="2xl"
          >
            <form onSubmit={handleLogin} style={{ width: "100%" }}>
              <VStack gap={6}>
                
                {/* E-mail */}
                <Field.Root>
                  <Field.Label color="gray.400" fontSize="xs" fontWeight="bold" textTransform="uppercase" mb={2}>
                    E-mail Profissional
                  </Field.Label>
                  <HStack 
                    w="full" bg="blackAlpha.400" borderRadius="xl" px={4} borderWidth="1px" 
                    borderColor="whiteAlpha.200" 
                    transition="all 0.2s"
                    _focusWithin={{ 
                      borderColor: "blue.500",
                      boxShadow: "0 0 0 1px var(--colors-blue-500)" 
                    }}
                  >
                    <Mail size={18} color="#4A5568" />
                    <Input 
                      placeholder="seu@email.com" 
                      h="50px"
                      color="white"
                      // Removido 'variant' completamente para evitar erros de tipo
                      // Reset manual de estilos:
                      border="none"
                      bg="transparent"
                      px={2}
                      _focus={{ outline: "none", boxShadow: "none" }}
                      _placeholder={{ color: "gray.600" }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </HStack>
                </Field.Root>

                {/* Senha */}
                <Field.Root>
                  <HStack justify="space-between" w="full" mb={2}>
                    <Field.Label color="gray.400" fontSize="xs" fontWeight="bold" textTransform="uppercase">
                      Senha
                    </Field.Label>
                    <Link asChild color="blue.400" fontSize="xs" fontWeight="semibold">
                      <RouterLink to="/forgot-password">Esqueceu a senha?</RouterLink>
                    </Link>
                  </HStack>
                  <HStack 
                    w="full" bg="blackAlpha.400" borderRadius="xl" px={4} borderWidth="1px" 
                    borderColor="whiteAlpha.200" 
                    transition="all 0.2s"
                    _focusWithin={{ 
                      borderColor: "blue.500",
                      boxShadow: "0 0 0 1px var(--colors-blue-500)" 
                    }}
                  >
                    <Lock size={18} color="#4A5568" />
                    <Input 
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••" 
                      h="50px"
                      color="white"
                      // Reset manual de estilos:
                      border="none"
                      bg="transparent"
                      px={2}
                      _focus={{ outline: "none", boxShadow: "none" }}
                      _placeholder={{ color: "gray.600" }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Icon 
                      as={showPassword ? EyeOff : Eye} 
                      cursor="pointer" 
                      color="gray.500" 
                      onClick={() => setShowPassword(!showPassword)} 
                    />
                  </HStack>
                </Field.Root>

                <Button 
                  type="submit" 
                  colorPalette="blue" 
                  size="lg" 
                  w="full" 
                  h="55px" 
                  borderRadius="xl" 
                  loading={isLoading}
                  _hover={{ transform: "translateY(-2px)", shadow: "0 10px 20px -10px rgba(49, 130, 206, 0.5)" }}
                  fontWeight="bold"
                >
                  Entrar no Sistema <ArrowRight size={18} style={{ marginLeft: '10px' }} />
                </Button>
              </VStack>
            </form>
          </Box>

          <Text color="gray.500" fontSize="sm">
            Novo por aqui?{" "}
            <Link asChild color="blue.400" fontWeight="bold">
              <RouterLink to="/register">Solicite acesso</RouterLink>
            </Link>
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}