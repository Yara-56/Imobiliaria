"use client";

import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Icon,
  SimpleGrid,
  Center,
} from "@chakra-ui/react";

import { useParams, useNavigate } from "react-router-dom";

// ✔ ÍCONES CORRETOS — somente os que realmente EXISTEM no react-icons/lu (V5)
import {
  LuSignature,
  LuUpload,
  LuCircleCheck,
  LuEye,
  LuSend,
  LuArrowLeft,
} from "react-icons/lu";

import { useTenants } from "../hooks/useTenants";

export default function TenantDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { tenants } = useTenants();
  const tenant = tenants?.find((t: any) => (t._id || t.id) === id);

  if (!tenant) {
    return (
      <Center h="80vh">
        <Text fontSize="lg" fontWeight="bold" color="gray.500">
          Locatário não encontrado.
        </Text>
      </Center>
    );
  }

  return (
    <Box p={10} minH="100vh" bg="#F8FAFC">
      
      {/* HEADER */}
      <HStack justify="space-between" mb="40px">
        
        <HStack>
          <Button
            onClick={() => navigate("/tenants")}
            variant="ghost"
            px="0"
          >
            <HStack>
              <Icon as={LuArrowLeft} />
              <Text>Voltar</Text>
            </HStack>
          </Button>

          <Heading fontWeight="900" letterSpacing="-1px">
            {tenant.fullName}
          </Heading>
        </HStack>

        <Button
          colorPalette="blue"
          borderRadius="xl"
          px={8}
          onClick={() => navigate(`/tenants/${id}/edit`)}
        >
          Editar Perfil
        </Button>
      </HStack>

      {/* PAINÉIS */}
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>

        {/* Upload */}
        <Box
          p={6}
          bg="white"
          borderRadius="3xl"
          border="1px solid"
          borderColor="gray.100"
        >
          <HStack mb={4}>
            <Icon as={LuUpload} boxSize="6" color="blue.600" />
            <Text fontWeight="bold">Enviar Documentos</Text>
          </HStack>

          <Text mb={4} color="gray.500">
            RG, CPF, comprovantes e mais.
          </Text>

          <Button
            w="100%"
            colorPalette="blue"
            onClick={() => navigate(`/tenants/${id}/documents/upload`)}
          >
            Abrir upload
          </Button>
        </Box>

        {/* Revisão */}
        <Box
          p={6}
          bg="white"
          borderRadius="3xl"
          border="1px solid"
          borderColor="gray.100"
        >
          <HStack mb={4}>
            <Icon as={LuEye} boxSize="6" color="blue.600" />
            <Text fontWeight="bold">Revisão de Documentos</Text>
          </HStack>

          <Text mb={4} color="gray.500">
            Aprovar ou rejeitar documentos enviados.
          </Text>

          <Button
            w="100%"
            onClick={() => navigate(`/tenants/${id}/documents/review`)}
          >
            Abrir revisão
          </Button>
        </Box>

        {/* OCR */}
        <Box
          p={6}
          bg="white"
          borderRadius="3xl"
          border="1px solid"
          borderColor="gray.100"
        >
          <HStack mb={4}>
            <Icon as={LuCircleCheck} boxSize="6" color="blue.600" />
            <Text fontWeight="bold">OCR e Identificação</Text>
          </HStack>

          <Text mb={4} color="gray.500">
            Ver dados extraídos automaticamente.
          </Text>

          <Button
            w="100%"
            onClick={() => navigate(`/tenants/${id}/documents/ocr`)}
          >
            Abrir OCR
          </Button>
        </Box>

        {/* Contrato */}
        <Box
          p={6}
          bg="white"
          borderRadius="3xl"
          border="1px solid"
          borderColor="gray.100"
        >
          <HStack mb={4}>
            <Icon as={LuSignature} boxSize="6" color="blue.600" />
            <Text fontWeight="bold">Contrato</Text>
          </HStack>

          <Text mb={4} color="gray.500">
            Contrato automatizado com dados do locatário.
          </Text>

          <Button
            w="100%"
            onClick={() => navigate(`/tenants/${id}/documents/contract`)}
          >
            Gerar Contrato
          </Button>
        </Box>

        {/* Recibo */}
        <Box
          p={6}
          bg="white"
          borderRadius="3xl"
          border="1px solid"
          borderColor="gray.100"
        >
          <HStack mb={4}>
            <Icon as={LuSend} boxSize="6" color="blue.600" />
            <Text fontWeight="bold">Enviar Recibo</Text>
          </HStack>

          <Text mb={4} color="gray.500">
            Envio rápido para e-mail ou WhatsApp.
          </Text>

          <Button
            w="100%"
            onClick={() => navigate(`/tenants/${id}/documents/receipt`)}
          >
            Enviar Recibo
          </Button>
        </Box>

      </SimpleGrid>
    </Box>
  );
}