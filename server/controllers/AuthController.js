

import User from "../models/User.js";

export const checkUser =async(req,res,next)=>{
    try{
     const {email} =req.body;
     if(!email){
        return res.json({msg:"Email is required",status:false});
     }
     const user =await User.findOne({email:email})
 
     if(!user){
        return res.json({msg:"User not found",status:false})
     }else{
        return res.json({msg:"User Found",status:true,data:user})
     }
    }catch(err){
        next(err)
    }
}

export const onboardUser =async(req,res,next)=>{
   try {
      const {email,name,about,image} =req.body;
      if(!email || !name ||!image){
         return res.json("Email,Name and Image are required.")
      }
      const newUser =new User({
         email,
         name,
         profilePicture:image,
         about
      })
     const user= await newUser.save();
      res.json({mag:"Success",status:true,user})
   } catch (error) {
      next(error)
   }
}