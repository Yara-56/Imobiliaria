"use client";

import { forwardRef } from "react";
import type { InputProps } from "@chakra-ui/react";
import type { FieldValues, Path, UseFormSetValue } from "react-hook-form";

import { AppInput } from "./app-input";
import { useMaskedInput, type MaskType } from "@/hooks/useMaskedInput";

// ===============================
interface MaskedInputProps<T extends FieldValues> extends InputProps {
  name: Path<T>;
  mask: MaskType;
  setValue: UseFormSetValue<T>;
}

// ===============================
export const MaskedInput = forwardRef(
  <T extends FieldValues>(
    { name, mask, setValue, ...props }: MaskedInputProps<T>,
    ref: React.Ref<HTMLInputElement>
  ) => {
    const { handleMask } = useMaskedInput<T>({ setValue });

    return (
      <AppInput
        ref={ref}
        {...props}
        onChange={handleMask(name, mask)}
      />
    );
  }
);

MaskedInput.displayName = "MaskedInput";