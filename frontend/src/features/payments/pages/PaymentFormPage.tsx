"use client";

import { useState, useEffect } from "react";
import { 
  Box, Container, Heading, Text, VStack, HStack, Button, Icon, 
  Input, Grid, GridItem, Center, Spinner, Badge, Flex,
  createListCollection
} from "@chakra-ui/react";
import { 
  LuDollarSign, LuArrowLeft, LuSave, LuUser, 
  LuFileText, LuClock, LuCircleCheck, LuCircleX
} from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import { Field } from "../../../components/ui/field";
import {
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../../../components/ui/select";

interface Tenant {
  _id: string;
  fullName: string;
}

interface Contract {
  _id: string;
  propertyAddress: string;
  tenantId: string;
}

export default function PaymentFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  
  const [formData, setFormData] = useState({
    tenantId: "",
    contractId: "",
    amount: "",
    dueDate: "",
    paymentDate: "",
    status: "Pendente",
    paymentMethod: "",
    description: "",
    referenceMonth: "",
    discount: "",
    lateFee: "",
    notes: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      setTenants([
        { _id: "1", fullName: "João Silva" },
        { _id: "2", fullName: "Maria Santos" },
        { _id: "3", fullName: "Pedro Costa" }
      ]);
      
      setContracts([
        { _id: "1", propertyAddress: "Rua A, 123 - Centro", tenantId: "1" },
        { _id: "2", propertyAddress: "Av. B, 456 - Bairro X", tenantId: "2" },
        { _id: "3", propertyAddress: "Praça C, 789 - Vila Y", tenantId: "1" }
      ]);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.tenantId) newErrors.tenantId = "Selecione um inquilino";
    if (!formData.contractId) newErrors.contractId = "Selecione um contrato";
    if (!formData.amount) newErrors.amount = "Informe o valor";
    if (!formData.dueDate) newErrors.dueDate = "Informe a data de vencimento";
    if (!formData.referenceMonth) newErrors.referenceMonth = "Informe o mês de referência";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate("/payments");
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Center h="100vh" bg="#F8FAFC">
        <VStack gap={4}>
          <Spinner size="xl" color="blue.500" borderWidth="4px" />
          <Text fontWeight="black" color="gray.400" fontSize="xs" letterSpacing="widest">
            CARREGANDO DADOS...
          </Text>
        </VStack>
      </Center>
    );
  }

  const filteredContracts = contracts.filter((c) => c.tenantId === formData.tenantId);
  const totalAmount = parseFloat(formData.amount || "0") + 
                      parseFloat(formData.lateFee || "0") - 
                      parseFloat(formData.discount || "0");

  const tenantsCollection = createListCollection({
    items: tenants.map(t => ({ label: t.fullName, value: t._id }))
  });

  const contractsCollection = createListCollection({
    items: filteredContracts.map(c => ({ label: c.propertyAddress, value: c._id }))
  });

  const paymentMethodsCollection = createListCollection({
    items: [
      { label: "PIX", value: "PIX" },
      { label: "Transferência Bancária", value: "Transferência" },
      { label: "Boleto", value: "Boleto" },
      { label: "Dinheiro", value: "Dinheiro" },
      { label: "Cartão", value: "Cartão" },
    ]
  });

  return (
    <Box bg="#F8FAFC" minH="100vh" p={{ base: 4, md: 10 }}>
      <Container maxW="5xl">
        
        <Flex justify="space-between" align="center" mb={12} wrap="wrap" gap={6}>
          <VStack align="start" gap={1}>
            <HStack color="blue.600" mb={1}>
              <Icon as={LuDollarSign} boxSize={6} />
              <Text fontSize="xs" fontWeight="black" letterSpacing="widest">
                {isEditing ? "EDITAR PAGAMENTO" : "NOVO PAGAMENTO"}
              </Text>
            </HStack>
            <Heading size="2xl" fontWeight="900" color="gray.800" letterSpacing="-2px">
              {isEditing ? "Atualizar Lançamento" : "Criar Lançamento"}
            </Heading>
            <Text color="gray.500" fontWeight="medium">
              Registre pagamentos de aluguéis e taxas adicionais.
            </Text>
          </VStack>

          <HStack gap={4}>
            <Button 
              onClick={() => navigate("/payments")} 
              variant="outline" 
              h="60px" 
              px={6} 
              borderRadius="2xl" 
              fontWeight="900"
            >
              <Icon as={LuArrowLeft} mr={2} /> CANCELAR
            </Button>
            
            <Button 
              onClick={handleSubmit}
              loading={isSaving}
              bg="blue.600" 
              color="white" 
              h="60px" 
              px={8} 
              borderRadius="2xl" 
              fontWeight="900"
            >
              <Icon as={LuSave} mr={2} /> {isEditing ? "ATUALIZAR" : "SALVAR"}
            </Button>
          </HStack>
        </Flex>

        <VStack gap={8} align="stretch">
          
          <Box bg="white" p={10} borderRadius="4xl" border="1px solid" borderColor="gray.100" shadow="sm">
            <HStack mb={8} gap={3}>
              <Center bg="blue.50" color="blue.600" boxSize="48px" borderRadius="xl">
                <Icon as={LuUser} boxSize={5} />
              </Center>
              <Box>
                <Heading size="md" fontWeight="900">Informações Básicas</Heading>
                <Text fontSize="sm" color="gray.400">Selecione o inquilino e contrato</Text>
              </Box>
            </HStack>

            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
              <GridItem>
                <Field label="Inquilino" required invalid={!!errors.tenantId} errorText={errors.tenantId}>
                  <SelectRoot
                    collection={tenantsCollection}
                    value={formData.tenantId ? [formData.tenantId] : []}
                    onValueChange={(details) => handleChange("tenantId", details.value[0])}
                    size="lg"
                  >
                    <SelectTrigger borderRadius="xl" h="55px" fontWeight="600">
                      <SelectValueText placeholder="Selecione o inquilino" />
                    </SelectTrigger>
                    <SelectContent>
                      {tenantsCollection.items.map((tenant) => (
                        <SelectItem key={tenant.value} item={tenant}>
                          <SelectItemText>{tenant.label}</SelectItemText>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                </Field>
              </GridItem>

              <GridItem>
                <Field label="Contrato / Imóvel" required invalid={!!errors.contractId} errorText={errors.contractId}>
                  <SelectRoot
                    collection={contractsCollection}
                    value={formData.contractId ? [formData.contractId] : []}
                    onValueChange={(details) => handleChange("contractId", details.value[0])}
                    size="lg"
                    disabled={!formData.tenantId || filteredContracts.length === 0}
                  >
                    <SelectTrigger borderRadius="xl" h="55px" fontWeight="600">
                      <SelectValueText placeholder="Selecione o contrato" />
                    </SelectTrigger>
                    <SelectContent>
                      {contractsCollection.items.map((contract) => (
                        <SelectItem key={contract.value} item={contract}>
                          <SelectItemText>{contract.label}</SelectItemText>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                </Field>
              </GridItem>

              <GridItem>
                <Field label="Mês de Referência" required invalid={!!errors.referenceMonth} errorText={errors.referenceMonth}>
                  <Input
                    type="month"
                    value={formData.referenceMonth}
                    onChange={(e) => handleChange("referenceMonth", e.target.value)}
                    size="lg"
                    borderRadius="xl"
                    h="55px"
                    fontWeight="600"
                  />
                </Field>
              </GridItem>

              <GridItem>
                <Field label="Descrição">
                  <Input
                    placeholder="Ex: Aluguel + Condomínio"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    size="lg"
                    borderRadius="xl"
                    h="55px"
                    fontWeight="600"
                  />
                </Field>
              </GridItem>
            </Grid>
          </Box>

          <Box bg="white" p={10} borderRadius="4xl" border="1px solid" borderColor="gray.100" shadow="sm">
            <HStack mb={8} gap={3}>
              <Center bg="green.50" color="green.600" boxSize="48px" borderRadius="xl">
                <Icon as={LuDollarSign} boxSize={5} />
              </Center>
              <Box>
                <Heading size="md" fontWeight="900">Valores e Datas</Heading>
                <Text fontSize="sm" color="gray.400">Defina valores e prazos de pagamento</Text>
              </Box>
            </HStack>

            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
              <GridItem>
                <Field label="Valor Principal (R$)" required invalid={!!errors.amount} errorText={errors.amount}>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={formData.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    size="lg"
                    borderRadius="xl"
                    h="55px"
                    fontWeight="700"
                    fontSize="xl"
                  />
                </Field>
              </GridItem>

              <GridItem>
                <Field label="Desconto (R$)">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={formData.discount}
                    onChange={(e) => handleChange("discount", e.target.value)}
                    size="lg"
                    borderRadius="xl"
                    h="55px"
                    fontWeight="600"
                  />
                </Field>
              </GridItem>

              <GridItem>
                <Field label="Multa/Juros (R$)">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={formData.lateFee}
                    onChange={(e) => handleChange("lateFee", e.target.value)}
                    size="lg"
                    borderRadius="xl"
                    h="55px"
                    fontWeight="600"
                  />
                </Field>
              </GridItem>

              <GridItem>
                <Field label="Data de Vencimento" required invalid={!!errors.dueDate} errorText={errors.dueDate}>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleChange("dueDate", e.target.value)}
                    size="lg"
                    borderRadius="xl"
                    h="55px"
                    fontWeight="600"
                  />
                </Field>
              </GridItem>

              <GridItem>
                <Field label="Data de Pagamento">
                  <Input
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) => handleChange("paymentDate", e.target.value)}
                    size="lg"
                    borderRadius="xl"
                    h="55px"
                    fontWeight="600"
                  />
                </Field>
              </GridItem>

              <GridItem>
                <Field label="Método de Pagamento">
                  <SelectRoot
                    collection={paymentMethodsCollection}
                    value={formData.paymentMethod ? [formData.paymentMethod] : []}
                    onValueChange={(details) => handleChange("paymentMethod", details.value[0])}
                    size="lg"
                  >
                    <SelectTrigger borderRadius="xl" h="55px" fontWeight="600">
                      <SelectValueText placeholder="Selecione o método" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethodsCollection.items.map((method) => (
                        <SelectItem key={method.value} item={method}>
                          <SelectItemText>{method.label}</SelectItemText>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                </Field>
              </GridItem>
            </Grid>

            <Box mt={8} p={6} bg="blue.50" borderRadius="2xl" border="2px solid" borderColor="blue.200">
              <Flex justify="space-between" align="center">
                <VStack align="start" gap={0}>
                  <Text fontSize="xs" fontWeight="black" color="blue.600" letterSpacing="widest">
                    VALOR TOTAL
                  </Text>
                  <Text fontSize="sm" color="blue.500" fontWeight="medium">
                    (Valor - Desconto + Multa/Juros)
                  </Text>
                </VStack>
                <Heading size="2xl" fontWeight="900" color="blue.700">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalAmount)}
                </Heading>
              </Flex>
            </Box>
          </Box>

          <Box bg="white" p={10} borderRadius="4xl" border="1px solid" borderColor="gray.100" shadow="sm">
            <HStack mb={8} gap={3}>
              <Center bg="purple.50" color="purple.600" boxSize="48px" borderRadius="xl">
                <Icon as={LuCircleCheck} boxSize={5} />
              </Center>
              <Box>
                <Heading size="md" fontWeight="900">Status do Pagamento</Heading>
                <Text fontSize="sm" color="gray.400">Selecione a situação atual</Text>
              </Box>
            </HStack>

            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
              <StatusCard status="Pendente" currentStatus={formData.status} onClick={() => handleChange("status", "Pendente")} />
              <StatusCard status="Pago" currentStatus={formData.status} onClick={() => handleChange("status", "Pago")} />
              <StatusCard status="Atrasado" currentStatus={formData.status} onClick={() => handleChange("status", "Atrasado")} />
            </Grid>
          </Box>

          <Box bg="white" p={10} borderRadius="4xl" border="1px solid" borderColor="gray.100" shadow="sm">
            <HStack mb={6} gap={3}>
              <Center bg="gray.100" color="gray.600" boxSize="48px" borderRadius="xl">
                <Icon as={LuFileText} boxSize={5} />
              </Center>
              <Box>
                <Heading size="md" fontWeight="900">Observações</Heading>
                <Text fontSize="sm" color="gray.400">Anotações adicionais (opcional)</Text>
              </Box>
            </HStack>

            <Field label="Notas">
              <Input
                placeholder="Ex: Desconto por pagamento antecipado"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                size="lg"
                borderRadius="xl"
                h="55px"
                fontWeight="600"
              />
            </Field>
          </Box>

          <Flex justify="flex-end" gap={4} pt={4}>
            <Button onClick={() => navigate("/payments")} variant="ghost" size="lg" h="65px" px={8} borderRadius="2xl" fontWeight="900">
              CANCELAR
            </Button>
            
            <Button onClick={handleSubmit} loading={isSaving} bg="blue.600" color="white" size="lg" h="65px" px={12} borderRadius="2xl" fontWeight="900" shadow="2xl">
              <Icon as={LuSave} mr={2} boxSize={5} /> 
              {isEditing ? "ATUALIZAR" : "CRIAR"}
            </Button>
          </Flex>

        </VStack>
      </Container>
    </Box>
  );
}

interface StatusCardProps {
  status: "Pendente" | "Pago" | "Atrasado";
  currentStatus: string;
  onClick: () => void;
}

function StatusCard({ status, currentStatus, onClick }: StatusCardProps) {
  const configs = {
    Pendente: { color: "orange", icon: LuClock, desc: "Aguardando pagamento" },
    Pago: { color: "green", icon: LuCircleCheck, desc: "Pagamento confirmado" },
    Atrasado: { color: "red", icon: LuCircleX, desc: "Vencimento ultrapassado" },
  };

  const config = configs[status];
  const isSelected = currentStatus === status;

  return (
    <Box 
      p={6} borderRadius="2xl" border="2px solid" 
      borderColor={isSelected ? `${config.color}.300` : "gray.100"}
      bg={isSelected ? `${config.color}.50` : "white"}
      cursor="pointer" transition="all 0.3s"
      _hover={{ shadow: "md", borderColor: `${config.color}.300` }}
      onClick={onClick}
    >
      <HStack gap={2} mb={3}>
        <Icon as={config.icon} color={`${config.color}.500`} />
        <Text fontWeight="900" fontSize="lg">{status}</Text>
        {isSelected && <Badge colorPalette={config.color} size="sm">✓</Badge>}
      </HStack>
      <Text fontSize="xs" color="gray.500">{config.desc}</Text>
    </Box>
  );
}