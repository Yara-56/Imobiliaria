"use client"

import {
  Toaster as ChakraToaster,
  Portal,
  Stack,
  createToaster,
} from "@chakra-ui/react"

export const toaster = createToaster({
  placement: "top-end",
  pauseOnPageIdle: true,
})

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ md: "4" }} top="4">
        {(toast) => (
          <Stack gap="1" width="full" p={4} bg="white" boxShadow="md" borderRadius="md" _dark={{ bg: "gray.800" }}>
            {toast.title && <div style={{ fontWeight: "bold" }}>{toast.title}</div>}
            {toast.description && <div style={{ fontSize: "sm" }}>{toast.description}</div>}
          </Stack>
        )}
      </ChakraToaster>
    </Portal>
  )
}