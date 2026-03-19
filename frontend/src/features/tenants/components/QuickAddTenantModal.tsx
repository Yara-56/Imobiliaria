"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  VStack,
  Text,
  HStack,
  Icon,
  SimpleGrid,
  Center,
} from "@chakra-ui/react";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LuPlus, LuUserPlus } from "react-icons/lu";

import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Field } from "@/components/ui/field";
import { toaster } from "@/components/ui/toaster";

import {
  tenantFormSchema,
  DEFAULT_TENANT_VALUES,
  type TenantFormInput,
} from "../schemas/tenant.schema";

import { useCreateTenant } from "../hooks/useCreateTenant";

export const QuickAddTenantModal = () => {
  const [open, setOpen] = useState(false);
  const { mutateAsync } = useCreateTenant();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    watch,
    setFocus,
    setValue,
  } = useForm<TenantFormInput>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: DEFAULT_TENANT_VALUES,
    mode: "onChange",
  });

  const documentValue = watch("document");
  const paymentMethod = watch("preferredPaymentMethod");

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setFocus("fullName"), 120);
      return () => clearTimeout(timer);
    }
  }, [open, setFocus]);

  const onSubmit: SubmitHandler<TenantFormInput> = async (data) => {
    try {
      await mutateAsync(data as any); 
      toaster.create({
        title: "Inquilino cadastrado",
        description: "Tudo pronto para iniciar o contrato.",
        type: "success",
      });
      reset();
      setOpen(false);
    } catch (error: any) {
      toaster.create({
        title: "Erro ao cadastrar",
        description: error?.response?.data?.message || "Erro inesperado.",
        type: "error",
      });
    }
  };

  // Estilo padrão para os inputs focados em idosos (Alto contraste)
  const inputStyle = {
    variant: "outline" as const, // Bordas nítidas
    bg: "white",               // Fundo sempre branco
    borderColor: "gray.300",    // Borda visível
    _focus: { borderColor: "blue.500", borderWidth: "2px" },
    size: "lg",                // Input maior para facilitar o clique
    color: "gray.800",          // Texto bem escuro
    fontWeight: "500"
  };

  return (
    <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)} placement="center">
      <DialogTrigger asChild>
        <Button colorPalette="blue" borderRadius="xl" fontWeight="800" h="50px" px={6}>
          <Icon as={LuPlus} mr={2} />
          Novo Inquilino
        </Button>
      </DialogTrigger>

      <DialogContent borderRadius="3xl" bg="white" boxShadow="fill" maxW="600px">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader borderBottom="1px solid" borderColor="gray.100" py={6}>
            <HStack gap={4}>
              <Center w={12} h={12} bg="blue.50" color="blue.600" borderRadius="2xl">
                <LuUserPlus size={28} />
              </Center>
              <VStack align="start" gap={0}>
                <DialogTitle fontSize="xl" fontWeight="900">Novo Inquilino</DialogTitle>
                <Text fontSize="sm" color="gray.500">Preencha as informações básicas para o contrato</Text>
              </VStack>
            </HStack>
          </DialogHeader>

          <DialogBody py={8}>
            <VStack gap={6}>
              <Field label="Nome Completo" invalid={!!errors.fullName} errorText={errors.fullName?.message}>
                <Input {...register("fullName")} placeholder="Digite o nome completo" {...inputStyle} />
              </Field>

              <SimpleGrid columns={2} gap={6} w="full">
                <Field label="CPF ou CNPJ" invalid={!!errors.document} errorText={errors.document?.message}>
                  <Input {...register("document")} placeholder="000.000.000-00" {...inputStyle} />
                </Field>

                <Field label="E-mail" invalid={!!errors.email} errorText={errors.email?.message}>
                  <Input {...register("email")} placeholder="exemplo@email.com" {...inputStyle} />
                </Field>
              </SimpleGrid>

              <Field label="Telefone de Contato" invalid={!!errors.phone} errorText={errors.phone?.message}>
                <Input {...register("phone")} placeholder="(00) 00000-0000" {...inputStyle} />
              </Field>

              <SimpleGrid columns={2} gap={6} w="full">
                <Field label="Valor do Aluguel (R$)" invalid={!!errors.rentValue} errorText={errors.rentValue?.message}>
                  <Input type="number" step="0.01" {...register("rentValue")} placeholder="0,00" {...inputStyle} />
                </Field>

                <Field label="Dia do Vencimento" invalid={!!errors.billingDay} errorText={errors.billingDay?.message}>
                  <Input type="number" min="1" max="31" {...register("billingDay")} placeholder="10" {...inputStyle} />
                </Field>
              </SimpleGrid>

              <Field label="Forma de pagamento preferida" invalid={!!errors.preferredPaymentMethod}>
                <HStack border="2px solid" borderColor="gray.100" borderRadius="2xl" p={2} bg="gray.50" w="full">
                  {(["PIX", "BOLETO", "DINHEIRO"] as const).map((method) => {
                    const isSelected = paymentMethod === method;
                    return (
                      <Button
                        key={method}
                        flex={1}
                        h="45px"
                        variant={isSelected ? "solid" : "ghost"}
                        colorPalette={isSelected ? "blue" : "gray"}
                        borderRadius="xl"
                        fontWeight="bold"
                        fontSize="sm"
                        onClick={() => setValue("preferredPaymentMethod", method, { shouldValidate: true })}
                      >
                        {method}
                      </Button>
                    );
                  })}
                </HStack>
              </Field>
            </VStack>
          </DialogBody>

          <DialogFooter bg="gray.50" p={6} borderBottomRadius="3xl">
            <HStack w="full" justify="space-between">
              <Text fontSize="sm" fontWeight="600" color={documentValue?.length >= 11 ? "green.600" : "gray.500"}>
                {documentValue?.length >= 11 ? "✓ Documento preenchido" : "Aguardando dados..."}
              </Text>
              <HStack gap={4}>
                <DialogActionTrigger asChild>
                  <Button variant="ghost" fontWeight="bold" size="lg">Cancelar</Button>
                </DialogActionTrigger>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={!isValid}
                  colorPalette="blue"
                  borderRadius="2xl"
                  fontWeight="900"
                  size="lg"
                  px={8}
                >
                  Confirmar Cadastro
                </Button>
              </HStack>
            </HStack>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};