import "./App.scss";
import Footer from "./compontents/footer/Footer.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartPage from "./compontents/startPage/StartPage.tsx";
import Impressum from "./compontents/impressum/Impressum.tsx";
import Datenschutz from "./compontents/datenschutz/Datenschutz.tsx";
import CustomCalendar, {
  CustomCalendarEvent,
} from "./compontents/customCalendar/CustomCalendar.tsx";
import { useEffect, useState } from "react";
import JiraIssueCollector from "./compontents/jiraIssueCollector/JiraIssueCollector.tsx";
import "jquery";
import { EmailColor } from "./utils.ts";

function App() {
  const [events, setEvents] = useState<CustomCalendarEvent[]>([]);

  // Define the parseEvent function
  const parseEvent = (event: any): CustomCalendarEvent | null => {
    let email = "";
     let color= "#00b5ff";
    if (event.attendees != null) {
      email = event.attendees[0].email;
      color = EmailColor[email];
    }

    if (event.start && event.start.date && event.start.date.value) {
      // All-day event
      return {
        eventId: event.id,
        date: new Date(event.start.date.value),
        isAllDay: true,
        name: event.summary || "", // Fallback if `summary` is missing
        description: event.description || "", // Fallback if `description` is missing
        color: color,
        email: email,
      };
    } else if (
      event.start &&
      event.start.dateTime &&
      event.start.dateTime.value
    ) {
      // Timed event
      return {
        eventId: event.id,
        date: new Date(event.start.dateTime.value),
        dateFrom: new Date(event.start.dateTime.value),
        dateTo: new Date(event.end.dateTime.value),
        isAllDay: false,
        name: event.summary || "", // Fallback if `summary` is missing
        description: event.description || "", // Fallback if `description` is missing
        color: color,
        email: email,
      };
    }
    return null; // Return null if neither all-day nor timed event
  };

  useEffect(() => {
    fetch("http://localhost:8080/getAllEvents")
      .then((r) => r.json())
      .then((data) => {
        const googleEvents: CustomCalendarEvent[] = data
          .map(parseEvent) // Use the parseEvent function here
          .filter(Boolean); // Remove null values from the array

        setEvents(googleEvents);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []); // Empty dependency array to run the code only once

  //TODO: Nicht im mvp aber farbe muss uebernommen werden
  // const fetchEventColor = async (event: CustomCalendarEvent): Promise<string> => {
  //   try {
  //     const response = await fetch(`http://localhost:8080/getColor?eventId=${event.eventId}`);
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok " + response.statusText);
  //     }
  //     const data = await response.text();
  //     console.log("fetchEventColor");
  //     console.log(data);
  //     return data;
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     return "";
  //   }
  // };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/calendar" element={<CustomCalendar events={events} />} />
        <Route path="/tickets" element={<JiraIssueCollector />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/datenschutz" element={<Datenschutz />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
