"use client";

import {
  VStack,
  Heading,
  Text,
  Stack,
  Box,
  Input,
  Button,
  SimpleGrid,
  HStack,
  Icon,
} from "@chakra-ui/react";
import {
  LuMail,
  LuLock,
  LuArrowRight,
  LuZap,
  LuShieldCheck,
} from "react-icons/lu";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { toaster } from "@/components/ui/toaster";

type PlanType = "FREE" | "PRO";

type Errors = {
  email: string;
  password: string;
};

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState<PlanType>("FREE");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<Errors>({
    email: "",
    password: "",
  });

  const validate = (): boolean => {
    const newErrors: Errors = { email: "", password: "" };
    let valid = true;

    if (!email) {
      newErrors.email = "E-mail é obrigatório";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Formato de e-mail inválido";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Senha é obrigatória";
      valid = false;
    } else if (password.length < 4) {
      newErrors.password = "Mínimo de 4 caracteres";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const userData = {
        id: "admin-yara-2026",
        name: "Yara Oliveira",
        email,
        role: "ADMIN",
        tenantId: "imobi-root",
        plan,
        limits:
          plan === "FREE"
            ? { tenants: 10, properties: 20 }
            : { tenants: 9999, properties: 9999 },
      };

      await login(userData as any, "token-fake-2026");

      toaster.create({
        title: "Login realizado com sucesso",
        description: `Plano ${plan} ativo`,
        type: "success",
      });

      navigate("/admin/dashboard");
    } catch {
      toaster.create({
        title: "Erro ao entrar",
        description: "Verifique suas credenciais",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      w="full"
      maxW="420px"
      p={10}
      bg="white"
      borderRadius="3xl"
      border="1px solid"
      borderColor="gray.100"
      boxShadow="0 10px 30px rgba(0,0,0,0.04)"
    >
      <form onSubmit={handleLogin}>
        <VStack align="stretch" gap={8}>
          {/* HEADER */}
          <VStack align="start" gap={1}>
            <Heading size="xl" fontWeight="900" color="gray.800">
              Imobi<Text as="span" color="blue.500">Sys</Text>
            </Heading>
            <Text color="gray.500" fontSize="sm">
              Acesse seu painel de gestão
            </Text>
          </VStack>

          {/* PLANOS */}
          <SimpleGrid columns={2} gap={4}>
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
            <InputField
              icon={LuMail}
              placeholder="E-mail profissional"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            <InputField
              icon={LuLock}
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            {/* BOTÃO */}
            <Button
              type="submit"
              h="60px"
              bg="blue.500"
              color="white"
              borderRadius="xl"
              fontWeight="bold"
              loading={loading}
              disabled={!email || !password || loading}
              _hover={{ bg: "blue.600" }}
              _active={{ transform: "scale(0.98)" }}
            >
              {loading ? "Entrando..." : "Entrar"}
              {!loading && <LuArrowRight style={{ marginLeft: 8 }} />}
            </Button>
          </Stack>
        </VStack>
      </form>
    </Box>
  );
};



// 🔹 INPUT COMPONENT (100% compatível com Chakra v3)
type InputFieldProps = {
  icon: React.ElementType;
  error?: string;
} & Omit<React.ComponentProps<typeof Input>, "size">;

function InputField({ icon: IconEl, error, ...props }: InputFieldProps) {
  return (
    <Box>
      <HStack
        bg="gray.50"
        borderRadius="xl"
        border="1px solid"
        borderColor={error ? "red.300" : "gray.100"}
        px={4}
        h="60px"
        transition="0.2s"
        _focusWithin={{
          borderColor: error ? "red.400" : "blue.400",
          bg: "white",
        }}
      >
        <Icon as={IconEl} color="gray.400" boxSize={5} />
        <Input
          variant="subtle" // ✅ corrigido
          px={0}
          fontSize="sm"
          _focus={{ boxShadow: "none" }}
          _placeholder={{ color: "gray.400" }}
          {...props}
        />
      </HStack>

      {error && (
        <Text color="red.400" fontSize="xs" mt={1}>
          {error}
        </Text>
      )}
    </Box>
  );
}



// 🔹 PLAN OPTION
type PlanOptionProps = {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
};

function PlanOption({ active, onClick, icon: IconEl, label }: PlanOptionProps) {
  return (
    <Box
      onClick={onClick}
      cursor="pointer"
      p={4}
      borderRadius="2xl"
      border="2px solid"
      borderColor={active ? "blue.500" : "gray.100"}
      bg={active ? "blue.50" : "white"}
      transition="0.2s"
      _hover={{ borderColor: "blue.400" }}
      _active={{ transform: "scale(0.98)" }}
    >
      <IconEl
        size={20}
        color={active ? "#3B82F6" : "#94A3B8"}
      />
      <Text mt={2} fontWeight="bold" color="gray.700" fontSize="sm">
        {label}
      </Text>
    </Box>
  );
}