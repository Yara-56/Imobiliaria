"use client";

import {
  Box,
  Heading,
  Text,
  Icon,
  Badge,
  Flex,
} from "@chakra-ui/react";

import {
  LuBuilding2,
  LuCircleCheck,
  LuArrowRight,
  LuPlay,
} from "react-icons/lu";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MotionDiv = motion.div;
const MotionButton = motion.button;

interface HeroSectionProps {
  isAuthenticated?: boolean;
  onLeadCapture?: () => void;
}

export const HeroSection = ({
  isAuthenticated = false,
  onLeadCapture,
}: HeroSectionProps) => {
  const navigate = useNavigate();

  return (
    <MotionDiv
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "120px 16px 80px",
        gap: "32px",
        position: "relative",
        overflow: "hidden",
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {/* Glow moderno (bem mais leve) */}
      <Box
        position="absolute"
        top="-200px"
        left="50%"
        transform="translateX(-50%)"
        w="800px"
        h="600px"
        bg="radial-gradient(circle, rgba(14,165,233,0.12), transparent 70%)"
        filter="blur(100px)"
        zIndex={0}
      />

      {/* Badge + Icon */}
      <MotionDiv
        style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Flex
          w="72px"
          h="72px"
          bg="white"
          borderRadius="20px"
          align="center"
          justify="center"
          boxShadow="0 10px 30px rgba(0,0,0,0.08)"
          border="1px solid rgba(0,0,0,0.05)"
        >
          <Icon as={LuBuilding2} boxSize={8} color="blue.500" />
        </Flex>

        <Badge
          bg="blue.50"
          color="blue.600"
          px={4}
          py={1.5}
          borderRadius="full"
          fontSize="xs"
          fontWeight="600"
          border="1px solid"
          borderColor="blue.100"
        >
          <Flex align="center" gap={2}>
            <Icon as={LuCircleCheck} boxSize={3} />
            HOMEFLUX PRO 2026
          </Flex>
        </Badge>
      </MotionDiv>

      {/* Título */}
      <Heading
        maxW="900px"
        fontWeight="800"
        lineHeight="1.1"
        letterSpacing="-0.02em"
        fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
        color="gray.800"
        zIndex={2}
      >
        Transforme sua gestão imobiliária com uma plataforma{" "}
        <Text
          as="span"
          bgGradient="linear(to-r, blue.500, cyan.400)"
          bgClip="text"
        >
          inteligente
        </Text>
      </Heading>

      {/* Subtexto */}
      <Text
        fontSize={{ base: "md", md: "lg" }}
        color="gray.600"
        maxW="600px"
        lineHeight="1.6"
        zIndex={2}
      >
        Centralize sua operação, automatize processos e foque no que realmente importa:
        <Text as="span" color="blue.500" fontWeight="600">
          {" "}fechar mais negócios.
        </Text>
      </Text>

      {/* Botões */}
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={4}
        pt={4}
        zIndex={2}
      >
        <MotionButton
          style={{
            height: "52px",
            padding: "0 28px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #2563eb, #0ea5e9)",
            color: "white",
            fontWeight: 600,
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() =>
            navigate(isAuthenticated ? "/admin/dashboard" : "/login")
          }
        >
          {isAuthenticated ? "Ir para o painel" : "Começar agora"}
          <Icon as={LuArrowRight} style={{ marginLeft: 8 }} />
        </MotionButton>

        <MotionButton
          style={{
            height: "52px",
            padding: "0 28px",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            color: "#334155",
            background: "white",
            fontWeight: 500,
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
          }}
          whileHover={{
            scale: 1.04,
            backgroundColor: "#f8fafc",
          }}
          whileTap={{ scale: 0.97 }}
          onClick={onLeadCapture}
        >
          <Icon as={LuPlay} style={{ marginRight: 8 }} />
          Ver demonstração
        </MotionButton>
      </Flex>
    </MotionDiv>
  );
};