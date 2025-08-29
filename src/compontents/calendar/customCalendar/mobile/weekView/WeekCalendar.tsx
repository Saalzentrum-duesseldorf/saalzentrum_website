import "./WeekCalendar.scss";
import { useState, useEffect, TouchEvent, useRef } from "react";
import { Button, Col, Container, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import {
  areDatesEqual,
  formatDateForHeader,
  getNextDay,
  getPreviousDay,
  MobileCalendarEvent,
  MobileCalendarProps,
  scrollTo8AM,
  filterEventsByRoom,
} from "../../../../../utils";
import MobileCalendarDetails from "../dayView/MobileCalendarDetails";
import SelectRoomDropDown from "../selectRoom/SelectRoomDropDown";
import CalendarSkeleton from "../skeleton/CalendarSkeleton";

/**
 * Week calendar component that provides weekly view with day selection and swipe navigation
 * Features: week navigation, day selection within week, room filtering, responsive design
 */

interface WeekCalendarProps extends MobileCalendarProps {
  selectedRoom: string;
  currentWeekStart: Date;}

const WeekCalendar = (props: WeekCalendarProps) => {
  // Calendar state management
  
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedDateDetails, setSelectedDateDetails] = useState<MobileCalendarEvent[]>([]);

  // Animation and loading states
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Touch/swipe functionality
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to 8 AM when a day is selected
  useEffect(() => {
    if (selectedDay) {
      setTimeout(() => scrollTo8AM(scrollContainerRef), 10);
    }
  }, [selectedDay]);

  // Load events for the selected day
  useEffect(() => {
    if (selectedDay) {
      const events = props.events.filter((event) =>
        areDatesEqual(event.date, selectedDay)
      );
      setSelectedDateDetails(events);
    }
  }, [selectedDay, props.events]);


  // Touch handlers for swipe navigation between days
  const handleTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || isAnimating || !selectedDay) return;
  
    const distance = touchStart - touchEnd;
    const isSwipeLeft = distance > minSwipeDistance;
    const isSwipeRight = distance < -minSwipeDistance;
  
    if (isSwipeLeft || isSwipeRight) {
      setIsAnimating(true);
      setIsLoading(true);
  
      setTimeout(() => {
        const newSelectedDay = isSwipeLeft
          ? getNextDay(selectedDay)
          : getPreviousDay(selectedDay);
  
        setSelectedDay(newSelectedDay);
        setIsAnimating(false);
        setIsLoading(false);
      }, 500);
    }
  };


  // Event handlers
  const handleDayClick = (day: Date) => {
    setSelectedDay(new Date(day));
    setSelectedRoom(""); // Reset room selection when changing days
  };

  // Helper function to check if a date is today
  const isToday = (date: Date): boolean => {
    return areDatesEqual(date, new Date());
  };

  // Generate week days (Monday to Sunday)
  const generateWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(props.currentWeekStart);
      day.setDate(props.currentWeekStart.getDate() + i);
      

      const filteredEvents = filterEventsByRoom(props.selectedRoom, props.events);

      // Get events for this day
      const dayEvents = filteredEvents.filter(event => 
        areDatesEqual(event.date, day) && 
        (selectedRoom === "" || event.location === selectedRoom)
      );
      
      days.push({
        date: day,
        events: dayEvents,
        isToday: isToday(day)
      });
    }
    return days;
  };

  const weekDays = generateWeekDays();

  return (
    <div className="WeekCalendar">
      <Container fluid className="week-calendar-container">
        {/* Week view content */}
        <div className="scrollable-body" ref={scrollContainerRef}>
            <div className="week-view-container">
              

              {/* Week grid */}
              <div className="week-grid">
                {/* Weekday headers */}
                <div className="weekday-headers">
                  {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((dayName, index) => (
                    <div key={dayName} className="weekday-header">
                      <div className="weekday-name">{dayName}</div>
                      <div className="weekday-date">
                        {weekDays[index].date.getDate()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Week days with events */}
                <div className="week-days">
                  {weekDays.map((day, index) => (
                    <div
                      key={`week-day-${index}`}
                      className={`week-day ${day.isToday ? "today" : ""}`}
                      onClick={() => handleDayClick(day.date)}
                    >
                      <div className="day-events">
                        
                        {day.events.length === 0 ? (
                          <div className="no-events">Keine Termine</div>
                        ) : (
                          day.events.map((event) => (
                            <div
                              key={`event-${event.eventId}`}
                              className="event-item"
                              style={{ backgroundColor: event.color }}
                            >
                              <div className="event-name">
                                {event.categoryNumber && `#${event.categoryNumber} `}
                                {event.name}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
        </div>
      </Container>
    </div>
  );
};

export default WeekCalendar;