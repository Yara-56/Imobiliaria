export class Tenant {
  id?: string;
  name!: string;
  email!: string;
  documentUrl?: string; 
  propertyId!: string;  
  createdAt?: Date;
  updatedAt?: Date;
}