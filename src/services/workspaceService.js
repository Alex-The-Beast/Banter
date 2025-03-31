import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import channelRepository from '../repositories/channelRepositories.js';
import workspaceRepository from '../repositories/workspaceRepositories.js';
import ClientError from '../utils/errors/clientError.js';
import ValidationError from '../utils/errors/validationError.js';

// 1. Core Features to Implement in the Service Layer

// Workspace Management

// a. Create a workspace
export const createWorkspaceService = async (workspaceData) => { //isme req.body and owner from client pass hoga
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
          
        }, error.message
       
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
      (member) => member.memberId == userId && member.role == 'admin'
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
    })
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Fetch all workspaces a user belongs to
