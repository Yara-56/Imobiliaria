"use client";

import { 
  Badge, 
  Box, 
  Button, 
  Flex, 
  Heading, 
  Icon, 
  IconButton, 
  Separator, 
  Text, 
  VStack, 
  HStack, 
  Center 
} from "@chakra-ui/react";
import { 
  LuMail, 
  LuPhone, 
  LuPencil, 
  LuTrash2, 
  LuBuilding2, 
  LuExternalLink 
} from "react-icons/lu";
import { Tenant } from "../types/tenant.enums";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface TenantCardProps {
  tenant: Tenant;
  onDelete: (id: string) => void;
}

// Criando o componente base para animação
const MotionBox = motion.create(Box);

export default function TenantCard({ tenant, onDelete }: TenantCardProps) {
  const navigate = useNavigate();

  // ✅ Cores profissionais: Adeus preto, olá Cinza Grafite e Azul Suave
  const titleColor = "gray.700"; 
  const infoColor = "gray.500";
  const accentColor = "blue.500";
  const iconBg = "blue.50";

  // ✅ Lógica para capturar o ID independente se vier do Prisma (_id) ou API (id)
  const tenantId = (tenant as any).id || (tenant as any)._id || "---";

  // ✅ Lógica de Status Segura
  const isActive = String(tenant.status || "").toLowerCase() === "active";

  return (
    <MotionBox
      // Animação de entrada e hover
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)" }}
      transition={{ duration: 0.3 }}
      // Estilos do Container
      bg="white"
      p={6}
      borderRadius="3xl"
      border="1px solid"
      borderColor="gray.100"
      position="relative"
      overflow="hidden"
    >
      {/* Detalhe visual de fundo (Marca d'água) */}
      <Box 
        position="absolute" 
        right="-10" 
        top="-10" 
        color="gray.50" 
        zIndex={0}
        transform="rotate(-10deg)"
      >
        <LuBuilding2 size={130} />
      </Box>

      <VStack align="start" gap={5} position="relative" zIndex={1}>
        {/* HEADER DO CARD */}
        <Flex w="full" justify="space-between" align="flex-start">
          <VStack align="start" gap={0}>
            <Heading size="md" fontWeight="800" color={titleColor} letterSpacing="tight">
              {tenant.fullName}
            </Heading>
            <Text fontSize="2xs" fontWeight="bold" color="blue.400" opacity={0.8}>
              ID: {String(tenantId).slice(-6).toUpperCase()}
            </Text>
          </VStack>
          
          <Badge 
            colorPalette={isActive ? "green" : "orange"} 
            variant="subtle" 
            px={3} 
            borderRadius="full"
            fontSize="10px"
            fontWeight="bold"
          >
            {isActive ? "ATIVO" : "PENDENTE"}
          </Badge>
        </Flex>

        <Separator opacity={0.3} />

        {/* INFORMAÇÕES DE CONTATO */}
        <VStack align="start" gap={3} w="full">
          <HStack gap={3}>
            <Center bg={iconBg} boxSize={8} borderRadius="lg" color={accentColor}>
              <LuMail size={14} />
            </Center>
            <Text fontSize="sm" color={infoColor} fontWeight="medium">
              {tenant.email}
            </Text>
          </HStack>

          <HStack gap={3}>
            <Center bg={iconBg} boxSize={8} borderRadius="lg" color={accentColor}>
              <LuPhone size={14} />
            </Center>
            <Text fontSize="sm" color={infoColor} fontWeight="medium">
              {tenant.phone || "Telefone não informado"}
            </Text>
          </HStack>
        </VStack>

        {/* AÇÕES (BOTÕES) */}
        <Flex w="full" gap={3} mt={2}>
          <Button
            flex={1}
            variant="subtle"
            colorPalette="blue"
            size="sm"
            borderRadius="xl"
            fontWeight="bold"
            _hover={{ bg: "blue.600", color: "white" }}
            onClick={() => navigate(`/admin/tenants/edit/${tenantId}`)}
          >
            <LuExternalLink size={14} style={{ marginRight: '6px' }} />
            Detalhes
          </Button>

          <IconButton
            aria-label="Editar"
            variant="outline"
            size="sm"
            borderRadius="xl"
            borderColor="gray.100"
            color="gray.400"
            _hover={{ color: "blue.500", borderColor: "blue.100", bg: "gray.50" }}
            onClick={() => navigate(`/admin/tenants/edit/${tenantId}`)}
          >
            <LuPencil size={14} />
          </IconButton>

          <IconButton
            aria-label="Excluir"
            variant="ghost"
            size="sm"
            borderRadius="xl"
            colorPalette="red"
            onClick={() => {
              if (tenantId !== "---") onDelete(tenantId);
            }}
          >
            <LuTrash2 size={14} />
          </IconButton>
        </Flex>
      </VStack>
    </MotionBox>
  );
}