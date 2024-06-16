import "./MobileCalendarDetails.scss";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React, { useState } from "react";
import {
  containsAllDayEvent,
   getEventHeight, getEventsForHour, getEventTopPosition,
  getOverlappingEvents,
   Resources
} from "../../../utils.ts";
import { CustomCalendarEvent } from "../CustomCalendar.tsx";
import EventPopover from "../calendarDetails/EventPopover.tsx";

export interface CalendarDetailsProps {
  events: CustomCalendarEvent[] | null;
  day: Date;
}

const MobileCalendarDetails = ({ events }: CalendarDetailsProps) => {


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

  const handleSelectResource = (event: SelectChangeEvent) => {
    setResource(event.target.value as string);
  };

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CustomCalendarEvent | null>(null);

  const handleEventClick = (event: React.MouseEvent<HTMLElement>, eventData: CustomCalendarEvent) => {
    setAnchorEl(event.currentTarget);
    setSelectedEvent(eventData);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedEvent(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div className="mobile-calendar-details">

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
                onClick={(e) => handleEventClick(e, event)}
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
            <div className="hour-label">{hour}</div>

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
                      whiteSpace: 'nowrap',  // Fügt hinzu, dass der Text nicht umbrechen soll
                      overflow: 'hidden',    // Versteckt Text, der über den Container hinausgeht
                      textOverflow: 'ellipsis' // Fügt "..." am Ende des Textes ein, falls er abgeschnitten wird
                    }}
                    onClick={(e) => handleEventClick(e, event)}
                  >
                    {event.name}
                    {/*<br/>*/}
                    {/*{prettifyRoomKey(findRoomByEmail(event.email))}*/}

                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <EventPopover event={selectedEvent} anchorEl={anchorEl} open={open} onClose={handleClose} />

    </div>
  );
};

export default MobileCalendarDetails;
