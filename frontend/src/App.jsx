import { useState } from 'react'
import './App.css'
import AppRoutes from './routes/index'
import { UserProvider } from './context/UserContext'

function App() {

  return (
    <>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </>
  )
}

export default App
