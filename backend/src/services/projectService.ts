import Project, { IProject } from '../models/Project';
import Membership from '../models/Membership';

const verifyMembership = async (
  workspaceId: string,
  userId: string
): Promise<void> => {
  const membership = await Membership.findOne({
    workspace_id: workspaceId,
    user_id: userId,
  });

  if (!membership) {
    throw new Error('Access Denied');
  }
};

export const createProject = async (
  workspaceId: string,
  title: string,
  description: string | undefined,
  userId: string
): Promise<IProject> => {
  await verifyMembership(workspaceId, userId);

  const project = await Project.create({
    workspace_id: workspaceId,
    title,
    description,
    created_by: userId,
  });

  return project;
};

export const getProject = async (
  workspaceId: string,
  userId: string
): Promise<IProject[]> => {
  await verifyMembership(workspaceId, userId);

  const projects = await Project.find({ workspace_id: workspaceId }).sort({
    createdAt: -1,
  });

  return projects;
};

export const updateProject = async (
  projectId: string,
  workspaceId: string,
  userId: string,
  updates: { title?: string; description?: string }
): Promise<IProject> => {
  await verifyMembership(workspaceId, userId);

  const project = await Project.findOneAndUpdate(
    { _id: projectId, workspace_id: workspaceId },
    updates,
    { new: true }
  );

  if (!project) {
    throw new Error('Project not found');
  }

  return project;
};

export const deleteProject = async (
  projectId: string,
  workspaceId: string,
  userId: string
): Promise<void> => {
  await verifyMembership(workspaceId, userId);

  const project = await Project.findOneAndDelete({
    _id: projectId,
    workspace_id: workspaceId,
  });

  if (!project) {
    throw new Error('Project not found');
  }
};
