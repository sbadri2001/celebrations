import { Team } from "../../types";
import { apiClient } from "../../lib/apiClient";

export const TeamService = {
  getAll: (editionId?: string): Promise<Team[]> => {
    if (!editionId) {
      return Promise.resolve([]);
    }
    return apiClient.get<Team[]>(`/editions/${editionId}/teams`);
  },

  create: (team: Omit<Team, "id" | "createdAt">): Promise<Team> => {
    return apiClient.post<Team>("/teams", team);
  },

  update: (id: string, team: Team): Promise<Team> => {
    const { id: _, ...payload } = team as any;
    return apiClient.put<Team>(`/teams/${id}`, payload);
  },

  delete: (id: string): Promise<{ success: boolean; id: string }> => {
    return apiClient.delete<{ success: boolean; id: string }>(`/teams/${id}`);
  },
};
