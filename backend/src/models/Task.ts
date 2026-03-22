import mongoose, { Document, Schema } from 'mongoose';

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface ITask extends Document {
  project_id: mongoose.Types.ObjectId;
  workspace_id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  assigned_to?: mongoose.Types.ObjectId;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: Date;
  created_by: mongoose.Types.ObjectId;
}

const taskSchema = new Schema<ITask>(
  {
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    workspace_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'completed'],
      default: 'todo',
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    due_date: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ workspace_id: 1, createdAt: -1 });
taskSchema.index({ project_id: 1, status: 1 });

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;
