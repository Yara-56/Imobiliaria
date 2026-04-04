import { injectable, inject } from "tsyringe";

// ✅ Caminhos ajustados para o que vejo no seu explorador
import { TenantService } from "../../../tenants/application/services/tenant.service";
import { ContractService } from "./contracts.services"; // Vizinho de pasta
import { ReceiptService } from "../../../payments/application/services/payment-receipt.service";
import { PropertyService } from "../../../properties/application/services/PropertyService";

import { AppError } from "../../../../shared/errors/AppError";
import { HttpStatus } from "../../../../shared/errors/http-status";

@injectable()
export class CreateContractFlowService {
  constructor(
    @inject(TenantService)
    private tenantService: TenantService,

    @inject(PropertyService)
    private propertyService: PropertyService,

    @inject(ContractService)
    private contractService: ContractService,

    @inject(ReceiptService)
    private receiptService: ReceiptService
  ) {}

  async execute(data: {
    tenantId: string;
    propertyId: string;
    rentAmount?: number;
    startDate: Date;
    endDate: Date;
    userId: string;
  }) {
    // 1. Validar inquilino
    const tenant = await this.tenantService.findById(data.tenantId, data.tenantId);

    // 2. Validar imóvel
    const property = await this.propertyService.findById(data.propertyId, data.tenantId);

    if (!property) {
      throw new AppError({ message: "Imóvel não encontrado.", statusCode: HttpStatus.NOT_FOUND });
    }

    const rentAmount = data.rentAmount ?? (property as any).rentValue;

    // 3. Criar contrato
    const contract = await this.contractService.createContract({
      propertyId: data.propertyId,
      rentAmount,
      startDate: data.startDate,
      endDate: data.endDate,
    }, data.tenantId, data.userId);

    // 4. Gerar recibo financeiro
    const receipt = await this.receiptService.generateInitialReceipt({
      tenantId: data.tenantId,
      contractId: contract.id,
      amount: rentAmount,
    });

    return {
      status: "success",
      data: { tenant, property, contract, receipt }
    };
  }
}