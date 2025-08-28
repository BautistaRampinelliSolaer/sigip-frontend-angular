export interface UserDTO { 
  id: number; 
  username: string; 
  name: string; 
  lastname: string; 
  workingHours: number; 
  email: string; 
  role: string; 
  profilePhoto?: string 
}