import { Select as ChakraSelect } from "@chakra-ui/react"
import * as React from "react"

export const SelectRoot = ChakraSelect.Root
export const SelectLabel = ChakraSelect.Label
export const SelectTrigger = ChakraSelect.Trigger
export const SelectValueText = ChakraSelect.ValueText
export const SelectContent = ChakraSelect.Content
export const SelectItem = ChakraSelect.Item
export const SelectItemText = ChakraSelect.ItemText
export const SelectIndicator = ChakraSelect.Indicator
export const SelectItemIndicator = ChakraSelect.ItemIndicator

// Removemos o SelectGroup e SelectGroupLabel que estavam causando o erro ts(2339)

export const SelectValue = React.forwardRef<
  HTMLSpanElement,
  ChakraSelect.ValueTextProps
>(function SelectValue(props, ref) {
  return (
    <ChakraSelect.ValueText ref={ref} {...props}>
      {props.children}
    </ChakraSelect.ValueText>
  )
})