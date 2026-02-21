"use client";

import { useEffect, useState } from "react";
import { Box, Button, Center, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { LuArrowLeft } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import PropertyForm from "../components/PropertyForm";
import { propertiesApi } from "../api/properties.api";

export default function EditPropertyPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState<any>(null);

  useEffect(() => {
    const run = async () => {
      if (!id) return;
      setLoading(true);
      const data = await propertiesApi.getById(id);
      setProperty(data);
      setLoading(false);
    };
    run();
  }, [id]);

  if (loading) {
    return (
      <Center h="60vh">
        <Spinner size="xl" color="blue.500" borderWidth="4px" />
      </Center>
    );
  }

  if (!property) {
    return (
      <Center h="60vh" flexDirection="column" gap={3}>
        <Heading size="md">Imóvel não encontrado</Heading>
        <Button borderRadius="xl" onClick={() => navigate("/admin/properties")}>
          Voltar
        </Button>
      </Center>
    );
  }

  return (
    <Box>
      {/* HEADER */}
      <Flex justify="space-between" align={{ base: "start", md: "center" }} mb={6} direction={{ base: "column", md: "row" }} gap={4}>
        <Box>
          <Heading size="xl" fontWeight="900" letterSpacing="tight">
            Editar Imóvel
          </Heading>
          <Text color="gray.500">Atualize os dados e anexe novos documentos.</Text>
        </Box>

        <Button variant="outline" borderRadius="xl" onClick={() => navigate("/admin/properties")} gap={2}>
          <LuArrowLeft /> Voltar
        </Button>
      </Flex>

      <PropertyForm mode="edit" initialData={property} propertyId={id!} />
    </Box>
  );
}