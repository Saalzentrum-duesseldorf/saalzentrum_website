import CustomCalendar, {
  CustomCalendarEvent,
} from "./customCalendar/desktop/CustomCalendar.tsx";
import { useEffect, useState } from "react";
import "./CalendarPage.scss";
import BurgerMenu from "../menu/BurgerMenu.tsx";
import MobileCalendar from "./customCalendar/mobile/MobileCalendar.tsx";
import { parseEvent } from "../../utils.ts";

const CalendarPage = () => {
  const [events, setEvents] = useState<CustomCalendarEvent[]>([]);


  useEffect(() => {
    fetch("https://saalzentrum-duesseldorf.de:8445/getAllEvents")
     //fetch("http://localhost:8080/getAllEvents") //local development
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const googleEvents: CustomCalendarEvent[] = data
          .map(parseEvent) // Use the parseEvent function here
          .filter(Boolean); // Remove null values from the array

        setEvents(googleEvents);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
      });
  }, []);

  return (
    <>
      <div className={"Calendar-Page"}>
        <div className={"Calendar-header"}>
          <img
            className={"Image"}
            src={"/calendarHeaderImage.png"}
            alt={"header image calendar page"}
          />
        </div>
        <div className={"burgerMenu-container"}>
          <BurgerMenu />
        </div>
        <div className={"CustomCalendar-container"}>
          <CustomCalendar events={events} />
        </div>
      </div>

      <div className={"Calendar-Page-Mobile"}>
        <MobileCalendar events={events}/>
      </div>
    </>
  );
};

export default CalendarPage;
