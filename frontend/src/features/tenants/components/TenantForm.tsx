"use client";

import { 
  Stack, Input, Button, SimpleGrid, Text, VStack, 
  Box, Icon, HStack, Separator, Center
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
  // Inicializa o formulário com dados prévios para o modo de edição
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData 
  });

  const handleInternalSubmit = (data: any) => {
    const formData = new FormData();
    
    // Mapeamento de dados estruturado para multipart/form-data
    Object.keys(data).forEach(key => {
      // Ignora o campo original do input de arquivo para tratar separadamente
      if (key === "documentFile") {
        if (data[key] && data[key][0]) {
          formData.append("documents", data[key][0]); 
        }
      } else if (data[key] !== undefined && data[key] !== "") {
        // 🛡️ Segurança: Só anexa se o valor existir (evita lixo no banco)
        formData.append(key, data[key]);
      }
    });

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleInternalSubmit)} style={{ width: '100%' }}>
      <Stack gap={10}>
        
        {/* SEÇÃO 1: DADOS DO LOCATÁRIO */}
        <VStack align="start" gap={5}>
          <HStack gap={3} color="blue.600">
            <Center bg="blue.50" w="10" h="10" borderRadius="xl">
              <LuUser size={20} />
            </Center>
            <Text fontWeight="black" fontSize="xs" letterSpacing="widest">DADOS PESSOAIS</Text>
          </HStack>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="full">
            <Field label="NOME COMPLETO" invalid={!!errors.fullName} errorText="Campo obrigatório">
              <Input 
                {...register("fullName", { required: true })} 
                placeholder="Ex: João Silva" 
                h="60px" borderRadius="xl" variant="subtle"
              />
            </Field>

            <Field label="CPF / CNPJ" invalid={!!errors.document} errorText="Documento necessário">
              <Input 
                {...register("document", { required: true })} 
                placeholder="000.000.000-00" 
                h="60px" borderRadius="xl" variant="subtle"
              />
            </Field>
          </SimpleGrid>
        </VStack>

        <Separator opacity={0.5} />

        {/* SEÇÃO 2: DOCUMENTAÇÃO (UPLOAD BINÁRIO) */}
        <VStack align="start" gap={5}>
          <HStack gap={3} color="orange.600">
            <Center bg="orange.50" w="10" h="10" borderRadius="xl">
              <LuFileUp size={20} />
            </Center>
            <Text fontWeight="black" fontSize="xs" letterSpacing="widest">UPLOAD DE DOCUMENTOS</Text>
          </HStack>
          
          <Box 
            w="full" p={8} border="2px dashed" borderColor="gray.200" 
            borderRadius="2xl" textAlign="center" transition="0.2s"
            _hover={{ borderColor: "blue.400", bg: "blue.50/30" }}
          >
            <VStack gap={2}>
              <input 
                type="file" 
                {...register("documentFile")} 
                accept=".pdf,image/*"
                style={{ cursor: 'pointer', width: '100%' }}
              />
              <Text fontSize="xs" color="gray.500">
                Anexe o comprovante (PDF ou Foto)
              </Text>
            </VStack>
          </Box>
        </VStack>

        <Separator opacity={0.5} />

        {/* SEÇÃO 3: FINANCEIRO */}
        <VStack align="start" gap={5}>
          <HStack gap={3} color="green.600">
            <Center bg="green.50" w="10" h="10" borderRadius="xl">
              <LuWallet size={20} />
            </Center>
            <Text fontWeight="black" fontSize="xs" letterSpacing="widest">REGRAS DE NEGÓCIO</Text>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="full">
            <Field label="VALOR DO ALUGUEL">
              <Input 
                {...register("rentValue")} 
                h="60px" borderRadius="xl" variant="subtle"
                placeholder="R$ 0.000,00"
              />
            </Field>

            <Field label="MÉTODO PREFERIDO">
               <Box 
                 as="select" {...register("paymentMethod")} 
                 w="full" h="60px" borderRadius="xl" bg="gray.100" px={4}
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
          bg="blue.600" color="white" h="80px" borderRadius="2xl"
          fontSize="lg" fontWeight="black" loading={isLoading}
          _hover={{ bg: "blue.700", transform: "translateY(-2px)", shadow: "xl" }}
        >
          <LuBadgeCheck style={{ marginRight: '12px' }} size={24} />
          {initialData ? "SALVAR ALTERAÇÕES" : "FINALIZAR CADASTRO"}
        </Button>
      </Stack>
    </form>
  );
}