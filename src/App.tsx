import "./App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartPage from "./components/startPage/StartPage.tsx";
import Impressum from "./components/impressum/Impressum.tsx";
import Datenschutz from "./components/datenschutz/Datenschutz.tsx";
import CalendarPage from "./components/calendar/CalendarPage.tsx";
import KioskView from "./components/calendar/kiosk/KioskView.tsx";

function App() {
  return (
    <Router>
      <div className="site-container"> {/* Use Flexbox here */}
        <div className="content-wrap"> {/* Content excluding footer */}
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            <Route path="/kiosk" element={<KioskView />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
