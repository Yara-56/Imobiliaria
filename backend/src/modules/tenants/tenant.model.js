import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    plan: {
      type: String,
      enum: ["BASIC", "PRO", "ENTERPRISE"],
      default: "BASIC"
    },
    status: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED"],
      default: "ACTIVE"
    },
    settings: {
      maxUsers: { type: Number, default: 3 },
      maxProperties: { type: Number, default: 50 },
      features: {
        crm: { type: Boolean, default: false },
        automation: { type: Boolean, default: false }
      }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Tenant", tenantSchema);
