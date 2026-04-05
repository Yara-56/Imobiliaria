// src/modules/contracts/infra/repositories/contract.repository.ts

import ContractModel from "../models/contract.model.js";
import { IContract } from "../domain/contract.types.js";

export class ContractRepository {
  async findAll(tenantId: string): Promise<IContract[]> {
    return ContractModel.find({ tenantId })
      .sort({ createdAt: -1 })
      .lean();
  }

  async findById(contractId: string, tenantId?: string): Promise<IContract | null> {
    return ContractModel.findOne({
      _id: contractId,
      ...(tenantId && { tenantId }),
    }).lean();
  }

  async create(data: Partial<IContract>): Promise<IContract> {
    const doc = await ContractModel.create(data);
    return doc.toObject();
  }

  async update(
    contractId: string,
    tenantId: string | undefined,
    updateData: Partial<IContract>
  ): Promise<IContract | null> {
    return ContractModel.findOneAndUpdate(
      { _id: contractId, ...(tenantId && { tenantId }) },
      { $set: updateData },
      { new: true, runValidators: true, lean: true }
    );
  }
}