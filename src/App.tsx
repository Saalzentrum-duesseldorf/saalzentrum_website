import "./App.scss";
import Footer from "./compontents/footer/Footer.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartPage from "./compontents/startPage/StartPage.tsx";
import IssueCollector from "./compontents/jiraIssueCollector/IssueCollector.tsx";
import Impressum from "./compontents/impressum/Impressum.tsx";
import Datenschutz from "./compontents/datenschutz/Datenschutz.tsx";
import CustomCalendar, { CustomCalendarDates } from "./compontents/customCalendar/CustomCalendar.tsx";

function App() {

  const dates: CustomCalendarDates[] = [
    {
      date: new Date(2023, 7, 28),
      name: "Neujahr",
      description: "Neujahr",
      color: "rgba(255,0,0,0.74)",
    },
    {
      date: new Date(2023, 7, 17),
      name: "Heilige Drei Könige",
      description: "Heilige Drei Könige",
      color: "#558ee0",
    },
  ];

  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/calendar" element={<CustomCalendar dates={dates}/>} />
        <Route path="/tickets" element={<IssueCollector />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/datenschutz" element={<Datenschutz />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
