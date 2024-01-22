import React, { useEffect, useReducer, useRef, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import axios from "axios";
import { CHECK_USER_ROUTE, GET_MESSAGES_ROUTE, HOST } from "@/utils/ApiRoutes";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import Chat from "./Chat/Chat";
import { io } from "socket.io-client";
import SearchMessages from "./Chat/SearchMessages";

function Main() {
  const router = useReducer();
  const [socketEvent, setSocketEvent] = useState(false);
  const socket = useRef();
  const [{ userInfo, currentChatUser, 
    //messagesSearch
   }, dispatch] =
    useStateProvider();
  const [redirectLogin, setRedirectLogin] = useState(false);

  useEffect(() => {
    if (redirectLogin) router.push("/login");
  }, [redirectLogin]);

  onAuthStateChanged(firebaseAuth, async (currentUser) => {
    if (!currentUser) {
      setRedirectLogin(true);
    }
    if (!userInfo && currentUser?.email) {
      const { data } = await axios.post(CHECK_USER_ROUTE, {
        email: currentUser.email,
      });

      if (!data.status) {
        router.push("/login");
      }

      const { _id, name, email, profilePicture, status } = data.data;
      dispatch({
        type: reducerCases.SET_USER_INFO,
        userInfo: {
          _id,
          name,
          email,
          profileImage: profilePicture,
          status,
        },
      });
    }
  });

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST);
      socket.current.emit("add-user", userInfo._id);
      dispatch({ type: reducerCases.SET_SOCKET, socket });
    }
  }, [userInfo]);

  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on("msg-recieve", (data) => {
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: {
            ...data.message,
          },
        });
      });
      socket.current.on("online-users", ({ onlineUsers }) => {
        dispatch({
          type: reducerCases.SET_ONLINE_USERS,
          onlineUsers,
        });
      });
      setSocketEvent(true);
    }
  }, [socket.current]);

  useEffect(() => {
    const getMessages = async () => {
      const {
        data: { messages },
      } = await axios.get(
        `${GET_MESSAGES_ROUTE}/${userInfo?._id}/${currentChatUser._id}`
      );

      dispatch({ type: reducerCases.SET_MESSAGES, messages });
    };
    if (currentChatUser?._id) {
      getMessages();
    }
  }, [currentChatUser]);

  return (
    <>
      <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
        <ChatList />
        {currentChatUser ? (
          <Chat />
          // <div
          //   className={
          //     messagesSearch ? "grid grid-cols-2 " : "grid grid-cols-2"
          //   }
          // >
          //   <div className="order-1">
          //     <Chat />
          //   </div>
          //   <div className="order-2">
          //     {messagesSearch && <SearchMessages />}
          //   </div>
          // </div>
        ) : (
          <Empty />
        )}
      </div>
    </>
  );
}

export default Main;
