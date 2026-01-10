import Receipt from "../models/receipt.model.js";

// List all receipts
export const listReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find().populate("paymentId");
    res.json(receipts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch receipts." });
  }
};

// Create a new receipt
export const createReceipt = async (req, res) => {
  try {
    const receipt = new Receipt(req.body);
    await receipt.save();
    res.status(201).json(receipt);
  } catch (error) {
    res.status(400).json({ error: "Failed to create receipt." });
  }
};
