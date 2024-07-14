import React from 'react'
import {  LuUserCircle2 } from "react-icons/lu";
import { useSelector } from 'react-redux';

function Avatar({userId,name,imageUrl,width,height}) {
  const onlineUser= useSelector(state=>state?.user?.onlineUser)
    let avatarName=""
    if(name){
        const splitname=name?.split(" ")
        if(splitname.length>1){
            avatarName=splitname[0][0]+splitname[1][0]
        }else{
            avatarName=splitname[0][0]
        }
    }

    const bgColor=[
        'bg-slate-100',
        'bg-teal-100',
        'bg-red-100',
        'bg-gren-100',
        'bg-yellow-100',
        "bg-gray-100",
        'bg-zinc-100',
        'bg-orange-100',
        'bg-lime-100',
        'bg-emerald-100',
        'bg-indigo-100'
    ]
    const randomNumber=Math.floor(Math.random()*11)
    const isOnline =  onlineUser.includes(userId)
  return (
    <div style={{width:width+"px", height:height+"px"}} className={`text-slate-800 overflow-hidden  rounded-full text-xl font-semibold  relative`}>
      {
        imageUrl ? (
            <img
            src={imageUrl}
            width={width}
            height={height}
            alt={name}
            className='overflow-hidden rounded-full'
            />
        ) : name ?(
            <div  style={{width:width+"px", height:height+"px"}} className={`overflow-hidden rounded-full flex justify-center items-center ${bgColor[randomNumber]}`}>
               {avatarName}
            </div>
        ) :(
            <LuUserCircle2
        size={width}
        />
        )
      }

       {
        isOnline && (
          <div className='bg-green-600 p-1 absolute bottom-2 right-1 z-10 rounded-full'></div>
        )
       }

    </div>
  )
}

export default Avatar
