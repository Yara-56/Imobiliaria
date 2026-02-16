"use client"

import { 
  Box, 
  Container, 
  SimpleGrid, 
  Heading, 
  Text, 
  Image, 
  Stack, 
  Badge, 
  Flex 
} from "@chakra-ui/react";
import { motion, Variants } from "framer-motion";

const MotionBox = motion(Box);
const MotionStack = motion(Stack);

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  }
};

const features = [
  { 
    title: "Gestão de Imóveis", 
    description: "Controle completo do patrimônio, vacância e manutenção automatizada.", 
    icon: "https://cdn-icons-png.flaticon.com/512/609/609803.png",
    status: "Essencial" 
  },
  { 
    title: "Dashboard Inteligente", 
    description: "Métricas de ROI e inadimplência em um painel consolidado em tempo real.", 
    icon: "https://cdn-icons-png.flaticon.com/512/1828/1828762.png",
    status: "Pro"
  },
  { 
    title: "Segurança Avançada", 
    description: "Proteção de dados críticos com criptografia e controle de acessos.", 
    icon: "https://cdn-icons-png.flaticon.com/512/2092/2092204.png",
    status: "Novo"
  },
];

export const FeaturesSection = () => {
  return (
    <Box bg="gray.950" position="relative" overflow="hidden">
      <Container maxW="6xl" py={{ base: 20, md: 32 }} position="relative" zIndex={1}>
        <Stack gap={12} mb={16} textAlign="center" align="center">
            <Badge colorPalette="blue" variant="outline" borderRadius="full" px={4}>
                Tecnologia Imobiliária
            </Badge>
            <Heading size="2xl" color="white" fontWeight="black" letterSpacing="tighter">
                Tudo o que você precisa para <br />
                <Text as="span" color="blue.500">gestão de alta performance.</Text>
            </Heading>
        </Stack>

        <MotionStack
          as={SimpleGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          columns={{ base: 1, md: 3 }}
          gap={8}
        >
          {features.map((f) => (
            <MotionBox
              key={f.title}
              variants={itemVariants}
              p={8}
              bg="whiteAlpha.50"
              borderRadius="3xl"
              border="1px solid"
              borderColor="whiteAlpha.100"
              backdropFilter="blur(10px)"
              transition={{ duration: 0.3 }}
              // ✅ AQUI ESTÁ A CORREÇÃO:
              // Framer Motion cuida do movimento (y)
              whileHover={{ y: -10 }} 
              // Chakra UI cuida das cores no hover
              _hover={{ 
                borderColor: "blue.500",
                bg: "whiteAlpha.100" 
              }}
            >
              <Stack gap={6}>
                <Flex justify="space-between" align="center">
                  <Box 
                    p={3} 
                    bg="blue.500/10" 
                    borderRadius="xl" 
                    border="1px solid" 
                    borderColor="blue.500/20"
                  >
                    <Image 
                      src={f.icon} 
                      width="32px" 
                      height="32px" 
                      alt={f.title}
                    />
                  </Box>
                  
                  <Badge colorPalette="blue" variant="subtle" borderRadius="full" px={3}>
                    {f.status}
                  </Badge>
                </Flex>

                <Box>
                  <Heading size="md" mb={2} color="white" fontWeight="bold">
                    {f.title}
                  </Heading>
                  <Text color="gray.400" fontSize="sm" lineHeight="relaxed">
                    {f.description}
                  </Text>
                </Box>
              </Stack>
            </MotionBox>
          ))}
        </MotionStack>
      </Container>
    </Box>
  );
};

export default FeaturesSection;