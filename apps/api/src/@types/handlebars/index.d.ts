/**
 * 📝 Definição de Tipos para o Handlebars
 * Este arquivo "ensina" o TypeScript a entender o módulo Handlebars
 * quando ele é importado no seu sistema de templates de e-mail/contratos.
 */

declare module "handlebars" {
  // Importamos o tipo original se ele existir, ou definimos a estrutura base
  interface HandlebarsStatic {
    compile<T = any>(
      input: any,
      options?: any
    ): (context: T, options?: any) => string;
    registerHelper(name: string, fn: Function): void;
    registerPartial(name: string, spec: any): void;
  }

  const handlebars: HandlebarsStatic;
  export = handlebars;
}