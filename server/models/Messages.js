import mongoose from "mongoose";

const MessagesSchema = new mongoose.Schema(
  {
        message: String,
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        type:{type:String,default:"text"},
        messageStatus:{type:String,default:"send"},     
  },
  { timestamps: true }
);
export default mongoose.model("Messages", MessagesSchema);