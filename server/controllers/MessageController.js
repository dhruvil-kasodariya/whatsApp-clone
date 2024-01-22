import Messages from "../models/Messages.js";
import { renameSync } from "fs";
import User from "../models/User.js";

export const addMessage = async (req, res, next) => {
  try {
    const { message, from, to } = req.body;
    const getUser = onlineUsers.get(to);

    if (message && from && to) {
      const newMessage = new Messages({
        message,
        senderId: from,
        receiverId: to,
        messageStatus: getUser ? "delivered" : "sent",
      });

      const messageResponse = await newMessage.save();

      return res.status(201).send({ message: messageResponse });
    }
    return res.status(400).send("From,to and Message is required.");
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.params;

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
    const unreadMessages = [];
    messages.forEach((message, index) => {
      if (
        message.messageStatus !== "read" &&
        message.senderId.toString() == to
      ) {
        messages[index].messageStatus = "read";
        unreadMessages.push(message._id);
      }
    });
    await Messages.updateMany(
      { _id: { $in: unreadMessages } },
      { $set: { messageStatus: "read" } }
    );
    res.status(200).json({ messages });
  } catch (error) {
    next(error);
  }
};

export const addImageMessage = async (req, res, next) => {
  try {
    if (req.file) {
      const date = Date.now();
      let fileName = "uploads/images/" + date + req.file.originalname;
      renameSync(req.file.path, fileName);

      const { from, to } = req.query;

      if (from && to) {
        const newMessage = new Messages({
          message: fileName,
          senderId: from,
          receiverId: to,
          type: "image",
        });

        const messageResponse = await newMessage.save();
        return res.status(201).json({ message: messageResponse });
      }
      return res.status(400).send("From,To is required.");
    }
    return res.status(400).send("Image is required.");
  } catch (error) {
    next(error);
  }
};

export const addAudioMessage = async (req, res, next) => {
  try {
    if (req.file) {
      const date = Date.now();
      let fileName = "uploads/recordings/" + date + req.file.originalname;
      renameSync(req.file.path, fileName);

      const { from, to } = req.query;

      if (from && to) {
        const newMessage = new Messages({
          message: fileName,
          senderId: from,
          receiverId: to,
          type: "audio",
        });

        const messageResponse = await newMessage.save();
        return res.status(201).json({ message: messageResponse });
      }
      return res.status(400).send("From,To is required.");
    }
    return res.status(400).send("Audio is required.");
  } catch (error) {
    next(error);
  }
};

export const getInitialContactsWithMessages = async (req, res, next) => {
  try {
    const userId = req.params.from;

    //const user = await User.findById(userId);

    const messages = await Messages.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .populate("senderId receiverId", "name profilePicture about email")
      .select("message senderId receiverId type messageStatus createdAt");

    messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const users = new Map();
    const messageStatusChange = [];

    messages.forEach((msg) => {
      let isSender = msg.senderId._id.toString() === userId.toString();
      let calculatedId = isSender
        ? msg.receiverId._id.toString()
        : msg.senderId._id.toString();

      if (msg.messageStatus === "sent") {
        messageStatusChange.push(msg._id);
      }

      const {
        _id,
        type,
        message,
        messageStatus,
        createdAt,
        senderId,
        receiverId,
      } = msg;

      let user = {
        messageId: _id,
        type,
        message,
        messageStatus,
        createdAt,
        senderId,
        receiverId,
      };

      if (!users.get(calculatedId)) {
        if (isSender) {
          user = {
            ...user,
            name: receiverId.name,
            profilePicture:receiverId.profilePicture,
            about:receiverId.about,
            email:receiverId.email,
            totalUnreadMessages: 0,
          };
        } else {
          user = {
            ...user,
            name: senderId.name,
            profilePicture:senderId.profilePicture,
            about:senderId.about,
            email:senderId.email,
            totalUnreadMessages: messageStatus !== "read" ? 1 : 0,
          };
        }

        users.set(calculatedId, { ...user });
      } else if (messageStatus !== "read" && !isSender) {
        users.set(calculatedId, {
          ...user,
          totalUnreadMessages: user.totalUnreadMessages + 1,
        });
      }
    });
    if(messageStatusChange.length){
      await Messages.updateMany(
        { _id: { $in: messageStatusChange } },
        { $set: { messageStatus: "delivered" } }
      );
    }

    return res.status(200).json({
      users: Array.from(users.values()),
      onlineUsers: Array.from(onlineUsers.keys()),
    });
  } catch (error) {
    next(error);
  }
};
