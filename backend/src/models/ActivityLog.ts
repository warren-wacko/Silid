import mongoose, { Document, Schema } from 'mongoose';

export type Entity = 'task' | 'project' | 'member';

export interface IActivityLog extends Document {
  workspace_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  action: string;
  entity_type: Entity;
  entity_id: mongoose.Types.ObjectId;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    workspace_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    entity_type: {
      type: String,
      enum: ['task', 'project', 'member'],
      required: true,
    },

    entity_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

activityLogSchema.index({ workspace_id: 1, createdAt: -1 });

const ActivityLog = mongoose.model<IActivityLog>(
  'ActivityLog',
  activityLogSchema
);

export default ActivityLog;
