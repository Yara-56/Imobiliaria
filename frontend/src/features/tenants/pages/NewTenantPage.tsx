import { Box, Container, Flex, Text, Link } from "@chakra-ui/react";
import { LuUsers, LuChevronRight } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import TenantForm from "../components/TenantForm";

export default function NewTenantPage() {
  const navigate = useNavigate();

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <Container maxW="container.md">
        {/* Navegação manual simplificada para evitar o erro do Breadcrumb v3,
           que agora exige um Provider específico em algumas configurações.
        */}
        <Flex mb={8} align="center" gap={2} color="gray.500" fontSize="sm">
          <LuUsers size={16} />
          <Link 
            onClick={() => navigate("/admin/tenants")} 
            _hover={{ color: "blue.500", textDecoration: "none" }}
            cursor="pointer"
          >
            Inquilinos
          </Link>
          <LuChevronRight size={14} />
          <Text fontWeight="bold" color="blue.600">Novo Cadastro</Text>
        </Flex>

        <TenantForm />
      </Container>
    </Box>
  );
}