import { Box, Container, Heading, Text, Button, VStack, HStack, Image, Stack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/core/hooks/useAuth";

// ✅ 1. Comentado temporariamente para não travar o Vite se a pasta estiver vazia
// import heroImage from "@/assets/hero.png"; 

const MotionBox = motion(Box);

export const HeroSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleDashboardRedirect = () => {
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <Box 
      as="section"
      bgGradient="to-b" 
      gradientFrom="gray.900" // Ajustado para combinar com seu login
      gradientTo="black" 
      py={{ base: 20, md: 32 }}
    >
      <Container maxW="6xl">
        <Stack direction={{ base: "column-reverse", md: "row" }} align="center" gap={12}>
          
          <VStack align={{ base: "center", md: "start" }} gap={6} flex={1}>
            <Heading 
              as="h1" 
              size="2xl" 
              fontWeight="black" 
              color="white"
              textAlign={{ base: "center", md: "left" }}
            >
              Bem-vindo ao <Text as="span" color="blue.500">ImobiSys</Text>
            </Heading>
            
            <Text fontSize="xl" color="gray.300" textAlign={{ base: "center", md: "left" }}>
              Transforme sua gestão imobiliária em algo simples e inteligente. 
              Centralize contratos e métricas em um só lugar.
            </Text>

            <HStack gap={4} w="full" justify={{ base: "center", md: "start" }}>
              <Button colorPalette="blue" size="lg" onClick={handleDashboardRedirect}>
                <HStack gap={2}>
                  <span>Ir para Dashboard</span>
                  <ArrowRight size={20} />
                </HStack>
              </Button>
            </HStack>
          </VStack>

          <MotionBox flex={1} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
            <Image 
              // ✅ 2. Usando URL temporária enquanto sua pasta assets está vazia
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop" 
              alt="Preview do Sistema" 
              borderRadius="2xl" 
              shadow="2xl"
            />
          </MotionBox>
        </Stack>
      </Container>
    </Box>
  );
};