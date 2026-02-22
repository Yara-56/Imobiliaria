import { TenantModel } from "../database/tenant.model.js";

export class TenantRepository {
  async create(data: any) {
    return TenantModel.create(data);
  }

  async findAll(tenantId: string, { page = 1, limit = 10, search = "" }) {
    const query: any = { tenantId };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const [data, total] = await Promise.all([
      TenantModel.find(query)
        .skip((page - 1) * limit)
        .limit(limit),
      TenantModel.countDocuments(query),
    ]);

    return { data, total };
  }

  async findById(id: string, tenantId: string) {
    return TenantModel.findOne({ _id: id, tenantId });
  }

  async update(id: string, tenantId: string, data: any) {
    return TenantModel.findOneAndUpdate(
      { _id: id, tenantId },
      data,
      { new: true }
    );
  }

  async delete(id: string, tenantId: string) {
    return TenantModel.findOneAndDelete({ _id: id, tenantId });
  }
}