"use client"

import {
  Box,
  Stack,
  Text,
  createToaster,
  Portal,
  Toaster as ChakraToaster,
  IconButton,
} from "@chakra-ui/react"
import { X } from "lucide-react"

// Instância para disparar notificações
export const toaster = createToaster({
  placement: "top-end",
  pauseOnPageIdle: true,
  duration: 4000,
})

// Componente visual para renderizar no App.tsx
export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ md: "4" }}>
        {(toast) => (
          <Box
            key={toast.id}
            position="relative"
            bg="rgba(255, 255, 255, 0.9)"
            backdropFilter="blur(10px)"
            shadow="xl"
            p="4"
            borderRadius="xl"
            borderStartWidth="5px"
            borderStartColor={
              toast.type === "success" ? "green.500" : 
              toast.type === "error" ? "red.500" : "blue.500"
            }
            minW="320px"
          >
            <Stack gap="1" pr="10">
              {toast.title && <Text fontWeight="bold" fontSize="sm" color="gray.800">{toast.title}</Text>}
              {toast.description && <Text fontSize="xs" color="gray.600">{toast.description}</Text>}
            </Stack>

            <IconButton
              aria-label="Fechar"
              variant="ghost"
              size="xs"
              position="absolute"
              top="2"
              right="2"
              onClick={() => toaster.dismiss(toast.id)}
            >
              <X size={14} />
            </IconButton>
          </Box>
        )}
      </ChakraToaster>
    </Portal>
  )
}