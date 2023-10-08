import Image from "next/image";
import React, { useEffect, useState } from "react";
import {FaCamera} from "react-icons/fa"
import ContextMenu from "./ContextMenu";
import PhotoPicker from "./PhotoPicker";
import PhotoLibrary from "./PhotoLibrary";
import CapturePhoto from "./CapturePhoto";

function Avatar({ type, image, setImage }) {
  const [hover, setHover] = useState(false);
  const [isContextMenuVisible,setIsContextMenuVisible] =useState(false);
  const [contextMenuCordinates,setContextMenuCordinates] =useState({
    x:0,
    y:0
  });
  const [grabPhoto,setGrabPhoto] =useState(false);
  const [showPhotoLibrary,setShowPhotoLibrary]=useState(false);
  const [showCapturePhoto,setShowCapturePhoto] =useState(false);

  const showContextMenu =(e)=>{
    e.preventDefault();
    setContextMenuCordinates({x:e.pageX, y:e.pageY});
    setIsContextMenuVisible(true)
  }

  useEffect(()=>{
    if(grabPhoto){
      const data =document.getElementById("photo-picker");
      data.click();
      document.body.onfocus=(e)=>{
        setTimeout(()=>{
          setGrabPhoto(false)
        },1000)
       
      }
    }
  },[grabPhoto])

const contextMenuOptions=[
  {name:"Take Photo",callback:()=>{
    setShowCapturePhoto(true)
  }},
  {name:"Choose From Library",callback:()=>{
    setShowPhotoLibrary(true)
  }},
  {name:"Upload Photo",callback:()=>{
    setGrabPhoto(true)
  }},
  {name:"Remove Photo",callback:()=>{
    setImage("/default_avatar.png")
  }},
]

const photoPickerChange =async(e)=>{
  const file =e.target.files[0];
  const reader =new FileReader();
  const data =document.createElement('img')
  reader.onload=function(event){
    data.src =event.target.result;
    data.setAttribute("data-src",event.target.result)
    
  }
  reader.readAsDataURL(file);
  setTimeout(()=>{
    setImage(data.src)
  },100)
}

  return (
    <>
      <div className="flex items-center justify-center">
        {type === "sm" && (
          <div className="relative h-10 w-10">
            <Image src={image} alt="avatar" className="rounded-full" fill />
          </div>
        )}

        {type === "lg" && (
          <div className="relative h-14 w-14">
            <Image src={image} alt="avatar" className="rounded-full" fill />
          </div>
        )}

        {type === "xl" && (
          <div
            className="relative cursor-pointer z-0"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <div className={`z-10 bg-photopicker-overlay-background h-60 w-60 absolute top-0 left-0 flex items-center justify-center flex-col text-center gap-2 ${hover?"visible":"hidden"}`} id="context-opener" onClick={(e)=>showContextMenu(e)}>
              <FaCamera className="text-2xl" id="context-opener" onClick={(e)=>showContextMenu(e)}/>
              <span id="context-opener" onClick={(e)=>showContextMenu(e)}>Change<br/> Profile <br/>Photo </span>
            </div>
            <div className=" h-60 w-60 ">
              <Image src={image} alt="avatar" className="rounded-full" fill />
            </div>
          </div>
        )}
      </div>
      {
        isContextMenuVisible && <ContextMenu options={contextMenuOptions} cordinates={contextMenuCordinates} contextMenu={isContextMenuVisible} setContextMenu={setIsContextMenuVisible}/>
      }
      {
        grabPhoto &&<PhotoPicker onChange={photoPickerChange}/>
      }
      {
        showPhotoLibrary && <PhotoLibrary setImage={setImage} hidePhotoLibrary={setShowPhotoLibrary}/>
      }
      {showCapturePhoto && <CapturePhoto setImage={setImage} hide={setShowCapturePhoto}/>}
    </>
  );
}

export default Avatar;
