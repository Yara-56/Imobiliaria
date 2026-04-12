"use client"

import React, { ReactNode } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Box,
  Button,
  Flex,
  Input,
  Stack,
  Text,
  SimpleGrid,
  Icon,
} from "@chakra-ui/react"
import { LuUser, LuBuilding2, LuCheck } from "react-icons/lu"
import { toaster } from "@/components/ui/toaster.js"

// Importações do seu Schema e Tipagens
import { 
  tenantFormSchema, 
  DEFAULT_TENANT_VALUES, 
  type TenantFormData 
} from "../../schemas/tenant.schema"

// Importação do seu componente Inteligente de Busca de Imóveis
import { SmartTenantHousingStep } from "../SmartTenantHousingStep"


// ✅ Máscaras blindadas contra undefined/null
const formatDocument = (value?: any) => {
  if (!value || typeof value !== "string") return "";
  const v = value.replace(/\D/g, "");
  if (v.length <= 11) return v.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return v.replace(/(\d{2})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1/$2").replace(/(\d{4})(\d{1,2})$/, "$1-$2");
};

const formatPhone = (value?: any) => {
  if (!value || typeof value !== "string") return "";
  const v = value.replace(/\D/g, "");
  return v.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{4})$/, "$1-$2");
};

interface TenantFormProps {
  initialData?: Partial<TenantFormData>
  onSubmit: (data: TenantFormData) => void
  isLoading?: boolean
}

export default function TenantForm({ initialData, onSubmit, isLoading }: TenantFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TenantFormData>({
    resolver: zodResolver(tenantFormSchema),
    // ✅ Filtra valores nulos para não quebrar os inputs controlados
    defaultValues: { 
      ...DEFAULT_TENANT_VALUES, 
      ...(initialData ? Object.fromEntries(Object.entries(initialData).filter(([_, v]) => v != null)) : {}) 
    },
  })

  // Observando os campos para UI condicional
  const selectedType = watch("type") || "RESIDENTIAL"
  const propertyId = watch("propertyId")
  const rentValue = watch("rentValue")
  const billingDay = watch("billingDay")
  const preferredPaymentMethod = watch("preferredPaymentMethod")

  // Feedback visual caso o usuário tente salvar com campos faltando/inválidos
  const onInvalid = () => {
    toaster.create({
      title: "Dados inválidos ou incompletos",
      description: "Verifique os campos destacados em vermelho antes de salvar.",
      type: "error",
    });
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit, onInvalid)} w="full">
      <Stack gap={10}>
        
        {/* 1. TIPO DE INQUILINO */}
        <Box animation="fade-in 0.4s ease-out">
          <Text fontSize="xs" fontWeight="bold" color="gray.400" mb={4} textTransform="uppercase" letterSpacing="widest">
            1. Perfil do Inquilino
          </Text>
          <SimpleGrid columns={2} gap={4}>
            <TypeToggle
              isActive={selectedType === "RESIDENTIAL"}
              icon={LuUser}
              label="Pessoa Física"
              onClick={() => setValue("type", "RESIDENTIAL", { shouldValidate: true })}
            />
            <TypeToggle
              isActive={selectedType === "COMMERCIAL"}
              icon={LuBuilding2}
              label="Pessoa Jurídica"
              onClick={() => setValue("type", "COMMERCIAL", { shouldValidate: true })}
            />
          </SimpleGrid>
        </Box>

        {/* 2. DADOS PRINCIPAIS */}
        <Box animation="fade-in 0.5s ease-out">
          <Text fontSize="xs" fontWeight="bold" color="gray.400" mb={4} textTransform="uppercase" letterSpacing="widest">
            2. Informações de Contato
          </Text>
          <Stack gap={5} p={6} bg="gray.50" borderRadius="3xl" border="1px solid" borderColor="gray.100">
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <Field label={selectedType === "COMMERCIAL" ? "Razão Social" : "Nome Completo"} error={errors.fullName?.message}>
                  <Input 
                    {...field} 
                    value={field.value || ""} // Safe fallback
                    placeholder={selectedType === "COMMERCIAL" ? "Ex: Tech Imóveis LTDA" : "Ex: João da Silva"} 
                    bg="white" 
                    size="lg" 
                    borderRadius="xl" 
                    border="none" 
                    boxShadow="sm" 
                  />
                </Field>
              )}
            />
            
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
              <Controller
                name="document"
                control={control}
                render={({ field }) => (
                  <Field label={selectedType === "COMMERCIAL" ? "CNPJ" : "CPF"} error={errors.document?.message}>
                    <Input 
                      {...field} 
                      value={field.value || ""}
                      onChange={(e) => field.onChange(formatDocument(e.target.value))}
                      placeholder={selectedType === "COMMERCIAL" ? "00.000.000/0001-00" : "000.000.000-00"} 
                      bg="white" size="lg" 
                      borderRadius="xl" 
                      border="none" 
                      boxShadow="sm" 
                    />
                  </Field>
                )}
              />
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Field label="WhatsApp / Telefone" error={errors.phone?.message}>
                    <Input 
                      {...field} 
                      value={field.value || ""}
                      onChange={(e) => field.onChange(formatPhone(e.target.value))}
                      placeholder="(00) 00000-0000" 
                      bg="white" 
                      size="lg" 
                      borderRadius="xl" 
                      border="none" 
                      boxShadow="sm" 
                    />
                  </Field>
                )}
              />
            </SimpleGrid>

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Field label="E-mail" error={errors.email?.message}>
                  <Input 
                    {...field} 
                    value={field.value || ""}
                    placeholder="email@exemplo.com" 
                    bg="white" 
                    size="lg" 
                    borderRadius="xl" 
                    border="none" 
                    boxShadow="sm" 
                  />
                </Field>
              )}
            />
          </Stack>
        </Box>

        {/* 3. IMÓVEL E ALUGUEL (Integração com o Smart Step) */}
        <Box animation="fade-in 0.6s ease-out">
          <Text fontSize="xs" fontWeight="bold" color="gray.400" mb={4} textTransform="uppercase" letterSpacing="widest">
            3. Imóvel e Contrato <Text as="span" color="blue.400">(Opcional)</Text>
          </Text>
          <Box p={6} bg="blue.50" borderRadius="3xl" border="1px dashed" borderColor="blue.200">
            <SmartTenantHousingStep
              value={{
                propertyId,
                rentAmount: rentValue,
                dueDay: billingDay,
                paymentMethod: preferredPaymentMethod,
              }}
              onChange={(housingData) => {
                setValue("propertyId", housingData.propertyId, { shouldValidate: true });
                setValue("rentValue", housingData.rentAmount, { shouldValidate: true });
                setValue("billingDay", housingData.dueDay, { shouldValidate: true });
                setValue("preferredPaymentMethod", housingData.paymentMethod as "PIX" | "BOLETO" | "DINHEIRO" | undefined, { shouldValidate: true });
              }}
            />
          </Box>
        </Box>

        {/* AÇÕES */}
        <Flex justify="flex-end" pt={4} animation="fade-in 0.7s ease-out">
          <Button
            type="submit"
            color="white"
            bg="blue.600"
            size="lg"
            h="56px"
            px={10}
            borderRadius="2xl"
            fontWeight="bold"
            loading={isLoading}
            _hover={{ bg: "blue.700", transform: "translateY(-2px)", boxShadow: "lg" }}
            transition="all 0.2s"
          >
            Salvar Inquilino
          </Button>
        </Flex>

      </Stack>
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  )
}

