"use client";

import { 
  Box, Container, Flex, Text, Heading, VStack, IconButton, Center, Badge, SimpleGrid, Icon
} from "@chakra-ui/react";
import { 
  LuUsers, 
  LuChevronRight, 
  LuArrowLeft, 
  LuShieldPlus, 
  LuInfo, 
  LuSparkles, 
  LuCircleCheck, // ✅ Nome correto na versão atual
  LuLock 
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import TenantForm from "../components/TenantForm";
import { useCreateTenant } from "../hooks/useCreateTenant";

// ✅ Componente animado isolado para evitar conflitos de tipos TS
const MotionDiv = motion.create("div");

export default function NewTenantPage() {
  const navigate = useNavigate();
  const { createTenant, isPending } = useCreateTenant();

  const handleFormSubmit = (data: any) => {
    createTenant(data, {
      onSuccess: () => navigate("/admin/tenants")
    });
  };

  return (
    <Box minH="100vh" bg="#F8FAFC">
      <Container maxW="6xl" py={{ base: 6, md: 12 }}>
        
        {/* NAVEGAÇÃO / BREADCRUMB */}
        <Flex justify="space-between" align="center" mb={10}>
          <Flex align="center" gap={3} fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase" letterSpacing="widest">
            <Flex 
              align="center" gap={2} cursor="pointer" 
              _hover={{ color: "blue.600" }} 
              onClick={() => navigate("/admin/tenants")}
              transition="color 0.2s"
            >
              <LuUsers size={14} />
              <Text>Locatários</Text>
            </Flex>
            <LuChevronRight size={12} />
            <Text color="blue.600">Provisionamento</Text>
          </Flex>

          <IconButton
            aria-label="Voltar"
            variant="ghost"
            bg="white"
            shadow="sm"
            borderRadius="xl"
            onClick={() => navigate("/admin/tenants")}
            _hover={{ transform: "translateX(-4px)", color: "blue.600" }}
          >
            <LuArrowLeft />
          </IconButton>
        </Flex>

        <SimpleGrid columns={{ base: 1, lg: 3 }} gap={12}>
          
          {/* COLUNA DE CONTEXTO (ESQUERDA) */}
          <VStack align="start" gap={8}>
            <VStack align="start" gap={3}>
              <Badge bg="blue.600" color="white" px={3} py={1} borderRadius="lg" fontSize="2xs" fontWeight="black">
                SISTEMA AURA v3
              </Badge>
              <Heading size="3xl" fontWeight="900" color="slate.900" letterSpacing="-1.5px" lineHeight="1.1">
                Nova Instância Imobiliária
              </Heading>
              <Text color="slate.500" fontSize="lg">
                Preencha os dados para criar um ambiente isolado e seguro para o novo cliente.
              </Text>
            </VStack>

            {/* CHECKLIST DE SEGURANÇA */}
            <VStack align="start" gap={4} w="full">
              <StepItem icon={LuCircleCheck} title="Isolamento de Dados" desc="Banco de dados dedicado por tenant." active />
              <StepItem icon={LuLock} title="Segurança Master" desc="Criptografia de ponta a ponta." active />
              <StepItem icon={LuSparkles} title="Interface Aura" desc="Layout personalizado via slug." active={false} />
            </VStack>

            <Box p={6} bg="slate.900" borderRadius="3xl" w="full" color="white" shadow="xl" position="relative" overflow="hidden">
               <Icon as={LuSparkles} position="absolute" right="-10px" top="-10px" fontSize="80px" opacity={0.1} />
               <Text fontSize="sm" fontWeight="bold" mb={2}>Dica Técnica</Text>
               <Text fontSize="xs" opacity={0.8} lineHeight="tall">
                 O 'Slug' define o endereço de acesso. Use apenas letras e números (ex: imobiliaria-central).
               </Text>
            </Box>
          </VStack>

          {/* COLUNA DO FORMULÁRIO (DIREITA) */}
          <Box gridColumn={{ lg: "span 2" }}>
            <MotionDiv
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box 
                bg="white" 
                p={{ base: 6, md: 10, lg: 16 }} 
                borderRadius="4xl" 
                shadow="0 30px 60px -12px rgba(0,0,0,0.05)"
                border="1px solid"
                borderColor="gray.100"
              >
                <VStack align="start" mb={10} gap={2}>
                  <Flex align="center" gap={3} color="blue.600">
                    <Center bg="blue.50" p={2} borderRadius="xl">
                      <LuShieldPlus size={24} />
                    </Center>
                    <Heading size="xl" fontWeight="800" color="slate.900">Configuração Master</Heading>
                  </Flex>
                  <Text color="gray.400">Insira as informações básicas para o provisionamento imediato.</Text>
                </VStack>

                {/* COMPONENTE DE FORMULÁRIO */}
                <TenantForm 
                  onSubmit={handleFormSubmit} 
                  isLoading={isPending} 
                />

                <Center mt={10} pt={10} borderTop="1px dashed" borderColor="gray.100">
                  <Flex align="center" gap={2} color="gray.400">
                    <LuInfo size={14} />
                    <Text fontSize="xs">Infraestrutura gerenciada por <Text as="span" fontWeight="bold" color="gray.600">AWS Cloud Systems</Text></Text>
                  </Flex>
                </Center>
              </Box>
            </MotionDiv>
          </Box>
        </SimpleGrid>

      </Container>
    </Box>
  );
}

// Sub-componente auxiliar
function StepItem({ icon: IconComp, title, desc, active = false }: any) {
  return (
    <Flex gap={4} align="flex-start" opacity={active ? 1 : 0.4}>
      <Center w="10" h="10" bg={active ? "blue.50" : "gray.50"} borderRadius="xl" color={active ? "blue.600" : "gray.400"}>
        <IconComp size={20} />
      </Center>
      <VStack align="start" gap={0}>
        <Text fontWeight="bold" fontSize="sm" color="slate.900">{title}</Text>
        <Text fontSize="xs" color="slate.500">{desc}</Text>
      </VStack>
    </Flex>
  );
}