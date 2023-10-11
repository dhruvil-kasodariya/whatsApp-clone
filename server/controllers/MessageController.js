import Messages from "../models/Messages.js";
import {renameSync} from "fs"

export const addMessage = async (req, res, next) => {
  try {
    const { message, from, to } = req.body;
    const getUser = onlineUsers.get(to);

    if (message && from && to) {
      const newMessage = new Messages({
        message,
        senderId: from,
        receiverId: to,
        messageStatus: getUser ? 'delivered' : 'sent',
      });

     const messageResponse = await newMessage.save();

      return res.status(201).send({ message: messageResponse  });
    }
    return res.status(400).send("From,to and Message is required.")
  } catch (err) {
   next(err)
  }
};

export const getMessages =async(req,res,next)=>{
  try {
    const {from ,to} =req.params;

    const messages = await Messages.find({
      $or: [
        {
          senderId: from,
          receiverId: to,
        },
        {
          senderId: to,
          receiverId: from,
        },
      ],
    }).sort({ id: 1 });
    const unreadMessages =[];
    messages.forEach((message,index)=>{
      if(
        message.messageStatus !== "read" && message.senderId.toString()==to
      ){
        messages[index].messageStatus = "read";
        unreadMessages.push(message._id)
      }
    })
await Messages.updateMany(
  { _id: { $in: unreadMessages } }, 
  { $set: { messageStatus: 'read' } } 
);
res.status(200).json({messages})
  } catch (error) {
    next(error)
  }
}

export const addImageMessage =async(req,res,next)=>{
  try {
    if(req.file){
      const date =Date.now();
      let fileName ="uploads/images/"+date+req.file.originalname;
      renameSync(req.file.path,fileName);

      const {from ,to} =req.query;

      if(from && to){
        const newMessage = new Messages({
          message:fileName,
          senderId: from,
          receiverId: to,
          type:"image"
        });
  
       const messageResponse = await newMessage.save();
       return res.status(201).json({message:messageResponse});
      }
      return res.status(400).send("From,To is required.")
    }
    return res.status(400).send("Image is required.")
  } catch (error) {
    next(error)
  }
}





