"use client"

import {
  Box,
  Container,
  VStack,
  Text,
  Input,
  SimpleGrid,
  Stack,
  Flex,
  Button,
} from "@chakra-ui/react.js"
import { useState } from "react"

interface ROICalculatorProps {
  onLeadCapture?: () => void
}

export default function ROICalculator({ onLeadCapture }: ROICalculatorProps) {
  const [currentHours, setCurrentHours] = useState("")
  const [hourlyRate, setHourlyRate] = useState("")
  const [monthlyCost, setMonthlyCost] = useState("")
  const [roi, setRoi] = useState<null | number>(null)

  const calculate = () => {
    const hours = Number(currentHours)
    const rate = Number(hourlyRate)
    const cost = Number(monthlyCost)

    if (hours <= 0 || rate <= 0 || cost <= 0) {
      setRoi(null)
      return
    }

    const savings = hours * rate
    const roiValue = ((savings - cost) / cost) * 100

    setRoi(roiValue)
  }

  return (
    <Box py={{ base: 24, md: 32 }} position="relative" overflow="hidden">
      
      {/* Fundo de luz premium */}
      <Box
        position="absolute"
        top="-200px"
        left="50%"
        transform="translateX(-50%)"
        w="1100px"
        h="700px"
        bg="linear-gradient(135deg, rgba(6,182,212,0.18), rgba(14,165,233,0.10))"
        filter="blur(180px)"
        opacity="0.35"
        pointerEvents="none"
      />

      <Container maxW="container.xl" position="relative" zIndex={2}>
        
        {/* Título */}
        <VStack gap={4} textAlign="center" mb={16}>
          <Text
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="900"
            bgGradient="linear(to-r, #06b6d4, #0ea5e9)"
            bgClip="text"
          >
            Calcule o ROI da sua imobiliária
          </Text>

          <Text color="gray.300" fontSize="lg" maxW="700px" lineHeight="1.7">
            Veja quanto tempo e dinheiro o HomeFlux pode economizar para sua operação.
          </Text>
        </VStack>

        {/* Inputs */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
          
          <InputBox
            label="Horas gastas com tarefas repetitivas por mês"
            placeholder="Ex: 30"
            value={currentHours}
            onChange={(e) => setCurrentHours(e.target.value)}
          />

          <InputBox
            label="Custo por hora do seu time"
            placeholder="Ex: 45"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
          />

          <InputBox
            label="Custo mensal da plataforma"
            placeholder="Ex: 129"
            value={monthlyCost}
            onChange={(e) => setMonthlyCost(e.target.value)}
          />

        </SimpleGrid>

        {/* Botão calcular */}
        <Flex justify="center" mt={10}>
          <Button
            size="lg"
            px={14}
            h="60px"
            rounded="xl"
            fontWeight="bold"
            color="white"
            bg="linear-gradient(135deg, #06b6d4, #0ea5e9)"
            onClick={calculate}
            _hover={{
              transform: "translateY(-3px)",
              boxShadow: "0 20px 40px rgba(6,182,212,0.35)",
              bg: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
            }}
            transition="all 0.25s ease"
          >
            Calcular ROI
          </Button>
        </Flex>

        {/* Resultado */}
        {roi !== null && (
          <VStack gap={4} mt={14} textAlign="center">
            <Text fontSize="3xl" fontWeight="900" color="cyan.300">
              ROI estimado: {roi.toFixed(1)}%
            </Text>

            <Text fontSize="md" color="gray.300" maxW="650px">
              Quanto maior o ROI, mais retorno sua imobiliária obtém para cada real investido.
            </Text>

            <Button
              size="lg"
              mt={4}
              px={12}
              h="56px"
              rounded="xl"
              color="white"
              fontWeight="bold"
              bg="linear-gradient(135deg, #06b6d4, #0ea5e9)"
              onClick={onLeadCapture}
              _hover={{
                transform: "translateY(-3px)",
                boxShadow: "0 18px 32px rgba(6,182,212,0.35)",
                bg: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
              }}
              transition="0.25s ease"
            >
              Quero aumentar meu ROI
            </Button>
          </VStack>
        )}
      </Container>
    </Box>
  )
}

interface InputBoxProps {
  label: string
  placeholder: string
  value: string
  onChange: (e: any) => void
}

const InputBox = ({ label, placeholder, value, onChange }: InputBoxProps) => (
  <Stack gap={2}>
    <Text fontSize="sm" color="gray.300" fontWeight="medium">
      {label}
    </Text>
    <Input
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      bg="rgba(255,255,255,0.06)"
      border="1px solid rgba(255,255,255,0.08)"
      rounded="xl"
      color="white"
      h="54px"
      _placeholder={{ color: "gray.500" }}
      _focus={{
        borderColor: "cyan.300",
        boxShadow: "0 0 0 2px rgba(6,182,212,0.4)",
      }}
    />
  </Stack>
)