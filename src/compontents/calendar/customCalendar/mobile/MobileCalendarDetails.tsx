import "./MobileCalendarDetails.scss";
import React, { useState, useEffect, useRef } from "react";
import {
  containsAllDayEvent,
  getEventHeight, getEventsForHour, getEventTopPosition,
  getOverlappingEvents,
} from "../../../../utils";
import { CustomCalendarEvent } from "../desktop/CustomCalendar.tsx";
import EventPopover from "../calendarDetails/EventPopover.tsx";

export interface CalendarDetailsProps {
  events: CustomCalendarEvent[] | null;
  day: Date;
  room: string;
}

const MobileCalendarDetails = ({ events, room }: CalendarDetailsProps) => {
  const timelineRef = useRef<HTMLDivElement>(null);

  const filterEvents = (resource: string): CustomCalendarEvent[] | null => {
    const result = events?.filter((event) => event.location === resource);

    if (resource != "" && result) {
      return result;
    }
    return events;
  };

  events = filterEvents(room);

  // Volle 24 Stunden anzeigen
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

  // Scroll zur 8-Uhr-Position beim Laden
  useEffect(() => {
    if (timelineRef.current) {
      // Höhe eines Stundenblockes berechnen
      const hourBlockHeight = 60;
      // Zu 8 Uhr scrollen
      timelineRef.current.scrollTop = hourBlockHeight * 8;
    }
  }, []);

  const open = Boolean(anchorEl);

  return (
    <div className="mobile-calendar-details">
      {/* Fixed All Day events section */}
       <div className="header-container">
        <div className="all-day-section">
          <span style={{fontSize: 16}}>Ganztags: </span>
          {events && containsAllDayEvent(events) ? (
            events
              .filter((e) => e.isAllDay)
              .map((event) => (
                <div
                  className="all-day-event"
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
      </div>

      {/* Scrollable timeline section */}
      <div className="timeline-scroll-container" ref={timelineRef}>
        <div className="timeline">
          {hours.map((hour) => (
            <div 
              className="hour-block" 
              key={hour}
              style={{ height: "80px" }}
            >
              <div className="hour-label">{hour}:00</div>

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
                        top: `${getEventTopPosition(event, 80)}px`,
                        height: `${getEventHeight(event, 80)}px`,
                        width: `${eventWidthPercentage}%`,
                        left: `${eventWidthPercentage * positionIndex}%`,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        padding: '4px',
                      }}
                      onClick={(e) => handleEventClick(e, event)}
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
      <EventPopover event={selectedEvent} anchorEl={anchorEl} open={open} onClose={handleClose} />
    </div>
  );
};

export default MobileCalendarDetails;