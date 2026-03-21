import api from "./axios";
import type { Workspace } from "../types";

export const getWorkspaces = async (): Promise<Workspace[]> => {
  const response = await api.get("/workspaces");
  return response.data.workspaces;
};

/* This is only for 1 workspace */
export const getWorkspace = async (workspaceId: string): Promise<Workspace> => {
  const response = await api.get(`/workspaces/${workspaceId}`);
  return response.data.workspace;
};

export const createWorkspace = async (name: string): Promise<Workspace> => {
  const response = await api.post("/workspaces", { name });
  return response.data.workspace;
};

export const joinWorkspace = async (
  invite_token: string,
): Promise<Workspace> => {
  const response = await api.post("/workspaces/join", { invite_token });
  return response.data.workspace;
};

export const generateShareToken = async (
  workspaceId: string,
): Promise<string> => {
  const response = await api.post(`/workspaces/${workspaceId}/share`);
  return response.data.share_token;
};
