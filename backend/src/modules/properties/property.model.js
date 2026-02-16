import mongoose from "mongoose";
import { multiTenantPlugin } from "../../shared/plugins/multiTenant.plugin.js";

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

propertySchema.plugin(multiTenantPlugin);

// Índice essencial para performance SaaS
propertySchema.index({ tenantId: 1, createdAt: -1 });

export default mongoose.model("Property", propertySchema);
