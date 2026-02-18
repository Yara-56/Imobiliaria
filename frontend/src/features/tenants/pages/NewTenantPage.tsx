"use client";

import { Box, Heading, Text, VStack, Badge, SimpleGrid, Center, Flex } from "@chakra-ui/react";
import { LuShieldPlus, LuCircleCheck, LuLock, LuArrowLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import TenantForm from "../components/TenantForm";
import { useTenants } from "../hooks/useTenants"; // ✅ Usando o hook mestre unificado
import { CreateTenantDTO } from "../types/tenant";

const MotionDiv = motion.create("div");

export default function NewTenantPage() {
  const navigate = useNavigate();
  
  // ✅ Desestruturando do hook unificado:
  // createTenant (função mutateAsync) e isCreating (estado de pendência)
  const { createTenant, isCreating } = useTenants();

  const handleFormSubmit = async (data: CreateTenantDTO) => {
    try {
      // ✅ Ligação direta com o back-end via hook
      await createTenant(data);
      // O toaster de sucesso já é disparado dentro do hook onSuccess
      navigate("/admin/tenants"); 
    } catch (err) {
      // Erros são tratados globalmente no hook, mas você pode capturar aqui se precisar de lógica extra
      console.error("Erro no provisionamento:", err);
    }
  };

  return (
    <Box p={{ base: 4, md: 10 }} bg="#F8FAFC" minH="100vh">
      {/* Botão de Voltar Rápido */}
      <Flex mb={8}>
        <Center 
          as="button" 
          onClick={() => navigate(-1)} 
          p={2} borderRadius="xl" 
          _hover={{ bg: "gray.100" }} 
          transition="0.2s"
        >
          <LuArrowLeft size={20} />
          <Text ml={2} fontWeight="medium">Voltar</Text>
        </Center>
      </Flex>

      <SimpleGrid columns={{ base: 1, lg: 3 }} gap={12} alignItems="start">
        
        {/* COLUNA DE CONTEXTO */}
        <VStack align="start" gap={8}>
          <VStack align="start" gap={3}>
            <Badge bg="blue.600" color="white" px={3} py={1} borderRadius="lg" fontSize="10px" fontWeight="black">
              SISTEMA AURA v3
            </Badge>
            <Heading size="3xl" fontWeight="900" color="slate.900" letterSpacing="-1.5px" lineHeight="1.1">
              Nova Instância <br /> Imobiliária
            </Heading>
            <Text color="slate.500" fontSize="lg">
              Provisione um ambiente isolado com banco de dados dedicado em segundos.
            </Text>
          </VStack>

          <VStack align="start" gap={4} w="full">
            <StepItem icon={LuCircleCheck} title="Isolamento de Dados" desc="Arquitetura Multi-tenant física." />
            <StepItem icon={LuLock} title="Segurança Master" desc="Criptografia AES-256 ativa." />
          </VStack>

          <Box p={6} bg="slate.900" borderRadius="3xl" w="full" color="white" shadow="xl">
             <Text fontSize="sm" fontWeight="bold" mb={2}>Dica de Infraestrutura</Text>
             <Text fontSize="xs" opacity={0.8}>
               O 'Slug' define o subdomínio exclusivo (ex: cliente.aura.com). Escolha com cuidado.
             </Text>
          </Box>
        </VStack>

        {/* COLUNA DO FORMULÁRIO */}
        <Box gridColumn={{ lg: "span 2" }}>
          <MotionDiv 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Box bg="white" p={{ base: 8, md: 12 }} borderRadius="4xl" shadow="sm" border="1px solid" borderColor="gray.100">
              <VStack align="start" mb={10} gap={2}>
                <Flex align="center" gap={3} color="blue.600">
                  <Center bg="blue.50" p={2} borderRadius="xl">
                    <LuShieldPlus size={24} />
                  </Center>
                  <Heading size="xl" fontWeight="800" color="slate.900">Configuração Master</Heading>
                </Flex>
                <Text color="gray.400">Preencha os dados para iniciar o deploy do cluster do cliente.</Text>
              </VStack>

              {/* ✅ isLoading agora usa isCreating do hook unificado */}
              <TenantForm onSubmit={handleFormSubmit} isLoading={isCreating} />
            </Box>
          </MotionDiv>
        </Box>
      </SimpleGrid>
    </Box>
  );
}

function StepItem({ icon: IconComp, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <Flex gap={4} align="center">
      <Center w="10" h="10" bg="blue.50" borderRadius="xl" color="blue.600">
        <IconComp size={20} />
      </Center>
      <Box>
        <Text fontWeight="bold" fontSize="sm" color="slate.900">{title}</Text>
        <Text fontSize="xs" color="slate.500">{desc}</Text>
      </Box>
    </Flex>
  );
}