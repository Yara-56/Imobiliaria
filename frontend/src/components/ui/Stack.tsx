import { Stack as ChakraStack, StackProps } from "@chakra-ui/react";

// Componente Base
export const Stack = (props: StackProps) => {
  return <ChakraStack {...props} />;
};

// Atalho para Vertical Stack (VStack)
export const VStack = (props: StackProps) => {
  return <ChakraStack direction="column" align="center" {...props} />;
};

// Atalho para Horizontal Stack (HStack)
export const HStack = (props: StackProps) => {
  return <ChakraStack direction="row" align="center" {...props} />;
};