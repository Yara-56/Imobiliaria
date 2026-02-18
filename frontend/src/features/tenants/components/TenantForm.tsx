"use client";

import { Stack, Input, Button, SimpleGrid } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Tenant, CreateTenantDTO } from "../types/tenant";
import { LuCircleCheck } from "react-icons/lu";
import { Field } from "../../../components/ui/field"; 

interface TenantFormProps {
  initialData?: Tenant;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export default function TenantForm({ initialData, onSubmit, isLoading }: TenantFormProps) {
  // ✅ Usamos CreateTenantDTO para garantir que o formulário siga o contrato de criação/edição
  const { register, handleSubmit } = useForm<CreateTenantDTO>({
    defaultValues: initialData 
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
      <Stack gap={8}>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
          <Field label="NOME DA IMOBILIÁRIA">
            <Input {...register("name")} placeholder="Ex: Aura Imóveis" variant="subtle" h="55px" borderRadius="xl" />
          </Field>

          <Field label="SLUG (URL ÚNICA)">
            <Input {...register("slug")} placeholder="aura-imoveis" variant="subtle" h="55px" borderRadius="xl" />
          </Field>

          <Field label="E-MAIL MASTER">
            <Input {...register("email")} placeholder="adm@empresa.com" variant="subtle" h="55px" borderRadius="xl" />
          </Field>

          <Field label="CONTATO DIRETO">
            <Input {...register("phone")} placeholder="(00) 00000-0000" variant="subtle" h="55px" borderRadius="xl" />
          </Field>

          <Field label="DOCUMENTO (CPF/CNPJ)">
            <Input {...register("cpfCnpj")} placeholder="00.000.000/0000-00" variant="subtle" h="55px" borderRadius="xl" />
          </Field>

          {/* ✅ Adicionando campo de configuração que o backend exige */}
          <Field label="LIMITE DE USUÁRIOS">
            <Input 
              type="number" 
              {...register("settings.maxUsers")} 
              variant="subtle" h="55px" borderRadius="xl" 
            />
          </Field>
        </SimpleGrid>

        <Button 
          type="submit" 
          bg="blue.600" 
          color="white" 
          h="70px" 
          borderRadius="2xl" 
          fontSize="md" 
          fontWeight="bold"
          loading={isLoading}
          _hover={{ bg: "blue.700", transform: "translateY(-2px)" }}
        >
          <LuCircleCheck style={{ marginRight: '10px' }} size={20} />
          {initialData ? "SALVAR ALTERAÇÕES" : "PROVISIONAR INSTÂNCIA"}
        </Button>
      </Stack>
    </form>
  );
}