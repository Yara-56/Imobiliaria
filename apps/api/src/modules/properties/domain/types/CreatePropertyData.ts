export interface CreatePropertyData {
     title: string;
     description: string;
     price: number;
     rentValue: number; // ✅ ADICIONE AQUI
   
     type: "APARTMENT" | "HOUSE" | "COMMERCIAL" | "LAND";
     bedrooms: number;
     bathrooms: number;
     area?: number;
     sqls?: string;
   
     tenantId: string;
     userId: string;
   
     documentUrl?: string;
     city: string;
     state: string;
   
     address: {
       street: string;
       number: string;
       neighborhood: string;
       city: string;
       state: string;
       zipCode: string;
       complement?: string | null;
     };
   }