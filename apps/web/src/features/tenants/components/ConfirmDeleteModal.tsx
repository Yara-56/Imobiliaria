"use client";

import React from "react";
import { Box, Flex, Heading, Text, Button, Icon } from "@chakra-ui/react";
import { LuCircleAlert } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion.create(Box);
const MotionFlex = motion.create(Flex);

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  tenantName: string;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  tenantName,
}: ConfirmDeleteModalProps) {
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
          p={4}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <MotionBox
            bg="white"
            w="full"
            maxW="md"
            borderRadius="3xl"
            boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            p={8}
            textAlign="center"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <Flex justify="center" mb={6}>
              <Flex w={16} h={16} bg="red.50" color="red.500" borderRadius="full" align="center" justify="center">
                <Icon as={LuCircleAlert} boxSize={8} />
              </Flex>
            </Flex>
            
            <Heading size="lg" fontWeight="900" color="gray.800" mb={3}>
              Excluir Inquilino?
            </Heading>
            <Text color="gray.500" fontSize="sm" mb={8} lineHeight="tall">
              Tem certeza que deseja excluir <b>{tenantName}</b>? Esta ação removerá o acesso do usuário ao sistema e não poderá ser desfeita.
            </Text>

            <Flex gap={3} w="full">
              <Button flex={1} variant="ghost" bg="gray.50" h="50px" borderRadius="xl" onClick={onClose} disabled={isLoading}>
                Cancelar
              </Button>
              <Button
                flex={1}
                bg="red.500"
                color="white"
                h="50px"
                borderRadius="xl"
                fontWeight="bold"
                _hover={{ bg: "red.600" }}
                onClick={onConfirm}
                loading={isLoading}
              >
                Sim, excluir
              </Button>
            </Flex>
          </MotionBox>
        </MotionFlex>
      )}
    </AnimatePresence>
  );
}