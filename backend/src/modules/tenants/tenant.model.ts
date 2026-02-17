import mongoose, { Schema, Document } from "mongoose";

// Interface para garantir que o TS reconheça os limites de cada plano
export interface ITenant extends Document {
  name: string;
  slug: string;
  plan: "BASIC" | "PRO" | "ENTERPRISE";
  status: "ACTIVE" | "SUSPENDED";
  settings: {
    maxUsers: number;
    maxProperties: number;
    features: {
      crm: boolean;
      automation: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const tenantSchema = new Schema<ITenant>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // Ex: "imobiliaria-da-vovo"
    plan: {
      type: String,
      enum: ["BASIC", "PRO", "ENTERPRISE"],
      default: "BASIC"
    },
    status: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED"],
      default: "ACTIVE"
    },
    settings: {
      maxUsers: { type: Number, default: 3 },
      maxProperties: { type: Number, default: 50 },
      features: {
        crm: { type: Boolean, default: false },
        automation: { type: Boolean, default: false }
      }
    }
  },
  { timestamps: true }
);

// Índice para buscas rápidas pelo subdomínio/slug
tenantSchema.index({ slug: 1 });

export default mongoose.model<ITenant>("Tenant", tenantSchema);