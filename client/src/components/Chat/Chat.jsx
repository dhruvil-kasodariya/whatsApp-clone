 import React from "react";
import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";
import MessageBar from "./MessageBar";

function Chat() {
  return <div className="border-conversation-border order-1 w-full bg-conversation-border flex flex-col h-[100vh] z-10">
 <ChatHeader />
 <ChatContainer />
 <MessageBar /  >

  </div>;
}

export default Chat;
