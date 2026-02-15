import { Center, VStack, Heading, Text, Button, Icon } from "@chakra-ui/react";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <Center h="100vh" bg="gray.950" p={6}>
      <VStack gap={6} textAlign="center">
        {/* Ícone de Alerta de Segurança */}
        <Icon asChild color="red.500" boxSize="80px">
          <ShieldAlert size={80} strokeWidth={1.5} />
        </Icon>
        
        <VStack gap={2}>
          <Heading size="2xl" letterSpacing="tighter" color="white">
            Acesso Restrito
          </Heading>
          <Text color="gray.500" maxW="md">
            Você não possui as permissões necessárias para acessar esta área da imobiliária. 
            Se acredita que isso é um erro, entre em contato com a administradora.
          </Text>
        </VStack>

        <Button 
          variant="outline" 
          colorPalette="blue" 
          onClick={() => navigate("/admin/dashboard")}
          gap={2}
        >
          <ArrowLeft size={18} /> Voltar para Segurança
        </Button>
      </VStack>
    </Center>
  );
}