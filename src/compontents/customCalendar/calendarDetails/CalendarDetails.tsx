import "./CalendarDetails.scss";
import { CustomCalendarEvent } from "../CustomCalendar.tsx";
import { getOverlappingEvents, parseDateToStringWithWrittenOutMonth, Resources } from "../../../utils.ts";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";

export interface CalendarDetailsProps {
  events: CustomCalendarEvent[] | null;
  day: Date;
}

const CalendarDetails = ({ events, day }: CalendarDetailsProps) => {
  const filterEvents = (resource: string): CustomCalendarEvent[] | null => {
    const resourceEmail = (Resources as never)[resource]; // Type assertion here
    const result = events?.filter((event) => event.email === resourceEmail);

    if (resource != "" && result) {
      return result;
    }
    return events;
  };

  const [currentResource, setResource] = useState<string>("");

  events = filterEvents(currentResource);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  function containsAllDayEvent(events: CustomCalendarEvent[] | null): boolean {
    if (events) {
      for (const element of events) {
        if (element.isAllDay) {
          return true;
        }
      }
    }
    return false;
  }

  function getEventsForHour(
    hour: number,
    events: CustomCalendarEvent[] | null
  ): CustomCalendarEvent[] {
    if (!events) return [];
    return events.filter((event) => {
      if (event.isAllDay) return false; // Exclude all-day events
      const eventStartHour = event.dateFrom?.getHours();
      return eventStartHour === hour;
    });
  }

  function getEventTopPosition(event: CustomCalendarEvent): number {
    if (event.dateFrom) {
      return (event.dateFrom.getMinutes() / 60) * 40; // 40px ist die Höhe eines hour-blocks
    }
    return 0;
  }

  function getEventHeight(event: CustomCalendarEvent): number {
    if (event.dateFrom && event.dateTo) {
      const durationInHours =
        (event.dateTo.getTime() - event.dateFrom.getTime()) / (1000 * 60 * 60);
      return durationInHours * 40; // 40px ist die Höhe eines hour-blocks
    }
    return 40; // Standardhöhe, falls dateFrom oder dateTo nicht definiert sind
  }

  const handleSelectResource = (event: SelectChangeEvent) => {
    setResource(event.target.value as string);
  };

  return (
    <div className="calendar-details">
      <div className={"calendar-details-header"}>{parseDateToStringWithWrittenOutMonth(day)}</div>

      <FormControl size="small" style={{backgroundColor: "#4b5782", color: "white"}}>
        <InputLabel id="select-resource-lable" style={{fontSize: 13}}>Raum wählen</InputLabel>
        <Select
          labelId="select-resource-lable"
          id="select-resource"
          label="Raum"
          onChange={handleSelectResource}
          style={{height: 35, borderRadius: 10, backgroundColor: "#ffffff"}}
        >
          <MenuItem value={""}>Kein Raum</MenuItem>
          <MenuItem value={"room1"}>Saal 1</MenuItem>
          <MenuItem value={"room2"}>Nebenraum 1</MenuItem>
          <MenuItem value={"room3"}>Saal 2</MenuItem>
          <MenuItem value={"room4"}>Nebenraum 2</MenuItem>
          <MenuItem value={"room5"}>Saal 3</MenuItem>
          <MenuItem value={"room6"}>Nebenraum 3</MenuItem>
          <MenuItem value={"room7"}>Saal 4</MenuItem>
          <MenuItem value={"room8"}>Nebenraum 4</MenuItem>
          <MenuItem value={"room9"}>Besprechungsraum 2OG</MenuItem>
          <MenuItem value={"other"}>Sonstiges</MenuItem>
        </Select>
      </FormControl>

      {/* All Day events section */}
      <div className="all-day-section">
        <span style={{fontSize: 18}}>Ganztags: </span>
        {events && containsAllDayEvent(events) ? (
          events
            .filter((e) => e.isAllDay)
            .map((event) => (
              <div
                className={"all-day-event"}
                key={event.name}
                style={{ background: event.color }}
              >
                {event.name}
              </div>
            ))
        ) : (
          <div className="no-events" >-</div>
        )}
      </div>

      <div className="timeline">
        {hours.map((hour) => (
          <div className="hour-block" key={hour}>
            <div className="hour-label">{hour}:00</div>

            <div className="time-slots">
              {getEventsForHour(hour, events).map((event) => {
                const overlappingEvents = getOverlappingEvents(event, events);

                const eventWidthPercentage = 100 / overlappingEvents.length;
                const positionIndex = overlappingEvents.findIndex(
                  (e) => e.name === event.name
                );

                return (
                  <div
                    className="event"
                    key={event.name}
                    style={{
                      background: event.color,
                      top: `${getEventTopPosition(event)}px`,
                      height: `${getEventHeight(event)}px`,
                      width: `${eventWidthPercentage}%`,
                      left: `${eventWidthPercentage * positionIndex}%`,
                    }}
                  >
                    {event.name}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarDetails;
