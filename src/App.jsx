import { useEffect } from 'react'
import './App.css'
import Content from './frontend/component/content'
import Header from './frontend/component/Header'
import { ThemeProvider } from './frontend/component/ThemeProvider';

function App() {

 
  return (
    <ThemeProvider>
     <Header></Header>
     <Content></Content>
    </ThemeProvider>
  )
}

export default App
