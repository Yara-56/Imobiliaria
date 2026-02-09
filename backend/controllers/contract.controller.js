export const listContracts = async (req, res) => {
    res.json([]);
  };
  
  export const getContractById = async (req, res) => {
    res.json({});
  };
  
  export const createContract = async (req, res) => {
    res.json({ message: "Contrato criado" });
  };
  
  export const updateContract = async (req, res) => {
    res.json({ message: "Contrato atualizado" });
  };
  
  export const deleteContract = async (req, res) => {
    res.json({ message: "Contrato removido" });
  };
  