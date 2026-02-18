import mongoose, { Document, Schema } from "mongoose";

export interface ITenant extends Document {
  fullName: string;
  email: string;
  phone?: string;
  document?: string;
  documents?: {
    name: string;
    url: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const tenantSchema = new Schema<ITenant>(
  {
    fullName: {
      type: String,
      required: [true, "Nome é obrigatório"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email é obrigatório"],
      unique: true,
      lowercase: true
    },
    phone: String,
    document: String,
    documents: [
      {
        name: String,
        url: String
      }
    ]
  },
  {
    timestamps: true
  }
);

export const Tenant = mongoose.model<ITenant>("Tenant", tenantSchema);
