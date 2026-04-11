"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  Table,
  Badge,
  Button,
  Spinner,
  Center,
  Input,
  Dialog,
} from "@chakra-ui/react";
import { LuPlus, LuRefreshCcw, LuHouse, LuPencil, LuTrash2 } from "react-icons/lu";
import { useProperties } from "../hooks/useProperties";
import { useNavigate } from "react-router-dom";

export default function PropertiesListPage() {
  const navigate = useNavigate();

  const { properties, isLoading, error, refresh, removeProperty, isSubmitting } =
    useProperties();

  const [search, setSearch] = useState("");

  // ✅ Dialog de confirmação
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleting = properties.find((p: any) => p.id === deleteId);

  const openDelete = (id: string) => setDeleteId(id);
  const closeDelete = () => setDeleteId(null);

  const confirmDelete = async () => {
    if (!deleteId) return;
    await removeProperty(deleteId);
    closeDelete();
  };

  const filteredProperties = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return properties;

    return properties.filter((p: any) => {
      const title = (p.title ?? "").toLowerCase();
      const status = (p.status ?? "").toLowerCase();
      const address = (p.address ?? "").toLowerCase();
      return title.includes(q) || status.includes(q) || address.includes(q);
    });
  }, [properties, search]);

  const statusMap: Record<string, string> = {
    Disponível: "green",
    Alugado: "blue",
    Vendido: "purple",
    Manutenção: "orange",
  };

  if (isLoading && properties.length === 0) {
    return (
      <Center h="60vh">
        <Spinner size="xl" color="blue.500" borderWidth="4px" />
      </Center>
    );
  }

  return (
    <Box>
      {/* HEADER DA PÁGINA */}
      <Flex
        justify="space-between"
        align={{ base: "start", md: "center" }}
        mb={6}
        direction={{ base: "column", md: "row" }}
        gap={4}
      >
        <Stack gap={1}>
          <Heading size="xl" fontWeight="900" letterSpacing="tight">
            Imóveis
          </Heading>
          <Text color="gray.500">
            Gestão de patrimônio e disponibilidade em tempo real.
          </Text>
        </Stack>

        <Flex gap={3} w={{ base: "full", md: "auto" }}>
          <Button
            variant="outline"
            onClick={() => refresh()}
            borderRadius="xl"
            loading={isLoading}
          >
            <LuRefreshCcw />
          </Button>

          <Button
            colorPalette="blue"
            size="lg"
            borderRadius="xl"
            gap={2}
            shadow="md"
            onClick={() => navigate("new")}
          >
            <LuPlus size={20} /> Novo Imóvel
          </Button>
        </Flex>
      </Flex>

      {/* BUSCA */}
      <Input
        placeholder="Buscar por nome, endereço ou status..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        mb={6}
        bg="white"
        borderRadius="2xl"
        h="52px"
      />

      {/* ERROR STATE */}
      {error && (
        <Center p={10} bg="red.50" borderRadius="2xl" color="red.500" mb={6}>
          {error}
        </Center>
      )}

      {/* TABELA DE CONTEÚDO */}
      <Box
        bg="white"
        borderRadius="24px"
        shadow="sm"
        borderWidth="1px"
        borderColor="gray.100"
        overflow="hidden"
      >
        <Table.Root variant="line" size="lg">
          <Table.Header>
            <Table.Row bg="gray.50/50">
              <Table.ColumnHeader py={4}>Propriedade</Table.ColumnHeader>
              <Table.ColumnHeader py={4}>Valor</Table.ColumnHeader>
              <Table.ColumnHeader py={4}>Status</Table.ColumnHeader>
              <Table.ColumnHeader py={4} textAlign="right">
                Ações
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredProperties.map((prop: any) => (
              <Table.Row key={prop.id} _hover={{ bg: "gray.50/50" }}>
                <Table.Cell py={5}>
                  <Flex align="center" gap={4}>
                    <Center
                      w="10"
                      h="10"
                      bg="blue.50"
                      color="blue.600"
                      borderRadius="xl"
                    >
                      <LuHouse size={20} />
                    </Center>
                    <Stack gap={0}>
                      <Text fontWeight="bold">{prop.title}</Text>
                      <Text fontSize="xs" color="gray.400">
                        {prop.address}
                      </Text>
                    </Stack>
                  </Flex>
                </Table.Cell>

                <Table.Cell fontWeight="bold">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(prop.price)}
                </Table.Cell>

                <Table.Cell>
                  <Badge
                    colorPalette={statusMap[prop.status] || "gray"}
                    variant="surface"
                    borderRadius="full"
                  >
                    {prop.status}
                  </Badge>
                </Table.Cell>

                <Table.Cell textAlign="right">
                  <Flex justify="flex-end" gap={2}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`edit/${prop.id}`)}
                    >
                      <LuPencil />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      colorPalette="red"
                      onClick={() => openDelete(prop.id)}
                      disabled={isSubmitting}
                    >
                      <LuTrash2 />
                    </Button>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

        {/* EMPTY STATE */}
        {filteredProperties.length === 0 && !isLoading && (
          <Center p={20} flexDirection="column" gap={2}>
            <Text color="gray.400">
              {search.trim()
                ? "Nenhum imóvel encontrado para essa busca."
                : "Nenhum imóvel cadastrado."}
            </Text>
          </Center>
        )}
      </Box>

      {/* ✅ DIALOG DE CONFIRMAÇÃO */}
      <Dialog.Root
        open={!!deleteId}
        onOpenChange={(e) => {
          if (!e.open) closeDelete();
        }}
      >
        {/* Fundo bem leve (quase imperceptível) */}
        <Dialog.Backdrop bg="blackAlpha.200" />

        <Dialog.Positioner>
          <Dialog.Content
            bg="white"
            opacity={1}
            borderRadius="2xl"
            maxW="520px"
            w="full"
            mx={4}
            boxShadow="2xl"
            borderWidth="1px"
            borderColor="gray.100"
          >
            <Dialog.Header>
              <Dialog.Title>Excluir imóvel</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <Text color="gray.600">
                Tem certeza que deseja excluir <b>{deleting?.title ?? "este imóvel"}</b>?
                Essa ação não pode ser desfeita.
              </Text>
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" borderRadius="xl" onClick={closeDelete}>
                  Cancelar
                </Button>
              </Dialog.ActionTrigger>

              <Button
                colorPalette="red"
                borderRadius="xl"
                onClick={confirmDelete}
                loading={isSubmitting}
              >
                Excluir
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  );
}