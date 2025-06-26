// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import Homepage from './pages/Homepage'
import Chatpage from './pages/chatpage'
import './App.css'
import ChatProvider from './Contextapi/ChatProvider'

function App() {

  return (
    <BrowserRouter>
    <ChatProvider>
    <div className='App '>
        <Routes>

          <Route path="/" element={<Homepage />} />
          <Route path="/chat" element={<Chatpage />} />

        </Routes>
      </div>
      </ChatProvider>
    </BrowserRouter>



  )
}

export default App
