import mongoose from 'mongoose';
const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Channel name is required']
    }
  },
  { timestamps: true }
);

const Channel = mongoose.model('Message', channelSchema);

export default Channel;
