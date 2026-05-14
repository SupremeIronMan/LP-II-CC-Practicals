import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { FaCartArrowDown } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { CartContext } from '../pages/frontend/CartContext';
 
function Header() {
     let {state, dispatch}=useContext(CartContext)
    let [category, setCategory]=useState([])
    useEffect(()=>{
        axios.get('http://localhost:5000/api/categories').then(a=>setCategory(a.data));
    })
  return (
   
     <>
     <header className='py-3 bg-green-500'>
        <div className="max-w-7xl mx-auto flex justify-between items-center text-white">
            <h2 className='text-4xl font-bold'>Online Shopping</h2>
           <div><Link to="/cart"  className='flex gap-2'><FaCartArrowDown className="text-2xl" /> <p>{state.cart.length}</p></Link></div>
        </div>
     </header>
     <nav className='bg-green-800 text-white p-3 text-center space-x-4'>
            <Link to="/">Home</Link>
            {category.map(a=><Link to={`/products/category/${a._id}`} key={a._id}>{a.name}</Link>)}
            <Link to="/contact">Contact</Link>
     </nav>
     </>
  )
}

export default Header