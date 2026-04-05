// utils/masks.ts

export const maskCPFOrCNPJ = (value: string) => {
    const v = value.replace(/\D/g, "");
  
    if (v.length <= 11) {
      return v
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
  
    return v
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  };
  
  export const maskPhoneBR = (value: string) => {
    const v = value.replace(/\D/g, "");
  
    return v
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };