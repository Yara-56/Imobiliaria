import mongoose, { Schema, Document, Types } from "mongoose";
import { multiTenantPlugin } from "../../shared/plugins/multiTenant.plugin.js";

// Interface que define a estrutura do documento no TS
export interface IProperty extends Document {
  title: string;
  price: number;
  address: string;
  tenantId: Types.ObjectId; // Adicionado para compatibilidade com o plugin
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Aplicação do plugin de multi-tenancy
propertySchema.plugin(multiTenantPlugin);

// Índice essencial para performance SaaS: otimiza buscas por dono e data
propertySchema.index({ tenantId: 1, createdAt: -1 });

export default mongoose.model<IProperty>("Property", propertySchema);