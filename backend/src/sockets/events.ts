import { getIO } from './index';

export const emitTaskCreated = (workspaceId: string, task: object): void => {
  getIO().to(workspaceId).emit('task:created', task);
};

export const emitTaskUpdated = (workspaceId: string, task: object): void => {
  getIO().to(workspaceId).emit('task:updated', task);
};

export const emitTaskDeleted = (workspaceId: string, taskId: string): void => {
  getIO().to(workspaceId).emit('task:deleted', { taskId });
};

export const emitProjectCreated = (
  workspaceId: string,
  project: object
): void => {
  getIO().to(workspaceId).emit('project:created', project);
};

export const emitMemberJoined = (workspaceId: string, userId: string): void => {
  getIO().to(workspaceId).emit('user:joined', { userId });
};
