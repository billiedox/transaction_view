import axios from "axios";

export const getTransactions = async (
  address?: string,
  chain?: string,
  page?: number
) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/transactions`, {
      params: { address, chain, page },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to search transactions");
  }
};
