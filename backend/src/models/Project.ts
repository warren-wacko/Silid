import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  workspace_id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  created_by: mongoose.Types.ObjectId;
}

const projectSchema = new Schema<IProject>(
  {
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
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ workspace_id: 1, createdAt: -1 });

const Project = mongoose.model<IProject>('Project', projectSchema);

export default Project;
