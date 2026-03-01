export type UserRole = "admin" | "corretor" | "cliente";

export interface AuthUser {
  id: string;
  role: UserRole;
  tenantId: string;
}
