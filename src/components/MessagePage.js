import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Avatar from './Avatar'
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import uploadFile from '../helpers/uploadFiles';
import { IoMdClose } from "react-icons/io";
import Loading from './Loading';
import backgroundImage from '../assets/wallapaper.jpeg'
import { LuSendHorizonal } from "react-icons/lu";
import moment  from 'moment'
function MessagePage() {
  const params=useParams()
  const socketConnection= useSelector(state=>state?.user?.socketConnection)
  const user= useSelector(state=>state?.user)
  const [userData,setUserData]=useState({
    name:"",
    email:"",
    profile_pic:"",
    online:false
  })
  const [openImageVideoUpload,setImageVideoOpenUpload]=useState(false)
  const [message,setMessage]=useState({
    text:"",
    videoUrl:"",
    imageUrl:""
  })
  const [loading,setLoading]=useState(false)
  const [allMessages,setAllMessage]=useState([])
  const currentMessage= useRef()
  
  useEffect(()=>{
      if(currentMessage.current){
        currentMessage.current.scrollIntoView({behavior:'smooth', block:'end'})
      }
  },[allMessages])
  console.log("params--------------------",params.userId)
  console.log("socketConnection--------------------",socketConnection)
  useEffect(()=>{
    console.log("use effect work inside message with redux socketconnection");
    console.log("params.userId before emitting:", params.userId);
    if(socketConnection){
      console.log("inside if case inside useefect");
      socketConnection.emit('message-page',params.userId)
      socketConnection.emit('seen', params.userId)
      socketConnection.on("message-user",(data)=>{
        console.log(data);
        setUserData(data)
        socketConnection.on('message',(data)=>{
          console.log("message fkinal---",data)
          setAllMessage(data)
        })
      })
     }
  },[socketConnection,params.userId,user])

  const handleImageVideoUpload=()=>{
    setImageVideoOpenUpload(preve=>!preve)
  }
  const handleUploadImage =async(e)=>{
    const file=e.target.files[0]
    setLoading(true)
    const uploadphoto= await uploadFile(file)
    console.log("uloadpic-99999999999------",uploadphoto.Url);
    setLoading(false)
    setImageVideoOpenUpload(false)
    setMessage((preve)=>{
      return{
        ...preve,
        imageUrl:uploadphoto?.url
        
      }
    })
  }
  const handleuploadVideo =async (e)=>{
    const file=e.target.files[0]
    setLoading(true)
    const uploadphoto= await uploadFile(file)
    console.log("videooooo",uploadphoto)
    console.log("video URL: ", uploadphoto.url)
    setLoading(false)
    setImageVideoOpenUpload(false)
    setMessage((preve)=>{
      return{
        ...preve,
        videoUrl:uploadphoto?.url
      }
    })
  }

  const handleclearUploadImage =()=>{
    setMessage((preve)=>{
      return{
        ...preve,
        imageUrl:""
        
      }
    })
  }
  const handleclearUploadVideo =()=>{
    setMessage((preve)=>{
      return{
        ...preve,
        videoUrl:""
        
      }
    })
  }

  const handleOnChange = async(e)=>{
       const {name,value}=e.target
        setMessage((preve)=>{
          return{
            ...preve,
            text: value
          }
        })
      }

   const handleSendMessage = async(e)=>{
     e.preventDefault()
     if(message.text || message.imageUrl || message.videoUrl){
      if(socketConnection){
        socketConnection.emit('new-message',{
          sender:user?._id,
          receiver:params?.userId,
          text:message?.text,
          imageUrl:message?.imageUrl,
          videoUrl:message?.videoUrl,
          MsgbyUserId:user?._id
        })
        setMessage({
          text:"",
          videoUrl:"",
          imageUrl:""
        })
      }
     }
   }
  return (
    <div style={{backgroundImage:`url(${backgroundImage})`}} className='bg-no-repeat bg-cover'>
      <header className='sticky top-0  h-16 bg-white pt-1 flex justify-between items-center'>
          <div className='flex items-center gap-4'>
            <Link to={"/"} className='lg:hidden pl-1'>
              <MdOutlineArrowBackIos
              size={20}/>
            </Link>
            <div>
              <Avatar
              width={50}
              height={50}
              imageUrl={userData?.profile_pic}
              name={userData?.name}
              userId={userData?._id}/>
            </div>
            <div>
              <h3 className='text-lg font-semibold my-0 text-ellipsis line-clamp-1'>{userData?.name}</h3>
              <p className='-my-2 text-sm'>
              {
                userData?.online ? <span className='text-primary'>Online</span> : <spna className='text-slate-400'>Offline</spna>
              }
              </p>
            </div>
          </div>
          <div className='px-4'>
            <button className='hover:text-primary'>
            <HiOutlineDotsVertical
             size={25}/>
            </button>
      </div>
      </header>
      {/* show all message in here  */}
      <section className='h-[calc(100vh-128px)]  overflow-x-hidden overflow-y-scroll scrollbar relative  bg-slate-200 bg-opacity-50'>
      {/* here i am showing all messages di display */}
         <div className='flex flex-col gap-1 py-2 mx-2' ref={currentMessage}>
          {
            allMessages?.map((msg,index)=>{
              return(
                <div  className={` p-1  w-fit rounded max-w-[280px] md:max-w-sm lg:max-w-md ${user?._id === msg?.MsgbyUserId ? "ml-auto bg-green-100" : "bg-white"}`}>
                  {/* to show my shred images here  */}
                  <div className='w-full'>
                    {
                      msg?.imageUrl && (
                        <img
                           src={msg?.imageUrl}
                           className='w-full h-full object-scale-down'
                        />
                      )
                    }
                  {/* here i am showing the video if sended */}
                    {
                      msg?.videoUrl && (
                       <video
                       src={msg?.videoUrl}
                       className='w-full h-full object-scale-down'
                       controls
                       />
                      )
                    }
                  </div>
                  <p className='px-3'>{msg.text}</p>
                  <p className='text-xs ml-auto w-fit'>{moment(msg.createdAt).format('hh,mm')}</p>
                </div>
              )
            })
          }
         </div>
           {/* here to show uploaded image */}
        {
          message.imageUrl && (
            <div className='w-full h-full bg-slate-700 sticky bottom-0 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
              <div title='close..'onClick={handleclearUploadImage} className='w-fit p-2 absolute top-0 right-0 hover:text-red-500 cursor-pointer' >
                 <IoMdClose
                 size={30}/>
              </div>
          <div className='rounded  p-3'>
              <img
              src={message.imageUrl}
              alt='UploadImage'
            className='aspect-square h-full w-full max-w-sm m-2 rounded object-scale-down'
              />
          </div>

        </div>
          )
        }
        {/* video content */}
        {
          message.videoUrl && (
            <div className='w-full h-full bg-slate-700 sticky bottom-0 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
              <div title='close..'onClick={handleclearUploadVideo} className='w-fit p-2 absolute top-0 right-0 hover:text-red-500 cursor-pointer' >
                 <IoMdClose
                 size={30}/>
              </div>
          <div className='rounded bg-white p-3'>
              <video
              src={message.videoUrl}
              className='aspect-square h-full w-full max-w-sm m-2 object-scale-down'
              controls
              muted
              autoPlay
              />
          </div>

        </div>
          )
        }
        {
          loading && (
            <div className='w-full h-full sticky bottom-0 flex justify-center items-center'>
              <Loading/>
            </div>
          )
        }
        
      </section>
      {/* fokr in put message */}
      <section className='bg-white h-16 flex items-center px-4'>
        <div className='relative'>
         <button onClick={handleImageVideoUpload} className='flex justify-center items-center w-11 h-11 text-primary  hover:bg-secondary hover:text-white rounded-full'>
          <FaPlus 
          size={25}/>
           </button>
           {/* image video upload */}
           {
            openImageVideoUpload && (
              <div className='absolute bg-white bottom-14  shadow-md w-36 p-2 rounded-md'>
            <form>
              <label htmlFor='uploadImage' className='flex items-center p-2 gap-3 hover:bg-slate-200 px-3 cursor-pointer'>
                    <div className='text-primary'>
                      <FaImage/>
                    </div>
                    <p>Image</p>
              </label>
              <label htmlFor='uploadVideo' className='flex items-center p-2 gap-3  hover:bg-slate-200 px-3 cursor-pointer'>
                    <div className='text-purple-400'>
                      <FaVideo/>
                    </div>
                    <p>Video</p>
              </label>
              <input
              type='file'
              id='uploadImage'
              onChange={handleUploadImage}
              className='hidden'/>
              <input
              type='file'
              id='uploadVideo'
              onChange={handleuploadVideo}
              className='hidden'/>
            </form>
           </div>
            )
           } 
        </div>
        {/* to send mesg input field */}
        <form className='h-full w-full flex gap-4' onSubmit={handleSendMessage}>
        <div className='w-full h-full'>
          <input
          type='text'
          placeholder='Enter your message...'
          className='py-1 px-4 outline-none w-full h-full'
          value={message?.text}
          onChange={handleOnChange}
          />
        </div>
        <button className='text-primary hover:text-secondary'>
           <LuSendHorizonal
           size={28}/>
        </button>
        </form>
      </section>
    </div>
  )
}

export default MessagePage
