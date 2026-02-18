/**
 * Máscara para Moeda Brasileira (R$)
 * Transforma: 150050 -> R$ 1.500,50
 */
export const currencyMask = (value: string | number) => {
    if (typeof value === "number") value = value.toFixed(2).replace(".", "");
    const cleanValue = String(value).replace(/\D/g, "");
    
    const options = { minimumFractionDigits: 2 };
    const result = new Intl.NumberFormat("pt-BR", options).format(
      parseFloat(cleanValue) / 100
    );
  
    return cleanValue ? `R$ ${result}` : "";
  };
  
  /**
   * Converte "R$ 1.500,50" em 1500.50 (formato numérico para o banco de dados)
   */
  export const parseCurrencyToNumber = (value: string): number => {
    if (!value) return 0;
    const cleanValue = value.replace(/\D/g, "");
    return Number(cleanValue) / 100;
  };
  
  /**
   * Máscara para CNPJ (Impostos/Identificação)
   * Transforma: 12345678000199 -> 12.345.678/0001-99
   */
  export const cnpjMask = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };
  
  /**
   * Máscara para Telefone
   */
  export const phoneMask = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    if (cleanValue.length <= 10) {
      return cleanValue
        .replace(/^(\d{2})(\d)/g, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }
    return cleanValue
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  };
  
  /**
   * Máscara para CEP
   */
  export const cepMask = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{3})\d+?$/, "$1");
  };