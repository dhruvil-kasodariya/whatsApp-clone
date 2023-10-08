import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    
    email: { type: String, require: true, unique: true },
    name:{type:String},
    profilePicture:{type:String,debugger:""},
    about:{type:String,default:""}
   
  },
  { timestamps: true }
);
export default mongoose.model("User", UserSchema);