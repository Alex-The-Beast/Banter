import { StatusCodes } from 'http-status-codes';

import WorkSpace from '../schema/workSpace.js';
import ClientError from '../utils/errors/clientError.js';
import crudRepository from './crudRepositories.js';
import User from '../schema/user.js';

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
  addMemberToWorkspace: async function (workspaceId, memberId, role) {
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

    const isMemberAlreadyPartOfWorkspace = WorkSpace.members.find(
      (member) => member.memberId === memberId
    );
    if (!isMemberAlreadyPartOfWorkspace) {
      throw new ClientError({
        explanation: 'Invalid Data sent from the client.',
        message: 'user already exists.',
        statusCode: StatusCodes.FORBIDDEN
      });
    }

    WorkSpace.members.push({
      memberId,
      role
    });
    await WorkSpace.Save();

    return workspace;

    // const updatedWorkspace = await WorkSpace.findByIdAndUpdate(
    //   workspaceId,
    //   {
    //     $addToSet: { mambers: memberId,role }
    //   },
    //   { new: true }
    // );
  },
  addChannelToWorkspace: async function () {},
  fetchAllWorkspaceByMemberId: async function () {}
};

export default workspaceRepository;
