import api from "./axios";
import type { Analytics } from "@/types";

export const getAnalytics = async (workspaceId: string): Promise<Analytics> => {
  const response = await api.get(`/workspaces/${workspaceId}/analytics`);
  return response.data.analytics;
};
