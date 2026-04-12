"use client";

import { 
  Box, Container, Button, Heading, Text, VStack, 
  HStack, Center, Flex, Icon
} from "@chakra-ui/react";
import { LuArrowLeft, LuUserPlus, LuSparkles } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { useTenants } from "../hooks/useTenants";
import TenantForm from "../components/forms/TenantForm";
import type { TenantFormData } from "../schemas/tenant.schema";
import { toaster } from "@/components/ui/toaster.js";

const MotionBox = motion.create(Box);

export default function NewTenantPage() {
  const navigate = useNavigate();
  
  // Pegamos as ações e o estado de criação do objeto mutations
  const { actions, mutations } = (useTenants() as any) || {};

  /**
   * 💾 SUBMIT HANDLER
   * Aqui removemos as propriedades que o seu hook ainda não "conhece"
   */
  const handleCreateTenant = async (data: TenantFormData) => {
    try {
      // ✅ CORREÇÃO DEFINITIVA: 
      // Enviamos apenas as propriedades que o TS disse que são aceitas no actions.create
      await actions?.create({
        type: data.type,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone ?? "", 
        document: data.document,
        
        // 🏠 Associação direta com o Imóvel (Aluguel)
        propertyId: data.propertyId || undefined,
        rentValue: data.rentValue || undefined,
        billingDay: data.billingDay || undefined,
        // ✅ Garante que o Enum da API não receba undefined e quebre com erro 400
        preferredPaymentMethod: data.preferredPaymentMethod || "PIX",
      } as any);
      
      // Notificação visual de sucesso
      toaster.create({
        title: "Inquilino cadastrado!",
        description: `${data.fullName} foi adicionado com sucesso.`,
        type: "success",
      });

      navigate("/admin/tenants");
    } catch (error) {
      console.error("Erro na criação:", error);
      // Notificação visual de erro
      toaster.create({
        title: "Erro ao cadastrar",
        description: "Verifique os dados e tente novamente.",
        type: "error",
      });
    }
  };

  return (
    <Box p={{ base: 4, md: 8 }} pb={{ base: 24, md: 12 }} bg="#FAFAFA" minH="100vh">
      <Container maxW="4xl">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Button 
            variant="ghost" 
            mb={8} 
            onClick={() => navigate("/admin/tenants")} 
            color="gray.500"
            gap={2}
            borderRadius="xl"
            _hover={{ color: "blue.600", bg: "white" }}
          >
            <LuArrowLeft size={18} /> Voltar
          </Button>

          <VStack align="start" gap={6} mb={10}>
            <HStack gap={5}>
              <Center bg="blue.50" p={4} borderRadius="2xl" color="blue.600" shadow="sm">
                <LuUserPlus size={28} />
              </Center>
              <VStack align="start" gap={1}>
                <Heading size="lg" fontWeight="900" color="gray.800" letterSpacing="tight">
                  Novo Inquilino
                </Heading>
                <Text color="gray.500" fontSize="sm" fontWeight="medium">
                  Cadastre os dados essenciais para o sistema e comece a fechar negócios.
                </Text>
              </VStack>
            </HStack>
          </VStack>

          <Box 
            p={{ base: 6, md: 10 }} 
            bg="white" 
            borderRadius="3xl" 
            shadow="0 4px 20px rgba(0,0,0,0.03)" 
            border="1px solid" 
            borderColor="gray.100"
          >
            <TenantForm 
              onSubmit={handleCreateTenant} 
              isLoading={mutations?.isCreating || false} 
            />
          </Box>

          <Flex mt={12} justify="center" align="center" gap={2} opacity={0.6}>
            <Icon as={LuSparkles} color="blue.500" />
            <Text fontSize="xs" color="gray.500" fontWeight="bold" letterSpacing="widest">
              HOMEFLUX PRO v3.0
            </Text>
          </Flex>
        </MotionBox>
      </Container>
    </Box>
  );
}