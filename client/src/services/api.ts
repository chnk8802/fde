import API from "./axios";

export interface Products {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export const fetchProducts = async () => {
  try {
    const response = await API.get("/products");
    return response.data;
  } catch (error) {
    console.error("Error in fetchProducts service:", error);
    throw error;
  }
};

export const fetchProductById = async (id: string) => {
  try {
    const response = await API.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};
