import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import React from "react";
import { IoClose } from "react-icons/io5";

function SearchMessages() {
  const [{}, dispatch] = useStateProvider();
  console.log("serach")
  const demo =()=>{
    alert("click")
    console.log("click")
  }
  return (
    <div 
    //className="border-conversation-border border-1 w-full bg-conversation-panel-background flex flex-col z-10 max-h-screen"
    >
      <div 
      //className="h-16 px-4 py-5 gap-10 items-center bg-panel-header-background text-primary-strong"
      >
        <button
      //    className="cursor-pointer text-icon-lighter text-2xl"
          onClick={demo}
        //  style={{ border: "1px solid red" }}
        >close</button>
      </div>
    </div>
  );
}

export default SearchMessages;
