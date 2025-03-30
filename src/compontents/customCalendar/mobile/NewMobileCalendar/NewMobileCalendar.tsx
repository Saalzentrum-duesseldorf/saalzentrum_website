import "./NewMobileCalendar.scss";
import { useState, useEffect, TouchEvent } from "react";
import { Button, Col, Container, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { areDatesEqual } from "../../../../utils";
import MobileCalendarDetails from "../MobileCalendarDetails";
import SelectRoomDropDown from "../../selectRoom/SelectRoomDropDown";
import { CustomCalendarEvent } from "../../CustomCalendar.tsx"


export interface MobileCalendarEvent {
  eventId: string;
  date: Date;           // Startzeit des Termins
  endTime?: Date;       // Endzeit des Termins (optional)
  isAllDay?: boolean;   // Ganztägiger Termin
  name: string;
  description: string;
  color: string;
  location?: string;
  categoryNumber?: string;
}

export interface MobileCalendarProps {
  events: MobileCalendarEvent[];
}

const NewMobileCalendar = (props: MobileCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isSwipingLeft, setIsSwipingLeft] = useState(false);
  const [isSwipingRight, setIsSwipingRight] = useState(false);
  const [selectedDateDetails, setSelectedDateDetails] = useState<MobileCalendarEvent[]>([]);
  
  // For swipe functionality
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;


  const daysInMonth: number = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDay: number = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  // Swipe handlers
  const handleTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const getPreviousDay = (date: Date) => {
    const previousDay = new Date(date);
    previousDay.setDate(previousDay.getDate() - 1);
    return previousDay;
  };

  const getNextDay = (date: Date) => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
  };

  const getPreviousDayEvents = () => {
    if (!selectedDay) return [];
    return props.events.filter(event => areDatesEqual(event.date, getPreviousDay(selectedDay)));
  };

  const getNextDayEvents = () => {
    if (!selectedDay) return [];
    return props.events.filter(event => areDatesEqual(event.date, getNextDay(selectedDay)));
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isSwipeLeft = distance > minSwipeDistance;
    const isSwipeRight = distance < -minSwipeDistance;
    
    // Animation-Flags setzen
    setIsSwipingLeft(isSwipeLeft);
    setIsSwipingRight(isSwipeRight);
    
    // Verzögerung hinzufügen, um sicherzustellen, dass die Animation abgeschlossen ist
    if (isSwipeLeft) {
      setTimeout(() => {
        goToNextDay();
        // Animation zurücksetzen
        setIsSwipingLeft(false);
      }, 300); // Anpassen an deine Animationsdauer
    }
    
    if (isSwipeRight) {
      setTimeout(() => {
        goToPreviousDay();
        // Animation zurücksetzen
        setIsSwipingRight(false);
      }, 300); // Anpassen an deine Animationsdauer
    }
  };

  // Generate calendar weeks array
  const generateCalendarDays = () => {
    const weeks = [];
    let week = [];
    
    // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday as first day
    
    // Add days from previous month
    const lastDayOfPrevMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      0
    ).getDate();
    
    for (let i = 0; i < firstDayOfWeek; i++) {
      week.push({
        day: lastDayOfPrevMonth - firstDayOfWeek + i + 1,
        monthOffset: -1,
        events: []
      });
    }

    const filterEvents = (resource: string): MobileCalendarEvent[] => {

      const result = props.events?.filter((event) => event.location === resource);
  
      if (resource != "" && result) {
        return result;
      }
      return props.events;
    };
  
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dayEvents = filterEvents(selectedRoom).filter(event => areDatesEqual(event.date, date));
      
      week.push({
        day,
        monthOffset: 0,
        events: dayEvents,
        date
      });
      
      if (week.length === 7) {
        weeks.push([...week]);
        week = [];
      }
    }
    
    // Add days from next month
    let nextMonthDay = 1;
    while (week.length < 7 && week.length > 0) {
      week.push({
        day: nextMonthDay++,
        monthOffset: 1,
        events: [],
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, nextMonthDay - 1)
      });
    }
    
    if (week.length > 0) {
      weeks.push(week);
    }
    
    return weeks;
  };

  const calendarWeeks = generateCalendarDays();

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // New day navigation functions
  const goToPreviousDay = () => {
    if (selectedDay) {
      const previousDay = new Date(selectedDay);
      previousDay.setDate(previousDay.getDate() - 1);
      setSelectedDay(previousDay);
    }
  };

  const goToNextDay = () => {
    if (selectedDay) {
      const nextDay = new Date(selectedDay);
      nextDay.setDate(nextDay.getDate() + 1);
      setSelectedDay(nextDay);
    }
  };

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    setSelectedRoom("");
  };

  const handleBackClick = () => {
    setSelectedDay(null);
  };
  
  // Load events for the selected day
  useEffect(() => {
    if (selectedDay) {
      const events = props.events.filter(event => areDatesEqual(event.date, selectedDay));
      setSelectedDateDetails(events);
    } 
  }, [selectedDay, props.events]);

  // Format date to display in header (e.g., "Mo, 16. März")
  const formatDateForHeader = (date: Date) => {
    const dayOfWeek = date.toLocaleString("de-DE", { weekday: "short" });
    const day = date.getDate();
    const month = date.toLocaleString("de-DE", { month: "long" });
    return `${dayOfWeek}, ${day}. ${month}`;
  };

  const goToToday = () => {
    const today = new Date();
    setSelectedDay(today);
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  };  


  return (
    <div className="MobileCalendar"> 
      <Container fluid style={{paddingLeft: 0, paddingRight: 0}}>
        {/* Header with back button, day/month navigation */}
        <Row className="MobileCalendar-header">
          <Col xs="2" className="menu-icon">
            {selectedDay ? (
              <Button className="nav-button back-button" onClick={handleBackClick}>
                <FontAwesomeIcon icon={faArrowLeft} />
              </Button>
            ) : (
              <div className="hamburger-icon">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
            )}
          </Col>
          <Col xs="8" className="month-navigation">
            {selectedDay ? (
              <div className="day-navigation">
                <Button className="nav-button" onClick={goToPreviousDay}>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </Button>
                <span className="day-title">
                  {formatDateForHeader(selectedDay)}
                </span>
                <Button className="nav-button" onClick={goToNextDay}>
                  <FontAwesomeIcon icon={faChevronRight} />
                </Button>
                <Button className="today-Button" onClick={goToToday}>
                  Heute
                </Button>
              </div>
            ) : (
              <>
                <Button className="nav-button" onClick={goToPreviousMonth}>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </Button>
                <span className="month-title">
                  {currentMonth.toLocaleString("de-DE", { month: "long" })}
                </span>
                <Button className="nav-button" onClick={goToNextMonth}>
                  <FontAwesomeIcon icon={faChevronRight} />
                </Button>
              </>
            )}
          </Col>
        </Row>

        {/* Room selection dropdown */}
        <SelectRoomDropDown onRoomChange={setSelectedRoom} initialRoom={selectedRoom} />

        {selectedDay ? (
            <div 
              className="calendar-details-container"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className={`preload-container ${isSwipingLeft ? 'swiping-left' : ''} ${isSwipingRight ? 'swiping-right' : ''}`}>
                {/* Vorheriger Tag */}
                <div className="day-container">
                  <MobileCalendarDetails 
                    events={getPreviousDayEvents()} 
                    day={getPreviousDay(selectedDay)} 
                    room={selectedRoom}
                  />
                </div>
                
                {/* Aktueller Tag */}
                <div className="day-container">
                  <MobileCalendarDetails 
                    events={selectedDateDetails} 
                    day={selectedDay} 
                    room={selectedRoom}
                  />
                </div>
                
                {/* Nächster Tag */}
                <div className="day-container">
                  <MobileCalendarDetails 
                    events={getNextDayEvents()} 
                    day={getNextDay(selectedDay)} 
                    room={selectedRoom}
                  />
                </div>
              </div>
            </div>
          ) : (
          <>
            {/* Calendar days of week header */}
            <div className="calendar-grid">
              <Row className="calendar-weekdays">
                <Col className="weekday-cell">Mo</Col>
                <Col className="weekday-cell">Di</Col>
                <Col className="weekday-cell">Mi</Col>
                <Col className="weekday-cell">Do</Col>
                <Col className="weekday-cell">Fr</Col>
                <Col className="weekday-cell">Sa</Col>
                <Col className="weekday-cell">So</Col>
              </Row>

              {/* Calendar grid */}
              {calendarWeeks.map((week, weekIndex) => (
                <Row key={`week-${weekIndex}`} className="calendar-week">
                  {week.map((day, dayIndex) => (
                    <Col 
                      key={`day-${weekIndex}-${dayIndex}`} 
                      className={`calendar-day ${day.monthOffset !== 0 ? 'other-month' : ''}`}
                      onClick={() => handleDayClick(day.date)}
                    >
                      <div className="day-number">{day.day}</div>
                      <div className="day-events">
                        {day.events.map((event) => (
                          <div 
                            key={`event-${event.eventId}`} 
                            className="event-item"
                            style={{ backgroundColor: event.color }}
                          >
                            {event.categoryNumber && `#${event.categoryNumber} `}{event.name}
                          </div>
                        ))}
                      </div>
                    </Col>
                  ))}
                </Row>
              ))}
            </div>
          </>
        )}
      </Container>
    </div>
  );
};

export default NewMobileCalendar;