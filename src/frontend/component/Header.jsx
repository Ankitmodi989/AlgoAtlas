import React, { useContext, useEffect } from 'react'
import { ThemeContext } from './ThemeProvider'
import logo from '../../assets/unnamed.jpg'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react'

const Header = ({ onLogout, user }) => {
  const { dark, setDark } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll to #about when hash changes
  useEffect(() => {
    if (location.hash === '#about') {
      setTimeout(() => {
        const el = document.getElementById('about');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  const handleAboutClick = () => {
    if (location.pathname === '/') {
      // Already on home page, just scroll
      const el = document.getElementById('about');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to home page with hash
      navigate('/#about');
    }
  };

  return (
    <div
      className='h-16 w-full font-bold flex items-center justify-between space-x-4 border-b-2'
      style={{ background: 'var(--navbar-bg)', color: 'var(--navbar-color)' }}
    >
      <div className="logo ml-5">
        <Link to="/">
          <img src={logo} height={50} width={60} className='rounded-[25px]' />
        </Link>
      </div>

      <div className="flex mr-5 space-x-4 items-center">
        <Link to="/">
          <div className="home cursor-pointer hover:text-red-500">
            Home
          </div>
        </Link>
        <Link to="/favour">
          <div className="add cursor-pointer hover:text-red-500">Wishlist</div>
        </Link>
        <div className="about cursor-pointer hover:text-red-500" onClick={handleAboutClick}>About</div>
        <div 
          className="mode cursor-pointer hover:text-red-500"
          onClick={() => setDark(!dark)}
        >
          {dark ? 'Light' : 'Dark'}
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