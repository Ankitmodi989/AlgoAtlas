import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Content from './frontend/component/content'
import Header from './frontend/component/Header'
import { ThemeProvider } from './frontend/component/ThemeProvider';
import Algo_page from './frontend/component/Algo_page'
import { useState } from 'react'
import Favour from './frontend/component/Favour '

function App() {
  const [favour,setfavour]=useState([]);
  const toggleFavour = (algo) => {
  const exists = favour.find(item => item.id === algo.id);

  if (exists) {
    setfavour(favour.filter(item => item.id !== algo.id));
  } else {
    setfavour([...favour, algo]);
  }
};

  return (
      <ThemeProvider>
        <Header />
        <Routes>  
          <Route path='/' element={<Content favour={favour} 
            toggleFavour={toggleFavour}/>} />
          <Route 
            path="/favour" 
            element={
              <Favour 
                favour={favour} 
                toggleFavour={toggleFavour} 
              />
            } 
          />
          <Route path='/algo/:id' element={<Algo_page/>}></Route>
        </Routes>
      </ThemeProvider>
    
  )
}

export default App
