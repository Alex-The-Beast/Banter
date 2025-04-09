import mongoose from 'mongoose';
const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Channel name is required']
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorksPace',
      required: [true, 'Workspace Id is required.']
    }
  },
  { timestamps: true }
);

const Channel = mongoose.model('Channel', channelSchema);

export default Channel;
