import api from "./axios";
import type { Membership } from "@/types";

export const getMembers = async (
  workspaceId: string,
): Promise<Membership[]> => {
  const response = await api.get(`/workspaces/${workspaceId}/members`);

  return response.data.members;
};
