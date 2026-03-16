import ActivityLog, { IActivityLog } from '../models/ActivityLog';

interface CreateActivityLogParams {
  workspace_id: string;
  user_id: string;
  action: string;
  entity_type: 'task' | 'project' | 'member';
  entity_id: string;
}

export const createActivityLog = async (
  params: CreateActivityLogParams
): Promise<void> => {
  try {
    await ActivityLog.create(params);
  } catch (error) {
    console.error('Failed to create activity log:', error);
  }
};

export const getWorkspaceActivity = async (
  workspaceId: string,
  limit: number = 20
): Promise<IActivityLog[]> => {
  const logs = await ActivityLog.find({ workspace_id: workspaceId })
    .populate('user_id', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit);

  return logs;
};
