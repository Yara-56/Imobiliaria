import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    cep: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      maxlength: 9,
      match: [/^\d{5}-?\d{3}$/, "CEP deve estar no formato 00000-000"],
    },
    sqls: { type: String, trim: true, maxlength: 20 },
    street: { type: String, required: true, trim: true, maxlength: 80 },
    number: { type: String, required: true, trim: true, maxlength: 10 },
    bairro: { type: String, required: true, trim: true, maxlength: 60 },
    city: { type: String, required: true, trim: true, maxlength: 60 },
    state: { type: String, required: true, trim: true, maxlength: 30 },
    status: {
      type: String,
      enum: ["Available", "Occupied", "Under Maintenance"],
      default: "Available",
    },
    documents: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

PropertySchema.index({ cep: 1 });
PropertySchema.index({ sqls: 1 });
PropertySchema.index({ status: 1, createdAt: -1 });

// 🚨 CORREÇÃO DE ESTABILIDADE (SINGLETON) 🚨
// Isto garante que o modelo só seja definido UMA VEZ, evitando o erro OverwriteModelError
export default mongoose.models.Property || mongoose.model("Property", PropertySchema);