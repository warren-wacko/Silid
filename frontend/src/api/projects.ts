import api from "./axios";
import type { Project } from "@/types";

export const getProjects = async (workspaceId: string): Promise<Project[]> => {
  const response = await api.get(`/workspaces/${workspaceId}/projects`);
  return response.data.projects;
};

export const createProject = async (
  workspaceId: string,
  data: { title: string; description?: string },
): Promise<Project> => {
  const response = await api.post(`/workspaces/${workspaceId}/projects`, data);
  return response.data.project;
};

export const updateProject = async (
  workspaceId: string,
  projectId: string,
  data: { title: string; description?: string },
): Promise<Project> => {
  const response = await api.put(
    `/workspaces/${workspaceId}/projects/${projectId}`,
    data,
  );

  return response.data.project;
};

export const deleteProject = async (
  workspaceId: string,
  projectId: string,
): Promise<void> => {
  await api.delete(`/workspaces/${workspaceId}/projects/${projectId}`);
};
