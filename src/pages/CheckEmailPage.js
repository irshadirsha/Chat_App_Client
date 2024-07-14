import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast'
import {  LuUserCircle2 } from "react-icons/lu";
function CheckEmailPage() {
  const [data,setData]=useState({
    email:"",
  })
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
  
  const handleSubmit= async (e)=>{
    e.preventDefault()
    const url=`${process.env.REACT_APP_BACKEND_URL}/api/email`
    try {
      console.log("lets go button cliccked")
      console.log(url)
      console.log("url---------------",url)
      const response= await axios.post(url,data)
      console.log("response...",response)
      toast.success(response?.data?.message)
      if(response.data.success){
        setData({
          email:"",
        })
        navigate('/password',{state:response.data})
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
 
  console.log("data",data);
  return (
    <div className='mt-5 '>
    <div className='bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto'>
    <div className='flex justify-center items-center'> 
        <LuUserCircle2
        size={80}
        />
      </div>
    <h3> Wellcome to ChatApp!</h3> 
    <form>
      <div className='flex flex-col gap-1 pt-2'>
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

      <div className='flex justify-center mt-4'>
      <button  className='bg-primary text-lg text-center w-full h-8 rounded hover:bg-secondary font-bold text-white leading-relaxed'
      onClick={handleSubmit}>
        Let's go
        </button>
      </div>
    </form>
    <p className='my-3 text-center'>New User ? <Link to={'/register'} className='hover:text-primary font-semibold'>Register</Link></p>
    </div>
  </div>
  )
}

export default CheckEmailPage
