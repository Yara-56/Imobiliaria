export interface Tenant {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: "active" | "inactive";
}