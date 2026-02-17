import mongoose, { Schema, Document, Types } from 'mongoose';

// Interface para tipagem forte no TypeScript
export interface IPayment extends Document {
  contractId: Types.ObjectId;
  tenantId: Types.ObjectId;
  amount: number;
  paymentDate: Date;
  method: 'Pix' | 'Card' | 'Cash';
  status: 'Pending' | 'Paid';
  owner: Types.ObjectId; // Essencial para o isolamento de segurança que planejamos
}

const PaymentSchema = new Schema<IPayment>({
  contractId: { type: Schema.Types.ObjectId, ref: 'Contract', required: true },
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  amount: { type: Number, required: true, min: 0 },
  paymentDate: { type: Date, required: true },
  method: { type: String, enum: ['Pix', 'Card', 'Cash'], required: true },
  status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true } 
}, { timestamps: true });

export default mongoose.model<IPayment>('Payment', PaymentSchema);