"use client";

import { useParams, useNavigate } from "react-router-dom";
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  VStack, 
  Spinner, 
  Center, 
  Flex, 
  IconButton,
  Button,
  Badge
} from "@chakra-ui/react";
import { 
  LuArrowLeft, 
  LuShieldCheck, 
  LuCircleAlert 
} from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import api from "@/core/api/api";
import { Tenant } from "../types/tenant";
import { useUpdateTenant } from "../hooks/useUpdateTenant";
import TenantForm from "../components/TenantForm";

export default function EditTenantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { mutate: updateTenant, isPending: isUpdating } = useUpdateTenant();

  const { data: tenant, isLoading, isError } = useQuery<Tenant>({
    queryKey: ["tenant", id],
    queryFn: async () => {
      const { data } = await api.get(`/tenants/${id}`);
      return data.data || data;
    },
    enabled: !!id,
    retry: 1,
  });

  // 1. LOADING STATE - Corrigido para Chakra v3
  if (isLoading) return (
    <Center h="100vh" bg="#F8FAFC">
      <VStack gap={6}>
        {/* 'thickness' mudou para 'borderWidth' no Chakra v3 */}
        <Spinner 
          size="xl" 
          color="blue.500" 
          borderWidth="4px" 
        />
        <Text fontWeight="black" color="gray.400" fontSize="xs" letterSpacing="widest">
          SINCRONIZANDO DADOS DA INSTÂNCIA
        </Text>
      </VStack>
    </Center>
  );

  // 2. ERROR STATE
  if (isError || !tenant) return (
    <Center h="100vh" bg="#F8FAFC">
      <Container maxW="md">
        <VStack gap={6} p={10} bg="white" borderRadius="3xl" shadow="2xl" textAlign="center">
          <Box color="red.500" bg="red.50" p={4} borderRadius="full">
            <LuCircleAlert size={40} />
          </Box>
          <VStack gap={2}>
            <Heading size="md" fontWeight="800">Instância não localizada</Heading>
            <Text color="gray.500" fontSize="sm">
              Não conseguimos encontrar este locatário ou o servidor está offline.
            </Text>
          </VStack>
          <Button 
            w="full"
            colorPalette="blue"
            size="lg"
            borderRadius="xl"
            onClick={() => navigate("/admin/tenants")}
          >
            Voltar para a Listagem
          </Button>
        </VStack>
      </Container>
    </Center>
  );

  return (
    <Box p={{ base: 4, md: 10 }} bg="#F8FAFC" minH="100vh">
      <Container maxW="2xl">
        
        <Flex align="center" justify="space-between" mb={10}>
          <VStack align="start" gap={1}>
            <Flex align="center" gap={2} color="blue.600">
              <LuShieldCheck size={18} />
              <Badge variant="surface" colorPalette="blue" fontSize="10px" borderRadius="md" px={2}>
                AMBIENTE DE CONFIGURAÇÃO
              </Badge>
            </Flex>
            <Heading size="xl" fontWeight="900" color="slate.800" letterSpacing="-1.5px">
              Ajustar Locatário
            </Heading>
            <Text color="gray.500" fontSize="sm">
              Alterando dados master de: 
              <Text as="span" fontWeight="900" color="blue.600" ml={1}>
                {tenant.name}
              </Text>
            </Text>
          </VStack>
          
          <IconButton
            aria-label="Voltar"
            variant="outline"
            bg="white"
            borderRadius="xl"
            onClick={() => navigate("/admin/tenants")}
            _hover={{ shadow: "md", transform: "translateX(-2px)" }}
          >
            <LuArrowLeft />
          </IconButton>
        </Flex>

        <Box 
          bg="white" 
          p={{ base: 6, md: 10 }} 
          borderRadius="3xl" 
          shadow="0 30px 60px -12px rgba(0, 0, 0, 0.05)" 
          border="1px solid" 
          borderColor="gray.100"
        >
          <TenantForm 
            initialData={tenant} 
            onSubmit={(formData) => updateTenant({ id: id!, data: formData })}
            isLoading={isUpdating}
          />
        </Box>

        <Text mt={8} textAlign="center" fontSize="xs" color="gray.400" fontWeight="bold" letterSpacing="0.5px">
          SISTEMA DE GESTÃO PATRIMONIAL v2.0
        </Text>
      </Container>
    </Box>
  );
}