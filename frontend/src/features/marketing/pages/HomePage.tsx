"use client";

import { Box, Spinner, Center, Container, Stack } from "@chakra-ui/react";

import { useAuth } from "@/core/context/AuthContext";

import { HeroSection } from "../components/HeroSection";
import { FeaturesSection } from "../components/FeaturesSection";
import { CTASection } from "../components/CTASection";
import { StatsSection } from "../components/StatsSection";
import { TestimonialsSection } from "../components/TestimonialsSection";

const HomePage = () => {
  // O hook useAuth deve agora ser reconhecido sem erro ts(2307)
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Center h="100vh" bg="bg.canvas">
        <Spinner 
          size="xl" 
          color="blue.500" 
          borderWidth="4px" 
        />
      </Center>
    );
  }

  return (
    <Box as="main" bg="bg.canvas" color="fg" overflowX="hidden">
      <HeroSection isAuthenticated={isAuthenticated} />

      <Container maxW="6xl" py={12}>
        <Stack gap={20}>
          <FeaturesSection />
          <StatsSection />
          <TestimonialsSection />
          <CTASection isAuthenticated={isAuthenticated} />
        </Stack>
      </Container>
    </Box>
  );
};

export default HomePage;