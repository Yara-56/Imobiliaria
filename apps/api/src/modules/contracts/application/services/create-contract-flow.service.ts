import { injectable, inject } from "tsyringe";

// ✅ Imports corrigidos (Removido os .ts e ajustado caminhos)
import { TenantService } from "../../../tenants/application/services/tenant.service.js";
import { PropertyService } from "../../../properties/services/PropertyService.js";
import { PaymentReceiptService } from "../../../payments/services/PaymentReceiptService.js";
import { ContractService } from "../contract-generator.service.js"; // ✅ Certifique-se que o nome da CLASSE lá dentro é ContractService

import { AppError } from "@shared/errors/AppError.js";
import { HttpStatus } from "@shared/errors/http-status.js";

@injectable()
export class CreateContractFlowService {
  constructor(
    @inject("TenantService")
    private tenantService: TenantService,

    @inject("PropertyService")
    private propertyService: PropertyService,

    // ✅ DICA: Certifique-se que no container você registrou como "ContractService"
    @inject("ContractService")
    private contractService: ContractService,

    @inject("ReceiptService")
    private receiptService: PaymentReceiptService
  ) {}

  async execute(data: {
    tenantId: string;
    propertyId: string;
    rentAmount?: number;
    startDate: Date;
    endDate: Date;
    userId: string;
  }) {
    // 1. Validar Locatário
    const tenant = await this.tenantService.findById(data.tenantId, data.tenantId);
    if (!tenant) throw new AppError({ message: "Locatário não encontrado.", statusCode: HttpStatus.NOT_FOUND });

    // 2. Validar Imóvel
    const property = await this.propertyService.findById(data.propertyId, data.tenantId);
    if (!property) throw new AppError({ message: "Imóvel não encontrado.", statusCode: HttpStatus.NOT_FOUND });

    const finalRentAmount = data.rentAmount ?? (property as any).price ?? 0;

    // 3. Criar o Contrato
    const contract = await this.contractService.execute({
      propertyId: data.propertyId,
      rentAmount: finalRentAmount,
      startDate: data.startDate,
      endDate: data.endDate,
      tenantId: data.tenantId,
      userId: data.userId
    });

    // 4. Gerar Recibo
    let receiptUrl = null;
    try {
      // O receiptService.execute geralmente espera o ID do pagamento ou contrato
      const receipt = await this.receiptService.execute(contract.id);
      receiptUrl = (receipt as any).url;
    } catch (error) {
      console.error("⚠️ Erro ao gerar recibo automático:", error);
    }

    return {
      status: "success",
      data: { contractId: contract.id, receiptUrl }
    };
  }
}