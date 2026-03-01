import mongoose, { Schema, Document, Types } from 'mongoose';

/**
 * 1️⃣ Interface de Dados Pura
 * Removemos o _id daqui para evitar o conflito ts(2320) com o Document.
 */
export interface IContract {
  landlordName: string;
  propertyAddress: string;
  rentAmount: number;
  startDate: Date;
  tenantId: Types.ObjectId;
  owner: Types.ObjectId; // 🛡️ Segurança: Isolamento de dados
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * 2️⃣ Interface do Documento (Mongoose)
 * Ao estender ambos, o TypeScript agora não verá conflito de _id.
 */
export interface IContractDocument extends IContract, Document {}

/**
 * 3️⃣ Definição do Schema
 */
const ContractSchema = new Schema<IContractDocument>(
  {
    landlordName: { type: String, required: true },
    propertyAddress: { type: String, required: true },
    rentAmount: { type: Number, required: true },
    startDate: { type: Date, required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * 4️⃣ Exportação do Modelo
 */
const Contract = mongoose.model<IContractDocument>('Contract', ContractSchema);
export default Contract;