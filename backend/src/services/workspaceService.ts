import crypto from 'crypto';
import Workspace, { IWorkspace } from '../models/Workspace';
import Membership, { IMembership } from '../models/Membership';
export const createWorkspace = async (
  name: string,
  userId: string
): Promise<IWorkspace> => {
  const invite_token = crypto.randomBytes(16).toString('hex');

  const workspace = await Workspace.create({
    name,
    owner_id: userId,
    invite_token,
  });

  await Membership.create({
    user_id: userId,
    workspace_id: workspace._id,
    role: 'owner',
  });

  return workspace;
};

export const getUserWorkspaces = async (
  userId: string
): Promise<IWorkspace[]> => {
  const memberships = await Membership.find({ user_id: userId });

  const workspaceIds = memberships.map((m) => m.workspace_id);

  const workspaces = await Workspace.find({ _id: { $in: workspaceIds } });

  return workspaces;
};

export const getWorkspaceById = async (
  workspaceId: string,
  userId: string
): Promise<IWorkspace> => {
  const membership = await Membership.findOne({
    workspace_id: workspaceId,
    user_id: userId,
  });

  if (!membership) {
    throw new Error('Workspace not found or access denied');
  }

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new Error('Workspace not found');
  }

  return workspace;
};

export const joinWorkspace = async (
  invite_token: string,
  userId: string
): Promise<IWorkspace> => {
  const workspace = await Workspace.findOne({ invite_token });

  if (!workspace) {
    throw new Error('Invalid invite token');
  }

  const existingMembership = await Membership.findOne({
    user_id: userId,
    workspace_id: workspace._id,
  });

  if (existingMembership) {
    throw new Error('You are already a member of this workspace');
  }

  await Membership.create({
    user_id: userId,
    workspace_id: workspace._id,
    role: 'member',
  });

  return workspace;
};

export const getWorkspaceMembers = async (
  workspaceId: string,
  userId: string
): Promise<IMembership[]> => {
  const membership = await Membership.findOne({
    workspace_id: workspaceId,
    user_id: userId,
  });

  if (!membership) {
    throw new Error('Access denied');
  }

  const members = await Membership.find({ workspace_id: workspaceId }).populate(
    'user_id',
    'name email'
  );

  return members;
};
