import axios from "axios";
import { API_URL } from "../config"; // Import API URL from config

// Create an Axios instance with default settings
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 5000, // 5 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient