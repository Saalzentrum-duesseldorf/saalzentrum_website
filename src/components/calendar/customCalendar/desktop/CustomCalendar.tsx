import "./CustomCalendar.scss";
import { useState } from "react";
import { Button, Col, Container, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import MonthButtons from "../../calendarComponents/monthButtons/MonthButtons.tsx";
import WeekView from "./weekView/WeekView.tsx";
import MonthWeekSwitch from "../../calendarComponents/switch/MonthWeekSwitch.tsx";
import MonthView from "./monthView/MonthView.tsx";
import {SelectChangeEvent} from "@mui/material";
import CalendarControls from "../../calendarComponents/calendarControls/CalendarControls.tsx";

export interface CustomCalendarEvent {
  eventId: string;
  date: Date;
  dateFrom?: Date;
  dateTo?: Date;
  isAllDay?: boolean;
  name: string;
  description: string;
  color: string;
  email?: string;
  location?: string;
}

export interface CustomCalendarProps {
  events: CustomCalendarEvent[];
}

const CustomCalendar = (props: CustomCalendarProps) => {
  const [isWeekView, setWeekView] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedResource, setSelectedResource] = useState<string>("");

  const goToCurrentWeek = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const weekStart = new Date(today);
    weekStart.setDate(diff);
    setCurrentWeekStart(weekStart);
  };

  // Week state management
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    const weekStart = new Date(today);
    weekStart.setDate(diff);
    return weekStart;
  });

  const handleResourceChange = (event: SelectChangeEvent) => {
    setSelectedResource(event.target.value as string);
  };

  // Format week range for header
  const formatWeekRange = () => {
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(currentWeekStart.getDate() + 6);

    const startFormat = currentWeekStart.toLocaleDateString("de-DE", {
      day: "numeric",
      month: "short",
    });
    const endFormat = weekEnd.toLocaleDateString("de-DE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    return `${startFormat} - ${endFormat}`;
  };

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

  // Month navigation handlers

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

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const formatMonthYear = () => {
    return currentMonth.toLocaleDateString("de-DE", {
      month: "long",
      year: "numeric",
    });
  };


  return (
    <div className="Calendar">
      <Container style={{ maxWidth: "80%" }}>
        {/* Week navigation header */}
        <Row className="calendar-header">
          <Col md={1} className="navigation-col">
            <Button className="nav-button" onClick={ isWeekView ? goToPreviousWeek : goToPreviousMonth}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </Button>
          </Col>

          <Col md={6} className="week-title-col">
            <h2 className="week-title">{isWeekView ? formatWeekRange() : formatMonthYear()}</h2>
          </Col>

          <Col md={1} className="navigation-col">
            <Button className="nav-button" onClick={isWeekView ? goToNextWeek : goToNextMonth}>
              <FontAwesomeIcon icon={faChevronRight} />
            </Button>
          </Col>
          <Col md={1} className="Calendar-switch-container">
            <MonthWeekSwitch
              isWeekView={isWeekView}
              setWeekView={setWeekView}
            />
          </Col>
        </Row>

        <Row style={{ marginBottom: "10px", justifyContent: "center" }}>
          {isWeekView ? (
            <>
              <CalendarControls selectedResource={selectedResource} onResourceChange={handleResourceChange} onGoToCurrentWeek={goToCurrentWeek} />
            </>
          ) : (
            <MonthButtons
              setCurrentMonth={setCurrentMonth}
              currentMonth={currentMonth}
            />
          )}
        </Row>

        <Row>
          {isWeekView ? (
            <WeekView
              events={props.events}
              currentWeekStart={currentWeekStart}
              setCurrentWeekStart={setCurrentWeekStart}
              selectedResource={selectedResource}
              setSelectedResource={setSelectedResource}
            />
          ) : (
            <MonthView 
              events={props.events} 
              currentMonth={currentMonth} 
              onNavigateToToday={goToToday}
            />
          )}
        </Row>
      </Container>
    </div>
  );
};

export default CustomCalendar;
