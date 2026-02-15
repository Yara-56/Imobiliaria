import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

interface MainLayoutProps {
  children?: React.ReactNode; // Tornamos o children opcional com o "?"
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box minH="100vh">
      {/* Se houver children, renderiza. Se não (nas rotas), renderiza o Outlet */}
      {children || <Outlet />}
    </Box>
  );
};

export default MainLayout;