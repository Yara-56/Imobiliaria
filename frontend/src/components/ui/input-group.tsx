import { Group, InputElement } from "@chakra-ui/react"
import * as React from "react"

/**
 * ✅ CORREÇÃO ts(6133): Removido o 'Box' que não estava sendo utilizado.
 * ✅ CORREÇÃO ts(2304): Propriedades extraídas via React.ComponentProps.
 */
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
            zIndex="1"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {startElement}
          </InputElement>
        )}
        
        {React.cloneElement(children, {
          ...(startElement && { ps: startOffset }),
          ...(endElement && { pe: endOffset }),
        })}

        {endElement && (
          <InputElement 
            pointerEvents="none" 
            height="full" 
            pe="4" 
            position="absolute" 
            right="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {endElement}
          </InputElement>
        )}
      </Group>
    )
  },
)