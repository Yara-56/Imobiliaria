// backend/models/Contract.js
import mongoose from 'mongoose';

const ContractSchema = new mongoose.Schema({
  landlordName: { type: String, required: true },
  landlordCPF: { type: String, required: true },

  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },

  tenantCPF: { type: String, required: true },

  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },

  propertyAddress: { type: String, required: true },
  rentAmount: { type: Number, required: true },
  duration: { type: String }, // Ex: "12 meses", "24 meses"
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  dueDate: { type: Date }, // Dia do vencimento

  guarantees: {
    guarantor: Boolean,
    deposit: Boolean,
    insurance: Boolean
  },

  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Contract', ContractSchema);
