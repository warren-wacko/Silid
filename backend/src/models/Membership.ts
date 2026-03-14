import mongoose, { Document, Schema } from 'mongoose';

export type MemberRole = 'owner' | 'admin' | 'member';

export interface IMembership extends Document {
  user_id: mongoose.Types.ObjectId;
  workspace_id: mongoose.Types.ObjectId;
  role: MemberRole;
}

const membershipSchema = new Schema<IMembership>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workspace_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member'],
      default: 'member',
    },
  },
  {
    timestamps: true,
  }
);

membershipSchema.index({ user_id: 1, workspace_id: 1 }, { unique: true });

const Membership = mongoose.model<IMembership>('Membership', membershipSchema);

export default Membership;
