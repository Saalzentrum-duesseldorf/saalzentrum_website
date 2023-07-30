import "./App.scss";
import Footer from "./compontents/footer/Footer.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartPage from "./compontents/startPage/StartPage.tsx";
import GoogleCalendar from "./compontents/calendar/GoogleCalendar.tsx";
import IssueCollector from "./compontents/jiraIssueCollector/IssueCollector.tsx";
import Impressum from "./compontents/impressum/Impressum.tsx";
import Datenschutz from "./compontents/datenschutz/Datenschutz.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/calendar" element={<GoogleCalendar />} />
        <Route path="/tickets" element={<IssueCollector />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/datenschutz" element={<Datenschutz />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
