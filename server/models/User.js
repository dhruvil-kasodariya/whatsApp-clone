import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    
    email: { type: String, required: true, unique: true },
    name:{type:String},
    profilePicture:{type:String,debugger:""},
    about:{type:String,default:""},
    sentMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    receivedMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  },
  { timestamps: true }
);
export default mongoose.model("User", UserSchema);