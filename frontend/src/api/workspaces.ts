import api from "./axios";
import type { Workspace } from "../types";

export const getWorkspaces = async (): Promise<Workspace[]> => {
  const response = await api.get("/workspaces");
  return response.data.workspaces;
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
