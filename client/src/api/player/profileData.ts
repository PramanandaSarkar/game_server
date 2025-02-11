// import apiClient from "../../config.ts"; // Import Axios instance

import apiClient from "../api";

export const getUserDetails = async (userId: string) => {
  try {
    const response = await apiClient.get(`/player/${userId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};
