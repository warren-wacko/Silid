import Workspace, { IWorkspace } from '../models/Workspace';
import crypto from 'crypto';
import Project, { IProject } from '../models/Project';
import Task, { ITask } from '../models/Task';

export const generateShareToken = async (
  workspaceId: string,
  userId: string
): Promise<string> => {
  const share_token = crypto.randomBytes(16).toString('hex');

  const workspace = await Workspace.findOneAndUpdate(
    { _id: workspaceId, owner_id: userId },
    { share_token },
    { new: true }
  );

  if (!workspace) {
    throw new Error('Not authorized or workspace not found');
  }

  return share_token;
};

export const getSharedWorkSpace = async (
  shareToken: string
): Promise<{ workspace: IWorkspace; projects: IProject[]; tasks: ITask[] }> => {
  const workspace = await Workspace.findOne({
    share_token: shareToken,
  }).select('-invite_token -share_token');

  if (!workspace) {
    throw new Error('Not authorized or workspace not found');
  }

  const projects = await Project.find({
    workspace_id: workspace._id,
  });

  const tasks = await Task.find({
    workspace_id: workspace._id,
  });

  return {
    workspace,
    projects,
    tasks,
  };
};
