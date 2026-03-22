
import { useEffect } from 'react'
import './App.css'
import Content from './frontend/component/content'
import Header from './frontend/component/Header'
import { ThemeProvider } from './frontend/component/ThemeProvider';

function App() {

 
  return (
    <ThemeProvider>
    {/* <div className="App"> */}
     <Header></Header>
     <Content></Content>
    {/* </div> */}
    </ThemeProvider>
  )
}

export default App
