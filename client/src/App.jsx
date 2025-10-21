import React from 'react'

import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'



function App() {
  return (
    <>
      <Header />
      {/* Outlet renders the content of the current child route. */}
      {/* Its like a Placeholder */}
      <Outlet /> 
      <Footer/>
    </>
  )
}

export default App
