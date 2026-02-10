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

export const createOrder = async (orderData: any) => {
  try {
    const response = await API.post("/orders", orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const fetchOrders = async () => {
  try {
    const response = await API.get("/orders");
    // support different response shapes
    return Array.isArray(response.data) ? response.data : response.data.orders || response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const response = await API.put(`/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};
