import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IContract extends Document {
  landlordName: string;
  propertyAddress: string;
  rentAmount: number;
  startDate: Date;
  tenantId: Types.ObjectId;
  owner: Types.ObjectId; // 🛡️ Segurança: Isolamento de dados
}

const ContractSchema = new Schema<IContract>({
  landlordName: { type: String, required: true },
  propertyAddress: { type: String, required: true },
  rentAmount: { type: Number, required: true },
  startDate: { type: Date, required: true },
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model<IContract>('Contract', ContractSchema);