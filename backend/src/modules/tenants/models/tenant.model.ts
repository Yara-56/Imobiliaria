import mongoose, { Document, Schema } from "mongoose";

/**
 * 🏢 INTERFACE DO MODELO - AURA IMOBISYS
 * Sincronizada com o Dashboard de BI e o isolamento Multi-tenancy.
 */
export interface ITenant extends Document {
  fullName: string;
  email: string;
  phone?: string;
  document?: string;
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE"; // ✅ Necessário para o BI
  plan: "BASIC" | "PRO" | "ENTERPRISE";        // ✅ Necessário para o Dashboard
  preferredPaymentMethod: "PIX" | "BOLETO" | "CARTAO_RECORRENTE" | "DINHEIRO";
  rentValue?: string;
  billingDay?: number;
  owner: mongoose.Types.ObjectId; // ✅ ESSENCIAL: Vínculo com o Admin logado
  documents?: {
    name: string;
    url: string;
  }[];
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
    fullName: {
      type: String,
      required: [true, "Nome é obrigatório"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email é obrigatório"],
      unique: true,
      lowercase: true
    },
    phone: String,
    document: String,
    status: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED", "INACTIVE"],
      default: "ACTIVE"
    },
    plan: {
      type: String,
      enum: ["BASIC", "PRO", "ENTERPRISE"],
      default: "BASIC"
    },
    preferredPaymentMethod: {
      type: String,
      enum: ["PIX", "BOLETO", "CARTAO_RECORRENTE", "DINHEIRO"],
      default: "PIX"
    },
    rentValue: String,
    billingDay: Number,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true // ✅ Garante que nenhum inquilino fique "órfão" no cluster
    },
    documents: [
      {
        name: String,
        url: String
      }
    ],
    settings: {
      maxUsers: { type: Number, default: 1 },
      maxProperties: { type: Number, default: 5 },
      features: {
        crm: { type: Boolean, default: false },
        automation: { type: Boolean, default: false }
      }
    }
  },
  {
    timestamps: true
  }
);

// ✅ Exportação única para evitar o erro ts(2307) nos seus scripts
export const Tenant = mongoose.model<ITenant>("Tenant", tenantSchema);