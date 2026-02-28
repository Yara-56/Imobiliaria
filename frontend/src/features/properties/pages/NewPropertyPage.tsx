"use client";

import { Box, Flex, Heading, Text, Button } from "@chakra-ui/react";
import { LuArrowLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import PropertyForm from "../components/PropertyForm";

export default function NewPropertyPage() {
  const navigate = useNavigate();

  return (
    <Box>
      {/* HEADER */}
      <Flex justify="space-between" align={{ base: "start", md: "center" }} mb={6} direction={{ base: "column", md: "row" }} gap={4}>
        <Box>
          <Heading size="xl" fontWeight="900" letterSpacing="tight">
            Novo Imóvel
          </Heading>
          <Text color="gray.500">Cadastre um novo imóvel e anexe documentos.</Text>
        </Box>

        <Button variant="outline" borderRadius="xl" onClick={() => navigate("/admin/properties")} gap={2}>
          <LuArrowLeft /> Voltar
        </Button>
      </Flex>

      <PropertyForm mode="create" />
    </Box>
  );
}