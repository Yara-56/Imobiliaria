import mongoose from "mongoose"

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cnpj: { type: String, required: true }
  },
  { timestamps: true }
)

export default mongoose.model("Company", companySchema)
