export const listTenants = async (req, res) => {
    res.json([]);
  };
  
  export const getTenant = async (req, res) => {
    res.json({});
  };
  
  export const createTenant = async (req, res) => {
    res.json({ message: "Tenant criado" });
  };
  
  export const updateTenant = async (req, res) => {
    res.json({ message: "Tenant atualizado" });
  };
  
  export const deleteTenant = async (req, res) => {
    res.json({ message: "Tenant removido" });
  };
  