// src/modules/contracts/infra/repositories/contract.repository.ts

import ContractModel from "../models/contract.model.js";
import { IContract } from "../domain/contract.types.js";

export class ContractRepository {
  async findAll(tenantId: string): Promise<IContract[]> {
    const rows = await ContractModel.find({ tenantId })
      .sort({ createdAt: -1 })
      .lean();
    return rows as unknown as IContract[];
  }

  async findById(contractId: string, tenantId?: string): Promise<IContract | null> {
    const row = await ContractModel.findOne({
      _id: contractId,
      ...(tenantId && { tenantId }),
    }).lean();
    return row as unknown as IContract | null;
  }

  async create(data: Partial<IContract>): Promise<IContract> {
    const doc = await ContractModel.create(data);
    return doc.toObject() as unknown as IContract;
  }

  async update(
    contractId: string,
    tenantId: string | undefined,
    updateData: Partial<IContract>
  ): Promise<IContract | null> {
    const row = await ContractModel.findOneAndUpdate(
      { _id: contractId, ...(tenantId && { tenantId }) },
      { $set: updateData },
      { new: true, runValidators: true, lean: true }
    );
    return row as unknown as IContract | null;
  }
}