import { useStateProvider } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import React from "react";
import MessageStatus from "../common/MessageStatus";
import ImageMessage from "./ImageMessage";

function ChatContainer() {

  const [{messages,currentChatUser,userInfo},dispatch] =useStateProvider();
  console.log(messages)
  return <div className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar bg-panel-header-background">
    <div className="bg-chat-background bg-fixed h-full w-full opacity-5 fixed left-0 top-0 z-0"></div>
    <div className="mx-10 my-6 relative bottom-0 z-40 left-0">


  <div className="flex w-full">
    <div className="flex flex-col justify-end w-full gap-1 overflow-auto">
         {messages.map((message,index)=>(<div key={message?._id} className={`flex ${message?.senderId==currentChatUser._id?"justify-start":"justify-end"}`}>
          {message?.type==="text" && (
            <div className={`text-white px-2 py-[5px] text-sm rounded-md flex gap-2 items-end max-w-[45%] ${message.senderId===currentChatUser._id?"bg-[dimgray]":"bg-outgoing-background"}`}>
              <span className="break-all">{message.message}</span>
              <div className="flex gap-1 items-end" >
                <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
                  {calculateTime(message.createdAt) }
                </span>
                <span>
                  {
                    message.senderId===userInfo._id && <MessageStatus messageStatus={message.messageStatus}/>
                  }
                </span>
              </div>
            </div>
          )}
          {
            message.type==="image" && <ImageMessage message={message} />
          }
          </div>))}
    </div>
  </div>
    </div>

  </div>;
}

export default ChatContainer;
