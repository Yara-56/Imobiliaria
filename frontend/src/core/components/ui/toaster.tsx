"use client"

import {
  Box,
  Stack,
  Text,
  IconButton,
  createToaster,
  Portal,
  Toaster as ChakraToaster,
} from "@chakra-ui/react"
import { X } from "lucide-react"

// ✅ 1. Criamos a instância do toaster (o que você importa no Login)
export const toaster = createToaster({
  placement: "top-end",
  pauseOnPageIdle: true,
  duration: 4000, // as notificações somem após 4 segundos
})

// ✅ 2. Criamos o componente visual (o que você coloca no main.tsx)
export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ md: "4" }}>
        {(toast) => (
          <Box
            key={toast.id}
            bg="white"
            shadow="lg"
            p="4"
            borderRadius="md"
            borderStartWidth="4px"
            borderStartColor={
              toast.type === "success" ? "green.500" : 
              toast.type === "error" ? "red.500" : "blue.500"
            }
            minW="300px"
          >
            <Stack gap="1" pr="6">
              {toast.title && (
                <Text fontWeight="bold" fontSize="sm" color="gray.800">
                  {toast.title}
                </Text>
              )}
              {toast.description && (
                <Text fontSize="xs" color="gray.600">
                  {toast.description}
                </Text>
              )}
            </Stack>
          </Box>
        )}
      </ChakraToaster>
    </Portal>
  )
}