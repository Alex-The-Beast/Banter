import { StatusCodes } from 'http-status-codes';

import userRepository from '../repositories/userRepositories.js';
import workspaceRepository from '../repositories/workspaceRepositories.js';
import ClientError from '../utils/errors/clientError.js';
import { isUserMemberOfWorkspace } from './workspaceService.js';

export const isMemberPartOfWorkspaceService = async (workspaceId, memberId) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'No workspaces found for the user',
        message: 'No workspaces found for the user',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isUserMember = await isUserMemberOfWorkspace(workspace, memberId);

    if (!isUserMember) {
      throw new ClientError({
        explanation: 'User is either not a member or admin of a workspace.',
        message: 'You are not allowed to get the details of this workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    const user = await userRepository.getById(memberId);
    return user;
  } catch (error) {
    console.log('isMemberPartOfWorkspaceService error', error);
    throw error;
  }
};
