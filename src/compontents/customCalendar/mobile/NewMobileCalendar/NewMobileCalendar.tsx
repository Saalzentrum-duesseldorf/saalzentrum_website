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

// Definiere ViewType als Union Type
type ViewType = "day" | "week" | "month";

const NewMobileCalendar = (props: MobileCalendarProps) => {
  const [viewType, setViewType] = useState<ViewType>("month");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedDateDetails, setSelectedDateDetails] = useState<
    MobileCalendarEvent[]
  >([]);

  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
        if (viewType === "day" && selectedDay) {
          const newSelectedDay = isSwipeLeft
            ? getNextDay(selectedDay)
            : getPreviousDay(selectedDay);
          setSelectedDay(newSelectedDay);
        } else if (viewType === "week") {
          const newDate = new Date(currentDate);
          newDate.setDate(newDate.getDate() + (isSwipeLeft ? 7 : -7));
          setCurrentDate(newDate);
        }
        setIsAnimating(false);
        setIsLoading(false);
      }, 500);
    }
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToPreviousDay = () => {
    if (selectedDay) {
      setSelectedDay(new Date(selectedDay.setDate(selectedDay.getDate() - 1)));
    }
  };

  const goToNextDay = () => {
    if (selectedDay) {
      setSelectedDay(new Date(selectedDay.setDate(selectedDay.getDate() + 1)));
    }
  };

  const handleDayClick = (day: Date | null) => {
    if (day) {
      setSelectedDay(new Date(day));
      setViewType("day");
    }
  };

  const handleBackClick = () => {
    setSelectedDay(null);
    setViewType("month");
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    if (viewType === "day") {
      setSelectedDay(today);
    }
  };

  // Hilfsfunktion für die Wochenansicht
  const getWeekStartDate = (date: Date): Date => {
    const day = date.getDay();
    // In JavaScript ist Sonntag 0, wir wollen aber Montag als ersten Tag
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(new Date(date).setDate(diff));
  };

  const calendarWeeks = generateCalendarDays(
    currentDate,
    selectedRoom,
    props.events
  );

  // Komponente für die Wochenansicht
  const WeekView = () => {
    const weekStart = getWeekStartDate(new Date(currentDate));
    const weekDays = Array(7)
      .fill(0)
      .map((_, i) => {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + i);
        return day;
      });

    // Zeitslots von 0 bis 23 Uhr
    const timeSlots = Array(24)
      .fill(0)
      .map((_, i) => i);

    return (
      <div
        className="week-view"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Wochentage-Header */}
        <div className="week-header">
          {weekDays.map((day, index) => (
            <div key={`weekday-${index}`} className="week-day-header">
              <div className="weekday-name">
                {day.toLocaleString("de-DE", { weekday: "short" })}
              </div>
              <div className="weekday-date">{day.getDate()}</div>
            </div>
          ))}
        </div>

        {/* Zeitraster mit Ereignissen */}
        <div className="week-grid">
          <div className="time-column">
            {timeSlots.map((hour) => (
              <div key={`time-${hour}`} className="time-slot">
                {hour}:00
              </div>
            ))}
          </div>

          <div className="days-container">
            {weekDays.map((day, dayIndex) => (
              <div key={`day-column-${dayIndex}`} className="day-column">
                {timeSlots.map((hour) => {
                  // Filtere Ereignisse für diesen Tag und diese Stunde
                  const dayEvents = props.events.filter((event) => {
                    const eventDate = new Date(event.date);
                    const eventStartHour = new Date(event.startTime).getHours();
                    const eventEndHour = new Date(event.endTime).getHours();

                    // Überprüfen, ob das Ereignis am aktuellen Tag stattfindet
                    const isSameDay = areDatesEqual(eventDate, day);

                    // Überprüfen, ob die Stunde innerhalb des Ereigniszeitraums liegt
                    const isWithinHour =
                      hour >= eventStartHour && hour < eventEndHour;

                    return isSameDay && isWithinHour;
                  });

                  return (
                    <div
                      key={`slot-${dayIndex}-${hour}`}
                      className="week-time-slot"
                    >
                      {dayEvents.map((event) => (
                        <div
                          key={`event-${event.eventId}`}
                          className="week-event"
                          style={{
                            backgroundColor: event.color,
                            height: `${
                              ((new Date(event.endTime).getTime() -
                                new Date(event.startTime).getTime()) /
                                (1000 * 60)) *
                              1
                            }px`,
                          }}
                        >
                          {event.categoryNumber && `#${event.categoryNumber} `}
                          {event.name}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const ViewTypeTabs = () => {
    return (
      <div className="view-type-tabs">
        <div 
          className={`view-tab ${viewType === "day" ? "active" : ""}`}
          onClick={() => setViewType("day")}
        >
          Tag
        </div>
        <div 
          className={`view-tab ${viewType === "week" ? "active" : ""}`}
          onClick={() => setViewType("week")}
        >
          Woche
        </div>
        <div 
          className={`view-tab ${viewType === "month" ? "active" : ""}`}
          onClick={() => setViewType("month")}
        >
          Monat
        </div>
      </div>
    );
  };

  // Render-Funktion für die Navigation basierend auf dem viewType
  const renderNavigation = () => {
    if (viewType === "day" || selectedDay) {
      return (
        <div className="day-navigation">
          <Button className="nav-button" onClick={goToPreviousDay}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </Button>
          <span className="day-title">
            {formatDateForHeader(selectedDay || currentDate)}
          </span>
          <Button className="nav-button" onClick={goToNextDay}>
            <FontAwesomeIcon icon={faChevronRight} />
          </Button>
          <Button className="today-Button" onClick={goToToday}>
            Heute
          </Button>
        </div>
      );
    } else if (viewType === "week") {
      const weekStart = getWeekStartDate(new Date(currentDate));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      return (
        <div className="week-navigation">
          <Button className="nav-button" onClick={goToPreviousWeek}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </Button>
          <span className="week-title">
            {`${weekStart.getDate()}. - ${weekEnd.getDate()}. ${weekEnd.toLocaleString(
              "de-DE",
              { month: "long" }
            )}`}
          </span>
          <Button className="nav-button" onClick={goToNextWeek}>
            <FontAwesomeIcon icon={faChevronRight} />
          </Button>
          <Button className="today-Button" onClick={goToToday}>
            Heute
          </Button>
        </div>
      );
    } else {
      return (
        <div className="month-navigation-container">
          <Button className="nav-button" onClick={goToPreviousMonth}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </Button>
          <span className="month-title">
            {currentDate.toLocaleString("de-DE", { month: "long" })}
          </span>
          <Button className="nav-button" onClick={goToNextMonth}>
            <FontAwesomeIcon icon={faChevronRight} />
          </Button>
          <Button className="today-Button" onClick={goToToday}>
            Heute
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="MobileCalendar">
      <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
        {/* Header with back button, day/month navigation */}
        <div className="sticky-header">
          <Row className="MobileCalendar-header">
            <Col xs="2" className="menu-icon">
              {selectedDay || viewType === "week" ? (
                <Button
                  className="nav-button back-button"
                  onClick={handleBackClick}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </Button>
              ) : (
                <Button
                  className="nav-button back-button"
                  onClick={() => {
                    window.location.href = "/";
                  }}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </Button>
              )}
            </Col>
            <Col xs="8" className="month-navigation text-center">
              {renderNavigation()}
            </Col>
            <Col xs="2" className="room-selection p-0">
              {/* Room selection dropdown */}
              <SelectRoomDropDown
                onRoomChange={setSelectedRoom}
                initialRoom=""
              />
            </Col>
          </Row>

          {/* View type selector */}
          <ViewTypeTabs />
        </div>

        {/* Scrollable Content */}
        <div className="scrollable-body" ref={scrollContainerRef}>
          {viewType === "day" || selectedDay ? (
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
                  day={selectedDay || currentDate}
                  room={selectedRoom}
                />
              )}
            </div>
          ) : viewType === "week" ? (
            <WeekView />
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
