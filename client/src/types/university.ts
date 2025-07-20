export interface University {
  id: number;
  name: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUniversityRequest {
  name: string;
  address: string;
}
