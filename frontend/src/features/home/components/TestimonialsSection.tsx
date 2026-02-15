import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Stack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

/**
 * Interface para os dados de depoimentos.
 * Definida localmente para manter a feature modular.
 */
interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Camila Souza",
    role: "Cliente VIP",
    quote: "O ImobiSys transformou a gestão dos meus imóveis! Totalmente intuitivo e seguro.",
  },
  {
    id: 2,
    name: "Victor Oliveira",
    role: "Administrador",
    quote: "Agora consigo monitorar contratos e pagamentos em tempo real, sem stress.",
  },
  {
    id: 3,
    name: "João Santos",
    role: "Corretor",
    quote: "A interface é elegante, responsiva e perfeita para o dia a dia no mercado imobiliário.",
  },
];

// Componente Box do Chakra com superpoderes do Framer Motion
const MotionBox = motion(Box);

/**
 * TestimonialsSection - Seção de prova social do ImobiSys.
 * Removido o uso de 'FC' para evitar erros de declaração global.
 */
export const TestimonialsSection = () => {
  return (
    <Box
      as="section"
      bg="gray.900"
      color="white"
      py={{ base: 16, md: 24 }}
      position="relative"
      overflow="hidden"
    >
      <Container maxW="7xl" position="relative" zIndex={1}>
        {/* Header da Seção */}
        <Stack direction="column" gap={6} mb={12} textAlign="center">
          <Heading 
            size="2xl" 
            fontWeight="black" 
            letterSpacing="tight"
          >
            O que nossos usuários dizem
          </Heading>
          <Text color="gray.400" maxW="3xl" mx="auto" fontSize="lg">
            Depoimentos reais de clientes, administradores e corretores que confiam no ImobiSys.
          </Text>
        </Stack>

        {/* Grade de Depoimentos */}
        <Stack
          direction={{ base: "column", md: "row" }}
          gap={6}
          justify="center"
          align="stretch"
        >
          {testimonials.map((testimonial, idx) => (
            <MotionBox
              key={testimonial.id}
              bg="gray.800"
              borderRadius="2xl"
              p={8}
              flex={1}
              border="1px solid"
              borderColor="whiteAlpha.100"
              // Animações
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, borderColor: "blue.500/50" }}
              transition={{ 
                delay: idx * 0.1, 
                duration: 0.4,
                ease: "easeOut" 
              }}
            >
              <VStack gap={6} align="start" h="full" justify="space-between">
                <Text fontSize="lg" fontWeight="medium" color="gray.200" fontStyle="italic">
                  "{testimonial.quote}"
                </Text>

                <HStack gap={4}>
                  <VStack align="start" gap={0}>
                    <Text fontWeight="bold" color="white">
                      {testimonial.name}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {testimonial.role}
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            </MotionBox>
          ))}
        </Stack>
      </Container>

      {/* Elemento Decorativo (Glow) */}
      <Box
        position="absolute"
        top="-10%"
        left="-5%"
        w="600px"
        h="600px"
        bgGradient="radial(blue.600/10, transparent 70%)"
        filter="blur(100px)"
        pointerEvents="none"
        zIndex={0}
      />
    </Box>
  );
};