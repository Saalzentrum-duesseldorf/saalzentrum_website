import "./App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartPage from "./compontents/startPage/StartPage.tsx";
import Impressum from "./compontents/impressum/Impressum.tsx";
import Datenschutz from "./compontents/datenschutz/Datenschutz.tsx";
import "jquery";
import CalendarPage from "./compontents/calendar/CalendarPage.tsx";
import BurgerMenu from "./compontents/menu/BurgerMenu.tsx";
import Footer from "./compontents/footer/Footer.tsx";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
        </Routes>
        <BurgerMenu />
        <Footer />
      </Router>
  );
}

export default App;
