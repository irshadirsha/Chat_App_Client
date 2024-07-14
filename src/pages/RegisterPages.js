import React, { useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFiles';
import axios from 'axios';
import toast from 'react-hot-toast'
const RegisterPages = () => {
  const [data,setData]=useState({
    name:"",
    email:"",
    password:"",
    profile_pic:""
  })
  const [uploadphoto,setUploadPhoto]=useState('')
  const navigate=useNavigate()
  
  const handleOnChange=(e)=>{
    const {name,value}=e.target
    setData((preve)=>{
      return{
        ...preve,
        [name]:value
      }
    })
  }
  const handleUploadPhoto = async(e)=>{
      const file=e.target.files[0]

      const uploadphoto= await uploadFile(file)
      console.log("upload photooo",uploadphoto)
      setUploadPhoto(file)
      setData((preve)=>{
        return{
          ...preve,
          profile_pic:uploadphoto?.data?.url
        }
      })
  }
  const handleSubmit= async (e)=>{
    e.preventDefault()
    const url=`${process.env.REACT_APP_BACKEND_URL}/api/register`
    try {
      console.log("register button cliccked")
      console.log(url)
      console.log("url---------------",url)
      const response= await axios.post(url,data)
      console.log(response)
      toast.success(response?.data?.message)
      if(response.data.success){
        setData({
          name:"",
          email:"",
          password:"",
          profile_pic:""
        })
        navigate('/email')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
  const handleRemoveImg=(e)=>{
    e.preventDefault()
      setUploadPhoto(null)
  }
  console.log("data",data);

  return (
    <div className='mt-5 '>
      <div className='bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto'>
      <h3> Wellcome to ChatApp</h3> 
      <form>
        <div className='flex flex-col gap-1'>
          <label htmlFor='name'>Name </label>
          <input type='text' 
          id='name'
          name='name'
          placeholder='Enter Your Name'
          className='bg-slate-100 px-2 py-1 focus:outline-primary'
          value={data.name}
          onChange={handleOnChange}
          required
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='email'>Email </label>
          <input type='text' 
          id='email'
          name='email'
          placeholder='Enter Your Email'
          className='bg-slate-100 px-2 py-1 focus:outline-primary'
          value={data.email}
          onChange={handleOnChange}
          required
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='password'>Password </label>
          <input type='password' 
          id='password'
          name='password'
          placeholder='Enter Your Password'
          className='bg-slate-100 px-2 py-1 focus:outline-primary'
          value={data.password}
          onChange={handleOnChange}
          required
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='profil_pic'>Photo 
          <div className='h-14 bg-slate-200 flex justify-center items-center rounded border hover:border-primary cursor-pointer'>
              <p className='text-sm max-w-[300px] text-ellipsis line-clamp-1'>
                {uploadphoto?.name? uploadphoto?.name :"Upload profile photo "}
               </p>
               {uploadphoto?.name && <button className='text-lg ml-3 hover:text-red-500'onClick={handleRemoveImg}>
                <IoMdClose/>
                </button> }
               
          </div>
          </label>
          <input type='file' 
          id='profil_pic'
          name='profil_pic'
          placeholder='select your image '
          className='bg-slate-100 px-2 py-1 focus:outline-primary hidden'
          onChange={handleUploadPhoto}
          required
          />
        </div>
        <div className='flex justify-center mt-4'>
        <button  className='bg-primary text-lg text-center w-full h-8 rounded hover:bg-secondary font-bold text-white leading-relaxed'
        onClick={handleSubmit}>
          Register
          </button>
        </div>
      </form>
      <p className='my-3 text-center'>Already have account ? <Link to={'/email'} className='hover:text-primary font-semibold'>Login</Link></p>
      </div>
    </div>
  )
}

export default RegisterPages
