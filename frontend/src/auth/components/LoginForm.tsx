import { Box, Button, Input, Stack, Heading, Text, VStack, Field } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/core/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; 
import { UserRole } from "@/core/constants/roles"; // Importe o tipo aqui

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      // ✅ INTEGRAÇÃO COM SEU BACKEND
      // Substitua a URL pela rota real do seu backend (ex: http://localhost:3333/sessions)
      const response = await fetch("http://seu-backend.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error("Credenciais inválidas");

      const { user, token } = await response.json();

      // ✅ CORREÇÃO DO ERRO ts(2345):
      // Forçamos o TypeScript a entender que o role vindo do banco é um UserRole válido
      const validatedUser = {
        ...user,
        role: user.role as UserRole 
      };

      signIn(validatedUser, token);
      
      toast.success(`Bem-vinda, ${user.name}!`);
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error("Falha na autenticação. Verifique seu e-mail e senha.");
    }
  };

  return (
    <Box w="full" maxW="md" p={8} borderWidth={1} borderRadius="2xl" boxShadow="lg" bg="white" color="gray.800">
      <VStack gap={6} align="stretch">
        <Stack gap={2} textAlign="center">
          <Heading size="xl" fontWeight="800" color="blue.600">ImobiSys</Heading>
          <Text color="gray.500">Conectando ao seu Backend</Text>
        </Stack>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={5}>
            <Field.Root invalid={!!errors.email}>
              <Field.Label fontWeight="bold">E-mail</Field.Label>
              <Input
                type="email"
                {...register("email", { required: "E-mail é obrigatório" })}
              />
              {errors.email && <Field.HelperText color="red.500">{errors.email.message}</Field.HelperText>}
            </Field.Root>

            <Field.Root invalid={!!errors.password}>
              <Field.Label fontWeight="bold">Senha</Field.Label>
              <Input
                type="password"
                {...register("password", { required: "Senha é obrigatória" })}
              />
              {errors.password && <Field.HelperText color="red.500">{errors.password.message}</Field.HelperText>}
            </Field.Root>

            <Button 
              type="submit" 
              colorPalette="blue" 
              size="lg" 
              width="full" 
              loading={isSubmitting}
            >
              Entrar no Sistema
            </Button>
          </Stack>
        </form>
      </VStack>
    </Box>
  );
};