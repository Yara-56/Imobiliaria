import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const useReceipt = () => {
  const generateReceipt = (payment: any) => {
    const content = `
      RECIBO DE PAGAMENTO DE ALUGUEL
      ----------------------------------------------
      VALOR: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payment.amount)}
      
      Recebemos de ${payment.tenantId?.fullName || "N/A"}, a importância acima referente ao aluguel do imóvel situado em:
      ${payment.contractId?.propertyAddress || "Endereço não informado"}
      
      Mês de Referência: ${payment.referenceMonth}
      Método de Pagamento: ${payment.method || "PIX"}
      Data da Transação: ${format(new Date(payment.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
      Hora: ${format(new Date(payment.createdAt), "HH:mm:ss")}
      
      Este recibo confirma a quitação da referida parcela conforme a lei brasileira.
      ----------------------------------------------
      Aura ImobiSys - Gestão Digital
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Recibo_${payment.tenantId?.fullName}_${payment.referenceMonth}.txt`;
    link.click();
  };

  return { generateReceipt };
};