import { Team } from '../../types';
import { apiClient } from '../../lib/apiClient';

export const TeamService = {
  getAll: (): Promise<Team[]> => {
    return apiClient.get<Team[]>('/teams');
  },
  
  create: (team: Omit<Team, 'id' | 'dateCreated'>): Promise<Team> => {
    return apiClient.post<Team>('/teams', team);
  },
  
  update: (id: string, team: Team): Promise<Team> => {
    return apiClient.put<Team>(`/teams/${id}`, team);
  },
  
  delete: (id: string): Promise<{ success: boolean; id: string }> => {
    return apiClient.delete<{ success: boolean; id: string }>(`/teams/${id}`);
  }
};
