import { Edition } from "../../types";
import { apiClient } from "../../lib/apiClient";

export const EditionService = {
  getAll: (): Promise<Edition[]> => {
    return apiClient.get<Edition[]>("/editions");
  },

  create: (edition: Omit<Edition, "id">): Promise<Edition> => {
    return apiClient.post<Edition>("/editions", edition);
  },

  activate: (id: string): Promise<Edition> => {
    return apiClient.put<Edition>(`/editions/${id}/activate`, {});
  },

  deactivate: (id: string): Promise<Edition> => {
    return apiClient.put<Edition>(`/editions/${id}/deactivate`, {});
  },

  update: (id: string, edition: Partial<Edition>): Promise<Edition> => {
    return apiClient.put<Edition>(`/editions/${id}`, edition);
  },

  delete: (id: string): Promise<{ success: boolean; id: string }> => {
    return apiClient.delete<{ success: boolean; id: string }>(
      `/editions/${id}`,
    );
  },
};
