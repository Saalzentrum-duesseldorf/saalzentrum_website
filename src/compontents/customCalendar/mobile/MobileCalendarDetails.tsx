import "./MobileCalendarDetails.scss";
import React, { useState } from "react";
import {
  containsAllDayEvent,
   getEventHeight, getEventsForHour, getEventTopPosition,
  getOverlappingEvents,
} from "../../../utils.ts";
import { CustomCalendarEvent } from "../CustomCalendar.tsx";
import EventPopover from "../calendarDetails/EventPopover.tsx";

export interface CalendarDetailsProps {
  events: CustomCalendarEvent[] | null;
  day: Date;
  room: string;
}

const MobileCalendarDetails = ({ events, room }: CalendarDetailsProps) => {


  const filterEvents = (resource: string): CustomCalendarEvent[] | null => {
    const result = events?.filter((event) => event.location === resource);

    if (resource != "" && result) {
      return result;
    }
    return events;
  };

  events = filterEvents(room);

  const hours = Array.from({ length: 24 }, (_, i) => i);


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
                const overlappingEvents = getOverlappingEvents(event, events).sort((a, b) => a.name.localeCompare(b.name));

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
