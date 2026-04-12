"use client"

import React from "react"
import {
  Box,
  Text,
  VStack,
  Input,
  Button,
  Flex,
} from "@chakra-ui/react"

interface LeadFormState {
  name: string
  email: string
  company: string
  phone: string
}

interface LeadCaptureModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  leadForm: LeadFormState
  setLeadForm: (value: LeadFormState) => void
}

export default function LeadCaptureModal({
  isOpen,
  onClose,
  onSubmit,
  leadForm,
  setLeadForm,
}: LeadCaptureModalProps) {
  if (!isOpen) return null

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={1000}
      bg="rgba(0,0,0,0.64)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
      backdropFilter="blur(6px)"
    >
      <Box
        bg="rgba(20,20,20,0.95)"
        border="1px solid rgba(255,255,255,0.08)"
        rounded="2xl"
        p={{ base: 6, md: 10 }}
        maxW="520px"
        w="100%"
        animation="showModal 0.35s ease forwards"
      >
        <VStack gap={2} textAlign="center" mb={6}>
          <Text
            fontSize="2xl"
            fontWeight="900"
            bgGradient="linear(to-r,#06b6d4,#0ea5e9)"
            bgClip="text"
          >
            Comece agora - sem compromisso
          </Text>

          <Text fontSize="sm" color="gray.300">
            Preencha seus dados e nossa equipe retornará em minutos.
          </Text>
        </VStack>

        <VStack gap={4}>
          <Input
            placeholder="Seu nome"
            value={leadForm.name}
            onChange={(e) =>
              setLeadForm({ ...leadForm, name: e.target.value })
            }
            h="52px"
            bg="rgba(255,255,255,0.05)"
            border="1px solid rgba(255,255,255,0.08)"
            rounded="xl"
            color="white"
          />

          <Input
            placeholder="Seu e-mail"
            value={leadForm.email}
            onChange={(e) =>
              setLeadForm({ ...leadForm, email: e.target.value })
            }
            h="52px"
            bg="rgba(255,255,255,0.05)"
            border="1px solid rgba(255,255,255,0.08)"
            rounded="xl"
            color="white"
          />

          <Input
            placeholder="Nome da imobiliária"
            value={leadForm.company}
            onChange={(e) =>
              setLeadForm({ ...leadForm, company: e.target.value })
            }
            h="52px"
            bg="rgba(255,255,255,0.05)"
            border="1px solid rgba(255,255,255,0.08)"
            rounded="xl"
            color="white"
          />

          <Input
            placeholder="Telefone (opcional)"
            value={leadForm.phone}
            onChange={(e) =>
              setLeadForm({ ...leadForm, phone: e.target.value })
            }
            h="52px"
            bg="rgba(255,255,255,0.05)"
            border="1px solid rgba(255,255,255,0.08)"
            rounded="xl"
            color="white"
          />
        </VStack>

        <Flex mt={8} gap={4}>
          <Button
            flex={1}
            h="52px"
            rounded="xl"
            bg="linear-gradient(135deg,#06b6d4,#0ea5e9)"
            color="white"
            fontWeight="bold"
            onClick={onSubmit}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "0 15px 35px rgba(6,182,212,0.35)",
            }}
            transition="all 0.25s ease"
          >
            Enviar
          </Button>

          <Button
            flex={1}
            h="52px"
            rounded="xl"
            bg="rgba(255,255,255,0.08)"
            color="gray.300"
            onClick={onClose}
            _hover={{
              bg: "rgba(255,255,255,0.12)",
            }}
          >
            Cancelar
          </Button>
        </Flex>
      </Box>

      <style>{`
        @keyframes showModal {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0px) scale(1); }
        }
      `}</style>
    </Box>
  )
}