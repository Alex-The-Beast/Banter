import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import { addEmailToMailQueue } from '../producers/mailQueueProducer.js';
import channelRepository from '../repositories/channelRepositories.js';
import workspaceRepository from '../repositories/workspaceRepositories.js';
import User from '../schema/user.js';
import { workspaceJoinMail } from '../utils/common/mailObject.js';
import ClientError from '../utils/errors/clientError.js';
import ValidationError from '../utils/errors/validationError.js';




const isUserAdminOfWorkspace = (workspace, userId) => {
  console.log(workspace.members, userId);
  const response = workspace.members.find(
    (member) =>
      (member.memberId.toString() === userId ||
        member.memberId._id.toString() === userId) &&
      member.role === 'admin'
  );
  return response;
};
export const isUserMemberOfWorkspace = (workspace, userId) => {
  return workspace.members.find((member) => {
    console.log('member id ', member.memberId.toString());
    return member.memberId._id.toString() === userId;
  });
};

const isChannelAlreadyPartOfWorkspace = (workspace, channelName) => {
  return workspace.channels.find(
    (channel) => channel.name.toLowerCase() === channelName.toLowerCase()
  );
};
export const createWorkspaceService = async (workspaceData) => {
  //isme req.body and owner from client pass hoga
  try {
    const joinCode = uuidv4().substring(0, 6).toUpperCase();
    const response = await workspaceRepository.create({
      name: workspaceData.name,
      description: workspaceData.description,
      joinCode
    });
    console.log('Workspace created:', response);

    await workspaceRepository.addMemberToWorkspace(
      response._id,
      workspaceData.owner,
      'admin'
    );
    console.log('Added admin to workspace');

    const updatedWorkspace = await workspaceRepository.addChannelToWorkspace(
      response._id,
      'general'
    );
    console.log('Added general channel to workspace:', updatedWorkspace);

    return updatedWorkspace;
  } catch (error) {
    console.log('Workspace service error', error);
    if (error.name === 'ValidationError') {
      throw new ValidationError(
        {
          error: error.errors
        },
        error.message
      );
    }

    if (error.name === 'MongoServerError' && error.code === 11000) {
      throw new ValidationError(
        {
          error: ['A user with same email or username alaready exists']
        },
        'A user with same email or username alaready exists'
      );
    }
  }
};

// b. Get all workspaces by userid (if user is a part of that workspace)

export const getAllWorkspacesUserIsMemberOfService = async (userId) => {
  try {
    const response =
      await workspaceRepository.fetchAllWorkspaceByMemberId(userId);
    // console.log("Workspaces fetched:", response); response give the array of objects

    if (response.length === 0) {
      throw new ClientError({
        explanation: 'No workspaces found for the user',
        message: 'No workspaces found for the user',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    return response;
  } catch (error) {
    console.log('Get workspace user is member of service error', error);
    throw error;
  }
};

// c. delete workspace by workspaceId after checking that the user is admin or not
export const deletedWorkspaceService = async (workspaceId, userId) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'No workspaces found for the user',
        message: 'No workspaces found for the user',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isAllowed = workspace.members.find(
      (member) =>
        member.memberId.toString() === userId && member.role === 'admin'
    );
    if (isAllowed) {
      await channelRepository.deleteMany(workspace.channels);

      const response = await workspaceRepository.delete(workspaceId);
      return response;
    }

    throw new ClientError({
      explanation: 'User is either not a member or admin of a workspace.',
      message: 'You are not allowed to delete this workspace',
      statusCode: StatusCodes.UNAUTHORIZED
    });
  } catch (error) {
    console.log('Delete workspace service error', error);
    throw error;
  }
};

export const getWorkspaceService = async (workspaceId, userId) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'No workspaces found for the user',
        message: 'No workspaces found for the user',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isMember = isUserMemberOfWorkspace(workspace, userId);
    if (!isMember) {
      throw new ClientError({
        explanation: 'User is either not a member or admin of a workspace.',
        message: 'You are not allowed to get the details of this workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    return workspace;
  } catch (error) {
    console.log('Get workspace service error', error);
    throw error;
  }
};

export const getWorkspaceByJoinCodeService = async (joinCode, userId) => {
  try {
    const workspace =
      await workspaceRepository.getWorkspaceByJoinCode(joinCode);
    if (!workspace) {
      throw new ClientError({
        explanation: 'No workspaces found for the user',
        message: 'No workspaces found for the user',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isMember = isUserMemberOfWorkspace(workspace, userId);
    if (!isMember) {
      throw new ClientError({
        explanation: 'User is either not a member or admin of a workspace.',
        message: 'You are not allowed to get the details of this workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    return workspace;
  } catch (error) {
    console.log('Get workspace by join code service error', error);
    throw error;
  }
};

export const updateWorkspaceService = async (
  workspaceId,
  workspaceData,
  userId
) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    const isMember = isUserMemberOfWorkspace(workspace, userId);
    if (!isMember) {
      throw new ClientError({
        explanation: 'User is either not a member or admin of a workspace.',
        message: 'You are not allowed to update this workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        explanation: 'User is either not a member or admin of a workspace.',
        message: 'You are not allowed to update this workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    const updatedWorkspace = await workspaceRepository.update(
      workspaceId,
      workspaceData
    );
    return updatedWorkspace;
  } catch (error) {
    console.log('update workspace service error', error);
    throw error;
  }
};

export const addMemberToWorkspaceService = async (
  workspaceId,
  memberId,
  role,userId
) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'No workspaces found for the user',
        message: 'No workspaces found for the user',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isValidUser = await User.findById(memberId);
    if (!isValidUser) {
      throw new ClientError({
        explanation: 'Invalid Data sent from the client.',
        message: 'User not found.',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isMember = await isUserMemberOfWorkspace(workspace, memberId);
    if (isMember) {
      throw new ClientError({
        explanation: 'User is already a member of workspace.',
        message: 'User is already a member of workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    const isAdmin = await isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        explanation: 'User is either not a member or admin of a workspace.',
        message: 'You are not allowed to add member to this workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    const response = await workspaceRepository.addMemberToWorkspace(
      workspaceId,
      memberId,
      role
    );
    addEmailToMailQueue({...workspaceJoinMail(workspace),to:isValidUser.email})
    return response;
  } catch (error) {
    console.log('Add member to workspace service error', error);
    throw error;
  }
};



export const addChannelToWorkspaceService = async (
  workspaceId,
  channelName,
  userId
) => {
  try {
    const workspace =
      await workspaceRepository.getWorkspaceDetailsById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'No workspaces found for the user',
        message: 'No workspaces found for the user',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        explanation: 'User is not admin of workspace',
        message: 'User is not admin of workspace',
        statusCode: StatusCodes.FORBIDDEN
      });
    }

    const channelExist = isChannelAlreadyPartOfWorkspace(
      workspace,
      channelName
    );
    if(channelExist){
      throw new ClientError({
        explanation: 'Invalid data sent from client',
        message: 'Channel is already part of workspace',
        statusCode: StatusCodes.FORBIDDEN
      });
      
    }
    console.log('addChannelToworkspaceService',workspaceId,channelName);
    const channelAdded = await workspaceRepository.addChannelToWorkspace(
      workspaceId,
      channelName
    );
    return channelAdded;
  } catch (error) {
    console.log('Get workspace user is member of service error', error);
    throw error;
  }
};

