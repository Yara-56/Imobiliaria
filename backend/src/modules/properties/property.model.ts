import { Schema, model, Document } from "mongoose";

export interface IProperty extends Document {
  title: string;
  description: string;
  type: "Casa" | "Apartamento" | "Terreno" | "Comercial";
  status: "Disponível" | "Alugado" | "Vendido";
  price: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  owner: Schema.Types.ObjectId;
  createdAt: Date;
}

const propertySchema = new Schema<IProperty>({
  title: { type: String, required: [true, "O título é obrigatório"], trim: true },
  description: { type: String, required: [true, "A descrição é obrigatória"] },
  type: { 
    type: String, 
    enum: ["Casa", "Apartamento", "Terreno", "Comercial"], 
    default: "Casa" 
  },
  status: { 
    type: String, 
    enum: ["Disponível", "Alugado", "Vendido"], 
    default: "Disponível" 
  },
  price: { type: Number, required: [true, "O valor é obrigatório"] },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
  },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export default model<IProperty>("Property", propertySchema);