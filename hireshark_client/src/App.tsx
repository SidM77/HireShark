// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

import {BrowserRouter, Routes, Route} from "react-router-dom";

import TablePage from './pages/Scratch/TablePage'
import Dashboard from './pages/Phases/Dashboard'
import AllJobsPage from './pages/AllJobs/AllJobsPage';
import WelcomePage from './pages/WelcomePage';
import CandidateReportForm from './pages/CandidateReportForm';

function App() {

  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<WelcomePage />}/>
                <Route path='/all-candidates' element={<TablePage/>}/>
                <Route path='/jobs/selection' element={<Dashboard/>}/>
                <Route path='/all-jobs' element={<AllJobsPage />}/>
                <Route path='/candidateEvaluation' element={<CandidateReportForm />} />
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
