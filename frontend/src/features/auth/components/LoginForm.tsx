import { 
    Box, 
    Button, 
    Heading, 
    Input, 
    Stack, 
    Text, 
    VStack,
    Field
  } from "@chakra-ui/react";
  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  // ✅ Corrigindo imports para caminhos relativos
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
        // Simulação de delay de rede
        await new Promise((resolve) => setTimeout(resolve, 800));
  
        // ✅ Credenciais liberadas para você testar rápido
        // Dica: Se quiser entrar com QUALQUER coisa, tire o "if" e deixe só o login(...)
        if (email === "admin@imobisys.com" && password === "123456") {
          login({
            id: "1",
            name: "Yara Administradora",
            email: email,
            role: "ADMIN",
          }, "token-fake-123");
  
          toaster.create({
            title: "Bem-vindo!",
            description: "Login realizado com sucesso.",
            type: "success",
          });
  
          navigate("/admin/dashboard");
        } else {
          throw new Error("Usuário ou senha inválidos");
        }
      } catch (error: any) {
        toaster.create({
          title: "Erro no Login",
          description: error.message || "Verifique suas credenciais.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <Box 
        w="full" 
        maxW="md" 
        p={8} 
        borderWidth="1px" 
        borderRadius="2xl" 
        shadow="xl" 
        bg="white"
      >
        <form onSubmit={handleSubmit}>
          <Stack gap={6}>
            <VStack align="start" gap={1}>
              <Heading size="xl" fontWeight="black" color="blue.600">ImobiSys</Heading>
              <Text color="gray.500">Gestão imobiliária simplificada</Text>
            </VStack>
  
            <Stack gap={4}>
              <Field.Root>
                <Field.Label fontWeight="bold">E-mail</Field.Label>
                <Input 
                  type="email" 
                  placeholder="admin@imobisys.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field.Root>
  
              <Field.Root>
                <Field.Label fontWeight="bold">Senha</Field.Label>
                <Input 
                  type="password" 
                  placeholder="123456"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field.Root>
            </Stack>
  
            <Button 
              type="submit" 
              variant="solid"
              colorPalette="blue" 
              size="lg" 
              loading={isLoading}
              w="full"
              fontWeight="bold"
            >
              Acessar Painel
            </Button>
          </Stack>
        </form>
      </Box>
    );
  };
  
  export default LoginForm;