import Task from '../models/Task';
import Project from '../models/Project';
import Membership from '../models/Membership';
import ActivityLog from '../models/ActivityLog';
import mongoose from 'mongoose';

export const getWorkspaceAnalytics = async (workspaceId: string) => {
  const workspaceObjectId = new mongoose.Types.ObjectId(workspaceId);

  const tasksByStatus = await Task.aggregate([
    { $match: { workspace_id: workspaceObjectId } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const totalProjects = await Project.countDocuments({
    workspace_id: workspaceId,
  });

  const totalMembers = await Membership.countDocuments({
    workspace_id: workspaceId,
  });

  const totalTasks = await Task.countDocuments({
    workspace_id: workspaceId,
  });

  const tasksByMember = await Task.aggregate([
    {
      $match: {
        workspace_id: workspaceObjectId,
        assigned_to: { $exists: true, $ne: null },
      },
    },
    { $group: { _id: '$assigned_to', count: { $sum: 1 } } },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: 1,
        count: 1,
        'user.name': 1,
        'user.email': 1,
      },
    },
  ]);

  const completedTasks =
    tasksByStatus.find((t) => t._id === 'completed')?.count || 0;

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const recentActivity = await ActivityLog.find({ workspace_id: workspaceId })
    .populate('user_id', 'name email')
    .sort({ createdAt: -1 })
    .limit(10);

  return {
    overview: {
      totalProjects,
      totalMembers,
      totalTasks,
      completionRate,
    },
    tasksByStatus,
    tasksByMember,
    recentActivity,
  };
};
