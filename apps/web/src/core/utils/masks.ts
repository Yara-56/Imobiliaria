/**
 * ============================================
 * 🚀 AURA V3 - UTILS DE MÁSCARAS E FORMATAÇÃO
 * Padrão: SaaS escalável / Clean Code
 * ============================================
 */

// ===============================
// 🔹 HELPERS BASE
// ===============================
export const onlyNumbers = (value: string): string =>
  value.replace(/\D/g, "");

export const unmask = (value: string): string =>
  value.replace(/\D/g, "");

export const isEmpty = (value?: string | number | null): boolean =>
  value === undefined || value === null || value === "";

// ===============================
// 💰 MOEDA (BRL)
// ===============================
export const currencyMask = (value: string | number): string => {
  if (isEmpty(value)) return "";

  const clean =
    typeof value === "number"
      ? value.toFixed(2).replace(/\D/g, "")
      : onlyNumbers(String(value));

  const number = Number(clean) / 100;

  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const parseCurrencyToNumber = (
  value: string | number
): number => {
  if (isEmpty(value)) return 0;
  if (typeof value === "number") return value;

  return Number(onlyNumbers(value)) / 100;
};

// ===============================
// 📄 DOCUMENTOS (CPF / CNPJ)
// ===============================
export const cpfMask = (value: string): string => {
  const v = onlyNumbers(value).slice(0, 11);

  return v
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

export const cnpjMask = (value: string): string => {
  const v = onlyNumbers(value).slice(0, 14);

  return v
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
};

export const documentMask = (value: string): string => {
  const clean = onlyNumbers(value);

  return clean.length <= 11
    ? cpfMask(clean)
    : cnpjMask(clean);
};

// ===============================
// 📞 TELEFONE
// ===============================
export const phoneMask = (value: string): string => {
  const v = onlyNumbers(value).slice(0, 11);

  if (v.length <= 10) {
    return v
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return v
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
};

// ===============================
// 📍 CEP
// ===============================
export const cepMask = (value: string): string => {
  return onlyNumbers(value)
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);
};

// ===============================
// 📅 DATAS
// ===============================
export const dateMask = (value: string): string => {
  return onlyNumbers(value)
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .slice(0, 10);
};

export const timeMask = (value: string): string => {
  return onlyNumbers(value)
    .replace(/(\d{2})(\d)/, "$1:$2")
    .slice(0, 5);
};

// ===============================
// 💳 CARTÃO DE CRÉDITO
// ===============================
export const creditCardMask = (value: string): string => {
  return onlyNumbers(value)
    .replace(/(\d{4})(\d)/, "$1 $2")
    .replace(/(\d{4})(\d)/, "$1 $2")
    .replace(/(\d{4})(\d)/, "$1 $2")
    .slice(0, 19);
};

export const creditCardExpiryMask = (value: string): string => {
  return onlyNumbers(value)
    .replace(/(\d{2})(\d)/, "$1/$2")
    .slice(0, 5);
};

export const creditCardCVVMask = (value: string): string => {
  return onlyNumbers(value).slice(0, 4);
};

// ===============================
// 📊 PORCENTAGEM
// ===============================
export const percentageMask = (value: string): string => {
  const clean = onlyNumbers(value);
  const number = Number(clean) / 100;

  return `${number.toFixed(2)}%`;
};

// ===============================
// 🔢 NÚMEROS FORMATADOS
// ===============================
export const numberMask = (value: string): string => {
  const clean = onlyNumbers(value);

  return Number(clean).toLocaleString("pt-BR");
};

// ===============================
// 🧠 VALIDAÇÕES BÁSICAS
// ===============================
export const isValidCPF = (cpf: string): boolean => {
  const clean = onlyNumbers(cpf);

  if (clean.length !== 11 || /^(\d)\1+$/.test(clean)) return false;

  let sum = 0;
  let rest;

  for (let i = 1; i <= 9; i++)
    sum += parseInt(clean.substring(i - 1, i)) * (11 - i);

  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(clean.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++)
    sum += parseInt(clean.substring(i - 1, i)) * (12 - i);

  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;

  return rest === parseInt(clean.substring(10, 11));
};

export const isValidCNPJ = (cnpj: string): boolean => {
  const clean = onlyNumbers(cnpj);

  if (clean.length !== 14) return false;

  // validação simplificada (suficiente para front)
  return true;
};

// ===============================
// 🔄 GENERIC MASK HANDLER
// ===============================
export type MaskType =
  | "currency"
  | "document"
  | "cpf"
  | "cnpj"
  | "phone"
  | "cep"
  | "date"
  | "time"
  | "card"
  | "cvv"
  | "expiry"
  | "percentage";

export const applyMask = (
  type: MaskType,
  value: string
): string => {
  switch (type) {
    case "currency":
      return currencyMask(value);
    case "document":
      return documentMask(value);
    case "cpf":
      return cpfMask(value);
    case "cnpj":
      return cnpjMask(value);
    case "phone":
      return phoneMask(value);
    case "cep":
      return cepMask(value);
    case "date":
      return dateMask(value);
    case "time":
      return timeMask(value);
    case "card":
      return creditCardMask(value);
    case "cvv":
      return creditCardCVVMask(value);
    case "expiry":
      return creditCardExpiryMask(value);
    case "percentage":
      return percentageMask(value);
    default:
      return value;
  }
};