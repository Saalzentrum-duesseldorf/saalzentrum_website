import CustomCalendar, {
  CustomCalendarEvent,
} from "../customCalendar/CustomCalendar.tsx";
import { useEffect, useState } from "react";
import { ColorIdToColor, Resources, roomPatterns } from "../../utils.ts";
import "./CalendarPage.scss";
import BurgerMenu from "../menu/BurgerMenu.tsx";
import MobileCalendar from "../customCalendar/mobile/MobileCalendar.tsx";

const CalendarPage = () => {
  const [events, setEvents] = useState<CustomCalendarEvent[]>([]);


  const parseLocation = (event: any): string | undefined => {
    const location = event.location as string;

    if (!location) {
      return Resources.andere;
    }

    const rooms = location.split(', ');

    for (const room of rooms) {
      for (const pattern in roomPatterns) {
        if (room.startsWith(pattern)) {
          return roomPatterns[pattern];
        }
      }
    }

    return Resources.andere;
  };

  // Define the parseEvent function
  const parseEvent = (event: any): CustomCalendarEvent | null => {

    const location = parseLocation(event);

    if (event.colorId != 3 && event.colorId != 4 && event.colorId != 8 && event.colorId != 11 && event.colorId) console.log(event.colorId)

    if (event.start && event.start.date && event.start.date.value) {

      console.log("TESTCOLOR: " + event.colorId)
      // All-day event
      return {
        eventId: event.id,
        date: new Date(event.start.date.value),
        isAllDay: true,
        name: event.summary || "", // Fallback if `summary` is missing
        description: event.description || "", // Fallback if `description` is missing
        color: ColorIdToColor[event.colorId],
        location: location,

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
        color: ColorIdToColor[event.colorId],
        location: location,
      };
    }
    return null; // Return null if neither all-day nor timed event
  };

  useEffect(() => {
    fetch("https://saalzentrum-duesseldorf.de:8445/getAllEvents")
    // fetch("http://localhost:8080/getAllEvents")
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
