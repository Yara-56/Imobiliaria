"use client";

import React, { useState } from "react";
import { 
  Box, Container, Button, Heading, Text, VStack, 
  HStack, Center, Flex, Icon, Input, SimpleGrid, Stack
} from "@chakra-ui/react";
import { LuArrowLeft, LuHouse, LuSparkles } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toaster } from "@/components/ui/toaster.js";
import { http } from "@/lib/http";

const MotionBox = motion.create(Box);

export default function NewPropertyPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    rentAmount: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.address || !formData.rentAmount) {
      return toaster.create({ title: "Preencha os campos obrigatórios", type: "error" });
    }

    setIsLoading(true);
    try {
      // Enviando para a sua API real
      await http.post("/properties", {
        title: formData.title,
        address: formData.address,
        rentAmount: Number(formData.rentAmount.replace(/\D/g, "")), // Limpa R$ antes de enviar
        status: "AVAILABLE"
      });
      
      toaster.create({
        title: "Imóvel cadastrado!",
        description: "Ele já está disponível para vinculação a um contrato.",
        type: "success",
      });

      navigate("/admin/properties");
    } catch (error) {
      console.error(error);
      toaster.create({
        title: "Erro ao cadastrar",
        description: "Falha na comunicação com o servidor.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={{ base: 4, md: 8 }} pb={{ base: 24, md: 12 }} bg="#FAFAFA" minH="100vh">
      <Container maxW="4xl">
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          
          <Button variant="ghost" mb={8} onClick={() => navigate("/admin/properties")} color="gray.500" gap={2} borderRadius="xl">
            <LuArrowLeft size={18} /> Voltar
          </Button>

          <VStack align="start" gap={6} mb={10}>
            <HStack gap={5}>
              <Center bg="blue.50" p={4} borderRadius="2xl" color="blue.600" boxShadow="sm">
                <LuHouse size={28} />
              </Center>
              <VStack align="start" gap={1}>
                <Heading size="lg" fontWeight="900" color="gray.800" letterSpacing="tight">Novo Imóvel</Heading>
                <Text color="gray.500" fontSize="sm" fontWeight="medium">Adicione uma casa ou apartamento ao seu portfólio.</Text>
              </VStack>
            </HStack>
          </VStack>

          <Box p={{ base: 6, md: 10 }} bg="white" borderRadius="3xl" boxShadow="0 4px 20px rgba(0,0,0,0.03)" border="1px solid" borderColor="gray.100">
            <Box as="form" onSubmit={handleSubmit} w="full">
              <Stack gap={6}>
                
                <Stack gap={1.5}>
                  <Text fontSize="sm" fontWeight="semibold" color="gray.700">Título ou Apelido do Imóvel</Text>
                  <Input 
                    value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Apartamento 302 - Residencial Flores" 
                    bg="gray.50" size="lg" borderRadius="xl" border="none" 
                  />
                </Stack>

                <Stack gap={1.5}>
                  <Text fontSize="sm" fontWeight="semibold" color="gray.700">Endereço Completo</Text>
                  <Input 
                    value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Ex: Rua das Américas, 123 - Centro" 
                    bg="gray.50" size="lg" borderRadius="xl" border="none" 
                  />
                </Stack>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                  <Stack gap={1.5}>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">Valor Base do Aluguel (R$)</Text>
                    <Input 
                      type="number"
                      value={formData.rentAmount} onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
                      placeholder="Ex: 2500" 
                      bg="gray.50" size="lg" borderRadius="xl" border="none" 
                    />
                  </Stack>
                </SimpleGrid>

                <Flex justify="flex-end" pt={4}>
                  <Button
                    type="submit" bg="blue.600" color="white" size="lg" h="56px" px={10} borderRadius="2xl" fontWeight="bold"
                    loading={isLoading} _hover={{ bg: "blue.700", transform: "translateY(-2px)" }} transition="all 0.2s"
                  >
                    Salvar Imóvel
                  </Button>
                </Flex>

              </Stack>
            </Box>
          </Box>

          <Flex mt={12} justify="center" align="center" gap={2} opacity={0.6}>
            <Icon as={LuSparkles} color="blue.500" />
            <Text fontSize="xs" color="gray.500" fontWeight="bold" letterSpacing="widest">HOMEFLUX PRO v3.0</Text>
          </Flex>

        </MotionBox>
      </Container>
    </Box>
  );
}