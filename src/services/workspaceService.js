import { v4 as uuidv4 } from 'uuid';

import workspaceRepository from '../repositories/workspaceRepositories.js';
import ValidationError from '../utils/errors/validationError.js';

// 1. Core Features to Implement in the Service Layer

// Workspace Management

// a. Create a workspace
export const createWorkspaceService = async (workspaceData) => {
  try{
  const joinCode = uuidv4().substring(0, 6).toUpperCase();
  const response = await workspaceRepository.create({
    name: workspaceData.name,
    description: workspaceData.description,
    joinCode
  });
  console.log("Workspace created:", response); 

  await workspaceRepository.addMemberToWorkspace(
    response._id,
    workspaceData.owner,
    'admin'
  );
  console.log("Added admin to workspace"); 

  const updatedWorkspace= await workspaceRepository.addChannelToWorkspace(response._id, 'general');
  console.log("Added general channel to workspace:", updatedWorkspace);

  return updatedWorkspace;

  }
  catch(error){
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

// Fetch a workspace by name or join code
// export const getWorkspaceByService=async(data)=>{}

// Fetch all workspaces a user belongs to
