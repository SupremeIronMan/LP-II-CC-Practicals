import React from 'react'
import Header from '../comp/Header'
import Footer from '../comp/Footer'

function Frontend({children}) {
  return (
     <>
     <Header/>
     {children}
     <Footer/>
     </>
  )
}

export default Frontend