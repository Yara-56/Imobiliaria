"use client";

import { 
  VStack, 
  SimpleGrid, 
  Input, 
  Button, 
  Box,
  Text,
  Icon,
  HStack,
  Textarea,
  createListCollection,
  // ✅ Usando o Field do Chakra diretamente para evitar erro de import local
  Field as ChakraField,
  NativeSelect
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { 
  LuDollarSign, 
  LuCalendar, 
  LuUser, 
  LuHouse, // ✅ Corrigido de LuHome para LuHouse
  LuCreditCard,
  LuCircleCheck // ✅ Corrigido de LuCheckCircle para LuCircleCheck
} from "react-icons/lu";

// Definição dos campos para o TypeScript parar de reclamar
interface ContractFormData {
  renterId: string;
  propertyId: string;
  rentAmount: number;
  dueDay: number;
  startDate: string;
  paymentMethod: string;
  status: string;
  notes: string;
}

interface ContractFormProps {
  onSubmit: (data: ContractFormData) => void;
  isLoading: boolean;
  tenants: any[];
  properties: any[];
}

export function ContractForm({ onSubmit, isLoading, tenants, properties }: ContractFormProps) {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<ContractFormData>({ // ✅ Tipagem adicionada aqui
    defaultValues: {
      status: "ACTIVE",
      paymentMethod: "BOLETO",
      dueDay: 10
    }
  });

  const fieldStyle = {
    bg: "gray.50",
    border: "1px solid",
    borderColor: "gray.100",
    borderRadius: "xl",
    h: "55px",
    _focus: { 
      bg: "white", 
      borderColor: "blue.500", 
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack gap={8} align="stretch">
        
        {/* SEÇÃO 1: VÍNCULO */}
        <Box>
          <Text fontSize="xs" fontWeight="black" color="blue.600" mb={4} letterSpacing="widest">
            VÍNCULOS DO CLUSTER
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            <ChakraField.Root invalid={!!errors.renterId}>
              <ChakraField.Label fontWeight="bold" mb={2}>
                <HStack gap={2}><LuUser size={14}/> Locatário</HStack>
              </ChakraField.Label>
              <NativeSelect.Root>
                <NativeSelect.Field 
                  {...fieldStyle}
                  {...register("renterId", { required: "Selecione o locatário" })}
                >
                  <option value="">Selecione o inquilino...</option>
                  {tenants.map((t) => (
                    <option key={t._id} value={t._id}>{t.fullName}</option>
                  ))}
                </NativeSelect.Field>
              </NativeSelect.Root>
            </ChakraField.Root>

            <ChakraField.Root invalid={!!errors.propertyId}>
              <ChakraField.Label fontWeight="bold" mb={2}>
                <HStack gap={2}><LuHouse size={14}/> Imóvel</HStack>
              </ChakraField.Label>
              <NativeSelect.Root>
                <NativeSelect.Field 
                  {...fieldStyle}
                  {...register("propertyId", { required: "Selecione o imóvel" })}
                >
                  <option value="">Selecione o imóvel...</option>
                  {properties.map((p) => (
                    <option key={p._id} value={p._id}>{p.title}</option>
                  ))}
                </NativeSelect.Field>
              </NativeSelect.Root>
            </ChakraField.Root>
          </SimpleGrid>
        </Box>

        {/* SEÇÃO 2: FINANCEIRO */}
        <Box>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
            <ChakraField.Root invalid={!!errors.rentAmount}>
              <ChakraField.Label fontWeight="bold" mb={2}>Valor do Aluguel</ChakraField.Label>
              <Input type="number" {...fieldStyle} {...register("rentAmount", { required: true })} />
            </ChakraField.Root>

            <ChakraField.Root invalid={!!errors.dueDay}>
              <ChakraField.Label fontWeight="bold" mb={2}>Dia Vencimento</ChakraField.Label>
              <Input type="number" {...fieldStyle} {...register("dueDay", { required: true })} />
            </ChakraField.Root>

            <ChakraField.Root invalid={!!errors.startDate}>
              <ChakraField.Label fontWeight="bold" mb={2}>Início</ChakraField.Label>
              <Input type="date" {...fieldStyle} {...register("startDate", { required: true })} />
            </ChakraField.Root>
          </SimpleGrid>
        </Box>

        {/* SEÇÃO 3: MÉTODO */}
        <Box>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            <ChakraField.Root>
              <ChakraField.Label fontWeight="bold" mb={2}>Pagamento</ChakraField.Label>
              <NativeSelect.Root>
                <NativeSelect.Field {...fieldStyle} {...register("paymentMethod")}>
                  <option value="BOLETO">Boleto</option>
                  <option value="PIX">PIX</option>
                </NativeSelect.Field>
              </NativeSelect.Root>
            </ChakraField.Root>

            <ChakraField.Root>
              <ChakraField.Label fontWeight="bold" mb={2}>Observações</ChakraField.Label>
              <Textarea {...fieldStyle} h="auto" {...register("notes")} />
            </ChakraField.Root>
          </SimpleGrid>
        </Box>

        <Button 
          type="submit"
          loading={isLoading}
          bg="blue.600"
          color="white"
          h="70px"
          borderRadius="2xl"
          fontWeight="900"
          _hover={{ bg: "blue.700", transform: "translateY(-2px)" }}
        >
          <Icon as={LuCircleCheck} mr={2} />
          CONSOLIDAR CONTRATO
        </Button>

      </VStack>
    </form>
  );
}