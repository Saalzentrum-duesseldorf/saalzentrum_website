import "./App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartPage from "./compontents/startPage/StartPage.tsx";
import Impressum from "./compontents/impressum/Impressum.tsx";
import Datenschutz from "./compontents/datenschutz/Datenschutz.tsx";
import CalendarPage from "./compontents/calendar/CalendarPage.tsx";
import Footer from "./compontents/footer/Footer.tsx";

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
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
