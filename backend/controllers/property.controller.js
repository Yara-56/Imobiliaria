import Property from "../models/Property.js";

// Listar todos os imóveis com paginação e ordenação
export const listProperties = async (req, res) => {
  const { page = 1, limit = 10, sortBy = 'name', order = 'asc' } = req.query;

  try {
    const properties = await Property.find()
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Error fetching properties." });
  }
};

// Criar novo imóvel com validação de campos
export const createProperty = async (req, res) => {
  const { name, address, value } = req.body;

  if (!name || !address || !value) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const property = new Property({ name, address, value });
    await property.save();
    res.status(201).json({
      message: "Property created successfully.",
      property,
    });
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ error: "Error creating property." });
  }
};
