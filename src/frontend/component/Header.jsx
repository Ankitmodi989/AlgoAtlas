import { useEffect } from 'react'
import React, { useContext } from 'react'
import { ThemeContext } from './ThemeProvider'

const Header = () => {

  const { dark, setDark } = useContext(ThemeContext);


  console.log(dark);
  return (
    <div className='h-20 w-full text-var(--navbar-color) font-bold flex items-center justify-between  space-x-4 border-b-2 ' style={{ background: 'var(--navbar-bg' }}>
      <div className="logo ml-5 ">logo</div>
      <div className="flex mr-5 space-x-4">
        <div className="add">Add to cart</div>
        <div className="about cursor-pointer hover:text-red-500">About</div>
        <div className="mode cursor-pointer  hover:text-red-500">
          {dark ? <span onClick={() => setDark(false)}>Light</span> : <span onClick={() => setDark(true)}>Dark</span>}
        </div>
        <div className="login cursor-pointer  hover:text-red-500">Login</div>
        <div className="div cursor-pointer hover:text-red-500">SignUp</div>
        </div>
        
    </div>

  )
}

export default Header