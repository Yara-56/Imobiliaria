"use client";

import { 
  Stack, Input, Button, SimpleGrid, Text, VStack, 
  Box, HStack, Separator, Center, Span
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { LuBadgeCheck, LuUser, LuFileUp, LuWallet } from "react-icons/lu";
import { Field } from "@/components/ui/field"; 

interface TenantFormProps {
  initialData?: any;
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export default function TenantForm({ initialData, onSubmit, isLoading }: TenantFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData 
  });

  const handleInternalSubmit = (data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === "documentFile") {
        if (data[key]?.[0]) formData.append("documents", data[key][0]); 
      } else if (data[key] !== undefined && data[key] !== "") {
        formData.append(key, data[key]);
      }
    });
    onSubmit(formData);
  };

  // ✅ Definindo a cor cinza profissional para os nomes dos campos
  const labelColor = "gray.500"; 

  return (
    <form onSubmit={handleSubmit(handleInternalSubmit)} style={{ width: '100%' }}>
      <Stack gap={10}>
        
        {/* SEÇÃO 1: DADOS PESSOAIS */}
        <VStack align="start" gap={5}>
          <HStack gap={3}>
            <Center bg="blue.50" w="10" h="10" borderRadius="xl" color="blue.600">
              <LuUser size={20} />
            </Center>
            <Text fontWeight="black" fontSize="xs" letterSpacing="widest" color="gray.400">
              DADOS PESSOAIS
            </Text>
          </HStack>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="full">
            {/* 🎨 O segredo: Passamos um Span com a cor dentro do label */}
            <Field 
              label={<Span color={labelColor} fontWeight="medium" fontSize="xs">NOME COMPLETO</Span>} 
              invalid={!!errors.fullName} 
              errorText="Campo obrigatório"
            >
              <Input 
                {...register("fullName", { required: true })} 
                placeholder="Ex: João Silva" 
                h="60px" borderRadius="xl" variant="subtle"
              />
            </Field>

            <Field 
              label={<Span color={labelColor} fontWeight="medium" fontSize="xs">CPF / CNPJ</Span>} 
              invalid={!!errors.document} 
              errorText="Documento necessário"
            >
              <Input 
                {...register("document", { required: true })} 
                placeholder="000.000.000-00" 
                h="60px" borderRadius="xl" variant="subtle"
              />
            </Field>
          </SimpleGrid>
        </VStack>

        <Separator opacity={0.5} />

        {/* SEÇÃO 2: DOCUMENTAÇÃO */}
        <VStack align="start" gap={5}>
          <HStack gap={3}>
            <Center bg="orange.50" w="10" h="10" borderRadius="xl" color="orange.600">
              <LuFileUp size={20} />
            </Center>
            <Text fontWeight="black" fontSize="xs" letterSpacing="widest" color="gray.400">
              UPLOAD DE DOCUMENTOS
            </Text>
          </HStack>
          
          <Box 
            w="full" p={8} border="2px dashed" borderColor="gray.200" 
            borderRadius="2xl" textAlign="center"
            _hover={{ borderColor: "blue.400", bg: "blue.50/10" }}
          >
            <VStack gap={2}>
              <input 
                type="file" 
                {...register("documentFile")} 
                style={{ cursor: 'pointer', width: '100%', fontSize: '14px', color: '#718096' }}
              />
              <Text fontSize="xs" color="gray.400">Anexe o comprovante (PDF ou Foto)</Text>
            </VStack>
          </Box>
        </VStack>

        <Separator opacity={0.5} />

        {/* SEÇÃO 3: FINANCEIRO */}
        <VStack align="start" gap={5}>
          <HStack gap={3}>
            <Center bg="green.50" w="10" h="10" borderRadius="xl" color="green.600">
              <LuWallet size={20} />
            </Center>
            <Text fontWeight="black" fontSize="xs" letterSpacing="widest" color="gray.400">
              REGRAS DE NEGÓCIO
            </Text>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="full">
            <Field label={<Span color={labelColor} fontWeight="medium" fontSize="xs">VALOR DO ALUGUEL</Span>}>
              <Input 
                {...register("rentValue")} 
                h="60px" borderRadius="xl" variant="subtle"
                placeholder="R$ 0.000,00"
              />
            </Field>

            <Field label={<Span color={labelColor} fontWeight="medium" fontSize="xs">MÉTODO PREFERIDO</Span>}>
               <Box 
                 as="select" {...register("paymentMethod")} 
                 w="full" h="60px" borderRadius="xl" bg="gray.100" px={4}
                 color="gray.600" fontSize="sm"
                 style={{ outline: 'none', appearance: 'none', cursor: 'pointer' }}
               >
                 <option value="pix">PIX Automático</option>
                 <option value="boleto">Boleto Bancário</option>
                 <option value="cartao">Cartão de Crédito</option>
               </Box>
            </Field>
          </SimpleGrid>
        </VStack>

        <Button 
          type="submit" 
          disabled={isLoading}
          bg="blue.600" color="white" h="70px" borderRadius="2xl"
          fontSize="md" fontWeight="black"
          _hover={{ bg: "blue.700", transform: "translateY(-2px)", shadow: "xl" }}
        >
          <LuBadgeCheck style={{ marginRight: '10px' }} size={22} />
          {initialData ? "SALVAR ALTERAÇÕES" : "FINALIZAR CADASTRO"}
        </Button>
      </Stack>
    </form>
  );
}