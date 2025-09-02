import axios, { AxiosInstance } from "axios";

// Create an axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1", // Set your API base URL here
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// You can add interceptors here for requests or responses if needed

// Export the axios instance to use in your components or services
export default axiosInstance;
