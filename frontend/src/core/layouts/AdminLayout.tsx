import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

const AdminLayout = () => {
  return (
    <Flex minH="100vh" bg="gray.50"> 
      {/* Sidebar lateral */}
      <Sidebar />
      
      {/* Área de conteúdo principal */}
      <Box flex="1" p={{ base: 4, md: 10 }} h="100vh" overflowY="auto">
        <Box maxW="1200px" mx="auto">
          <Outlet /> 
        </Box>
      </Box>
    </Flex>
  );
};

export default AdminLayout;