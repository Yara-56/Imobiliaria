"use client";

// ✅ Adicione o Avatar à lista de imports do Chakra
import { Box, Container, Heading, Text, SimpleGrid, Stack, Flex, Avatar } from "@chakra-ui/react";

const testimonials = [
  {
    name: "Ricardo Silva",
    role: "Corretor Autônomo",
    content: "O ImobiSys mudou a forma como gerencio meus contratos. A automação de pagamentos me economiza horas toda semana.",
    avatar: "https://bit.ly/prosper-baba",
  },
  {
    name: "Ana Oliveira",
    role: "Dona de Imobiliária",
    content: "A visão geral do dashboard é incrível. Consigo ver a vacância e os recebíveis em tempo real sem planilhas complexas.",
    avatar: "https://bit.ly/sage-adebayo",
  },
  {
    name: "Marcos Souza",
    role: "Investidor Imobiliário",
    content: "Excelente suporte e plataforma intuitiva. O controle de inquilinos e vistorias é o mais completo que já usei.",
    avatar: "https://bit.ly/code-beast",
  },
];

export const TestimonialsSection = () => {
  return (
    <Box py={20} bg="gray.50" borderRadius="3xl">
      <Container maxW="6xl">
        <Stack gap={12} align="center" textAlign="center">
          <Stack gap={4}>
            <Heading size="2xl" fontWeight="bold">
              Quem usa, <Text as="span" color="blue.600">recomenda</Text>
            </Heading>
            <Text color="gray.600" fontSize="lg" maxW="2xl">
              Centenas de profissionais já transformaram sua gestão imobiliária com nossa plataforma.
            </Text>
          </Stack>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap={8} w="full">
            {testimonials.map((testimonial, index) => (
              <Stack 
                key={index}
                bg="white" 
                p={8} 
                borderRadius="2xl" 
                boxShadow="sm"
                borderWidth="1px"
                borderColor="gray.100"
                justify="space-between"
                transition="transform 0.2s"
                _hover={{ transform: "translateY(-5px)" }}
              >
                <Text fontSize="md" color="gray.700" fontStyle="italic">
                  "{testimonial.content}"
                </Text>
                
                <Flex align="center" gap={4} mt={6}>
                  <Avatar.Root size="md">
                    <Avatar.Image src={testimonial.avatar} alt={testimonial.name} />
                    <Avatar.Fallback name={testimonial.name} />
                  </Avatar.Root>
                  <Box textAlign="left">
                    <Text fontWeight="bold" fontSize="sm">{testimonial.name}</Text>
                    <Text fontSize="xs" color="gray.500">{testimonial.role}</Text>
                  </Box>
                </Flex>
              </Stack>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
};