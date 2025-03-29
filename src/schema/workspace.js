import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Workspace name is required.'],
    unique: true
  },
  description: {
    type: String
  },
  members: [
    {
      memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      role: {
        type: String,
        enum: ['admin', 'member'],
        default: 'member'
      }
    }
  ],
  joinCode: {
    type: String,
    required: [true, 'Join code must be required.']
  },
  channels: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel'
  }
]
});

const WorkSpace = mongoose.model('WorkSpace', workspaceSchema);
export default WorkSpace;
