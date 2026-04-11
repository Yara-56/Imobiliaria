"use client";

import React from "react";
import { 
  Stack, SimpleGrid, Input, Button, Text, 
  VStack, HStack, Box, Separator 
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { LuSignature, LuUser, LuWallet } from "react-icons/lu";
import { NativeSelectRoot, NativeSelectField } from "@chakra-ui/react";
import { Field } from "@/components/ui/field.js";

// ✅ Importação de tipos (Só funciona em .tsx)
import type { CreateContractDTO } from "../types/contract.types";
import type { Tenant } from "../../tenants/types/tenant.types";

interface ContractFormProps {
  onSubmit: (data: CreateContractDTO) => void;
  isLoading: boolean;
  tenants: Tenant[];
}

export function ContractForm({ onSubmit, isLoading, tenants }: ContractFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateContractDTO>({
    defaultValues: {
      dueDay: 5,
      paymentMethod: "PIX",
      startDate: new Date().toISOString().split('T')[0]
    }
  });

  const fieldStyle = {
    bg: "gray.50",
    borderWidth: "1px",
    borderColor: "gray.100",
    borderRadius: "xl",
    h: "58px",
    px: 4,
    _focus: { bg: "white", borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={10}>
        <Box>
          <HStack gap={3} mb={4}>
            <LuUser size={18} color="var(--chakra-colors-blue-600)" />
            <Text fontWeight="900" fontSize="sm" color="gray.700">PARTES DO CONTRATO</Text>
          </HStack>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
            <Field label="IMÓVEL (SQL / ALVO)" invalid={!!errors.propertyId}>
              <NativeSelectRoot borderRadius="xl">
                <NativeSelectField {...fieldStyle} {...register("propertyId", { required: true })}>
                  <option value="">Selecione a propriedade...</option>
                  <option value="1">Apto 202 - Ed. Horizonte (SQL: 123.45)</option>
                </NativeSelectField>
              </NativeSelectRoot>
            </Field>

            <Field label="LOCATÁRIO" invalid={!!errors.renterId}>
              <NativeSelectRoot borderRadius="xl">
                <NativeSelectField {...fieldStyle} {...register("renterId", { required: true })}>
                  <option value="">Selecione o inquilino...</option>
                  {tenants?.map(t => (
                    <option key={t._id} value={t._id}>{t.fullName}</option>
                  ))}
                </NativeSelectField>
              </NativeSelectRoot>
            </Field>
          </SimpleGrid>
        </Box>

        <Separator opacity={0.5} />

        <Box>
          <HStack gap={3} mb={4}>
            <LuWallet size={18} color="var(--chakra-colors-blue-600)" />
            <Text fontWeight="900" fontSize="sm" color="gray.700">CONDIÇÕES FINANCEIRAS</Text>
          </HStack>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={5}>
            <Field label="ALUGUEL MENSAL">
              <Input {...fieldStyle} type="number" step="0.01" {...register("rentAmount", { required: true, valueAsNumber: true })} />
            </Field>
            
            <Field label="DIA VENCIMENTO">
              <Input {...fieldStyle} type="number" min={1} max={31} {...register("dueDay", { required: true, valueAsNumber: true })} />
            </Field>

            <Field label="PAGAMENTO">
              <NativeSelectRoot borderRadius="xl">
                <NativeSelectField {...fieldStyle} {...register("paymentMethod")}>
                  <option value="PIX">PIX</option>
                  <option value="BOLETO">Boleto</option>
                </NativeSelectField>
              </NativeSelectRoot>
            </Field>
          </SimpleGrid>
        </Box>

        <Button 
          type="submit" loading={isLoading} bg="blue.600" color="white" h="70px" 
          borderRadius="2xl" fontWeight="900" shadow="xl" _hover={{ transform: "translateY(-2px)" }}
        >
          <LuSignature size={22} style={{ marginRight: "12px" }} />
          GERAR INSTRUMENTO JURÍDICO
        </Button>
      </Stack>
    </form>
  );
}