import { Schema, model, Document, models } from "mongoose";

export interface IProperty extends Document {
  title: string;
  description: string;
  type: "APARTMENT" | "HOUSE" | "COMMERCIAL" | "LAND";
  status: "AVAILABLE" | "RENTED" | "SOLD";
  price: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  tenantId: string;
  owner: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: [true, "O título é obrigatório"], trim: true },
    description: { type: String, required: [true, "A descrição é obrigatória"] },
    type: { type: String, enum: ["APARTMENT", "HOUSE", "COMMERCIAL", "LAND"], required: true },
    status: { type: String, enum: ["AVAILABLE", "RENTED", "SOLD"], default: "AVAILABLE" },
    price: { type: Number, required: [true, "O valor é obrigatório"], min: 0 },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    tenantId: { type: String, required: true, index: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

propertySchema.index({ tenantId: 1, type: 1 });

// ✅ Prevenção contra erro de OverwriteModelError
const Property = models.Property || model<IProperty>("Property", propertySchema);
export default Property;