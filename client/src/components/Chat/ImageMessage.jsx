import { useStateProvider } from "@/context/StateContext";
import { HOST } from "@/utils/ApiRoutes";
import Image from "next/image";
import React from "react";
import MessageStatus from "../common/MessageStatus";
import { calculateTime } from "@/utils/CalculateTime";

function ImageMessage({message}) {
  const [{currentChatUser,userInfo}] =useStateProvider()
  return <div className={`p-1 rounded-lg ${
    message.senderId ===currentChatUser._id?"bg-[dimgray]":"bg-outgoing-background"
  }`}>
    <div className="relative">
      <Image 
        src={`${HOST}/${message.message}`}
        className="rounded-lg"
        alt="asset"
        height={300}
        width={300}
      />
      <div className="absolute bottom-1 right-1 flex items-end gap-1">
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
  </div>;
}

export default ImageMessage;
