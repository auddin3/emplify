import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import EmplifyLogo from '../assets/images/logo.png'
import { ArrowLeftStartOnRectangleIcon, ChartPieIcon, ShieldCheckIcon, WalletIcon } from '@heroicons/react/24/solid'
import { Icon,
  Image,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  Portal,
  Avatar } from '@chakra-ui/react'
import useSignOut from 'react-auth-kit/hooks/useSignOut'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'

const Navbar = () => {
  const signOut = useSignOut()
  const location = useLocation()
  const navigate = useNavigate()

  const auth = useAuthUser()
  const [user, setUser] = useState(auth?.user)

  useEffect(() => {
    setUser(auth?.user)
  }, [auth])

  const handleClick = () => {
    signOut()
    navigate('/')
  }

  return (
    <div className='flex flex-col min-h-screen bg-blue-kpmgBlue max-w-28 min-w-28 rounded-r-3xl'>
      <Image
        src={EmplifyLogo}
        alt='KPMG Logo'
        className='object-contain h-[50px] w-[100px] my-12 px-4 mx-auto'
      />

      <div className='flex flex-col justify-between h-full'>
        <div className='flex flex-col w-full mt-12 2xl:my-40 space-y-12'>
          <a href='/dashboard' aria-label="dashboard" className={`flex justify-center py-3 cursor-pointer ${location.pathname.includes('/dashboard') ? 'bg-blue-lightBlue rounded-r-full w-10/12 pl-4' : ''}`}>
            <Icon w={30} h={30} color="white" as={ChartPieIcon}/>
          </a>

          <a href='/portfolios' aria-label="portfolios" className={`flex justify-center py-3 cursor-pointer ${location.pathname.includes('/portfolios') ? 'bg-blue-lightBlue rounded-r-full w-10/12 pl-4' : ''}`}>
            <Icon w={30} h={30} color="white" as={ShieldCheckIcon}/>
          </a>

          <a href='/library' aria-label="library" className={`flex justify-center py-3 cursor-pointer ${location.pathname.includes('/library') ? 'bg-blue-lightBlue rounded-r-full w-10/12 pl-4' : ''}`}>
            <Icon w={30} h={30} color="white" as={WalletIcon}/>
          </a>
        </div>

        <div>
          <hr className='border-t border-t-white mb-20'/>

          <Popover placement='right'>
            <PopoverTrigger>
              <div role="button" className={`mb-20 flex justify-center py-2.5 mr-3 pl-3
              ${location.pathname.includes('/profile') ? 'bg-blue-lightBlue rounded-r-full' : ''}`}>
                <Avatar name={user?.name} size='lg' fontWeight={600} className='cursor-pointer'/>
              </div>
            </PopoverTrigger>
            <Portal className='rounded-lg'>
              <PopoverContent className='p-1'>
                <PopoverArrow />
                <PopoverBody>
                  <div
                    className='font-sansSemibold text-blue-kpmgBlue py-2 px-4 cursor-pointer rounded-full hover:bg-blue-kpmgBlue/10'
                    onClick={() => navigate('/profile', { state: { tab: 0 } })}
                  >
                    My Profile
                  </div>
                  <div
                    className='font-sansSemibold text-blue-kpmgBlue py-2 px-4 cursor-pointer rounded-full hover:bg-blue-kpmgBlue/10'
                    onClick={() => navigate('/profile', { state: { tab: 1 } })}
                  >
                    Settings
                  </div>
                </PopoverBody>
                <PopoverFooter>
                  <div onClick={() => handleClick()} className='flex flex-row space-x-2 items-center py-2 px-4 cursor-pointer rounded-full hover:bg-blue-kpmgBlue/10'>
                    <Icon h={5} w={5} stroke={4} as={ArrowLeftStartOnRectangleIcon} color='#00338D'/>
                    <p className='font-sansSemibold text-blue-kpmgBlue'>Logout</p>
                  </div>
                </PopoverFooter>
              </PopoverContent>
            </Portal>
          </Popover>
        </div>
      </div>
    </div>
  )
}

export default Navbar
