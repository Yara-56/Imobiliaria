import mongoose, { Schema, Document, Types } from 'mongoose';

// Interface para garantir tipagem forte em todo o backend
export interface IContract extends Document {
  landlordName: string;
  landlordCPF: string;
  tenantId: Types.ObjectId;
  tenantCPF: string;
  propertyId: Types.ObjectId;
  propertyAddress: string;
  rentAmount: number;
  duration?: string;
  startDate: Date;
  endDate?: Date;
  dueDate?: Date;
  guarantees: {
    guarantor: boolean;
    deposit: boolean;
    insurance: boolean;
  };
  notes?: string;
  owner: Types.ObjectId; // 🛡️ Segurança: Vincula o contrato ao admin logado
}

const ContractSchema = new Schema<IContract>({
  landlordName: { type: String, required: true },
  landlordCPF: { type: String, required: true },
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  tenantCPF: { type: String, required: true },
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  propertyAddress: { type: String, required: true },
  rentAmount: { type: Number, required: true },
  duration: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  dueDate: { type: Date },
  guarantees: {
    guarantor: { type: Boolean, default: false },
    deposit: { type: Boolean, default: false },
    insurance: { type: Boolean, default: false }
  },
  notes: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model<IContract>('Contract', ContractSchema);