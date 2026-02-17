import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, Button, Input, VStack, Heading, Text, 
  SimpleGrid, Stack 
} from "@chakra-ui/react";
import { LuSave, LuArrowLeft } from "react-icons/lu";
import { useTenants } from "../hooks/useTenants";
import { toaster } from "@/components/ui/toaster"; // ✅ Ajustado para v3

export default function TenantForm() {
  const navigate = useNavigate();
  const { addTenant, isAdding } = useTenants();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    cpfCnpj: "", // ✅ Sincronizado com sua interface Tenant
    status: "active" as const
  });

  // ✅ O ChangeEvent agora será aceito porque o arquivo é .tsx
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    addTenant(form, {
      onSuccess: () => {
        toaster.create({
          title: "Sucesso!",
          description: "Inquilino cadastrado na AuraImobi.",
          type: "success",
        });
        navigate("/admin/tenants"); // ✅ Rota correta do seu AppRoutes
      },
      onError: () => {
        toaster.create({
          title: "Erro ao salvar",
          description: "Verifique a conexão com o servidor na porta 3001.",
          type: "error",
        });
      }
    });
  };

  return (
    <Box maxW="2xl" mx="auto" p={8} bg="white" borderRadius="3xl" shadow="sm" border="1px solid" borderColor="gray.100">
      <VStack align="start" gap={6}>
        <Box>
          <Heading size="lg" fontWeight="black" color="slate.800">Novo Inquilino</Heading>
          <Text color="gray.500">Preencha os dados para o contrato da sua avó.</Text>
        </Box>

        <Stack gap={4} w="full">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <Box>
              <Text fontSize="xs" fontWeight="bold" mb={1} color="gray.600">NOME COMPLETO</Text>
              <Input name="name" placeholder="Nome do inquilino" value={form.name} onChange={handleChange} borderRadius="xl" />
            </Box>
            <Box>
              <Text fontSize="xs" fontWeight="bold" mb={1} color="gray.600">E-MAIL</Text>
              <Input name="email" type="email" placeholder="email@exemplo.com" value={form.email} onChange={handleChange} borderRadius="xl" />
            </Box>
            <Box>
              <Text fontSize="xs" fontWeight="bold" mb={1} color="gray.600">TELEFONE</Text>
              <Input name="phone" placeholder="(31) 99999-9999" value={form.phone} onChange={handleChange} borderRadius="xl" />
            </Box>
            <Box>
              <Text fontSize="xs" fontWeight="bold" mb={1} color="gray.600">CPF / CNPJ</Text>
              <Input name="cpfCnpj" placeholder="000.000.000-00" value={form.cpfCnpj} onChange={handleChange} borderRadius="xl" />
            </Box>
          </SimpleGrid>
        </Stack>

        <Button
          onClick={handleSave}
          colorPalette="blue"
          size="lg"
          w="full"
          borderRadius="2xl"
          loading={isAdding} // ✅ Propriedade correta da v3
          gap={2}
        >
          <LuSave /> Salvar e Finalizar
        </Button>
        
        <Button variant="ghost" w="full" gap={2} onClick={() => navigate("/admin/tenants")}>
          <LuArrowLeft /> Voltar para a lista
        </Button>
      </VStack>
    </Box>
  );
}