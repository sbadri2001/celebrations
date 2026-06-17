import { apiClient } from "../../lib/apiClient";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  accessToken?: string;
  expiresIn?: number;
}

export const AuthService = {
  register: (payload: RegisterPayload): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>("/auth/register", payload);
  },

  login: (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>("/auth/login", credentials);
  },

  refreshToken: (): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>("/auth/refresh", {});
  },

  logout: (): Promise<{ success: boolean }> => {
    return apiClient.post<{ success: boolean }>("/auth/logout", {});
  },
};
