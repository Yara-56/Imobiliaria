import React from 'react';
import { Center, Container, Box, VStack, Image } from '@chakra-ui/react';
import { LoginForm } from '@/features/auth/components/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <Box 
      minH="100vh" 
      bg="gray.50" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
    >
      <Container maxW="md">
        <VStack gap={8}>
          {/* Logo ou Nome do Sistema */}
          <Box mb={4}>
            {/* Se você tiver uma logo, use o componente Image:
                <Image src="/logo.svg" alt="ImobiSys Logo" h="40px" /> 
            */}
            <Box fontSize="3xl" fontWeight="bold" color="blue.600">
              ImobiSys
            </Box>
          </Box>

          {/* O formulário vindo da feature de Auth */}
          <LoginForm />
        </VStack>
      </Container>
    </Box>
  );
};

export default LoginPage;