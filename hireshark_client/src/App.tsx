// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import TablePage from './pages/Scratch/TablePage'
import Dashboard from './pages/UploadResumesToJD/Dashboard'
import {BrowserRouter, Routes, Route} from "react-router-dom";

function App() {

  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path='/all-candidates' element={<TablePage/>}/>
                <Route path='/jobs/selection/:meow' element={<Dashboard/>}/>
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
