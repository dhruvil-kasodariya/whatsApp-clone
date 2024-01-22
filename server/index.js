import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import methodOverride from "method-override";
import AuthRouter from "./routes/AuthRoutes.js";
import MessageRoutes from "./routes/MessageRoutes.js";
import { Server } from "socket.io";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.info("Database connected"))
  .catch((err) => console.error(err));

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("X-HTTP-Method-Override"));

app.use("/uploads/images", express.static("uploads/images"));
app.use("/uploads/recordings", express.static("uploads/recordings"));

app.use("/api/auth", AuthRouter);
app.use("/api/messages", MessageRoutes);

const server = app.listen(process.env.PORT, () => {
  console.info(`Server Started on Port ${process.env.PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.broadcast.emit("online-users",{
        onlineUsers:Array.from(onlineUsers.keys())
    })
  });
socket.on("signout",(id)=>{
onlineUsers.delete(id);
socket.broadcast.emit("online-users",{
    onlineUsers:Array.from(onlineUsers.keys())
})
})
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", {
        from: data.from,
        message: data.message,
      });
    }
  });
});
