// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import TablePage from './pages/Scratch/TablePage'
import Dashboard from './pages/UploadResumesToJD/Dashboard'
import AllJobsPage from './pages/AllJobs/AllJobsPage';
import {BrowserRouter, Routes, Route} from "react-router-dom";

function App() {

  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path='/all-candidates' element={<TablePage/>}/>
                <Route path='/jobs/selection' element={<Dashboard/>}/>
                <Route path='/all-jobs' element={<AllJobsPage />}/>
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
