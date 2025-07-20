import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, ApiResponse } from "@/types/auth";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL_API;

export const loginUser = async (loginData: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, loginData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(JSON.stringify(error.response.data));
    }
    throw error;
  }
};

export const registerUser = async (registerData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, registerData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(JSON.stringify(error.response.data));
    }
    throw error;
  }
};