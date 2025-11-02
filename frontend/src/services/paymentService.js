// frontend/src/services/paymentService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const listPayments = async () => {
  const response = await axios.get(`${API_URL}/payments`);
  return response.data;
};
