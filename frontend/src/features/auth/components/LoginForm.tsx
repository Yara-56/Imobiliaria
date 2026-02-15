import { Box, Button, Field, Input, Stack, Heading, Text, VStack, Flex } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/core/context/AuthContext";
import { useNavigate } from "react-router-dom";
// Se o PasswordInput der erro, use o Input normal com type="password" por enquanto
import { toast } from "sonner"; 

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      // SIMULAÇÃO DE CHAMADA DE API (Substitua pela sua chamada axios depois)
      // No mundo real: const response = await api.post('/login', data);
      await new Promise(resolve => setTimeout(resolve, 1000)); 

      const mockUser = {
        id: "1",
        name: "Yara Ramos",
        email: data.email,
        role: "ADMIN" as const,
        tenant_id: "imobiliaria-vovo-123"
      };
      const mockToken = "token-jwt-gerado";

      // Agora passamos os dados que o seu NOVO AuthContext espera
      login(mockUser, mockToken);
      
      toast.success("Bem-vinda ao ImobiSys!");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error("Falha na autenticação. Verifique seus dados.");
    }
  };

  return (
    <Box w="full" maxW="md" p={8} borderWidth={1} borderRadius="2xl" boxShadow="lg" bg="white" color="gray.800">
      <VStack gap={6} align="stretch">
        <Stack gap={2} textAlign="center">
          <Heading size="xl" fontWeight="800">ImobiSys</Heading>
          <Text color="gray.500" fontSize="sm">Acesse sua plataforma imobiliária</Text>
        </Stack>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={5}>
            <Field.Root invalid={!!errors.email}>
              <Field.Label fontWeight="bold">E-mail</Field.Label>
              <Input
                type="email"
                placeholder="seu@email.com"
                {...register("email", { required: "E-mail obrigatório" })}
              />
              <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.password}>
              <Flex justify="space-between">
                <Field.Label fontWeight="bold">Senha</Field.Label>
              </Flex>
              <Input
                type="password"
                placeholder="********"
                {...register("password", { required: "Senha obrigatória" })}
              />
              <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
            </Field.Root>

            <Button type="submit" colorPalette="blue" size="lg" width="full" loading={isSubmitting}>
              Entrar
            </Button>
          </Stack>
        </form>
      </VStack>
    </Box>
  );
};