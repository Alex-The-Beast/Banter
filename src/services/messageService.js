import messageRepository from '../repositories/messageRepositories';

export const getMessageService = async (messageParams, page, limit) => {
  const messages = await messageRepository.getPaginatedMessaged(
    messageParams,
    page,
    limit
  );
  return messages;
};
