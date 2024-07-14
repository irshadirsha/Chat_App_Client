import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast'
import Avatar from '../components/Avatar';
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/userSlice';
function CheckPasswordPage() {
  const [data,setData]=useState({
    password:"",
    userId:""
  })
  const navigate=useNavigate()
  const location = useLocation()
  const dispatch=useDispatch()
  console.log("location",location)
  
  useEffect(()=>{
     if(!location?.state?.data?.name){
      navigate('/email')
     }
  },[])
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
    const url=`${process.env.REACT_APP_BACKEND_URL}/api/password`
    try {
      // console.log("register button cliccked")
      const response= await axios({
        method:'post',
        url:url,
        data:{
          userId:location.state.data._id,
          password:data.password
        },
        withCredentials:true 
      })
      toast.success(response?.data?.Message)
      if(response.data.succuss){
        dispatch(setToken(response?.data?.token))
        localStorage.setItem("token",response?.data?.token)
        setData({
          password:"",
        })
        navigate('/')
        console.log("in side if statement ")
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message)
    }
  }
 
  // console.log("data",data);
  return (
    <div className='mt-5 '>
    <div className='bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto'>
    <div className='w-fit mx-auto mb-2 flex justify-center items-center flex-col'> 
    <Avatar
       width={80}
       height={80}
       name={location?.state?.data?.name}
       imageUrl={location?.state?.data?.profile_pic}
       />
       <h3 className='font-semibold text-lg mt-1'>{location?.state?.data?.name}</h3>
      </div>
    <h3> Wellcome to ChatApp!</h3> 
    <form>
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


      <div className='flex justify-center mt-4'>
      <button  className='bg-primary text-lg text-center w-full h-8 rounded hover:bg-secondary font-bold text-white leading-relaxed'
      onClick={handleSubmit}>
          Login
        </button>
      </div>
    </form>
    <p className='my-3 text-center'><Link to={'/forgot-password'} className='hover:text-primary font-semibold'>Forgot password ?</Link></p>
    </div>
  </div>
  )
}

export default CheckPasswordPage

