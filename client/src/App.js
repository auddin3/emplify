import React from 'react'
import AppRouter from './components/AppRouter'
import { ChakraProvider } from '@chakra-ui/react'
import './styles/fonts.css'

function App () {
  return (
    <div className='font-sans'>
      <ChakraProvider>
        <main>
          <AppRouter />
        </main>
      </ChakraProvider>
    </div>
  )
}

export default App
