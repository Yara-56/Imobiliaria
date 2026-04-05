"use client";

import {
  Box,
  Container,
  Button,
  Flex,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { HeroSection } from "../components/HeroSection";
import ProblemSection from "../components/ProblemSection";
import SolutionSection from "../components/SolutionSection";
import EducationSection from "../components/EducationSection";
import CaseStudiesSection from "../components/CaseStudiesSection";
import ROICalculator from "../components/ROICalculator";
import TestimonialsSection from "../components/TestimonialsSection";
import PricingSection from "../components/PricingSection";
import FAQSection from "../components/FAQSection";
import FinalCTA from "../components/FinalCTA";
import LeadCaptureModal from "../components/LeadCaptureModal";

const MotionBox = motion(Box);

/* ===============================
   🌞 BACKGROUND LIGHT MODERNO
================================ */
function DashboardBackground() {
  return (
    <Box
      position="absolute"
      inset={0}
      bg="#F8FAFC"
      zIndex={0}
      _before={{
        content: '""',
        position: "absolute",
        top: "-200px",
        left: "50%",
        transform: "translateX(-50%)",
        w: "900px",
        h: "600px",
        bg: "radial-gradient(circle, rgba(14,165,233,0.10), transparent 70%)",
        filter: "blur(120px)",
      }}
    />
  );
}

export default function HomePage() {
  const navigate = useNavigate();

  const { open, onOpen, onClose } = useDisclosure();

  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
  });

  const refHero = useRef<HTMLDivElement>(null);
  const refSolution = useRef<HTMLDivElement>(null);
  const refCases = useRef<HTMLDivElement>(null);
  const refPricing = useRef<HTMLDivElement>(null);
  const refFAQ = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sections: {
    label: string;
    ref: React.RefObject<HTMLDivElement | null>;
  }[] = [
    { label: "Início", ref: refHero },
    { label: "Solução", ref: refSolution },
    { label: "Casos", ref: refCases },
    { label: "Preços", ref: refPricing },
    { label: "FAQ", ref: refFAQ },
  ];

  const handleLeadCapture = useCallback(() => {
    onClose();
    alert("Obrigado! Você receberá um e-mail em breve.");
    setLeadForm({ name: "", email: "", company: "", phone: "" });
  }, [onClose]);

  return (
    <Box
      minH="100vh"
      bg="#F8FAFC"
      color="gray.800"
      position="relative"
      overflow="hidden"
    >
      <DashboardBackground />

      {/* NAVBAR */}
      <Box
        position="sticky"
        top={0}
        zIndex={50}
        bg="rgba(255,255,255,0.75)"
        backdropFilter="blur(12px)"
        borderBottom="1px solid rgba(0,0,0,0.06)"
        py={3}
      >
        <Container maxW="7xl">
          <Flex align="center" justify="space-between">
            {/* Logo */}
            <Text fontWeight="700" color="gray.700">
              HomeFlux
            </Text>

            {/* Menu */}
            <Flex gap={6} display={{ base: "none", md: "flex" }}>
              {sections.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  color="gray.600"
                  fontWeight="500"
                  _hover={{ color: "blue.500", bg: "transparent" }}
                  onClick={() => scrollTo(item.ref)}
                >
                  {item.label}
                </Button>
              ))}
            </Flex>

            {/* Login */}
            <Flex gap={3}>
              <Button
                variant="ghost"
                color="gray.600"
                _hover={{ color: "blue.500" }}
                onClick={() => navigate("/login")}
              >
                Entrar
              </Button>

              <Button
                bg="linear-gradient(135deg, #2563eb, #0ea5e9)"
                color="white"
                px={5}
                borderRadius="12px"
                _hover={{ opacity: 0.9 }}
                onClick={() => navigate("/login")}
              >
                Começar
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* LOGO CENTRAL */}
      <Container pt={12} textAlign="center" position="relative" zIndex={2}>
        <Image
          src="/Captura-de-Tela-2026-03-22-s-15.52.27.png"
          maxW="200px"
          mx="auto"
          draggable={false}
        />
        <Text mt={3} color="gray.500">
          Inteligência • Automação • Crescimento Real
        </Text>
      </Container>

      {/* CONTEÚDO */}
      <Container maxW="7xl" pt={10} pb={32} zIndex={2}>
        <MotionBox ref={refHero} mb={24}>
          <HeroSection onLeadCapture={onOpen} />
        </MotionBox>

        <MotionBox ref={refSolution} mb={24}>
          <ProblemSection />
          <Box mt={16}>
            <SolutionSection />
          </Box>
        </MotionBox>

        <MotionBox ref={refCases} mb={24}>
          <EducationSection onLeadCapture={onOpen} />
          <Box mt={16}>
            <CaseStudiesSection />
          </Box>
        </MotionBox>

        <MotionBox mb={24}>
          <ROICalculator onLeadCapture={onOpen} />
          <Box mt={16}>
            <TestimonialsSection />
          </Box>
        </MotionBox>

        <MotionBox ref={refPricing} mb={24}>
          <PricingSection onLeadCapture={onOpen} />
        </MotionBox>

        <MotionBox ref={refFAQ} mb={24}>
          <FAQSection onLeadCapture={onOpen} />
        </MotionBox>

        <FinalCTA onLeadCapture={onOpen} />
      </Container>

      {/* MODAL */}
      <LeadCaptureModal
        isOpen={open}
        onClose={onClose}
        onSubmit={handleLeadCapture}
        leadForm={leadForm}
        setLeadForm={setLeadForm}
      />

      {/* FOOTER */}
      <Box bg="white" borderTop="1px solid #E2E8F0" py={12} mt={20}>
        <Container maxW="7xl">
          <Text fontSize="sm" textAlign="center" color="gray.500">
            © {new Date().getFullYear()} HomeFlux • Gestão Imobiliária Inteligente
          </Text>
        </Container>
      </Box>
    </Box>
  );
}