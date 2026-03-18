"use client";

import React, { useState } from "react";
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
  type TenantFormInput,  // ← MUDOU AQUI
  DEFAULT_TENANT_VALUES,
} from "../utils/form.utils";

interface QuickAddTenantModalProps {
  onCreate: (data: TenantFormInput) => Promise<any>;  // ← MUDOU AQUI
  onSuccess?: () => void;
}

export const QuickAddTenantModal = ({
  onCreate,
  onSuccess,
}: QuickAddTenantModalProps) => {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    watch,
  } = useForm<TenantFormInput>({  // ← MUDOU AQUI
    resolver: zodResolver(tenantFormSchema),
    defaultValues: DEFAULT_TENANT_VALUES,
    mode: "onChange",
  });

  // 👀 Observando campos
  const documentValue = watch("document");

  const onSubmit: SubmitHandler<TenantFormInput> = async (data) => {  // ← MUDOU AQUI
    try {
      await onCreate(data);

      toaster.create({
        title: "Inquilino cadastrado com sucesso",
        type: "success",
      });

      reset();
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toaster.create({
        title: "Erro ao cadastrar",
        description:
          error?.response?.data?.message || "Tente novamente.",
        type: "error",
      });
    }
  };

  return (
    <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)} placement="center">
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          colorPalette="blue"
          size="sm"
          fontWeight="800"
        >
          <Icon as={LuPlus} mr={2} />
          Cadastro Rápido
        </Button>
      </DialogTrigger>

      <DialogContent borderRadius="2xl" bg="white" boxShadow="2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* HEADER */}
          <DialogHeader borderBottom="1px solid" borderColor="gray.100" py={5}>
            <HStack gap={4}>
              <Center
                w={10}
                h={10}
                bg="blue.50"
                color="blue.600"
                borderRadius="xl"
              >
                <LuUserPlus size={20} />
              </Center>

              <VStack align="start" gap={0}>
                <DialogTitle fontSize="lg" fontWeight="900">
                  Novo Inquilino
                </DialogTitle>
                <Text fontSize="xs" color="gray.400">
                  Cadastro rápido para começar
                </Text>
              </VStack>
            </HStack>
          </DialogHeader>

          {/* BODY */}
          <DialogBody py={6}>
            <VStack gap={5}>
              <Field
                label="Nome Completo"
                invalid={!!errors.fullName}
                errorText={errors.fullName?.message}
              >
                <Input
                  {...register("fullName")}
                  placeholder="Ex: João Silva"
                  variant="subtle"
                />
              </Field>

              <SimpleGrid columns={2} gap={4} w="full">
                <Field
                  label="CPF ou CNPJ"
                  invalid={!!errors.document}
                  errorText={errors.document?.message}
                >
                  <Input
                    {...register("document")}
                    placeholder="Digite CPF ou CNPJ"
                    variant="subtle"
                  />
                </Field>

                <Field
                  label="E-mail"
                  invalid={!!errors.email}
                  errorText={errors.email?.message}
                >
                  <Input
                    {...register("email")}
                    placeholder="email@email.com"
                    variant="subtle"
                  />
                </Field>
              </SimpleGrid>

              <Field
                label="Telefone"
                invalid={!!errors.phone}
                errorText={errors.phone?.message}
              >
                <Input
                  {...register("phone")}
                  placeholder="(31) 99999-9999"
                  variant="subtle"
                />
              </Field>

              <SimpleGrid columns={2} gap={4} w="full">
                <Field
                  label="Valor do Aluguel"
                  invalid={!!errors.rentValue}
                  errorText={errors.rentValue?.message}
                >
                  <Input
                    type="number"
                    step="0.01"
                    {...register("rentValue", { valueAsNumber: true })}
                    placeholder="R$ 1.500,00"
                    variant="subtle"
                  />
                </Field>

                <Field
                  label="Dia do Vencimento"
                  invalid={!!errors.billingDay}
                  errorText={errors.billingDay?.message}
                >
                  <Input
                    type="number"
                    min="1"
                    max="31"
                    {...register("billingDay", { valueAsNumber: true })}
                    placeholder="10"
                    variant="subtle"
                  />
                </Field>
              </SimpleGrid>
            </VStack>
          </DialogBody>

          {/* FOOTER */}
          <DialogFooter bg="gray.50" p={4} borderBottomRadius="2xl">
            <HStack w="full" justify="space-between">
              <Text fontSize="xs" color="gray.400">
                {documentValue
                  ? "Documento será validado automaticamente"
                  : "Preencha os dados básicos"}
              </Text>

              <HStack gap={3}>
                <DialogActionTrigger asChild>
                  <Button
                    variant="ghost"
                    onClick={() => reset()}
                    fontWeight="700"
                  >
                    Cancelar
                  </Button>
                </DialogActionTrigger>

                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={!isValid}
                  colorPalette="blue"
                  borderRadius="xl"
                  fontWeight="900"
                  px={6}
                >
                  Salvar
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