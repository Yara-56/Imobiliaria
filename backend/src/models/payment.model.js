// backend/models/Payment.js
import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  contractId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract',
    required: true
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentDate: {
    type: Date,
    required: true
  },
  method: {
    type: String,
    enum: ['Pix', 'Card', 'Cash'],
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending'
  }
}, { timestamps: true });

export default mongoose.model('Payment', PaymentSchema);
