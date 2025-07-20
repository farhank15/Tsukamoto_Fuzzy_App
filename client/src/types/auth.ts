// types/auth.ts

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  username: string;
  name: string;
  password: string;
  role: 'admin' | 'student';
  // Make these optional but at least one must be provided for students
  university_id?: number;
  university_name?: string;
  university_address?: string;
}

export interface RegisterResponse {
  id: number;
  username: string;
  name: string;
  role: string;
  message: string;
}

// API Response wrapper types
export interface ApiResponse<T> {
  data: T;
  errors?: Array<{ field?: string; message: string }>;
}

// JWT Token payload type
export interface JwtPayload {
  user_id: number;
  username: string;
  role: 'admin' | 'student';
  university_id: number;
  university_name: string;
  exp: number;
}