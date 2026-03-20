"use client";

import { useState, useEffect } from "react";
import { 
  Box, Container, Heading, Text, VStack, HStack, Button, Icon, 
  Grid, GridItem, Center, Spinner, Badge, Flex, Separator
} from "@chakra-ui/react";
import { 
  LuDollarSign, LuArrowLeft, LuPencil, LuTrash2, LuDownload, 
  LuCalendar, LuUser, LuHouse, LuFileText, LuCircleCheck, 
  LuClock, LuCircleX, LuReceipt, LuCreditCard
} from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";

export default function PaymentDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [payment, setPayment] = useState<any>(null);

  useEffect(() => {
    loadPayment();
  }, [id]);

  const loadPayment = async () => {
    setIsLoading(true);
    try {
      // const res = await fetch(`/api/payments/${id}`);
      // setPayment(await res.json());
      
      // Mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      setPayment({
        _id: id,
        tenantId: { _id: "1", fullName: "João Silva", email: "joao@email.com", phone: "(31) 98888-7777" },
        contractId: { 
          _id: "1", 
          propertyAddress: "Rua das Flores, 123 - Centro, Ipatinga/MG",
          rentAmount: 1500
        },
        amount: 1500,
        discount: 50,
        lateFee: 0,
        totalAmount: 1450,
        dueDate: "2026-03-10",
        paymentDate: "2026-03-08",
        status: "Pago",
        paymentMethod: "PIX",
        description: "Aluguel + Condomínio",
        referenceMonth: "2026-03",
        notes: "Pagamento antecipado - desconto concedido",
        createdAt: "2026-02-20T10:30:00Z",
        updatedAt: "2026-03-08T14:20:00Z"
      });
    } catch (error) {
      console.error("Erro ao carregar pagamento:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // await fetch(`/api/payments/${id}`, { method: "DELETE" });
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate("/payments");
    } catch (error) {
      console.error("Erro ao deletar:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleGenerateReceipt = () => {
    console.log("Gerando recibo para pagamento:", id);
    // Implementar lógica de geração de recibo
  };

  if (isLoading) {
    return (
      <Center h="100vh" bg="#F8FAFC">
        <VStack gap={4}>
          <Spinner size="xl" color="blue.500" borderWidth="4px" />
          <Text fontWeight="black" color="gray.400" fontSize="xs" letterSpacing="widest">
            CARREGANDO DETALHES...
          </Text>
        </VStack>
      </Center>
    );
  }

  if (!payment) {
    return (
      <Center h="100vh" bg="#F8FAFC">
        <VStack gap={4}>
          <Icon as={LuCircleX} boxSize={16} color="red.400" />
          <Text fontWeight="black" color="gray.700" fontSize="xl">Pagamento não encontrado</Text>
          <Button onClick={() => navigate("/payments")} colorPalette="blue">
            Voltar para lista
          </Button>
        </VStack>
      </Center>
    );
  }

  const formatMoney = (v: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const formatDate = (date: string) => 
    new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  const getStatusConfig = (status: string) => {
    const configs: Record<string, any> = {
      Pago: { color: "green", icon: LuCircleCheck, label: "Pago" },
      Pendente: { color: "orange", icon: LuClock, label: "Pendente" },
      Atrasado: { color: "red", icon: LuCircleX, label: "Atrasado" }
    };
    return configs[status] || configs.Pendente;
  };

  const statusConfig = getStatusConfig(payment.status);

  return (
    <Box bg="#F8FAFC" minH="100vh" p={{ base: 4, md: 10 }}>
      <Container maxW="6xl">
        
        {/* HEADER */}
        <Flex justify="space-between" align="center" mb={12} wrap="wrap" gap={6}>
          <VStack align="start" gap={1}>
            <HStack color="blue.600" mb={1}>
              <Icon as={LuReceipt} boxSize={6} />
              <Text fontSize="xs" fontWeight="black" letterSpacing="widest">
                DETALHES DO PAGAMENTO
              </Text>
            </HStack>
            <Heading size="2xl" fontWeight="900" color="gray.800" letterSpacing="-2px">
              {payment.description || "Pagamento"}
            </Heading>
            <HStack gap={2} mt={2}>
              <Badge 
                colorPalette={statusConfig.color} 
                variant="solid" 
                px={4} 
                py={1} 
                borderRadius="full"
                fontSize="xs"
                fontWeight="black"
              >
                <HStack gap={1.5}>
                  <Icon as={statusConfig.icon} boxSize={3} />
                  <Text>{statusConfig.label.toUpperCase()}</Text>
                </HStack>
              </Badge>
              <Badge variant="outline" px={4} py={1} borderRadius="full" fontSize="xs" fontWeight="black">
                {payment.referenceMonth ? 
                  new Date(payment.referenceMonth + "-01").toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()
                  : "SEM REFERÊNCIA"
                }
              </Badge>
            </HStack>
          </VStack>

          <HStack gap={4}>
            <Button 
              onClick={() => navigate("/payments")} 
              variant="outline" 
              borderColor="gray.200" 
              h="60px" 
              px={6} 
              borderRadius="2xl" 
              fontWeight="900"
            >
              <Icon as={LuArrowLeft} mr={2} /> VOLTAR
            </Button>

            <Button 
              onClick={handleGenerateReceipt}
              bg="green.600" 
              color="white" 
              h="60px" 
              px={6} 
              borderRadius="2xl" 
              fontWeight="900"
            >
              <Icon as={LuDownload} mr={2} /> RECIBO
            </Button>
            
            <Button 
              onClick={() => navigate(`/payments/edit/${id}`)}
              bg="blue.600" 
              color="white" 
              h="60px" 
              px={6} 
              borderRadius="2xl" 
              fontWeight="900" 
              shadow="xl"
            >
              <Icon as={LuPencil} mr={2} /> EDITAR
            </Button>

            <DialogRoot>
              <DialogTrigger asChild>
                <Button 
                  bg="red.600" 
                  color="white" 
                  h="60px" 
                  px={6} 
                  borderRadius="2xl" 
                  fontWeight="900"
                >
                  <Icon as={LuTrash2} />
                </Button>
              </DialogTrigger>
              
              <DialogContent borderRadius="3xl" p={8}>
                <DialogHeader>
                  <DialogTitle fontSize="2xl" fontWeight="900">
                    Confirmar Exclusão
                  </DialogTitle>
                </DialogHeader>
                
                <DialogBody>
                  <VStack gap={4} align="start">
                    <Text color="gray.600">
                      Tem certeza que deseja excluir este pagamento? Esta ação não pode ser desfeita.
                    </Text>
                    <Box p={4} bg="red.50" borderRadius="xl" w="full">
                      <Text fontWeight="bold" color="red.700" fontSize="sm">
                        {payment.description} - {formatMoney(payment.totalAmount)}
                      </Text>
                    </Box>
                  </VStack>
                </DialogBody>
                
                <DialogFooter gap={3}>
                  <DialogActionTrigger asChild>
                    <Button variant="outline" borderRadius="xl">Cancelar</Button>
                  </DialogActionTrigger>
                  <Button 
                    bg="red.600" 
                    color="white" 
                    onClick={handleDelete}
                    loading={isDeleting}
                    borderRadius="xl"
                    fontWeight="900"
                  >
                    Confirmar Exclusão
                  </Button>
                </DialogFooter>
                
                <DialogCloseTrigger />
              </DialogContent>
            </DialogRoot>
          </HStack>
        </Flex>

        {/* VALOR TOTAL DESTACADO */}
        <Box 
          bg="gradient-to-r" 
          bgGradient="to-r" 
          gradientFrom="blue.500" 
          gradientTo="blue.700"
          p={12} 
          borderRadius="4xl" 
          mb={8}
          shadow="2xl"
        >
          <VStack gap={2}>
            <Text fontSize="sm" fontWeight="black" color="blue.100" letterSpacing="widest">
              VALOR TOTAL
            </Text>
            <Heading size="4xl" fontWeight="900" color="white" letterSpacing="-3px">
              {formatMoney(payment.totalAmount)}
            </Heading>
            {payment.paymentDate && (
              <HStack gap={2} mt={2}>
                <Icon as={LuCircleCheck} color="green.300" boxSize={4} />
                <Text fontSize="sm" color="blue.100" fontWeight="bold">
                  Pago em {formatDate(payment.paymentDate)}
                </Text>
              </HStack>
            )}
          </VStack>
        </Box>

        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8}>
          
          {/* COLUNA ESQUERDA */}
          <GridItem>
            <VStack gap={6} align="stretch">
              
              {/* INFORMAÇÕES DO INQUILINO */}
              <Box bg="white" p={8} borderRadius="3xl" border="1px solid" borderColor="gray.100">
                <HStack mb={6} gap={3}>
                  <Center bg="blue.50" color="blue.600" boxSize="48px" borderRadius="xl">
                    <Icon as={LuUser} boxSize={5} />
                  </Center>
                  <Heading size="md" fontWeight="900">Inquilino</Heading>
                </HStack>

                <VStack align="stretch" gap={4}>
                  <Box>
                    <Text fontSize="xs" fontWeight="black" color="gray.400" mb={1}>NOME COMPLETO</Text>
                    <Text fontWeight="900" fontSize="lg">{payment.tenantId.fullName}</Text>
                  </Box>
                  
                  <Separator />
                  
                  <Box>
                    <Text fontSize="xs" fontWeight="black" color="gray.400" mb={1}>E-MAIL</Text>
                    <Text fontWeight="700" color="gray.600">{payment.tenantId.email}</Text>
                  </Box>
                  
                  <Separator />
                  
                  <Box>
                    <Text fontSize="xs" fontWeight="black" color="gray.400" mb={1}>TELEFONE</Text>
                    <Text fontWeight="700" color="gray.600">{payment.tenantId.phone}</Text>
                  </Box>
                </VStack>
              </Box>

              {/* INFORMAÇÕES DO IMÓVEL */}
              <Box bg="white" p={8} borderRadius="3xl" border="1px solid" borderColor="gray.100">
                <HStack mb={6} gap={3}>
                  <Center bg="purple.50" color="purple.600" boxSize="48px" borderRadius="xl">
                    <Icon as={LuHouse} boxSize={5} />
                  </Center>
                  <Heading size="md" fontWeight="900">Imóvel</Heading>
                </HStack>

                <VStack align="stretch" gap={4}>
                  <Box>
                    <Text fontSize="xs" fontWeight="black" color="gray.400" mb={1}>ENDEREÇO</Text>
                    <Text fontWeight="700" fontSize="md" color="gray.700">
                      {payment.contractId.propertyAddress}
                    </Text>
                  </Box>
                  
                  <Separator />
                  
                  <Box>
                    <Text fontSize="xs" fontWeight="black" color="gray.400" mb={1}>VALOR DO ALUGUEL</Text>
                    <Text fontWeight="900" fontSize="xl" color="gray.800">
                      {formatMoney(payment.contractId.rentAmount)}
                    </Text>
                  </Box>
                </VStack>
              </Box>

            </VStack>
          </GridItem>

          {/* COLUNA DIREITA */}
          <GridItem>
            <VStack gap={6} align="stretch">
              
              {/* DETALHES DO PAGAMENTO */}
              <Box bg="white" p={8} borderRadius="3xl" border="1px solid" borderColor="gray.100">
                <HStack mb={6} gap={3}>
                  <Center bg="green.50" color="green.600" boxSize="48px" borderRadius="xl">
                    <Icon as={LuDollarSign} boxSize={5} />
                  </Center>
                  <Heading size="md" fontWeight="900">Detalhamento Financeiro</Heading>
                </HStack>

                <VStack align="stretch" gap={4}>
                  <Flex justify="space-between" align="center">
                    <Text fontSize="sm" fontWeight="700" color="gray.500">Valor Principal</Text>
                    <Text fontSize="lg" fontWeight="900">{formatMoney(payment.amount)}</Text>
                  </Flex>
                  
                  {payment.discount > 0 && (
                    <>
                      <Separator />
                      <Flex justify="space-between" align="center">
                        <Text fontSize="sm" fontWeight="700" color="green.600">Desconto</Text>
                        <Text fontSize="lg" fontWeight="900" color="green.600">
                          - {formatMoney(payment.discount)}
                        </Text>
                      </Flex>
                    </>
                  )}
                  
                  {payment.lateFee > 0 && (
                    <>
                      <Separator />
                      <Flex justify="space-between" align="center">
                        <Text fontSize="sm" fontWeight="700" color="red.600">Multa/Juros</Text>
                        <Text fontSize="lg" fontWeight="900" color="red.600">
                          + {formatMoney(payment.lateFee)}
                        </Text>
                      </Flex>
                    </>
                  )}
                  
                  <Separator borderWidth="2px" borderColor="gray.200" />
                  
                  <Flex justify="space-between" align="center" p={4} bg="blue.50" borderRadius="xl">
                    <Text fontSize="sm" fontWeight="black" color="blue.700">TOTAL</Text>
                    <Text fontSize="2xl" fontWeight="900" color="blue.700">
                      {formatMoney(payment.totalAmount)}
                    </Text>
                  </Flex>
                </VStack>
              </Box>

              {/* DATAS E MÉTODO */}
              <Box bg="white" p={8} borderRadius="3xl" border="1px solid" borderColor="gray.100">
                <HStack mb={6} gap={3}>
                  <Center bg="orange.50" color="orange.600" boxSize="48px" borderRadius="xl">
                    <Icon as={LuCalendar} boxSize={5} />
                  </Center>
                  <Heading size="md" fontWeight="900">Datas e Pagamento</Heading>
                </HStack>

                <VStack align="stretch" gap={4}>
                  <Box>
                    <Text fontSize="xs" fontWeight="black" color="gray.400" mb={1}>VENCIMENTO</Text>
                    <Text fontWeight="900" fontSize="lg">{formatDate(payment.dueDate)}</Text>
                  </Box>
                  
                  {payment.paymentDate && (
                    <>
                      <Separator />
                      <Box>
                        <Text fontSize="xs" fontWeight="black" color="gray.400" mb={1}>DATA DO PAGAMENTO</Text>
                        <Text fontWeight="900" fontSize="lg" color="green.600">
                          {formatDate(payment.paymentDate)}
                        </Text>
                      </Box>
                    </>
                  )}
                  
                  {payment.paymentMethod && (
                    <>
                      <Separator />
                      <Box>
                        <Text fontSize="xs" fontWeight="black" color="gray.400" mb={1}>MÉTODO DE PAGAMENTO</Text>
                        <HStack gap={2}>
                          <Icon as={LuCreditCard} color="blue.600" />
                          <Text fontWeight="900" fontSize="lg">{payment.paymentMethod}</Text>
                        </HStack>
                      </Box>
                    </>
                  )}
                </VStack>
              </Box>

              {/* OBSERVAÇÕES */}
              {payment.notes && (
                <Box bg="white" p={8} borderRadius="3xl" border="1px solid" borderColor="gray.100">
                  <HStack mb={4} gap={3}>
                    <Center bg="gray.100" color="gray.600" boxSize="48px" borderRadius="xl">
                      <Icon as={LuFileText} boxSize={5} />
                    </Center>
                    <Heading size="md" fontWeight="900">Observações</Heading>
                  </HStack>
                  
                  <Text color="gray.600" fontWeight="600" lineHeight="tall">
                    {payment.notes}
                  </Text>
                </Box>
              )}

            </VStack>
          </GridItem>

        </Grid>

        {/* FOOTER COM METADADOS */}
        <Box mt={8} p={6} bg="white" borderRadius="2xl" border="1px solid" borderColor="gray.100">
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
            <Box>
              <Text fontSize="xs" fontWeight="black" color="gray.400" mb={1}>CRIADO EM</Text>
              <Text fontWeight="700" color="gray.600">
                {new Date(payment.createdAt).toLocaleString('pt-BR')}
              </Text>
            </Box>
            <Box>
              <Text fontSize="xs" fontWeight="black" color="gray.400" mb={1}>ÚLTIMA ATUALIZAÇÃO</Text>
              <Text fontWeight="700" color="gray.600">
                {new Date(payment.updatedAt).toLocaleString('pt-BR')}
              </Text>
            </Box>
          </Grid>
        </Box>

      </Container>
    </Box>
  );
}