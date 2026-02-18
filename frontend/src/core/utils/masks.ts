/**
 * AURA V3 - UTILITÁRIOS DE FORMATAÇÃO (PADRÃO DE MERCADO)
 * Localização Sugerida: src/core/utils/masks.ts
 */

/**
 * Máscara para Moeda Brasileira (R$)
 * Transforma: 150050 -> R$ 1.500,50
 */
export const currencyMask = (value: string | number): string => {
  if (!value && value !== 0) return "";
  
  // Se vier número (ex: do banco), transforma em string de centavos
  let cleanValue = typeof value === "number" 
    ? value.toFixed(2).replace(/\D/g, "") 
    : String(value).replace(/\D/g, "");

  const options = { minimumFractionDigits: 2 };
  const result = new Intl.NumberFormat("pt-BR", options).format(
    parseFloat(cleanValue) / 100
  );

  return cleanValue ? `R$ ${result}` : "";
};

/**
 * Converte "R$ 1.500,50" em 1500.50 (Número para o Banco de Dados)
 */
export const parseCurrencyToNumber = (value: string | number): number => {
  if (!value) return 0;
  if (typeof value === "number") return value;
  const cleanValue = value.replace(/\D/g, "");
  return Number(cleanValue) / 100;
};

/**
 * Máscara dinâmica para CPF ou CNPJ (Documentos)
 * Detecta o tamanho e aplica a máscara correta automaticamente
 */
export const documentMask = (value: string): string => {
  const cleanValue = value.replace(/\D/g, "");

  if (cleanValue.length <= 11) {
    return cleanValue
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  return cleanValue
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
    .slice(0, 18); // Garante limite do CNPJ
};

/**
 * Máscara para Telefone (Fixo ou Celular - 10 ou 11 dígitos)
 */
export const phoneMask = (value: string): string => {
  const cleanValue = value.replace(/\D/g, "");
  
  if (cleanValue.length <= 10) {
    return cleanValue
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 14);
  }
  
  return cleanValue
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15);
};

/**
 * Máscara para CEP
 */
export const cepMask = (value: string): string => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);
};

/**
 * Máscara para Data (DD/MM/AAAA)
 */
export const dateMask = (value: string): string => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d)/, "$1")
    .slice(0, 10);
};

/**
 * Limpa qualquer máscara (Retorna apenas números)
 * Útil para enviar ao backend
 */
export const unmask = (value: string): string => {
  return value.replace(/\D/g, "");
};