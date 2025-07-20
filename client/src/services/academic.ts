import type {
  AcademicRequest,
  AcademicUpdateRequest,
  AcademicRecord,
} from "@/types/academic";
import axios from "axios";
import { getCookie } from "@/lib/JwtDecode";

const API_BASE_URL = import.meta.env.VITE_BASE_URL_API;

// Ambil data akademik berdasarkan student_id
export async function getAcademicRecordsByStudentId(student_id: number): Promise<AcademicRecord[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/academic/student/${student_id}`, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Get Academic Records by Student ID error:", {
      error,
      url: `${API_BASE_URL}/academic/student/${student_id}`,
      status: error.response?.status,
      message: error.response?.data?.message,
    });
    throw error;
  }
}

// Buat catatan akademik baru
export async function createAcademicRecord(data: AcademicRequest): Promise<AcademicRecord> {
  try {
    console.log("Sending data to createAcademicRecord:", data);
    const response = await axios.post(`${API_BASE_URL}/academic`, data, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Create Academic Record error:", {
      error,
      data,
      status: error.response?.status,
      message: error.response?.data?.message,
    });
    throw error;
  }
}

// Perbarui catatan akademik
export async function updateAcademicRecord(id: number, data: AcademicUpdateRequest): Promise<AcademicRecord> {
  try {
    const response = await axios.put(`${API_BASE_URL}/academic/${id}`, data, {
      headers: {
        Authorization: `Bearer ${getCookie("access_token")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Update Academic Record error:", {
      error,
      id,
      data,
      status: error.response?.status,
      message: error.response?.data?.message,
    });
    throw error;
  }
}