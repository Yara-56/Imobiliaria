"use client"

import { Box, Container, Heading, Text, Button, VStack, HStack, Image, Stack, Badge } from "@chakra-ui/react";
// ✅ Agora o 'motion' será usado para criar componentes animados
import { motion } from "framer-motion";
import { LuArrowRight, LuLayoutDashboard, LuShieldCheck } from "react-icons/lu"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../core/hooks/useAuth";

// 1. Criando os componentes animados usando o 'motion' importado
const MotionVStack = motion(VStack);
const MotionBox = motion(Box);

export const HeroSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleDashboardRedirect = () => {
    navigate(isAuthenticated ? "/admin/dashboard" : "/login");
  };

  return (
    <Box as="section" bg="gray.950" py={{ base: 20, md: 40 }} position="relative" overflow="hidden">
      <Container maxW="6xl" position="relative" zIndex={1}>
        <Stack direction={{ base: "column", md: "row" }} align="center" gap={16}>
          
          {/* ✅ 2. Usando o MotionVStack para uma entrada suave do texto */}
          <MotionVStack 
            align={{ base: "center", md: "start" }} 
            gap={8} 
            flex={1}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Badge colorPalette="blue" variant="subtle" borderRadius="full" px={4}>
              <HStack gap={2}>
                <LuShieldCheck size={14} />
                <Text fontSize="xs">PROTEÇÃO DE DADOS 2026</Text>
              </HStack>
            </Badge>

            <Heading size="4xl" fontWeight="black" color="white" letterSpacing="tighter">
              Sua imobiliária na <br />
              <Text as="span" color="blue.500">era da inteligência.</Text>
            </Heading>

            <Text fontSize="xl" color="gray.400" textAlign={{ base: "center", md: "left" }}>
              Centralize contratos e métricas com o ImobiSys. 
              A plataforma definitiva para o gestor moderno.
            </Text>

            <Stack direction={{ base: "column", sm: "row" }} gap={4} w="full">
              <Button colorPalette="blue" size="xl" borderRadius="full" onClick={handleDashboardRedirect}>
                <HStack gap={2}>
                  <Text>{isAuthenticated ? "Ver Dashboard" : "Acessar Agora"}</Text>
                  <LuArrowRight size={20} />
                </HStack>
              </Button>

              <Button variant="ghost" color="white" size="xl" borderRadius="full">
                <HStack gap={2}>
                  <LuLayoutDashboard size={20} />
                  <Text>Explorar Funções</Text>
                </HStack>
              </Button>
            </Stack>
          </MotionVStack>

          {/* ✅ 3. Usando o MotionBox para a imagem entrar com escala */}
          <MotionBox 
            flex={1.2}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <Image 
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000" 
              alt="Preview do Sistema" 
              borderRadius="3xl" 
              shadow="2xl"
            />
          </MotionBox>
        </Stack>
      </Container>
    </Box>
  );
};