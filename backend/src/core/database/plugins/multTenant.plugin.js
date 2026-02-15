export const multiTenantPlugin = (schema) => {
    schema.add({
      tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tenant",
        required: true,
        index: true
      }
    });
  
    schema.pre(/^find/, function () {
      if (!this.getQuery().tenantId) {
        throw new Error("TenantId is required in query");
      }
    });
  };
  