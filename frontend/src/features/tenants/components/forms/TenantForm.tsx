"use client";

import {
  Stack, Button, SimpleGrid, Text, VStack, HStack, Separator, Center, Input,
  NativeSelectRoot, NativeSelectField, Box
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { 
  LuBadgeCheck, LuUser, LuWallet, LuMail, 
  LuPhone, LuFileDigit, LuCalendar, LuShieldCheck 
} from "react-icons/lu";

import { Field } from "@/components/ui/field";
import { useMaskedInput } from "../../../../hooks/useMaskedInput";
import { parseCurrencyToNumber } from "@/core/utils/masks";
import type { CreateTenantDTO } from "../../types/tenant.types";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  document: string;
  rentValue: string; 
  billingDay: number;
  preferredPaymentMethod: string;
  plan: string;
};

interface TenantFormProps {
  onSubmit: (data: CreateTenantDTO) => void;
  isLoading: boolean;
  initialData?: any;
}

export default function TenantForm({ onSubmit, isLoading, initialData }: TenantFormProps) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: initialData || {
      fullName: "", email: "", phone: "", document: "",
      rentValue: "", billingDay: 1, preferredPaymentMethod: "PIX", plan: "BASIC",
    },
  });

  const { handleMask } = useMaskedInput<FormData>({ setValue });

  const onSubmitForm = (data: FormData) => {
    onSubmit({
      ...data,
      rentValue: parseCurrencyToNumber(data.rentValue),
      billingDay: Number(data.billingDay),
      preferredPaymentMethod: data.preferredPaymentMethod as any,
      plan: data.plan as any,
    });
  };

  const Label = ({ icon: Icon, text }: { icon: any, text: string }) => (
    <HStack gap={2} mb={1} color="gray.500">
      <Icon size={14} />
      <Text fontSize="xs" fontWeight="bold" letterSpacing="widest">{text.toUpperCase()}</Text>
    </HStack>
  );

  const fieldStyle = {
    bg: "gray.50",
    borderWidth: "1px",
    borderColor: "gray.100",
    borderRadius: "xl",
    h: "55px",
    fontSize: "md",
    color: "gray.700",
    _focus: {
      bg: "white",
      borderColor: "blue.500",
      boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)"
    },
    _hover: {
      borderColor: "gray.300"
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <Stack gap={10}>
        
        {/* SEÇÃO: IDENTIFICAÇÃO */}
        <VStack align="start" gap={6}>
          <HStack gap={3} w="full">
            <Center bg="blue.50" color="blue.600" p={3} borderRadius="xl">
              <LuShieldCheck size={20} />
            </Center>
            <Box>
              <Text fontWeight="900" fontSize="md" color="gray.800">Identificação do Inquilino</Text>
              <Text fontSize="xs" color="gray.400">Dados fundamentais para o registro no cluster</Text>
            </Box>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="full">
            <Field label={<Label icon={LuUser} text="Nome Completo" />} invalid={!!errors.fullName} errorText="Nome é obrigatório">
              <Input {...fieldStyle} placeholder="Ex: João Silva" {...register("fullName", { required: true })} />
            </Field>

            <Field label={<Label icon={LuFileDigit} text="Documento (CPF/CNPJ)" />} invalid={!!errors.document} errorText="Documento obrigatório">
              <Input {...fieldStyle} placeholder="000.000.000-00" {...register("document", { required: true })} onChange={handleMask("document", "document")} />
            </Field>

            <Field label={<Label icon={LuMail} text="E-mail Principal" />} invalid={!!errors.email} errorText="E-mail inválido">
              <Input {...fieldStyle} type="email" placeholder="email@exemplo.com" {...register("email", { required: true })} />
            </Field>

            <Field label={<Label icon={LuPhone} text="Telefone de Contato" />}>
              <Input {...fieldStyle} placeholder="(00) 00000-0000" {...register("phone")} onChange={handleMask("phone", "phone")} />
            </Field>
          </SimpleGrid>
        </VStack>

        <Separator opacity={0.5} />

        {/* SEÇÃO: FINANCEIRO */}
        <VStack align="start" gap={6}>
          <HStack gap={3} w="full">
            <Center bg="green.50" color="green.600" p={3} borderRadius="xl">
              <LuWallet size={20} />
            </Center>
            <Box>
              <Text fontWeight="900" fontSize="md" color="gray.800">Parâmetros de Cobrança</Text>
              <Text fontSize="xs" color="gray.400">Configuração financeira e de pagamento</Text>
            </Box>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="full">
            <Field label={<Label icon={LuWallet} text="Valor do Aluguel" />} invalid={!!errors.rentValue} errorText="Valor obrigatório">
              <Input {...fieldStyle} fontWeight="black" color="green.700" placeholder="R$ 0,00" {...register("rentValue", { required: true })} onChange={handleMask("rentValue", "currency")} />
            </Field>

            <Field label={<Label icon={LuBadgeCheck} text="Método de Pagamento" />}>
              <NativeSelectRoot size="lg">
                <NativeSelectField 
                  {...fieldStyle}
                  {...register("preferredPaymentMethod")}
                >
                  <option value="PIX">PIX (Instantâneo)</option>
                  <option value="BOLETO">Boleto Bancário</option>
                  <option value="CARTAO">Cartão de Crédito</option>
                </NativeSelectField>
              </NativeSelectRoot>
            </Field>

            <Field label={<Label icon={LuCalendar} text="Vencimento (Dia)" />}>
               <Input {...fieldStyle} type="number" min={1} max={31} {...register("billingDay")} />
            </Field>

            <Field label={<Label icon={LuShieldCheck} text="Plano do Inquilino" />}>
              <NativeSelectRoot size="lg">
                <NativeSelectField 
                  {...fieldStyle}
                  {...register("plan")}
                >
                  <option value="BASIC">Plano Standard</option>
                  <option value="PRO">Plano Professional</option>
                  <option value="ENTERPRISE">Plano Enterprise</option>
                </NativeSelectField>
              </NativeSelectRoot>
            </Field>
          </SimpleGrid>
        </VStack>

        <Button 
          type="submit" 
          disabled={isLoading} 
          bg="blue.600" 
          color="white" 
          h="70px" 
          borderRadius="2xl" 
          fontSize="md" 
          fontWeight="900" 
          shadow="0 10px 20px -5px rgba(49, 130, 206, 0.5)"
          _hover={{ bg: "blue.700", transform: "translateY(-2px)" }}
          _active={{ transform: "scale(0.98)" }}
        >
          {isLoading ? "PROCESSANDO..." : "CONSOLIDAR REGISTRO"}
        </Button>
      </Stack>
    </form>
  );
}