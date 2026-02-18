"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { 
  Box, Button, Input, VStack, Text, 
  SimpleGrid, Stack, Separator, createListCollection,
  Flex
} from "@chakra-ui/react";
import { 
  SelectContent, 
  SelectItem, 
  SelectRoot, 
  SelectTrigger, 
  SelectValueText 
} from "@/components/ui/select";
import { LuSave, LuRefreshCw, LuUser, LuMail, LuPhone, LuFileDigit } from "react-icons/lu";
import { Tenant } from "../types/tenant";

interface TenantFormProps {
  initialData?: Tenant;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

// Coleção de status para o Select do Chakra v3
const statuses = createListCollection({
  items: [
    { label: "Ativo", value: "ACTIVE" },
    { label: "Suspenso", value: "SUSPENDED" },
    { label: "Pendente", value: "PENDING" },
  ],
});

export default function TenantForm({ initialData, onSubmit, isLoading }: TenantFormProps) {
  // Estado inicial do formulário
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    cpfCnpj: "",
    status: "ACTIVE",
  });

  // Efeito para carregar dados em caso de edição
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        cpfCnpj: initialData.cpfCnpj || "",
        status: (initialData.status as any) || "ACTIVE",
      });
    }
  }, [initialData]);

  // Manipulador de inputs de texto
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Correção do erro ts(7006) - Tipagem do Select do Chakra v3
  const handleStatusChange = (details: { value: string[] }) => {
    const newStatus = details.value[0] as "ACTIVE" | "SUSPENDED" | "PENDING";
    setForm((prev) => ({ ...prev, status: newStatus }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Box as="form" onSubmit={handleFormSubmit} w="full">
      <VStack gap={8} align="stretch">
        
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="full">
          
          {/* NOME DA IMOBILIÁRIA */}
          <Stack gap={2}>
            <Flex align="center" gap={2} color="gray.500">
              <LuUser size={14} />
              <Text fontSize="xs" fontWeight="black" textTransform="uppercase" letterSpacing="widest">
                Nome da Imobiliária
              </Text>
            </Flex>
            <Input 
              name="name" 
              placeholder="Ex: Aura Imóveis" 
              value={form.name} 
              onChange={handleChange} 
              borderRadius="2xl" h="14" bg="gray.50" border="none" px={5}
              _focus={{ bg: "white", outline: "2px solid", outlineColor: "blue.500" }}
            />
          </Stack>

          {/* STATUS DO CONTRATO */}
          <Stack gap={2}>
            <Flex align="center" gap={2} color="gray.500">
              <LuRefreshCw size={14} />
              <Text fontSize="xs" fontWeight="black" textTransform="uppercase" letterSpacing="widest">
                Status Operacional
              </Text>
            </Flex>
            <SelectRoot 
              collection={statuses} 
              value={[form.status]}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger borderRadius="2xl" h="14" bg="gray.50" border="none" px={5}>
                <SelectValueText placeholder="Selecione o Status" />
              </SelectTrigger>
              <SelectContent borderRadius="xl" zIndex="popover" shadow="2xl">
                {statuses.items.map((item) => (
                  <SelectItem item={item} key={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
          </Stack>

          {/* EMAIL MASTER */}
          <Stack gap={2}>
            <Flex align="center" gap={2} color="gray.500">
              <LuMail size={14} />
              <Text fontSize="xs" fontWeight="black" textTransform="uppercase" letterSpacing="widest">
                E-mail Master
              </Text>
            </Flex>
            <Input 
              name="email" 
              type="email"
              placeholder="adm@empresa.com" 
              value={form.email} 
              onChange={handleChange} 
              borderRadius="2xl" h="14" bg="gray.50" border="none" px={5}
              _focus={{ bg: "white", outline: "2px solid", outlineColor: "blue.500" }}
            />
          </Stack>

          {/* CPF / CNPJ */}
          <Stack gap={2}>
            <Flex align="center" gap={2} color="gray.500">
              <LuFileDigit size={14} />
              <Text fontSize="xs" fontWeight="black" textTransform="uppercase" letterSpacing="widest">
                Documento (CPF/CNPJ)
              </Text>
            </Flex>
            <Input 
              name="cpfCnpj" 
              placeholder="00.000.000/0000-00" 
              value={form.cpfCnpj} 
              onChange={handleChange} 
              borderRadius="2xl" h="14" bg="gray.50" border="none" px={5}
              _focus={{ bg: "white", outline: "2px solid", outlineColor: "blue.500" }}
            />
          </Stack>

          {/* TELEFONE */}
          <Stack gap={2}>
            <Flex align="center" gap={2} color="gray.500">
              <LuPhone size={14} />
              <Text fontSize="xs" fontWeight="black" textTransform="uppercase" letterSpacing="widest">
                Contato Direto
              </Text>
            </Flex>
            <Input 
              name="phone" 
              placeholder="(00) 00000-0000" 
              value={form.phone} 
              onChange={handleChange} 
              borderRadius="2xl" h="14" bg="gray.50" border="none" px={5}
              _focus={{ bg: "white", outline: "2px solid", outlineColor: "blue.500" }}
            />
          </Stack>

        </SimpleGrid>

        <Separator borderColor="gray.100" my={4} />

        {/* BOTÃO DE AÇÃO PRINCIPAL */}
        <Button
          type="submit"
          colorPalette="blue"
          size="xl"
          w="full"
          h="16"
          borderRadius="3xl"
          loading={isLoading}
          gap={3}
          shadow="0 15px 30px -5px rgba(59, 130, 246, 0.3)"
          _hover={{ transform: "translateY(-2px)", shadow: "0 20px 40px -5px rgba(59, 130, 246, 0.4)" }}
          transition="all 0.3s ease"
        >
          {initialData ? <LuRefreshCw size={20} /> : <LuSave size={20} />}
          <Text fontWeight="bold" fontSize="lg">
            {initialData ? "SALVAR ALTERAÇÕES" : "PROVISIONAR INSTÂNCIA"}
          </Text>
        </Button>
      </VStack>
    </Box>
  );
}