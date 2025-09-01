import "./WeekView.scss";
import { useState, useEffect } from "react";
import { Button, Col, Container, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import {
  areDatesEqual,
  getEventsForHour,
  getEventHeight,
  getEventTopPosition,
  getOverlappingEvents,
} from "../../../../../utils";

import EventPopover from "../calendarDetails/EventPopover";

import { CustomCalendarEvent } from "../CustomCalendar";

/**
 * Desktop week view component - displays 7 days side by side like Google Calendar
 * Features: week navigation, room filtering, timeline view with events, event popover
 */

export interface WeekViewProps {
  events: CustomCalendarEvent[];
  currentWeekStart: Date;
  setCurrentWeekStart: (date: Date) => void;
  selectedResource: string;
  setSelectedResource: (resource: string) => void;
}

const WeekView = (props: WeekViewProps) => {
  // Event popover state
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedEvent, setSelectedEvent] =
    useState<CustomCalendarEvent | null>(null);

  // Generate week days (Monday to Sunday)
  const generateWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(props.currentWeekStart);
      day.setDate(props.currentWeekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = generateWeekDays();

  // Filter events by selected resource
  const filterEventsByResource = (
    events: CustomCalendarEvent[]
  ): CustomCalendarEvent[] => {
    if (props.selectedResource === "") return events;
    return events.filter((event) => event.location === props.selectedResource);
  };

  // Get events for a specific day
  const getEventsForDay = (day: Date): CustomCalendarEvent[] => {
    const filteredEvents = filterEventsByResource(props.events);
    return filteredEvents.filter((event) => areDatesEqual(event.date, day));
  };

  // Event handlers
  const handleEventClick = (
    event: React.MouseEvent<HTMLElement>,
    eventData: CustomCalendarEvent
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedEvent(eventData);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedEvent(null);
  };

  // Helper function to check if a date is today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return areDatesEqual(date, today);
  };

  // Generate hours array (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Auto-scroll to 9 AM on component mount
  useEffect(() => {
    const scrollToBusinessHours = () => {
      const timelineContainer = document.querySelector(".timeline-container");
      if (timelineContainer) {
        // Scroll to 9 AM (9 * 60px per hour)
        timelineContainer.scrollTop = 9 * 60;
      }
    };

    // Small delay to ensure DOM is rendered
    setTimeout(scrollToBusinessHours, 100);
  }, [props.currentWeekStart]);

  return (
    <div className="WeekView">
      <Container fluid>
        {/* Week grid with headers and scrollable timeline */}
        <div className="week-grid">
          {/* Fixed headers section */}
          <div className="week-headers">
            {/* Time column header */}
            <div className="time-header">Zeit</div>

            {/* Day headers with all-day events */}
            {weekDays.map((day, dayIndex) => {
              const dayEvents = getEventsForDay(day);
              const dayName = day.toLocaleDateString("de-DE", {
                weekday: "short",
              });
              const dayNumber = day.getDate();

              return (
                <div key={dayIndex} className="day-header-column">
                  {/* Day name and number */}
                  <div className={`day-header ${isToday(day) ? "today" : ""}`}>
                    <div className="day-name">{dayName}</div>
                    <div className="day-number">{dayNumber}</div>
                  </div>

                  {/* All-day events */}
                  <div className="all-day-events">
                    {dayEvents
                      .filter((event) => event.isAllDay)
                      .map((event) => (
                        <div
                          key={event.eventId}
                          className="all-day-event"
                          style={{ backgroundColor: event.color }}
                          onClick={(e) => handleEventClick(e, event)}
                        >
                          {event.name}
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scrollable timeline container */}
          <div className="timeline-container">
            {/* Hour labels */}
            <div className="hours-column">
              {hours.map((hour) => (
                <div key={hour} className="hour-label">
                  {hour.toString().padStart(2, "0")}:00
                </div>
              ))}
            </div>

            {/* Days timeline */}
            <div className="days-timeline">
              {weekDays.map((day, dayIndex) => {
                const dayEvents = getEventsForDay(day);

                return (
                  <div key={dayIndex} className="day-timeline-column">
                    {hours.map((hour) => {
                      const hourEvents = getEventsForHour(hour, dayEvents);

                      return (
                        <div key={hour} className="hour-slot">
                          <div className="hour-events">
                            {hourEvents.map((event) => {
                              const overlappingEvents = getOverlappingEvents(
                                event,
                                dayEvents
                              );
                              const eventWidthPercentage =
                                100 / overlappingEvents.length;
                              const positionIndex = overlappingEvents.findIndex(
                                (e) => e.eventId === event.eventId
                              );

                              return (
                                <div
                                  key={event.eventId}
                                  className="timed-event"
                                  style={{
                                    backgroundColor: event.color,
                                    top: `${getEventTopPosition(event, 80)}px`,
                                    height: `${getEventHeight(event, 80)}px`,
                                    width: `${eventWidthPercentage}%`,
                                    left: `${
                                      eventWidthPercentage * positionIndex
                                    }%`,
                                  }}
                                  onClick={(e) => handleEventClick(e, event)}
                                >
                                  <div className="event-content">
                                    <div className="event-name">
                                      {event.name}
                                    </div>
                                    {event.location && (
                                      <div className="event-location">
                                        {event.location}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>

      {/* Event details popover */}
      <EventPopover
        event={selectedEvent}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handlePopoverClose}
      />
    </div>
  );
};

export default WeekView;
