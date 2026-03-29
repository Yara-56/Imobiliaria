import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cnpj: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const CompanyModel = mongoose.model("Company", companySchema);