/* COMPONENTES AUXILIARES PARA UX */
interface FieldProps {
  label: string
  error?: string
  children: ReactNode
}

const Field = ({ label, error, children }: FieldProps) => (
  <Stack gap={1.5} flex={1}>
    <Text fontSize="sm" fontWeight="semibold" color="gray.700" pl={1}>{label}</Text>
    {children}
    {error && <Text fontSize="xs" color="red.500" fontWeight="medium" pl={1}>{error}</Text>}
  </Stack>
)

interface TypeToggleProps {
  isActive: boolean
  icon: React.ElementType
  label: string
  onClick: () => void
}

const TypeToggle = ({ isActive, icon, label, onClick }: TypeToggleProps) => (
  <Box 
    w="full"
    textAlign="left"
    onClick={onClick} 
    cursor="pointer" 
    p={5} 
    borderRadius="2xl" 
    border="2px solid" 
    borderColor={isActive ? "blue.500" : "transparent"} 
    bg={isActive ? "white" : "gray.50"} 
    boxShadow={isActive ? "sm" : "none"} 
    position="relative" 
    transition="all 0.2s"
    _hover={{ transform: "scale(1.02)" }}
    _active={{ transform: "scale(0.98)" }}
  >
    {isActive && <Flex position="absolute" top={3} right={3} w={5} h={5} bg="blue.500" borderRadius="full" align="center" justify="center"><Icon as={LuCheck} color="white" boxSize={3} /></Flex>}
    <Flex direction="column" align="center" gap={3}>
      <Flex w={12} h={12} borderRadius="full" bg={isActive ? "blue.50" : "white"} color={isActive ? "blue.600" : "gray.400"} align="center" justify="center" boxShadow={isActive ? "none" : "sm"}><Icon as={icon} boxSize={6} /></Flex>
      <Text fontWeight="bold" color={isActive ? "blue.700" : "gray.500"} fontSize="sm">{label}</Text>
    </Flex>
  </Box>
)