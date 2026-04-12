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
  profileType?: "PF" | "PJ"
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
        bg="white"
        border="1px solid"
        borderColor="gray.100"
        rounded="2xl"
        p={{ base: 6, md: 10 }}
        maxW="520px"
        w="100%"
        boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
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

          <Text fontSize="sm" color="gray.500">
            Como você deseja configurar seus contratos na plataforma?
          </Text>
        </VStack>

        <VStack gap={4}>
          {/* TIPO DE PERFIL */}
          <Flex gap={3} w="full" mb={2}>
            <Button
              flex={1}
              bg={leadForm.profileType === "PF" ? "blue.50" : "white"}
              color={leadForm.profileType === "PF" ? "blue.600" : "gray.500"}
              border="1px solid"
              borderColor={leadForm.profileType === "PF" ? "blue.200" : "gray.200"}
              onClick={() => setLeadForm({ ...leadForm, profileType: "PF" })}
              _hover={{ bg: "blue.50" }}
            >
              Para Mim (CPF)
            </Button>
            <Button
              flex={1}
              bg={leadForm.profileType === "PJ" ? "blue.50" : "white"}
              color={leadForm.profileType === "PJ" ? "blue.600" : "gray.500"}
              border="1px solid"
              borderColor={leadForm.profileType === "PJ" ? "blue.200" : "gray.200"}
              onClick={() => setLeadForm({ ...leadForm, profileType: "PJ" })}
              _hover={{ bg: "blue.50" }}
            >
              Para Empresa (CNPJ)
            </Button>
          </Flex>

          <Input
            placeholder="Nome completo"
            value={leadForm.name}
            onChange={(e) =>
              setLeadForm({ ...leadForm, name: e.target.value })
            }
            h="52px"
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            rounded="xl"
            color="gray.800"
            _focus={{ borderColor: "blue.400", bg: "white" }}
          />

          <Input
            placeholder="Melhor e-mail de contato"
            value={leadForm.email}
            onChange={(e) =>
              setLeadForm({ ...leadForm, email: e.target.value })
            }
            h="52px"
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            rounded="xl"
            color="gray.800"
            _focus={{ borderColor: "blue.400", bg: "white" }}
          />

          {leadForm.profileType === "PJ" && (
            <Input
              placeholder="Nome da empresa / imobiliária"
              value={leadForm.company}
              onChange={(e) =>
                setLeadForm({ ...leadForm, company: e.target.value })
              }
              h="52px"
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
              rounded="xl"
              color="gray.800"
              _focus={{ borderColor: "blue.400", bg: "white" }}
            />
          )}

          <Input
            placeholder="WhatsApp / Telefone (Opcional)"
            value={leadForm.phone}
            onChange={(e) =>
              setLeadForm({ ...leadForm, phone: e.target.value })
            }
            h="52px"
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            rounded="xl"
            color="gray.800"
            _focus={{ borderColor: "blue.400", bg: "white" }}
          />
        </VStack>

        <Flex mt={8} direction="column" gap={3}>
          <Button
            w="full"
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
            Confirmar e Iniciar
          </Button>

          <Button
            w="full"
            h="52px"
            rounded="xl"
            variant="ghost"
            color="gray.500"
            fontWeight="bold"
            onClick={onClose}
            _hover={{
              bg: "gray.50",
              color: "gray.700"
            }}
          >
            Pular por enquanto
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