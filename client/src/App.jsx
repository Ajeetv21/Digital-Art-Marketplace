import React from 'react'
import Navbar from './components/Navbar'
import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Contacts from './pages/Contacts'
import Gallery from './pages/Gallery'
import SendMail from './pages/SendMail'


function App() {
  
  return (
    <div className='nav'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/contacts' element={<Contacts/>}/>
        <Route path='/gallery' element={<Gallery/>}/>
        <Route path='/send-mail' element={<SendMail/>}/>

      </Routes>
    </div>
  )
}

export default App
