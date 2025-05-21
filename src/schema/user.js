import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
   
    // email: {
    //     type: String,
    //     unique: true, //  Unique constraint applied correctly
    //     required: [true, 'Email is required'],
    //     match: [
    //       /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    //       'Please fill a valid email address'
    //     ]
    //   },

    email: {
      type: String,
      unique: true, // Unique constraint applied correctly
      required: [true, 'Email is required'],
      match: [
        /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,3}$/, 
        'Please fill a valid email address'
      ]
    },
    
      
    password: {
      type: String,
      required: [true, 'Password is required']
    },

    username: {
      type: String,
      required: [true, 'Name is required'],
      unique: [true, 'username already exists'],
      match: [
        /^[a-zA-Z0-9_]{3,16}$/,
        "Username should be 3-16 characters and shouldn't include any special character"
      ]
    },
    avatar: {
      type: String
    }
  },
  { timestamps: true }
);

userSchema.pre('save', function saveUser(next) {
  const user = this;
  const SALT = bcrypt.genSaltSync(9);
  const hashedPassword = bcrypt.hashSync(user.password, SALT);
  user.password = hashedPassword;
   user.avatar = `https://robohash.org/${user.username}`;
  next();
});
const User = mongoose.model('User', userSchema);

export default User;
