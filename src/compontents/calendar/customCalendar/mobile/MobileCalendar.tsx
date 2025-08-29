import "./MobileCalendar.scss";
import { useState, useEffect, TouchEvent, useRef } from "react";
import { Button, Col, Container, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
  areDatesEqual,
  formatDateForHeader,
  generateCalendarDays,
  getNextDay,
  getPreviousDay,
  MobileCalendarEvent,
  MobileCalendarProps,
  scrollTo8AM,
} from "../../../../utils";
import MobileCalendarDetails from "./dayView/MobileCalendarDetails";
import SelectRoomDropDown from "./selectRoom/SelectRoomDropDown";
import CalendarSkeleton from "./skeleton/CalendarSkeleton";
import WeekCalendar from "./weekView/WeekCalendar";
import { Switch } from "@mui/material";


const MobileCalendar = (props: MobileCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedDateDetails, setSelectedDateDetails] = useState<
    MobileCalendarEvent[]
  >([]);

  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedDay) {
      setTimeout(() => scrollTo8AM(scrollContainerRef), 10); // Delay to ensure DOM is rendered
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

  // For swipe functionality
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Swipe handlers
  const handleTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || isAnimating) return;
  
    const distance = touchStart - touchEnd;
    const isSwipeLeft = distance > minSwipeDistance;
    const isSwipeRight = distance < -minSwipeDistance;
  
    if (isSwipeLeft || isSwipeRight) {
      setIsAnimating(true);
      setIsLoading(true);
  
      setTimeout(() => {
        const newSelectedDay = isSwipeLeft
          ? getNextDay(selectedDay!)
          : getPreviousDay(selectedDay!);
  
        setSelectedDay(newSelectedDay);
        setIsAnimating(false);
        setIsLoading(false);
      }, 500);
    }
  };
  

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // New day navigation functions
  const goToPreviousDay = () =>
    selectedDay &&
    setSelectedDay(new Date(selectedDay.setDate(selectedDay.getDate() - 1)));

  const goToNextDay = () =>
    selectedDay &&
    setSelectedDay(new Date(selectedDay.setDate(selectedDay.getDate() + 1)));

  const handleDayClick = (day: Date | null) => {
    day && setSelectedDay(new Date(day));
    setSelectedRoom("");
  };

  const handleBackClick = () => setSelectedDay(null);
  const handleBackToHomePageClick = () => {
    window.location.href = "/";
  };

  const goToToday = () => {
    setSelectedDay(new Date());
    setCurrentMonth(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    );
  };

  // Helper function to check if a date is today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return areDatesEqual(date, today);
  };

  const calendarWeeks = generateCalendarDays(
    currentMonth,
    selectedRoom,
    props.events
  );

  // Week navigation handlers
  const goToPreviousWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newWeekStart);
  };

  const goToNextWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newWeekStart);
  };

  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
    return new Date(today.setDate(diff));
  });

   // Format week range for header
   const formatWeekRange = () => {
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(currentWeekStart.getDate() + 6);
    
    const startFormat = currentWeekStart.toLocaleDateString('de-DE', { 
      day: 'numeric', 
      month: 'numeric' 
    });
    const endFormat = weekEnd.toLocaleDateString('de-DE', { 
      day: 'numeric', 
      month: 'numeric', 
      year: 'numeric' 
    });
    
    return `${startFormat} - ${endFormat}`;
  };

  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.valueOf() - firstDayOfYear.valueOf()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  const formatWeekRangeKW = () => {
    const weekNumber = getWeekNumber(currentWeekStart);
    return `KW ${weekNumber}`;
  }

  // Back button component to switch between month and day view and go back to Homepage
  const BackButton = () => {
    if (selectedDay) {
      return (
        <Button className="nav-button back-button" onClick={handleBackClick}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </Button>
      );
    }
    return (
      <Button className="nav-button back-button" onClick={handleBackToHomePageClick}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </Button>
    );
  };

  const [isWeekView, setWeekView] = useState(false);

  const MonthWeekSwitch = () => {
    return (
      <Switch
        checked={isWeekView}
        onChange={() => setWeekView(!isWeekView)}
        color="primary"
        inputProps={{ 'aria-label': 'controlled' }}
      />
    );
  }
  
  const MonthView = () => {
    return (
      <div className="scrollable-body" ref={scrollContainerRef}>
      {selectedDay ? (
        <div
        className="calendar-details-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {isLoading ? (
         <CalendarSkeleton />
        ) : (
          <MobileCalendarDetails
            events={selectedDateDetails}
            day={selectedDay!}
            room={selectedRoom}
          />
        )}
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
                    className={`calendar-day ${
                      day.monthOffset !== 0 ? "other-month" : ""
                    }
                    ${day.date && isToday(day.date) ? "today" : ""}
                    `}
                    onClick={() => handleDayClick(day.date ?? null)}
                  >
                    <div className={`day-number`}>{day.day}</div>
                    <div className="day-events">
                      {day.events.map((event) => (
                        <div
                          key={`event-${event.eventId}`}
                          className="event-item"
                          style={{ backgroundColor: event.color }}
                        >
                          {event.categoryNumber &&
                            `#${event.categoryNumber} `}
                          {event.name}
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
    </div>
    );
  };
  

  return (
    <div className="MobileCalendar">
      <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
        {/* Header with back button, day/month navigation */}
        <div className="sticky-header">
          <Row className="MobileCalendar-header">
            <Col xs="2" className="menu-icon">
              <BackButton />
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

                {/* switch header if isWeekView */
                  isWeekView ? (
                   
                  <>
                    <Button className="nav-button" onClick={goToPreviousWeek}>
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </Button>
                    <span className="month-title">
                      {formatWeekRangeKW()}
                    </span>
                    <Button className="nav-button" onClick={goToNextWeek}>
                      <FontAwesomeIcon icon={faChevronRight} />
                    </Button>
                  </>

                  ) : (<> <Button className="nav-button" onClick={goToPreviousMonth}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </Button>
                  <span className="month-title">
                    {currentMonth.toLocaleString("de-DE", { month: "long" })}
                  </span>
                  <Button className="nav-button" onClick={goToNextMonth}>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </Button>

                  </>)
                }
                <MonthWeekSwitch />
                </>
              )}
            </Col>

            <Col>
              {/* Room selection dropdown */}
              <SelectRoomDropDown
                onRoomChange={setSelectedRoom}
                initialRoom={selectedRoom}
              />
            </Col>
          </Row>
        </div>
        

        {isWeekView ? (
          <WeekCalendar events={props.events} selectedRoom={selectedRoom} currentWeekStart={currentWeekStart} />
        ) : (
          <MonthView />
        )}

      </Container>
    </div>
  );
};

export default MobileCalendar;
