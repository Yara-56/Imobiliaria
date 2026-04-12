"use client";

import React from "react";

import {
  Box, 
  Flex, 
  Heading, 
  IconButton
} from "@chakra-ui/react";
import { LuX } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";

// ✅ Importando o formulário (Caminho absoluto ou relativo correto)
import TenantForm from "./forms/TenantForm";
import type { TenantFormData } from "../schemas/tenant.schema";

interface QuickAddTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TenantFormData) => void;
  isLoading: boolean;
}

const MotionBox = motion.create(Box);
const MotionFlex = motion.create(Flex);

/**
 * COMPONENTE: QuickAddTenantModal
 * Objetivo: Modal flutuante de cadastro rápido (À prova de falhas com Framer Motion).
 */
export function QuickAddTenantModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: QuickAddTenantModalProps) {

  return (
    <AnimatePresence>
      {isOpen && (
          <MotionFlex
            position="fixed"
            inset={0}
            zIndex={9999}
            bg="rgba(0, 0, 0, 0.6)"
            backdropFilter="blur(6px)"
            align="center"
            justify="center"
            p={{ base: 4, md: 6 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {/* A Janela do Modal */}
            <MotionBox
              bg="white"
              w="full"
              maxW="3xl" // Um pouco mais largo para os campos respirarem
              maxH="90vh" // Garante que a rolagem aconteça DENTRO do modal e não bugue a tela
              borderRadius="3xl"
              boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              display="flex"
              flexDirection="column"
              overflow="hidden"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Header Fixo (Não rola junto com o form) */}
              <Flex p={6} justify="space-between" align="center" borderBottom="1px solid" borderColor="gray.100">
                <Heading size="md" fontWeight="900" color="gray.800">
                  Novo Inquilino
                </Heading>
                <IconButton
                  aria-label="Fechar"
                  variant="ghost"
                  size="sm"
                  borderRadius="full"
                  onClick={onClose}
                >
                  <LuX size={20} />
                </IconButton>
              </Flex>

              {/* Corpo Rolável (Aqui fica o formulário) */}
              <Box p={{ base: 4, md: 8 }} overflowY="auto" flex={1}>
                <TenantForm onSubmit={onSubmit} isLoading={isLoading} />
              </Box>
            </MotionBox>
          </MotionFlex>
      )}
    </AnimatePresence>
  );
}