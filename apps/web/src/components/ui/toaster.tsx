"use client"

import {
  Toaster as ChakraToaster,
  Portal,
  Stack,
  createToaster,
  Toast,
} from "@chakra-ui/react"

// ✅ 1. Criação da instância do toaster com configurações de Cybersecurity UX
export const toaster = createToaster({
  placement: "top-end",
  pauseOnPageIdle: true,
  duration: 4000,
})

// ✅ 2. Componente Toaster que será usado no main.tsx
export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ md: "4" }} top="4">
        {(toast) => (
          <Toast.Root 
            width={{ md: "sm" }} 
            bg="rgba(15, 23, 42, 0.9)" // ✅ Vidro escuro para combinar com seu Login
            backdropFilter="blur(10px)"
            border="1px solid rgba(255, 255, 255, 0.1)"
            borderRadius="xl"
            boxShadow="2xl"
            p={4}
          >
            <Stack gap="1" flex="1">
              {toast.title && (
                <Toast.Title color="white" fontWeight="bold">
                  {toast.title}
                </Toast.Title>
              )}
              {toast.description && (
                <Toast.Description color="slate.400" fontSize="sm">
                  {toast.description}
                </Toast.Description>
              )}
            </Stack>
            <Toast.CloseTrigger color="whiteAlpha.600" />
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}