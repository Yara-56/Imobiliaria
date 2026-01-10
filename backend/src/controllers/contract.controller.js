import Contract from "../models/contract.model.js";

// List all contracts
export const listContracts = async (req, res) => {
  try {
    const contracts = await Contract.find().populate("tenantId propertyId");
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contracts." });
  }
};

// Create a new contract
export const createContract = async (req, res) => {
  try {
    const contract = new Contract(req.body);
    await contract.save();
    res.status(201).json(contract);
  } catch (error) {
    res.status(400).json({ error: "Failed to create contract." });
  }
};

// Get contract by ID
export const getContractById = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id).populate(
      "tenantId propertyId"
    );
    if (!contract)
      return res.status(404).json({ error: "Contract not found." });
    res.json(contract);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contract." });
  }
};

// Update a contract
export const updateContract = async (req, res) => {
  try {
    const updated = await Contract.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Contract not found." });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Failed to update contract." });
  }
};
