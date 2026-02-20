import mongoose, { Schema, type Document } from "mongoose";

export interface IPropertyDocument {
  originalName: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;          // ex: /uploads/properties/<filename>
  uploadedAt: Date;
}

export interface IProperty extends Document {
  title: string;
  description: string;
  type: "APARTMENT" | "HOUSE" | "COMMERCIAL" | "LAND";
  status: "AVAILABLE" | "RENTED" | "SOLD";
  price: number;

  // ✅ endereço mais completo
  address: {
    street: string;
    number: string;
    neighborhood: string;
    complement?: string;
    city: string;
    state: string;
    zipCode: string;
  };

  sqls?: string;

  // ✅ anexos
  documents: IPropertyDocument[];

  tenantId: string;
  owner: Schema.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const propertyDocumentSchema = new Schema<IPropertyDocument>(
  {
    originalName: { type: String, required: true },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const propertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: [true, "O título é obrigatório"], trim: true },
    description: { type: String, required: [true, "A descrição é obrigatória"] },
    type: { type: String, enum: ["APARTMENT", "HOUSE", "COMMERCIAL", "LAND"], required: true },
    status: { type: String, enum: ["AVAILABLE", "RENTED", "SOLD"], default: "AVAILABLE" },
    price: { type: Number, required: [true, "O valor é obrigatório"], min: 0 },

    address: {
      street: { type: String, required: true },
      number: { type: String, required: true },
      neighborhood: { type: String, required: true },
      complement: { type: String, required: false },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
    },

    sqls: { type: String, required: false },

    documents: { type: [propertyDocumentSchema], default: [] },

    tenantId: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

propertySchema.index({ tenantId: 1, type: 1 });

const Property =
  mongoose.models.Property || mongoose.model<IProperty>("Property", propertySchema);

export default Property;
