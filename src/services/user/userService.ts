import { apiClient } from '../../lib/apiClient';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export const UserService = {
  getProfile: (): Promise<UserProfile> => {
    return apiClient.get<UserProfile>('/user/profile');
  },
  
  updateProfile: (profile: Partial<UserProfile>): Promise<UserProfile> => {
    return apiClient.put<UserProfile>('/user/profile', profile);
  }
};
