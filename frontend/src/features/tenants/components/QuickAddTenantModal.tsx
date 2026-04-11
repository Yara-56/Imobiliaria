"use client";

import { useState } from "react";
import {
  Button,
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
  DialogBackdrop, // Adicionado para um UX profissional (escurece o fundo)
  Icon,
} from "@chakra-ui/react";
import { LuUserPlus } from "react-icons/lu";

// ✅ Importando o formulário (Caminho absoluto ou relativo correto)
import TenantForm from "./forms/TenantForm";
import type { CreateTenantDTO } from "../types/tenant.types";
interface QuickAddTenantModalProps {
  onSubmit: (data: CreateTenantDTO) => void;
  isLoading: boolean;
}

/**
 * COMPONENTE: QuickAddTenantModal
 * Objetivo: Botão de ação rápida que abre o Drawer/Modal de cadastro.
 */
export function QuickAddTenantModal({
  onSubmit,
  isLoading,
}: QuickAddTenantModalProps) {
  const [open, setOpen] = useState(false);

  // Fecha o modal apenas se o envio for bem sucedido
  const handleFormSubmit = async (data: CreateTenantDTO) => {
    try {
      await onSubmit(data);
      setOpen(false); 
    } catch (error) {
      console.error("Erro ao processar cadastro:", error);
    }
  };

  return (
    <DialogRoot
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      size="lg"
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <DialogBackdrop />

      {/* 🎯 O BOTÃO NO DASHBOARD */}
      <DialogTrigger asChild>
        <Button
          bg="blue.600"
          color="white"
          height="70px" // Ajustado para 70px para um look mais "Enterprise"
          px={10}
          borderRadius="2xl"
          fontWeight="900"
          fontSize="md"
          letterSpacing="tight"
          boxShadow="0 15px 30px -10px rgba(49, 130, 206, 0.4)"
          gap={3}
          _hover={{ bg: "blue.700", transform: "translateY(-2px)" }}
          _active={{ transform: "translateY(0)" }}
          transition="all 0.2s"
        >
          <Icon as={LuUserPlus} boxSize={6} />
          CADASTRAR INQUILINO
        </Button>
      </DialogTrigger>

      {/* 🖼️ A JANELA FLUTUANTE */}
      <DialogContent
        borderRadius="4xl" // Bordas bem arredondadas para UX Premium
        p={6}
        bg="white"
        boxShadow="0 30px 60px -12px rgba(0, 0, 0, 0.15)"
        border="1px solid"
        borderColor="gray.100"
      >
        <DialogHeader mb={4}>
          <DialogTitle fontSize="2xl" fontWeight="900" color="gray.800">
            Novo Cadastro Rápido
          </DialogTitle>
          <DialogCloseTrigger top={8} right={8} />
        </DialogHeader>

        <DialogBody pb={8}>
          {/* ✅ O FORMULÁRIO DE ALTO NÍVEL */}
          <TenantForm 
            onSubmit={handleFormSubmit} 
            isLoading={isLoading} 
          />
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}