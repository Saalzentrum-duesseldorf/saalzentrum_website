import './App.scss'
import Footer from "./compontents/footer/Footer.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import BurgerMenu from "./compontents/menu/BurgerMenu.tsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Calendar } from "./compontents/calendar/Calendar.tsx";
import StartPage from "./compontents/startPage/StartPage.tsx";
// import  IssueCollector from "./compontents/jiraIssueCollector/IssueCollector.tsx";


function App() {
  return (
    <Router>
      <BurgerMenu/>
      <Routes>
        <Route path="/" element={<StartPage/>} />
        <Route path="/calendar" element={<Calendar/>} />
        {/*<Route path="/tickets" element={<IssueCollector/>} />*/}
      </Routes>
      <Footer/>
    </Router>
  )
}


export default App
