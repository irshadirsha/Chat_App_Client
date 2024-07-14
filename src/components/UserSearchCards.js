import React from 'react'
import Avatar from './Avatar'
import { Link } from 'react-router-dom'

function UserSearchCards({user,onClose}) {
  return (
    <Link to={'/'+user._id} onClick={onClose} className='flex items-center  gap-4 p-2 lg:p-3 border border-transparent hover:border hover:border-primary rounded-md'>
      <div>
        <Avatar 
        width={50}
        height={50}
        name={user.name}
        userId={user?._id}
        imageUrl={user?.profile_pic}
        />
      </div>
      <div className='font-semibold text-ellipsis line-clamp-1'>
        {user?.name}
        <p className='text-sm text-ellipsis line-clamp-1'>{user?.email}</p>
      </div>
    </Link>
  )
}

export default UserSearchCards
