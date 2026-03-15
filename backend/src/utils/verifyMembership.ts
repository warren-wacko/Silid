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
    throw new Error('Access denied');
  }
};

export default verifyMembership;
