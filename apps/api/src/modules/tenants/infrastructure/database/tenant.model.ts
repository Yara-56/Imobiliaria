import mongoose, { Schema, Document } from "mongoose";

export interface TenantDocument extends Document {
  tenantId: string;
  name: string;
  email: string;
  phone?: string;
  document?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TenantSchema = new Schema<TenantDocument>(
  {
    tenantId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    document: String,
  },
  { timestamps: true }
);

export const TenantModel = mongoose.model<TenantDocument>(
  "Tenant",
  TenantSchema
);