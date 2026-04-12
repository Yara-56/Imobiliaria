"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { 
  Box, Container, Heading, Text, VStack, 
  Spinner, Center, Flex, IconButton, Button, Badge, Stack 
} from "@chakra-ui/react";
import { LuArrowLeft, LuShieldCheck, LuCircleAlert, LuTrash2, LuSignature, LuReceipt } from "react-icons/lu";

import { useTenants } from "../hooks/useTenants";
import TenantForm from "../components/forms/TenantForm";
import type { TenantFormData } from "../schemas/tenant.schema";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";
import { ReceiptGeneratorModal } from "../components/ReceiptGeneratorModal";
import { toaster } from "@/components/ui/toaster.js";
import { http } from "@/lib/http";

export default function EditTenantPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // ✅ CORREÇÃO: Pegando as variáveis do lugar certo no seu hook
  const { 
    tenant, 
    isLoading, // listQuery.isLoading
    actions, 
    mutations 
  } = (useTenants(id) as any) || {};

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSendingContract, setIsSendingContract] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const handleUpdate = async (formData: TenantFormData) => {
    if (!id) return;
    try {
      if (actions?.update) await actions.update({ id, data: formData });
      navigate("/admin/tenants");
    } catch (error) {
      // O Toaster já é chamado dentro do hook (onError)
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      if (actions?.remove) await actions.remove(id);
      navigate("/admin/tenants");
    } catch (error) {
      // O erro já é tratado no Toaster dentro do hook useTenants
    }
  };

  const handleSendContract = async () => {
    if (!id) return;
    try {
      setIsSendingContract(true);
      
      // Faz a requisição para a nossa rota do Express
      await http.post("/contracts/send", { 
        tenantId: id,
        // Simulando a URL do PDF (No futuro você passaria o PDF real gerado)
        documentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" 
      });

      toaster.create({
        title: "Contrato Enviado!",
        description: "O inquilino recebeu o link da ZapSign no e-mail.",
        type: "success"
      });
    } catch (error) {
      toaster.create({ title: "Erro ao enviar", type: "error" });
    } finally {
      setIsSendingContract(false);
    }
  };

  // 1. LOADING DO DETALHE (Busca inicial)
  if (isLoading) return (
    <Center h="100vh" bg="#F8FAFC">
      <VStack gap={6}>
        <Spinner size="xl" color="blue.600" borderWidth="4px" />
        <Text fontWeight="black" color="gray.400" fontSize="xs" letterSpacing="widest">
          SINCRONIZANDO INFRAESTRUTURA
        </Text>
      </VStack>
    </Center>
  );

  // 2. ERRO (Se não carregando e sem tenant)
  if (!tenant && !isLoading) return (
    <Center h="100vh" bg="#F8FAFC">
      <Container maxW="md">
        <VStack gap={6} p={10} bg="white" borderRadius="3xl" boxShadow="2xl" textAlign="center">
          <Box color="red.500" bg="red.50" p={4} borderRadius="full">
            <LuCircleAlert size={40} />
          </Box>
          <VStack gap={2}>
            <Heading size="md" fontWeight="800">Node não identificado</Heading>
            <Text color="gray.500" fontSize="sm">A instância solicitada não existe.</Text>
          </VStack>
          <Button w="full" colorPalette="blue" size="lg" borderRadius="xl" onClick={() => navigate("/admin/tenants")}>
            Voltar ao Dashboard
          </Button>
        </VStack>
      </Container>
    </Center>
  );

  return (
    <Box p={{ base: 4, md: 10 }} bg="#F8FAFC" minH="100vh">
      <Container maxW="2xl">
        <Flex align="center" justify="space-between" mb={10}>
          <Stack gap={1}>
            <Flex align="center" gap={2} color="blue.600">
              <LuShieldCheck size={18} />
              <Badge variant="subtle" colorPalette="blue" fontSize="10px" borderRadius="md" px={2}>
                CONFIGURAÇÃO MASTER
              </Badge>
            </Flex>
            <Heading size="xl" fontWeight="900" color="gray.800" letterSpacing="-1.5px">
              Ajustar Locatário
            </Heading>
          </Stack>
          
          <Flex gap={3}>
            <Button
              bg="green.600"
              color="white"
              borderRadius="xl"
              fontWeight="bold"
              onClick={() => setIsReceiptModalOpen(true)}
              _hover={{ bg: "green.700", transform: "translateY(-2px)" }}
            >
              <LuReceipt /> Emitir Recibo
            </Button>
            <Button
              bg="blue.600"
              color="white"
              borderRadius="xl"
              fontWeight="bold"
              onClick={handleSendContract}
              loading={isSendingContract}
              _hover={{ bg: "blue.700", transform: "translateY(-2px)" }}
            >
              <LuSignature /> Assinar Contrato
            </Button>
            <IconButton
              aria-label="Excluir inquilino"
              variant="outline"
              bg="white"
              color="red.500"
              borderColor="red.200"
              borderRadius="xl"
              _hover={{ bg: "red.50", borderColor: "red.300", transform: "translateY(-2px)" }}
              transition="all 0.2s"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <LuTrash2 size={18} />
            </IconButton>
            <IconButton
              aria-label="Voltar"
              variant="outline"
              bg="white"
              borderRadius="xl"
              onClick={() => navigate("/admin/tenants")}
            >
              <LuArrowLeft size={18} />
            </IconButton>
          </Flex>
        </Flex>

        <Box bg="white" p={10} borderRadius="4xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
          <TenantForm
            initialData={tenant as Partial<TenantFormData>}
            onSubmit={handleUpdate}
            isLoading={mutations?.isUpdating || false}
          />
        </Box>

        {/* Renderiza o modal seguro no final da página */}
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          isLoading={mutations?.isDeleting || false}
          tenantName={tenant?.fullName || "este inquilino"}
        />

        {/* Renderiza o gerador de recibo */}
        <ReceiptGeneratorModal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          tenantData={tenant}
        />
      </Container>
    </Box>
  );
}