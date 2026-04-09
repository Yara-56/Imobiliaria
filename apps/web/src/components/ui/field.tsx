"use client"

import { Field as ChakraField, Text } from "@chakra-ui/react.js"
import * as React from "react"

export interface FieldProps extends Omit<ChakraField.RootProps, "label"> {
  label?: React.ReactNode
  helperText?: React.ReactNode
  errorText?: React.ReactNode
  optionalText?: React.ReactNode
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  function Field(props, ref) {
    const { label, children, helperText, errorText, optionalText, ...rest } = props
    
    return (
      <ChakraField.Root ref={ref} {...rest} w="full">
        {label && (
          <ChakraField.Label 
            fontSize="11px" 
            fontWeight="800" 
            color="gray.500" 
            letterSpacing="0.05em"
            mb={1.5}
            textTransform="uppercase"
            userSelect="none"
          >
            {label}
            {optionalText && (
              <Text as="span" color="gray.400" ml={1} fontWeight="500" fontSize="10px">
                ({optionalText})
              </Text>
            )}
          </ChakraField.Label>
        )}

        {children}

        {helperText && (
          <ChakraField.HelperText color="gray.400" fontSize="xs" mt={1.5}>
            {helperText}
          </ChakraField.HelperText>
        )}

        {errorText && (
          <ChakraField.ErrorText 
            color="red.500" 
            fontSize="xs" 
            fontWeight="600"
            mt={1.5}
            animation="slide-from-left 0.2s ease-out" // Feedback visual moderno
          >
            {errorText}
          </ChakraField.ErrorText>
        )}
      </ChakraField.Root>
    )
  },
)