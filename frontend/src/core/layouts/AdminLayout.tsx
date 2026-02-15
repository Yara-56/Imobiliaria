import { Flex, Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar"; 

const AdminLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <Flex minH="100vh">
      <Sidebar />
      <Box flex="1" p="8" bg="gray.50">
        {children || <Outlet />}
      </Box>
    </Flex>
  );
};

export default AdminLayout;