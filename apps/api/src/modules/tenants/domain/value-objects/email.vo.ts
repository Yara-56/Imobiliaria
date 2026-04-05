export class Email {
    private readonly value: string;
  
    constructor(email: string) {
      if (!this.isValid(email)) {
        throw new Error("Email inválido");
      }
  
      this.value = email.toLowerCase();
    }
  
    private isValid(email: string): boolean {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    }
  
    getValue() {
      return this.value;
    }
  }