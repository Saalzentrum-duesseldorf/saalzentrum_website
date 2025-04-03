import "./NewMobileCalendar.scss";
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
import MobileCalendarDetails from "../MobileCalendarDetails";
import SelectRoomDropDown from "../../selectRoom/SelectRoomDropDown";
import CalendarSkeleton from "./CalendarSkeleton";

const NewMobileCalendar = (props: MobileCalendarProps) => {
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

  const goToToday = () => {
    setSelectedDay(new Date());
    setCurrentMonth(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    );
  };

  const calendarWeeks = generateCalendarDays(
    currentMonth,
    selectedRoom,
    props.events
  );

  return (
    <div className="MobileCalendar">
      <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
        {/* Header with back button, day/month navigation */}
        <div className="sticky-header">
          <Row className="MobileCalendar-header">
            <Col xs="2" className="menu-icon">
              {selectedDay ? (
                <Button
                  className="nav-button back-button"
                  onClick={handleBackClick}
                >
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

            <Col>
              {/* Room selection dropdown */}
              <SelectRoomDropDown
                onRoomChange={setSelectedRoom}
                initialRoom={selectedRoom}
              />
            </Col>
          </Row>
        </div>
        {/* Scrollable Timeline */}
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
                        }`}
                        onClick={() => handleDayClick(day.date ?? null)}
                      >
                        <div className="day-number">{day.day}</div>
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
      </Container>
    </div>
  );
};

export default NewMobileCalendar;
