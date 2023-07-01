import './App.scss'
import Footer from "./compontents/footer/Footer.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import BurgerMenu from "./compontents/menu/BurgerMenu.tsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from "./compontents/startPage/StartPage.tsx";
import { GoogleCalendar } from "./compontents/calendar/GoogleCalendar.tsx";
import React from "react";
import IssueCollector from "./compontents/jiraIssueCollector/IssueCollector.tsx";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage/>} />
        <Route path="/calendar" element={<GoogleCalendar />} />
        <Route path="/tickets" element={<IssueCollector/>} />
      </Routes>
      <Footer/>
    </Router>
  )
}


export default App
