"use client";

import { Box, Flex, Heading, Text, VStack, HStack, Button, Center } from "@chakra-ui/react";
import { LuUserPlus, LuZap, LuArrowRight } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);

export const QuickAddTenant = () => {
  const navigate = useNavigate();

  return (
    <MotionBox
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      mb={8}
      p="1.5px"
      bgGradient="to-r"
      gradientFrom="blue.400"
      gradientTo="cyan.300"
      borderRadius="3xl"
      shadow="0 15px 30px -10px rgba(49, 130, 206, 0.2)"
    >
      <Flex 
        bg="white" 
        borderRadius="3xl" 
        p={{ base: 6, md: 8 }} 
        align="center" 
        justify="space-between"
        flexDirection={{ base: "column", md: "row" }}
        gap={6}
      >
        <HStack gap={6} align="center">
          <Center bg="blue.50" color="blue.500" p={4} borderRadius="2xl">
            <LuUserPlus size={32} />
          </Center>

          <VStack align="start" gap={0}>
            <HStack color="orange.400" gap={1} mb={1}>
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                <LuZap size={14} fill="currentColor" />
              </motion.div>
              <Text fontSize="10px" fontWeight="black" textTransform="uppercase" letterSpacing="widest">
                Atalho Amazon
              </Text>
            </HStack>
            <Heading size="md" color="gray.700" fontWeight="800">Novo Inquilino</Heading>
            <Text color="gray.400" fontSize="sm">Inicie o cadastro e vincule documentos agora.</Text>
          </VStack>
        </HStack>

        <Button 
          size="xl" 
          colorPalette="blue" 
          borderRadius="2xl" 
          px={12}
          fontWeight="900"
          onClick={() => navigate("/tenants/new")}
        >
          Cadastrar Agora <LuArrowRight style={{ marginLeft: '10px' }} />
        </Button>
      </Flex>
    </MotionBox>
  );
};