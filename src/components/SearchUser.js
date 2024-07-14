import React, { useEffect, useState } from 'react'
import { FiSearch } from "react-icons/fi";
import Loading from './Loading';
import UserSearchCards from './UserSearchCards';
import toast from 'react-hot-toast'
import axios from 'axios'
import { IoMdClose } from "react-icons/io";

function SearchUser({onClose}) {
    const [searchUser,setSearchUser]=useState([])
    const [loading,setLoading]=useState(false)
    const [search,setSearch]=useState("")

    const handleSearchUser=async()=>{
        const url=`${process.env.REACT_APP_BACKEND_URL}/api/search-user`
        try {
            setLoading(true)
            const res= await axios.post(url,{
                search:search
            })
            setLoading(false)
            console.log("---",res.data)
            setSearchUser(res.data.data)
        } catch (error) {
            toast.error(error?.res?.data?.message)
        }
    }
    useEffect(()=>{
        handleSearchUser()
    },[search])

    console.log(searchUser);
  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 bg-slate-700 bg-opacity-40 p-3 z-10'>
        <div className='w-full max-w-lg mx-auto mt-10'>
        <div className='bg-white rounded h-12 overflow-hidden flex'>
            <input
            type='text'
            placeholder='Search user by name, email....'
            className='w-full outline-none py-1 h-full px-4'
            onChange={(e)=>setSearch(e.target.value)}
            value={search}
            />
            <div className='h-12 w-14 flex justify-center items-center'>
                <FiSearch
                size={25}
                />
            </div>
        </div>
             {/* search result */}
        <div className='bg-white mt-2 rounded w-full p-4'>
            {
                searchUser.length === 0 && !loading && (
                    <p className='text-center text-slate-500'>No user found!</p>
                )
            }
            {
                loading && (
                    <p><Loading/></p>
                )
            }
           {
                        searchUser.length !== 0 && !loading && (
                            searchUser.map((user,index) => (
                                <UserSearchCards key={user._id} user={user} onClose={onClose} />
                            ))
                        )
                    }
        </div>
        </div>
        <div title='Close..' onClick={onClose} className='absolute top-0 right-0 p-2 lg:text-4xl hover:text-red-600'>
            <button>
                <IoMdClose 
                size={25}
                />
            </button>
        </div>
    </div>
  )
}

export default SearchUser
