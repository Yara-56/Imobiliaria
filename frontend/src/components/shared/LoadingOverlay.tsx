import React from "react";
import { Box, VStack, Text, Spinner, Center } from "@chakra-ui/react";
import { Building2 } from "lucide-react";

/**
 * Componente de carregamento corrigido para as tipagens do Chakra v3.
 */
export const LoadingOverlay = () => {
  return (
    <Center
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="rgba(3, 7, 18, 0.9)" 
      backdropFilter="blur(10px)"
      zIndex={9999}
    >
      <VStack gap={8}>
        
        {/* Logo Animada do ImobiSys */}
        <Box 
          display="flex"
          flexDirection="column"
          alignItems="center"
          style={{
            animation: "pulseCustom 2s infinite ease-in-out"
          }}
        >
          <Box 
            p={4} 
            bg="blue.500/10" 
            borderRadius="2xl" 
            border="1px solid" 
            borderColor="blue.500/20"
          >
            <Building2 size={60} color="#3b82f6" strokeWidth={1.5} />
          </Box>
          
          <Text 
            mt={6}
            fontSize="3xl" 
            fontWeight="black" 
            letterSpacing="tighter"
            color="white"
          >
            Imobi<Text as="span" color="blue.500">Sys</Text>
          </Text>
        </Box>

        {/* Spinner Corrigido: Removida a propriedade 'speed' */}
        <VStack gap={3}>
          <Spinner 
            borderWidth="4px"      
            color="blue.500"
            borderColor="gray.800" 
            size="xl"
            // Se quiser controlar a velocidade na v3, usamos animationDuration:
            animationDuration="0.8s" 
          />
          <Text 
            color="gray.400" 
            fontSize="sm" 
            fontWeight="medium" 
            letterSpacing="widest"
            textTransform="uppercase"
          >
            Autenticando Acesso
          </Text>
        </VStack>
      </VStack>

      <style>{`
        @keyframes pulseCustom {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </Center>
  );
};

export default LoadingOverlay;