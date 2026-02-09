export const listReceipts = async (req, res) => {
    res.json([]);
  };
  
  export const getReceiptById = async (req, res) => {
    res.json({});
  };
  
  export const createReceipt = async (req, res) => {
    res.json({ message: "Recibo criado" });
  };
  
  export const deleteReceipt = async (req, res) => {
    res.json({ message: "Recibo removido" });
  };
  