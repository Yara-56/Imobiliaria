"use client"

import { Group, InputElement } from "@chakra-ui/react.js"
import * as React from "react"

export interface InputGroupProps extends React.ComponentProps<typeof Group> {
  startElement?: React.ReactNode
  endElement?: React.ReactNode
  children: React.ReactElement
  startOffset?: string
  endOffset?: string
}

export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  function InputGroup(props, ref) {
    const {
      startElement,
      endElement,
      children,
      startOffset = "3rem",
      endOffset = "3rem",
      ...rest
    } = props

    return (
      <Group ref={ref} {...rest} position="relative" width="full">
        {startElement && (
          <InputElement 
            pointerEvents="none" 
            height="full" 
            ps="4" 
            zIndex="2"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="gray.400" // ✅ Ícone cinza suave, não preto
          >
            {startElement}
          </InputElement>
        )}
        
        {/* ✅ SOLUÇÃO DO ERRO ts(2769): Forçamos o tipo para aceitar as props do Chakra */}
        {React.cloneElement(children as React.ReactElement<any>, {
          ...(startElement && { ps: startOffset }),
          ...(endElement && { pe: endOffset }),
          // Estilização para tirar o "preto" e deixar clean:
          variant: "subtle",
          bg: "gray.50",
          borderColor: "gray.100",
          color: "gray.700", // Texto digitado em grafite
          _focus: { borderColor: "blue.200", bg: "white" }
        })}

        {endElement && (
          <InputElement 
            pointerEvents="none" 
            height="full" 
            pe="4" 
            position="absolute" 
            right="0"
            zIndex="2"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="gray.400"
          >
            {endElement}
          </InputElement>
        )}
      </Group>
    )
  },
)