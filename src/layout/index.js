import React from 'react'
import logo from '../assets/chatlogo.png'
function AuthLayout({children}) {
  return (
    <>
      <header className='flex justify-center items-center py-3 height-20 shadow-md bg-white'>
        <img
        src={logo}
        alt='logo'
        width={180}
        height={60}
        />
      </header>
      {children}
    </>
  )
}

export default AuthLayout
