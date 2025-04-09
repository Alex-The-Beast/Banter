import channelRepository from '../repositories/channelRepositories.js';
import { StatusCodes } from 'http-status-codes';
import ClientError from '../utils/errors/clientError.js';
import { isUserMemberOfWorkspace } from './workspaceService.js';

// get channel by Id service
export const getChannelByIdService = async (channelId, userId) => {
  try {
    const channel =
      await channelRepository.getChannelByWorkspaceDetails(channelId);


    if (!channel || !channel.workspaceId ) {
      throw new ClientError({
        explanation: 'No channel found with given id',
        message: 'No channel found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isUserPartOfWorkspace = isUserMemberOfWorkspace(
      channel.workspaceId,
      userId
    );
    if (!isUserPartOfWorkspace) {
      throw new ClientError({
        message: 'User is not a member of workspace and hence cannot access the channel.',
        explanation: 'User is not a member of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    return channel;
  } catch (error) {
    console.log(Error, 'Error from get channel by id service');
    throw error;
  }
};
