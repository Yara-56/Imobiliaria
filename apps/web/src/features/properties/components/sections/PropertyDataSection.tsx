"use client";

import { Box, Flex, Heading, Text, SimpleGrid, Input, Stack, NativeSelect } from "@chakra-ui/react";
import { LuUser } from "react-icons/lu";
import type { PropertyFormValues } from "../PropertyForm";

export default function PropertyDataSection({
  values,
  onChange,
}: {
  values: PropertyFormValues;
  onChange: (patch: Partial<PropertyFormValues>) => void;
}) {
  return (
    <Box bg="white" borderRadius="24px" shadow="sm" borderWidth="1px" borderColor="gray.100" overflow="hidden">
      <Flex align="center" gap={2} px={6} py={4} borderBottomWidth="1px" borderColor="gray.100" bg="gray.50/50">
        <LuUser />
        <Stack gap={0}>
          <Heading size="sm" fontWeight="800">Dados do imóvel</Heading>
          <Text fontSize="xs" color="gray.500">Preencha os dados principais do cadastro.</Text>
        </Stack>
      </Flex>

      <Box p={6}>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
          <Input
            placeholder="Nome do imóvel (ex: Casa - Centro)"
            value={values.title}
            onChange={(e) => onChange({ title: e.target.value })}
            borderRadius="xl"
            h="48px"
          />

          <Input
            placeholder="Cidade"
            value={values.cidade}
            onChange={(e) => onChange({ cidade: e.target.value })}
            borderRadius="xl"
            h="48px"
          />

          <Input
            placeholder="Estado"
            value={values.estado}
            onChange={(e) => onChange({ estado: e.target.value })}
            borderRadius="xl"
            h="48px"
          />
          
          <Input
            placeholder="CEP"
            value={values.cep}
            onChange={(e) => onChange({ cep: e.target.value })}
            borderRadius="xl"
            h="48px"
          />

          <Input
            placeholder="Rua"
            value={values.rua}
            onChange={(e) => onChange({ rua: e.target.value })}
            borderRadius="xl"
            h="48px"
          />

          <Input
            placeholder="Bairro"
            value={values.bairro}
            onChange={(e) => onChange({ bairro: e.target.value })}
            borderRadius="xl"
            h="48px"
          />

          <Input
            placeholder="Número"
            value={values.numero}
            onChange={(e) => onChange({ numero: e.target.value })}
            borderRadius="xl"
            h="48px"
          />

          <Input
            placeholder="SQLS"
            value={values.sqls}
            onChange={(e) => onChange({ sqls: e.target.value })}
            borderRadius="xl"
            h="48px"
          />

          <NativeSelect.Root size="md">
                <NativeSelect.Field
                value={values.status}
                onChange={(e) => onChange({ status: e.currentTarget.value as any })}
                style={{ height: 48, borderRadius: 12, paddingLeft: 12, paddingRight: 12 }}
    >
                <option value="Disponível">Disponível</option>
                <option value="Alugado">Alugado</option>
                <option value="Vendido">Vendido</option>
                <option value="Manutenção">Manutenção</option>
                </NativeSelect.Field>
            </NativeSelect.Root>
        </SimpleGrid>

        {/* Botão “Editar” do seu print não é necessário no create.
            Se quiser, dá pra colocar um “Limpar campos” aqui depois. */}
      </Box>
    </Box>
  );
}