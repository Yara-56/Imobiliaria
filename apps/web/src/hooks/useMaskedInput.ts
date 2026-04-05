"use client";

import {
  UseFormSetValue,
  Path,
  FieldValues,
} from "react-hook-form";

// ===============================
// 🎯 TIPOS DE MÁSCARA
// ===============================
export type MaskType = "phone" | "document" | "currency";

// ===============================
// 🧠 INTERFACE DO HOOK
// ===============================
interface UseMaskedInputProps<T extends FieldValues> {
  setValue: UseFormSetValue<T>;
}

// ===============================
// 🔧 UTIL: LIMPAR VALOR
// ===============================
const onlyNumbers = (value: string) => value.replace(/\D/g, "");

// ===============================
// 📞 MÁSCARA TELEFONE
// ===============================
const maskPhone = (value: string): string => {
  const v = onlyNumbers(value);

  return v
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15);
};

// ===============================
// 🪪 MÁSCARA CPF/CNPJ
// ===============================
const maskDocument = (value: string): string => {
  const v = onlyNumbers(value);

  if (v.length <= 11) {
    return v
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  }

  return v
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18);
};

// ===============================
// 💰 MÁSCARA MOEDA
// ===============================
const maskCurrency = (value: string): string => {
  const v = onlyNumbers(value);

  const number = Number(v) / 100;

  if (isNaN(number)) return "R$ 0,00";

  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

// ===============================
// 🧠 STRATEGY PATTERN
// ===============================
const maskStrategies: Record<MaskType, (value: string) => string> = {
  phone: maskPhone,
  document: maskDocument,
  currency: maskCurrency,
};

// ===============================
// 🚀 HOOK PRINCIPAL
// ===============================
export function useMaskedInput<T extends FieldValues>({
  setValue,
}: UseMaskedInputProps<T>) {
  const handleMask =
    (field: Path<T>, type: MaskType) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;

      const strategy = maskStrategies[type];
      if (!strategy) return;

      const maskedValue = strategy(rawValue);

      setValue(field, maskedValue as any, {
        shouldValidate: true,
        shouldDirty: true,
      });
    };

  return {
    handleMask,
  };
}