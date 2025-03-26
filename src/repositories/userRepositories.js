import User from '../schema/user.js';
import crudRepository from './crudRepositories.js';

// explanation of below line

// This code defines a userRepository function that calls the crudRepository function with User as an argument, setting the context of crudRepository to the current object (this).

// In other words, it's creating a new repository for users by extending the general crudRepository functionality with the User model.
// function userRepository() {
//     crudRepository.call(this,User)
// }

// export default new userRepository()

// we can make this by creating an object as well
const userRepository = {
  ...crudRepository(User),
  getUserByEmail: async (email) => {
    const user = await User.findOne({ email });
    return user;
  },

  getUserByName: async (name) => {
    const user = await User.findOne({ username: name });
    return user;
  }
};

export default userRepository;
