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
} from "@chakra-ui/react";
import { 
  LuMail, LuPhone, LuPencil, LuTrash2, 
  LuBuilding2, LuExternalLink 
} from "react-icons/lu";
import { Tenant } from "../types/tenant";
import { TenantStatusBadge } from "./TenantStatusBadge";
import { motion } from "framer-motion";

interface TenantCardProps {
  tenant: Tenant;
  onDelete: (id: string) => void;
}

const MotionBox = motion.create(Box);

export default function TenantCard({ tenant, onDelete }: TenantCardProps) {
  return (
    <MotionBox
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      bg="white"
      p={6}
      borderRadius="3xl"
      shadow="sm"
      border="1px solid"
      borderColor="gray.100"
      _hover={{ shadow: "xl", borderColor: "blue.200" }}
      position="relative"
      overflow="hidden"
    >
      <Icon
        as={LuBuilding2}
        position="absolute"
        right="-10px"
        top="-10px"
        boxSize="100px"
        color="gray.50"
        zIndex={0}
      />

      <VStack align="start" gap={4} position="relative" zIndex={1}>
        <Flex w="full" justify="space-between" align="flex-start">
          <VStack align="start" gap={1}>
            <Heading size="md" fontWeight="800">
              {tenant.fullName}
            </Heading>
            <Badge variant="subtle" colorPalette="blue" size="sm" borderRadius="md">
              ID: {tenant.tenantId || "---"}
            </Badge>
          </VStack>
          <TenantStatusBadge status={tenant.status} />
        </Flex>

        <Separator />

        <VStack align="start" gap={2} w="full">
          <Flex align="center" gap={3}>
            <Icon as={LuMail} boxSize={4} color="blue.400" />
            <Text fontSize="sm" fontWeight="medium">
              {tenant.email}
            </Text>
          </Flex>

          <Flex align="center" gap={3}>
            <Icon as={LuPhone} boxSize={4} color="blue.400" />
            <Text fontSize="sm" fontWeight="medium">
              {tenant.phone || "Não informado"}
            </Text>
          </Flex>
        </VStack>

        <Flex mt={2} w="full" gap={2}>
          <Button
            flex={1}
            size="sm"
            variant="subtle"
            colorPalette="blue"
            borderRadius="xl"
          >
            <LuExternalLink size={14} /> Detalhes
          </Button>

          <IconButton
            aria-label="Editar"
            size="sm"
            variant="outline"
            borderRadius="xl"
          >
            <LuPencil size={14} />
          </IconButton>

          <IconButton
            aria-label="Excluir"
            size="sm"
            variant="ghost"
            colorPalette="red"
            borderRadius="xl"
            onClick={() => {
              if (confirm(`Deseja realmente remover ${tenant.fullName}?`)) {
                onDelete(tenant._id);
              }
            }}
          >
            <LuTrash2 size={14} />
          </IconButton>
        </Flex>
      </VStack>
    </MotionBox>
  );
}