import { UserDTO } from "../users/user-dto";

export interface AuthResponse {
    user: UserDTO;
    token: string;
}