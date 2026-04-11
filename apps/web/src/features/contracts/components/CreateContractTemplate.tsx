"use client";

import {
  Box, Button, Container, Flex, HStack, Icon, 
  SimpleGrid, Stack, Text, VStack, Separator, Center, Input
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { 
  LuSignature, 
  LuHouse,    // ✅ CORREÇÃO: Em versões novas é LuHouse em vez de LuHome
  LuWallet, 
  LuCalendar, 
  LuArrowLeft, 
  LuInfo 
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";

// UI Components
import { Field } from "@/components/ui/field.js";
import { NativeSelectRoot, NativeSelectField } from "@chakra-ui/react";

// Hooks
import { useContracts } from "../hooks/useContracts";
import { useTenants } from "../../tenants/hooks/useTenants";

// ✅ Importação de tipo (Certifique-se que o arquivo termina em .tsx)
import type { CreateContractDTO } from "../types/contract.types";

export default function CreateContractTemplate() {
  const navigate = useNavigate();
  const { createContract, isCreating } = useContracts();
  
  // ✅ Buscando inquilinos reais do seu módulo de Tenants
  const { tenants } = useTenants();

  const { register, handleSubmit, formState: { errors } } = useForm<CreateContractDTO>({
    defaultValues: {
      dueDay: 5,
      paymentMethod: "PIX",
      startDate: new Date().toISOString().split('T')[0]
    }
  });

  const onSubmit = async (data: CreateContractDTO) => {
    try {
      await createContract(data);
      navigate("/contracts");
    } catch (error) {
      console.error("Erro ao gerar contrato:", error);
    }
  };

  // Estilo "Subtle Gray" Profissional
  const fieldStyle = {
    bg: "gray.50",
    borderWidth: "1px",
    borderColor: "gray.100",
    borderRadius: "xl",
    h: "60px",
    fontSize: "md",
    px: 4,
    _focus: { bg: "white", borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }
  };

  return (
    <Box bg="#F7F8FA" minH="100vh" p={{ base: 4, md: 10 }}>
      <Container maxW="4xl">
        
        {/* NAVEGAÇÃO VOLTAR */}
        <Button 
          variant="ghost" mb={8} onClick={() => navigate("/contracts")} 
          gap={2} color="gray.500" fontWeight="bold" _hover={{ color: "blue.600", bg: "white" }}
        >
          <LuArrowLeft /> Voltar para Gestão
        </Button>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={8}>
            
            {/* CARD DE DADOS */}
            <Box bg="white" p={{ base: 6, md: 10 }} borderRadius="4xl" shadow="sm" border="1px solid" borderColor="gray.100">
              
              <VStack gap={10} align="stretch">
                
                {/* 1. VÍNCULO (IMÓVEL E LOCATÁRIO) */}
                <Box>
                  <HStack gap={4} mb={6}>
                    <Center bg="blue.600" color="white" p={3} borderRadius="2xl" shadow="lg">
                      <LuHouse size={22} />
                    </Center>
                    <VStack align="start" gap={0}>
                      <Text fontWeight="900" fontSize="lg" color="gray.800">Vínculo Contratual</Text>
                      <Text fontSize="xs" color="gray.400">Associe o imóvel ao novo locatário</Text>
                    </VStack>
                  </HStack>

                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                    <Field label="IMÓVEL (ALVO / SQL)" invalid={!!errors.propertyId} errorText="Selecione um imóvel">
                      <NativeSelectRoot>
                        <NativeSelectField {...fieldStyle} {...register("propertyId", { required: true })}>
                          <option value="">Selecione o imóvel...</option>
                          <option value="1">Apto 202 - Ed. Horizonte (SQL: 123.45)</option>
                          <option value="2">Casa Jardim 05 (SQL: 882.10)</option>
                        </NativeSelectField>
                      </NativeSelectRoot>
                    </Field>

                    <Field label="LOCATÁRIO (INQUILINO)" invalid={!!errors.renterId} errorText="Selecione um locatário">
                      <NativeSelectRoot>
                        <NativeSelectField {...fieldStyle} {...register("renterId", { required: true })}>
                          <option value="">Selecione o locatário...</option>
                          {tenants?.map((t: any) => (
                            <option key={t._id} value={t._id}>{t.fullName}</option>
                          ))}
                        </NativeSelectField>
                      </NativeSelectRoot>
                    </Field>
                  </SimpleGrid>
                </Box>

                <Separator opacity={0.5} />

                {/* 2. FINANCEIRO */}
                <Box>
                  <HStack gap={4} mb={6}>
                    <Center bg="green.500" color="white" p={3} borderRadius="2xl" shadow="lg">
                      <LuWallet size={22} />
                    </Center>
                    <VStack align="start" gap={0}>
                      <Text fontWeight="900" fontSize="lg" color="gray.800">Financeiro e Cobrança</Text>
                      <Text fontSize="xs" color="gray.400">Configure valores e vencimentos</Text>
                    </VStack>
                  </HStack>

                  <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
                    <Field label="ALUGUEL MENSAL" invalid={!!errors.rentAmount}>
                      <Input {...fieldStyle} type="number" fontWeight="bold" color="green.700" placeholder="0.00" {...register("rentAmount", { required: true, valueAsNumber: true })} />
                    </Field>

                    <Field label="DIA DO VENCIMENTO">
                      <Input {...fieldStyle} type="number" min={1} max={31} {...register("dueDay", { required: true, valueAsNumber: true })} />
                    </Field>

                    <Field label="MÉTODO DE PAGAMENTO">
                      <NativeSelectRoot>
                        <NativeSelectField {...fieldStyle} {...register("paymentMethod")}>
                          <option value="PIX">Transferência PIX</option>
                          <option value="BOLETO">Boleto Bancário</option>
                          <option value="CARTAO_RECORRENTE">Cartão de Crédito</option>
                        </NativeSelectField>
                      </NativeSelectRoot>
                    </Field>
                  </SimpleGrid>
                </Box>

              </VStack>
            </Box>

            {/* BOTÃO DE AÇÃO MASTER */}
            <Button 
              type="submit" bg="blue.600" color="white" h="80px" px={12} 
              borderRadius="3xl" fontWeight="900" fontSize="xl" shadow="2xl"
              loading={isCreating} gap={4}
              _hover={{ bg: "blue.700", transform: "translateY(-3px)" }}
              transition="all 0.2s"
            >
              <LuSignature size={28} />
              GERAR INSTRUMENTO JURÍDICO
            </Button>

          </Stack>
        </form>

        <Center mt={10}>
          <HStack color="gray.300" fontSize="xs" fontWeight="black" letterSpacing="widest">
            <LuInfo size={14} />
            <Text>SISTEMA IMOBILIÁRIO v3.0 • PROTOCOLO DE CONTRATOS</Text>
          </HStack>
        </Center>
      </Container>
    </Box>
  );
}