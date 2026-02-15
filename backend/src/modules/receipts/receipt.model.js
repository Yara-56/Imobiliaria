// backend/models/Receipt.js
import mongoose from 'mongoose';

const ReceiptSchema = new mongoose.Schema({
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    required: true
  },
  description: {
    type: String,
    maxlength: 500
  }
}, { timestamps: true }); // createdAt já serve como dataEmissao

export default mongoose.model('Receipt', ReceiptSchema);
