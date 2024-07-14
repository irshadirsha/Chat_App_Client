import React, { useEffect, useRef, useState } from 'react'
import Avatar from './Avatar'
import uploadFile from '../helpers/uploadFiles'
import Divider from './Divider'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/userSlice'
function EdittUserDetails({onClose,user}) {
    const [data, setData] = useState({
        name: user?.name || '',
        profile_pic: user?.profile_pic || ''
      })
      const uploadPhotoRef=useRef()
      const dispatch=useDispatch()

    useEffect(() => {
        if (user) {
          setData({
            name: user.name,
            profile_pic: user.profile_pic
          })
        }
      }, [user])
    console.log("edit section",user)
    const handleOnChange=(e)=>{
        const {name,value}=e.target
    
    setData((preve)=>{
        return{
            ...preve,
            [name]:value
        }
    })
}

const handleUplaodPhoto = async(e)=>{
  const file=e.target.files[0]

  const uploadphoto= await uploadFile(file)
  console.log("upload photooo",uploadphoto)
  setData((preve)=>{
    return{
      ...preve,
      profile_pic:uploadphoto?.data?.url
    }
  })
}
const handleOpenUploadPhoto=(e)=>{
  e.preventDefault()
  e.stopPropagation()
  uploadPhotoRef.current.click()
}

const handleSubmit=async(e)=>{
      e.preventDefault()
      e.stopPropagation()
       const url=`${process.env.REACT_APP_BACKEND_URL}/api/update-user`
      try {
        console.log("before api call---",data)
        const res= await axios.post(url,data,{withCredentials:true})
        console.log(res.data)
        console.log("res.--data",res)
        toast.success(res?.data?.message)
        if(res.data.success){
           dispatch(setUser(res.data.data))
        }
        onClose()
      } catch (error) {
        toast.error(error?.res?.data?.message)
      }
}
  return (
    <div className='fixed top-0 bottom-0 left-0 right-0  bg-gray-600 bg-opacity-40 flex justify-center items-center z-10'>
    <div className='bg-white p-4 py-6 m-1 rounded w-full max-w-sm'>
       <h2 className='font-semibold'>Profile Details</h2>
       <p className='text-sm'>Edit profile details</p>
       <form className='grid gap-3 mt-3' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-1'>
            <label htmlFor='name'>Name</label>
            <input  
            type='text'
            id='name'
            name='name'
            value={data.name}
            onChange={handleOnChange}
            className='w-full py-1 px-2  focus:outline-primary border'
        />
        </div>
        <div>
        <div>Photo :</div>
          <div className='my-1 flex items-center gap-5'>
            <Avatar
            width={40}
            height={40}
            imageUrl={data.profile_pic}
            name={data.name}
            />
             <label htmlFor='profile_pic'>
            <button className='font-semibold' onClick={handleOpenUploadPhoto}>Change Photo</button>
            <input
            type='file'
            id='profile_pic'
            className='hidden'
            onChange={handleUplaodPhoto}
            ref={uploadPhotoRef}
            />
            </label>
          </div>
        </div>
        <Divider/>
        <div className='flex gap-2 w-fit ml-auto '>
          <button onClick={onClose} className='border-primary border text-primary hover:bg-primary hover:text-white px-4 py-1 rounded'>Cancel</button>
          <button  onSubmit={handleSubmit} className='border-primary bg-primary hover:bg-secondary text-white border py-1 px-4 rounded'>Save</button>
        </div>
       </form>
    </div>
    </div>
  )
}

export default React.memo(EdittUserDetails)
