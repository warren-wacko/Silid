import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkspace extends Document {
  name: string;
  owner_id: mongoose.Types.ObjectId;
  invite_token: string;
  share_token: string;
}

const workspaceSchema = new Schema<IWorkspace>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    invite_token: {
      type: String,
      required: true,
      unique: true,
    },
    share_token: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

const Workspace = mongoose.model<IWorkspace>('Workspace', workspaceSchema);

export default Workspace;
