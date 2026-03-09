"use client";

import {
  Stack,
  Input,
  Button,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Separator,
  Center,
  Span,
  NativeSelect,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { LuBadgeCheck, LuUser, LuWallet } from "react-icons/lu";
import { Field } from "@/components/ui/field";
import type { CreateTenantDTO } from "../types/tenant.types";

interface TenantFormProps {
  onSubmit: (data: CreateTenantDTO) => void;
  isLoading: boolean;
}

export default function TenantForm({ onSubmit, isLoading }: TenantFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTenantDTO>();

  const inputStyle = {
    h: "56px",
    borderRadius: "xl",
    bg: "gray.50",
    border: "1px solid",
    borderColor: "gray.200",
    color: "gray.700",
    fontSize: "sm",
    _focus: {
      bg: "white",
      borderColor: "blue.500",
      shadow: "0 0 0 3px rgba(59,130,246,0.1)",
    },
    _placeholder: { color: "gray.400" },
    _invalid: { borderColor: "red.400", bg: "red.50" },
  };

  const fieldLabel = (text: string) => (
    <Span color="gray.500" fontWeight="bold" fontSize="xs" letterSpacing="wide">
      {text}
    </Span>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
      <Stack gap={10}>

        {/* ── DADOS PESSOAIS ─────────────────────────── */}
        <VStack align="start" gap={5}>
          <HStack gap={3}>
            <Center bg="blue.50" w="10" h="10" borderRadius="xl" color="blue.600">
              <LuUser size={18} />
            </Center>
            <Text fontWeight="black" fontSize="xs" letterSpacing="widest" color="gray.400">
              DADOS PESSOAIS
            </Text>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={5} w="full">
            <Field
              label={fieldLabel("Nome Completo")}
              invalid={!!errors.fullName}
              errorText="O nome é obrigatório"
            >
              <Input
                {...register("fullName", { required: true })}
                placeholder="Ex: João Silva"
                {...inputStyle}
              />
            </Field>

            <Field
              label={fieldLabel("CPF / CNPJ")}
              invalid={!!errors.document}
              errorText="Documento é obrigatório"
            >
              <Input
                {...register("document", { required: true })}
                placeholder="000.000.000-00"
                {...inputStyle}
              />
            </Field>

            <Field
              label={fieldLabel("E-mail")}
              invalid={!!errors.email}
              errorText="E-mail inválido"
            >
              <Input
                {...register("email", {
                  required: true,
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "E-mail inválido",
                  },
                })}
                type="email"
                placeholder="joao@email.com"
                {...inputStyle}
              />
            </Field>

            <Field label={fieldLabel("Telefone")}>
              <Input
                {...register("phone")}
                placeholder="(11) 99999-9999"
                {...inputStyle}
              />
            </Field>
          </SimpleGrid>
        </VStack>

        <Separator opacity={0.2} />

        {/* ── FINANCEIRO ─────────────────────────────── */}
        <VStack align="start" gap={5}>
          <HStack gap={3}>
            <Center bg="green.50" w="10" h="10" borderRadius="xl" color="green.600">
              <LuWallet size={18} />
            </Center>
            <Text fontWeight="black" fontSize="xs" letterSpacing="widest" color="gray.400">
              FINANCEIRO
            </Text>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={5} w="full">
            <Field
              label={fieldLabel("Valor do Aluguel")}
              invalid={!!errors.rentValue}
              errorText="Valor é obrigatório"
            >
              <Input
                {...register("rentValue", { required: true, valueAsNumber: true })}
                type="number"
                placeholder="0.00"
                {...inputStyle}
              />
            </Field>

            <Field label={fieldLabel("Método de Pagamento")}>
              <NativeSelect.Root {...inputStyle}>
                <NativeSelect.Field
                  {...register("preferredPaymentMethod")}
                  bg="transparent"
                  border="none"
                  h="full"
                >
                  <option value="PIX">PIX Automático</option>
                  <option value="BOLETO">Boleto Bancário</option>
                  <option value="CARTAO_RECORRENTE">Cartão Recorrente</option>
                  <option value="DINHEIRO">Dinheiro</option>
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Field>

            <Field label={fieldLabel("Dia de Vencimento")}>
              <Input
                {...register("billingDay", { valueAsNumber: true })}
                type="number"
                placeholder="Ex: 10"
                min={1}
                max={31}
                {...inputStyle}
              />
            </Field>

            <Field label={fieldLabel("Plano")}>
              <NativeSelect.Root {...inputStyle}>
                <NativeSelect.Field
                  {...register("plan")}
                  bg="transparent"
                  border="none"
                  h="full"
                >
                  <option value="BASIC">Básico</option>
                  <option value="PRO">Pro</option>
                  <option value="ENTERPRISE">Enterprise</option>
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Field>
          </SimpleGrid>
        </VStack>

        {/* ── SUBMIT ─────────────────────────────────── */}
        <Button
          type="submit"
          loading={isLoading}
          loadingText="Salvando..."
          bg="blue.600"
          color="white"
          h="64px"
          borderRadius="2xl"
          fontSize="sm"
          fontWeight="bold"
          letterSpacing="wide"
          _hover={{ bg: "blue.700", transform: "translateY(-1px)", shadow: "md" }}
          _active={{ transform: "translateY(0)" }}
          transition="all 0.15s ease"
        >
          <LuBadgeCheck style={{ marginRight: "10px" }} size={20} />
          FINALIZAR CADASTRO
        </Button>

      </Stack>
    </form>
  );
}
