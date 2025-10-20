export interface UserDTO {
  id: number;
  username: string;
  name: string;
  lastname: string;
  workingHours: number;
  email: string;
  role: string;
  profilePhoto?: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  dni: number;
  name: string;
  lastname: string;
  workingHours: number;
  isAdmin: boolean;
  profilePhoto?: string;
  role: string;
}
