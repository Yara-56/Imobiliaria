"use client"

import { Box, Container, SimpleGrid, Stack, Text, Flex, Link, Icon } from "@chakra-ui/react";
import { LuInstagram, LuLinkedin, LuGithub, LuMail, LuPhone } from "react-icons/lu";

export const Footer = () => {
  return (
    <Box bg="black" color="gray.400" borderTop="1px solid" borderColor="whiteAlpha.100" py={16}>
      <Container maxW="6xl">
        <SimpleGrid columns={{ base: 1, md: 4 }} gap={12} mb={12}>
          {/* Logo e Branding */}
          <Stack gap={6}>
            <Text fontSize="2xl" fontWeight="black" color="white" letterSpacing="tighter">
              Imobi<Text as="span" color="blue.500">Sys</Text>
            </Text>
            <Text fontSize="sm" lineHeight="relaxed">
              Elevando o padrão da gestão imobiliária com inteligência de dados e segurança jurídica.
            </Text>
            <Flex gap={4}>
              <Icon as={LuInstagram} cursor="pointer" _hover={{ color: "blue.400" }} />
              <Icon as={LuLinkedin} cursor="pointer" _hover={{ color: "blue.400" }} />
              <Icon as={LuGithub} cursor="pointer" _hover={{ color: "blue.400" }} />
            </Flex>
          </Stack>

          {/* Links de Navegação */}
          <Stack gap={4}>
            <Text color="white" fontWeight="bold">Plataforma</Text>
            <Link fontSize="sm" _hover={{ color: "blue.400" }}>Dashboard</Link>
            <Link fontSize="sm" _hover={{ color: "blue.400" }}>Gestão de Contratos</Link>
            <Link fontSize="sm" _hover={{ color: "blue.400" }}>Análise de Crédito</Link>
          </Stack>

          {/* Suporte */}
          <Stack gap={4}>
            <Text color="white" fontWeight="bold">Suporte</Text>
            <Link fontSize="sm" _hover={{ color: "blue.400" }}>Central de Ajuda</Link>
            <Link fontSize="sm" _hover={{ color: "blue.400" }}>Documentação API</Link>
            <Link fontSize="sm" _hover={{ color: "blue.400" }}>Status do Sistema</Link>
          </Stack>

          {/* Contato Direto */}
          <Stack gap={4}>
            <Text color="white" fontWeight="bold">Contato</Text>
            <Flex align="center" gap={3} fontSize="sm">
              <LuMail size={16} /> suporte@imobisys.com
            </Flex>
            <Flex align="center" gap={3} fontSize="sm">
              <LuPhone size={16} /> (11) 98765-4321
            </Flex>
          </Stack>
        </SimpleGrid>

        <Box borderTop="1px solid" borderColor="whiteAlpha.100" pt={8} textAlign="center">
          <Text fontSize="xs">
            © 2026 ImobiSys Pro. Desenvolvido por Yara com tecnologia de ponta. Todos os direitos reservados.
          </Text>
        </Box>
      </Container>
    </Box>
  );
};