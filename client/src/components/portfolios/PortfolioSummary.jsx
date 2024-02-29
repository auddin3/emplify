import React from 'react'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import Navbar from '../Navbar'
import { useLocation } from 'react-router-dom'

const Portfolio = () => {
  const auth = useAuthUser()
  const user = auth.user
  const location = useLocation()
  const portfolio = location?.state?.portfolio

  return (
    <div className='bg-gradient-to-r from-[#F7F7F8] from-10% to-white flex flex-row'>
      <Navbar user={user}/>
      <div className='w-full p-14'>
        <h1 className='text-2xl text-blue-kpmgBlue font-semibold'>{portfolio?.name}</h1>
        <hr className='border-t-2 border-t-black-custom1/15 text-black-custom1 my-2 w-full' />
      </div>
    </div>
  )
}

export default Portfolio
