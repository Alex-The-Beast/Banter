import { StatusCodes } from 'http-status-codes';

import User from '../schema/user.js';
import WorkSpace from '../schema/workSpace.js';
import ClientError from '../utils/errors/clientError.js';
import channelRepository from './channelRepositories.js';
import crudRepository from './crudRepositories.js';

// we can make this by creating an object as well
const workspaceRepository = {
  ...crudRepository(WorkSpace),
  getWorkspaceByName: async function (workspaceName) {
    const workspace = await WorkSpace.findOne({
      name: workspaceName
    });
    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid Data sent from the client.',
        message: 'Workspace not found.',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    return workspace;
  },
  getWorkspaceByJoinCode: async function (joinCode) {
    const workspace = await WorkSpace.findOne({ joinCode });
    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid Data sent from the client.',
        message: 'Workspace not found.',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    return workspace;
  },
  addMemberToWorkspace: async function (workspaceId, memberId, role) { //ye wala after creating workspace response come to service adn after extracting data from there comes to here .
    const workspace = await WorkSpace.findById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid Data sent from the client.',
        message: 'Workspace not found.',
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

    const isMemberAlreadyPartOfWorkspace = workspace.members.find(
      (member) => member.memberId == memberId
    );
    if (isMemberAlreadyPartOfWorkspace) {
      throw new ClientError({
        explanation: 'Invalid Data sent from the client.',
        message: 'user already exists in workspace.',
        statusCode: StatusCodes.FORBIDDEN
      });
    }

    workspace.members.push({
      memberId,
      role
    });
    await workspace.save();

    return workspace;
  },

    // const updatedWorkspace = await WorkSpace.findByIdAndUpdate(
    //   workspaceId,
    //   {
    //     $addToSet: { members: {memberId,role} }
    //   },
    //   { new: true }
    // );
 
  // addChannelToWorkspace: async function (workspaceId, channelName) {
  //   const workspace =
  //     await WorkSpace.findById(workspaceId).populate('channels');
  //   if (!workspace) {
  //     return ClientError({
  //       explanation: 'Invalid data sent from the client.',
  //       message: 'Workspace not found.',
  //       statusCode: StatusCodes.NOT_FOUND
  //     });
  //   }

  //   const isChannelExistInWorkspace = workspace.channels.find(
  //     (channel) => channel.name === channelName
  //   );
  //   if (isChannelExistInWorkspace) {
  //     return ClientError({
  //       explanation: 'Invalid data sent from the client.',
  //       message: 'Channel already exist in workspace.',
  //       statusCode: StatusCodes.FORBIDDEN
  //     });
  //   }

  //   // now we have to create a channel repository that will create channel first then we push in workspace

  //   const channel = await channelRepository.create({ name: channelName });
  //   workspace.channels.push({
  //     channel
  //   });
  //   await workspace.save();

  //   return workspace;
  // },


  addChannelToWorkspace: async function (workspaceId, channelName) {
    const workspace =
      await WorkSpace.findById(workspaceId).populate('channels');
      

    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isChannelAlreadyPartOfWorkspace = workspace.channels.find(
      (channel) => channel.name === channelName
    );

    if (isChannelAlreadyPartOfWorkspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from client',
        message: 'Channel already part of workspace',
        statusCode: StatusCodes.FORBIDDEN
      });
    }

    const channel = await channelRepository.create({
      name: channelName,
      workspaceId: workspaceId
    });

    workspace.channels.push(channel);
    await workspace.save();

    return workspace;
  },

 


  fetchAllWorkspaceByMemberId: async function (memberId) {
    const workspaces = await WorkSpace.find({
      'members.memberId': memberId
    }).populate('members.memberId', 'username email  avatar');

    return workspaces;
  }
};

export default workspaceRepository;
