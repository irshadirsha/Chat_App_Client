import React, { useEffect, useState } from 'react'
import { MdChat } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
import { TbLogout2 } from "react-icons/tb";
import Avatar from './Avatar';
import { useDispatch, useSelector } from 'react-redux';
import EdittUserDetails from './EdittUserDetails';
import { IoArrowUndoSharp } from "react-icons/io5";
import SearchUser from './SearchUser';
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import axios from 'axios';
import { logout } from '../redux/userSlice';

function SideBar() {
    const user= useSelector(state=>state?.user)
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const [editUserOpen,setEditUserOpen]=useState(false)
    const [allUser,setAllUser]=useState([])
    const [openSearchUser,setOpenSearchUser]=useState(false)
  const socketConnection= useSelector(state=>state?.user?.socketConnection)
   const handlelogout=async()=>{
     const url=`${process.env.REACT_APP_BACKEND_URL}/api/logout`
     const response = await axios.get(url);
     console.log("resopnse",response)
     if(response?.data?.success){
      dispatch(logout())
      localStorage.removeItem('token');
      navigate('/email')
     }    

   }
  useEffect(()=>{
    if(socketConnection){
      socketConnection.emit('sideBar',user?._id)
      socketConnection.on('conversation',(data)=>{
        console.log("data---contact conversation",data)
        const conversationUserData= data.map((conversationUser,index)=>{
            if(conversationUser?.sender?._id === conversationUser?.receiver?._id){
                  return{
                     ...conversationUser,
                     userDetails:conversationUser?.sender
                  }
            }else if(conversationUser?.receiver?._id  !== user?._id){
              return{
                ...conversationUser,
                userDetails:conversationUser?.receiver
              }
            }else{
              return{
                ...conversationUser,
                userDetails:conversationUser?.sender
              }
            }
        })
        setAllUser(conversationUserData)
      })
    }
  },[socketConnection,user])
  return (
    <div className='h-full w-full grid grid-cols-[48px,1fr] bg-white'>
      <div className='bg-slate-100 h-full w-12 rounded-tr-lg rounded-br-lg py-5 text-slate-700 flex flex-col justify-between '>
       <div className=''>
            <NavLink className={({isActive})=>`h-12 w-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${isActive && "bg-slate-200"}`} title='Chat..'>
                <MdChat
                size={20} 
                />
                </NavLink>
            
                <div title='Add Freind' onClick={()=>setOpenSearchUser(true)} className='h-12 w-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded'>
                <FaUserPlus
                size={20}/>
                </div>
            </div>
                <div className='flex flex-col items-center'>    
                <button className='mx-auto' title={user?.name} onClick={()=>setEditUserOpen(true)}> 
                    <Avatar
                    width={40}
                    height={40}
                    name={user?.name}
                    imageUrl={user?.profile_pic}
                    userId={user?._id}
                    />

                </button>
                <button onClick={handlelogout} title='Logout' className='h-12 w-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded'>
                <span className='pr-1'>
                <TbLogout2
                size={20}
                />
                </span>
                </button>
                </div>
       
      </div>
      <div className='w-full'>
        <div className='h-16 flex items-center'>
        <h1 className='text-xl font-bold p-4 text-slate-800 '>Message</h1>
        </div>
        <div className='bg-slate-200 p-[0.5px]'></div>
        <div className='h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>
          {
            allUser.length === 0 && (
              <div className='mt-12'>
                <div className='flex justify-center items-center my-4 text-slate-500'>
                  <IoArrowUndoSharp
                  size={45}/>
                </div>
                <p className='text-slate-400 text-lg text-center'>Explore users to start a conversation with..</p>
              </div>
            )
          }
          {/* to show conversation contact list  */}
          {
             allUser?.map((conv,index)=>{
              return(
                <NavLink to={"/"+conv?.userDetails?._id} key={conv._id} className='flex items-center gap-2 px-2 py-2 rounded hover:bg-slate-100 cursor-pointer border border-transparent hover:border-primary'>
                  <div className='p-1'>
                    <Avatar
                    imageUrl={conv?.userDetails?.profile_pic}
                    name={conv?.userDetails?.name}
                    width={40}
                    height={40}
                    />
                  </div>
                  <div>
                    <h3 className='text-ellipsis line-clamp-1 font-semibold text-base '>{conv?.userDetails?.name}</h3>
                    <div className='text-xs text-slate-400 text-ellipsis line-clamp-1 flex items-center gap-2'>
                      <div className='flex items-center gap-2'>
                        {
                          conv?.lastMsg?.imageUrl && (
                            <div className='flex items-center gap-2'>
                                 <span className='hover:text-primary'><FaImage/></span>
                                 {!conv?.lastMsg?.text && <span>Image</span>}
                                 </div>
                          )
                        }
                         {
                          conv?.lastMsg?.videoUrl && (
                            <div className='flex items-center gap-2'>
                                 <span className='hover:text-primary'><FaVideo/></span>
                                 {!conv?.lastMsg?.text && <span>Video</span>}
                                 </div>
                          )
                        }
                      </div>
                      <p className='text-ellipsis line-clamp-1'>{conv?.lastMsg?.text}</p>
                    </div>
                  </div>
                  {
                    Boolean(conv?.unseen) && (
                  <p className='text-xs w-5 h-5 flex justify-center items-center ml-auto p-1 bg-primary  text-white hover:bg-secondary rounded-full font-semibold'>{conv?.unseen}</p>
                    )
                  }
                </NavLink>
              )
             })
          }
        </div>
      </div>
      {
        editUserOpen && (
            <EdittUserDetails onClose={()=>setEditUserOpen(false)} user={user}/>
        )
      }
      {
        openSearchUser && (
          <SearchUser onClose={()=>setOpenSearchUser(false)}/>
        )
      }
      
    </div>
  )
}

export default SideBar
