import { StatusCodes } from 'http-status-codes';

import channelRepository from '../repositories/channelRepositories.js';
import messageRepository from '../repositories/messageRepositories.js';
import ClientError from '../utils/errors/clientError.js';
import { isUserMemberOfWorkspace } from './workspaceService.js';

export const getMessageService = async (messageParams, page, limit, user) => {
  const channelDetails = await channelRepository.getChannelByWorkspaceDetails(
    messageParams.channelId
  );
  const workspace = channelDetails.workspaceId;

  const isMember = await isUserMemberOfWorkspace(workspace, user);

  if (!isMember) {
    throw new ClientError({
      explanation: 'User is either not a member or admin of a workspace.',
      message: 'You are not allowed to get the details of this workspace',
      statusCode: StatusCodes.UNAUTHORIZED
    });
  }

  const messages = await messageRepository.getPaginatedMessaged(
    messageParams,
    page,
    limit
  );
  return messages;
};

export const createMessageService = async (message) => {
  const newMessage = await messageRepository.create(message);

  const messageDetails = await messageRepository.getMessageDetails(
    newMessage._id
  );
  return messageDetails;
};
