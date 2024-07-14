import React, { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { logout, setOnlineUser, setUser, setsocketConnection,  } from '../redux/userSlice'
import SideBar from '../components/SideBar'
import logo from '../assets/chatlogo.png'
import io from 'socket.io-client'

function Home() {

  const dispatch=useDispatch()
  const navigate=useNavigate()
  const location = useLocation()
  const user=useSelector(state=>state.user)
  console.log("redux user---",user)
  const fetchUserDetails=async()=>{
    try {
       const url=`${process.env.REACT_APP_BACKEND_URL}/api/user-details`
       const response = await axios.get(url, { withCredentials : true });
       console.log("response", response); 
       console.log("response", response.data); 
       dispatch(setUser(response.data.data))

       if(response.data.data.logout){
        dispatch(logout())
        navigate('/email')
       }      
    } catch (error) {
      console.log("error",error)
    }
  }

  
  useEffect(()=>{
    fetchUserDetails()
  },[])

  useEffect(()=>{
    const socketConnection= io(process.env.REACT_APP_BACKEND_URL,{
      auth:{
        token:localStorage.getItem('token')
      }
    })
    socketConnection.on('onlineUser',(data)=>{
      console.log("data online --",data)
      dispatch(setOnlineUser(data)) 
    })
   dispatch(setsocketConnection(socketConnection))  
    return ()=>{
      socketConnection.disconnect()
    }
  },[])
  console.log("location---",location)
  const basePath=location.pathname==="/"
  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
     <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
      <SideBar/>
     </section>
     {/*itss both  */}
      <section className={`${basePath && "hidden"}`}>
        <Outlet/>
      </section>
      <div className={` justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : 'lg:flex'}`}>
        <div>
          <img
          src={logo} 
          width={250}
            alt='logo'
          />
        </div>
        <p className='text-lg mt-2 text-slate-400'>Select user to send Message</p>
      </div>
    </div>
  )
}

export default Home
