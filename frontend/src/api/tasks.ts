import api from "./axios";
import type { Task } from "@/types";

export const getTasks = async (
  workspaceId: string,
  projectId: string,
): Promise<Task[]> => {
  const response = await api.get(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks`,
  );

  return response.data.tasks;
};

export const createTask = async (
  workspaceId: string,
  projectId: string,
  data: { title: string; description?: string; assigned_to?: string },
): Promise<Task> => {
  const response = await api.post(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks`,
    data,
  );

  return response.data.task;
};

export const updateTask = async (
  workspaceId: string,
  projectId: string,
  taskId: string,
  data: {
    title?: string;
    description?: string;
    assigned_to?: string;
    status?: string;
  },
): Promise<Task> => {
  const response = await api.put(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
    data,
  );

  return response.data.task;
};

export const deleteTask = async (
  workspaceId: string,
  projectId: string,
  taskId: string,
): Promise<void> => {
  await api.delete(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
  );
};
