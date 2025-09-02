import axiosInstance from "../axiosInstance";
import { AxiosResponse } from "axios";
import axios from "axios";
import { ProductFormData } from "@/models/admin-view/product";

const PRODUCT_API = "/admin/products";

// Fetch all products
export const fetchProducts = async (): Promise<AxiosResponse<any> | Error> => {
  try {
    const response: AxiosResponse<any> = await axiosInstance.get(PRODUCT_API);
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return error.response as AxiosResponse<any>;
    }
    return error as Error;
  }
};

// Add a new product
export const createProduct = async (data: ProductFormData): Promise<AxiosResponse<any> | Error> => {
  try {
    const response: AxiosResponse<any> = await axiosInstance.post(PRODUCT_API, data);
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return error.response as AxiosResponse<any>;
    }
    return error as Error;
  }
};

// Edit an existing product
export const updateProduct = async (
  id: string,
  data: ProductFormData
): Promise<AxiosResponse<any> | Error> => {
  try {
    const response: AxiosResponse<any> = await axiosInstance.put(`${PRODUCT_API}/${id}`, data);
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return error.response as AxiosResponse<any>;
    }
    return error as Error;
  }
};

// Delete a product
export const removeProduct = async (id: string): Promise<AxiosResponse<any> | Error> => {
  try {
    const response: AxiosResponse<any> = await axiosInstance.delete(`${PRODUCT_API}/${id}`);
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return error.response as AxiosResponse<any>;
    }
    return error as Error;
  }
};

// Upload an image
export const uploadProductImage = async (file: File): Promise<AxiosResponse<any> | Error> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response: AxiosResponse<any> = await axiosInstance.post(`${PRODUCT_API}/upload-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return error.response as AxiosResponse<any>;
    }
    return error as Error;
  }
};
