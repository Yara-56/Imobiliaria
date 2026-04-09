"use client";

import { forwardRef } from "react";
import {
  Input as ChakraInput,
  Box,
  Spinner,
} from "@chakra-ui/react.js";

import type { InputProps } from "@chakra-ui/react.js";
import type { ReactNode } from "react";

// ===============================
// 🎨 BASE STYLE (TIPADO CORRETAMENTE)
// ===============================
export const baseInputStyles: InputProps = {
  variant: "outline",
  size: "lg",
  borderRadius: "xl",
  bg: "white",
  borderColor: "gray.300",
  color: "gray.800",
  fontWeight: "500",

  _placeholder: { color: "gray.400" },
  _hover: { borderColor: "gray.400" },

  _focusVisible: {
    borderColor: "blue.500",
    boxShadow: "0 0 0 3px rgba(59,130,246,0.25)",
  },

  _invalid: {
    borderColor: "red.500",
    boxShadow: "0 0 0 2px rgba(239,68,68,0.2)",
  },

  _disabled: {
    bg: "gray.100",
    cursor: "not-allowed",
    opacity: 0.7,
  },
};

// ===============================
// 🔢 NUMÉRICO (OPCIONAL)
// ===============================
export const numericInputStyles: InputProps = {
  ...baseInputStyles,
  textAlign: "right",
};

// ===============================
// 🧩 PROPS
// ===============================
type CustomInputProps = InputProps & {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
};

// ===============================
// 🚀 COMPONENTE PROFISSIONAL
// ===============================
export const AppInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ leftIcon, rightIcon, isLoading, ...props }, ref) => {
    const hasLeft = !!leftIcon;
    const hasRight = !!rightIcon || isLoading;

    return (
      <Box position="relative" w="full">
        {/* ICONE ESQUERDA */}
        {hasLeft && (
          <Box
            position="absolute"
            left="12px"
            top="50%"
            transform="translateY(-50%)"
            pointerEvents="none"
            color="gray.400"
          >
            {leftIcon}
          </Box>
        )}

        {/* INPUT */}
        <ChakraInput
          ref={ref}
          {...baseInputStyles}
          pl={hasLeft ? "40px" : props.pl}
          pr={hasRight ? "40px" : props.pr}
          {...props}
        />

        {/* ICONE DIREITA / LOADING */}
        {hasRight && (
          <Box
            position="absolute"
            right="12px"
            top="50%"
            transform="translateY(-50%)"
          >
            {isLoading ? <Spinner size="sm" /> : rightIcon}
          </Box>
        )}
      </Box>
    );
  }
);

AppInput.displayName = "AppInput";