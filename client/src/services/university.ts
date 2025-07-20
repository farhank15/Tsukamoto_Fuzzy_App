import type { University } from "@/types/university";
import axios from "axios";
import { getCookie } from "@/lib/JwtDecode";

const API_BASE_URL = import.meta.env.VITE_BASE_URL_API;

// Get all universities
export async function getAllUniversities(): Promise<University[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/university`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Get All Universities error:", {
      error,
      url: `${API_BASE_URL}/university`,
      status: error.response?.status,
      message: error.response?.data?.message,
    });
    throw error;
  }
}

// Get university by ID
export async function getUniversityById(id: number): Promise<University> {
  try {
    const response = await axios.get(`${API_BASE_URL}/university/${id}`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Get University By ID error:", {
      error,
      url: `${API_BASE_URL}/university/${id}`,
      status: error.response?.status,
      message: error.response?.data?.message,
    });
    throw error;
  }
}
