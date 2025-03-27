import User from '../schema/user.js';
import WorkSpace from '../schema/workSpace.js';
import crudRepository from './crudRepositories.js';

// we can make this by creating an object as well
const workspaceRepository = {
  ...crudRepository(WorkSpace),
  getWorkspaceByName: async function () {},
  getWorkspaceByJoinCode: async function () {},
  addMemberToWorkspace: async function () {},
  addChannelToWorkspace: async function () {},
  fetchAllWorkspaceByMemberId: async function () {}
};

export default workspaceRepository;
