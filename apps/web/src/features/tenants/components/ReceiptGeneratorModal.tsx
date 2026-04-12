"use client";

import React from "react";
import { Box, Flex, Heading, IconButton, Button, Text, VStack, HStack, Separator } from "@chakra-ui/react";
import { LuX, LuPrinter } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";

const MotionFlex = motion.create(Flex);
const MotionBox = motion.create(Box);

interface ReceiptGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantData: any;
}

export function ReceiptGeneratorModal({ isOpen, onClose, tenantData }: ReceiptGeneratorModalProps) {
  
  const handlePrint = () => {
    window.print();
  };

  const rentValue = tenantData?.rentValue ? `R$ ${tenantData.rentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "R$ 0,00";
  const dateStr = new Date().toLocaleDateString('pt-BR');

  return (
    <AnimatePresence>
      {isOpen && (
        <MotionFlex
          position="fixed" inset={0} zIndex={9999}
          bg="rgba(0, 0, 0, 0.6)" backdropFilter="blur(6px)"
          align="center" justify="center" p={4}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="no-print" // Esconde o fundo escuro na hora da impressão
        >
          <MotionBox
            bg="white" w="full" maxW="2xl" borderRadius="2xl"
            boxShadow="2xl" overflow="hidden"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            className="print-container" // Tag para o CSS de impressão
          >
            {/* HEADER CONTROLS (NÃO IMPRIME) */}
            <Flex p={4} justify="space-between" align="center" borderBottom="1px solid" borderColor="gray.100" bg="gray.50" className="no-print">
              <Heading size="sm" color="gray.700">Visualização do Recibo</Heading>
              <HStack gap={2}>
                <Button size="sm" colorPalette="blue" onClick={handlePrint} gap={2}>
                  <LuPrinter /> Imprimir / Salvar PDF
                </Button>
                <IconButton aria-label="Fechar" variant="ghost" size="sm" onClick={onClose}>
                  <LuX />
                </IconButton>
              </HStack>
            </Flex>

            {/* CORPO DO RECIBO (O QUE VAI PARA O PDF) */}
            <Box p={10} id="receipt-paper" bg="white">
              <Flex justify="space-between" align="start" mb={8}>
                <VStack align="start" gap={0}>
                  <Heading size="lg" color="blue.600" fontWeight="900">RECIBO DE PAGAMENTO</Heading>
                  <Text color="gray.500" fontSize="sm">Nº {Math.floor(Math.random() * 100000).toString().padStart(6, '0')}</Text>
                </VStack>
                <VStack align="end" gap={0}>
                  <Text fontWeight="bold" fontSize="2xl" color="gray.800">{rentValue}</Text>
                  <Text color="gray.500" fontSize="sm">Emissão: {dateStr}</Text>
                </VStack>
              </Flex>

              <Box border="2px solid" borderColor="gray.200" borderRadius="xl" p={6} mb={8}>
                <Text fontSize="md" lineHeight="1.8" color="gray.700">
                  Recebemos de <b>{tenantData?.fullName || "LOCATÁRIO"}</b>, inscrito(a) no documento <b>{tenantData?.document || "---"}</b>, 
                  a quantia de <b>{rentValue}</b>, referente ao pagamento do aluguel / encargos de locação.
                </Text>
              </Box>

              <Separator mb={8} borderColor="gray.200" />

              <Flex justify="space-between" align="end">
                <VStack align="start" gap={1}>
                  <Text fontWeight="bold" color="gray.800">HomeFlux Gestão Imobiliária LTDA</Text>
                  <Text fontSize="sm" color="gray.500">CNPJ: 00.000.000/0001-00</Text>
                  <Text fontSize="sm" color="gray.500">Av. Paulista, 1000 - São Paulo, SP</Text>
                </VStack>
                <VStack gap={1} align="center">
                  <Box borderBottom="1px solid black" w="250px" h="40px" />
                  <Text fontSize="xs" color="gray.500">Assinatura do Recebedor</Text>
                </VStack>
              </Flex>
            </Box>
          </MotionBox>
        </MotionFlex>
      )}
      
      {/* CSS MÁGICO PARA IMPRESSÃO PERFEITA */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .no-print { display: none !important; }
          .print-container { box-shadow: none !important; border: none !important; }
          #receipt-paper, #receipt-paper * { visibility: visible; }
          #receipt-paper { position: absolute; left: 0; top: 0; width: 100%; padding: 0 !important; }
        }
      `}</style>
    </AnimatePresence>
  );
}