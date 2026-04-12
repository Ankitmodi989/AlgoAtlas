import React, { useContext } from 'react'
import { ThemeContext } from './ThemeProvider'
import logo from '../../assets/logo2.0.jpeg'
import { Link } from 'react-router-dom'
import { LogOut } from 'lucide-react'

const Header = ({ onLogout, user }) => {
  const { dark, setDark } = useContext(ThemeContext);

  return (
    <div
      className='h-16 w-full font-bold flex items-center justify-between space-x-4 border-b-2'
      style={{ background: 'var(--navbar-bg)', color: 'var(--navbar-color)' }}
    >
      <div className="logo ml-5">
        <img src={logo} height={50} width={60} className='rounded-[25px]' />
      </div>

      <div className="flex mr-5 space-x-4 items-center">
        <Link to="/favour">
          <div className="add cursor-pointer hover:text-red-500">Wishlist</div>
        </Link>
        <div className="about cursor-pointer hover:text-red-500">About</div>
        <div className="mode cursor-pointer hover:text-red-500">
          {dark
            ? <span onClick={() => setDark(false)}>Light</span>
            : <span onClick={() => setDark(true)}>Dark</span>
          }
        </div>

        {user && (
          <>
            <span style={{ fontSize: 14, opacity: 0.75 }}>Hi, {user.name?.split(' ')[0]}</span>
            <button
              onClick={onLogout}
              className="flex items-center gap-1 cursor-pointer hover:text-red-500"
              style={{ background: 'none', border: 'none', color: 'inherit', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default Header