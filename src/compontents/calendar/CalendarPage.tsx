import CustomCalendar, {
  CustomCalendarEvent,
} from "./customCalendar/desktop/CustomCalendar.tsx";
import { useEffect, useState } from "react";
import { ColorIdToColor, Resources, roomPatterns } from "../../utils.ts";
import "./CalendarPage.scss";
import BurgerMenu from "../menu/BurgerMenu.tsx";
import NewMobileCalendar from "./customCalendar/mobile/NewMobileCalendar/NewMobileCalendar.tsx";

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
// Adjusted parseEvent function
  const parseEvent = (event: any): CustomCalendarEvent | null => {
    // Parse location if available
    const location = parseLocation(event);

    // Check for startDate and endDate fields
    if (event.startDate && event.endDate) {
      // Convert startDate and endDate to Date objects
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);

      return {
        eventId: event.eventId,
        date: startDate, // For all-day events
        dateFrom: event.allDay ? undefined : startDate,
        dateTo: event.allDay ? undefined : endDate,
        isAllDay: event.allDay,
        name: event.summary || "", // Fallback if `summary` is missing
        description: event.description || "", // Fallback if `description` is missing
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        color: event.colorId ? ColorIdToColor[ event.colorId] : ColorIdToColor["undefined"], // Default color if colorId is null
        location: location,
      };
    }

    return null; // Return null if data is incomplete
  };


  useEffect(() => {
    fetch("https://saalzentrum-duesseldorf.de:8445/getAllEvents")
     //fetch("http://localhost:8080/getAllEvents")
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
        <NewMobileCalendar events={events}/>
      </div>
    </>
  );
};

export default CalendarPage;
