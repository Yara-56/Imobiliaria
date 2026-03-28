export class SantanderWebhookService {
    async handlePixNotification(event: any) {
      const txid = event.pix?.[0]?.txid;
      const amount = event.pix?.[0]?.valor;
  
      console.log("PIX recebido:", txid, amount);
  
      // atualizar pagamento no banco
    }
  
    async handleBoleto(event: any) {
      console.log("Boleto atualizado:", event);
    }
  
    async handleCard(event: any) {
      console.log("Pagamento cartão:", event);
    }
  }