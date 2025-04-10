import "./CustomCalendar.scss";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "reactstrap";
import CalendarDetails from "./calendarDetails/CalendarDetails.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { areDatesEqual, truncateText } from "../../utils.ts";
import MonthButtons from "./monthButtons/MonthButtons.tsx";
import WeekButtons from "./monthButtons/WeekButtons.tsx";

// Definiere ViewType als Union Type
type ViewType = "month" | "week";

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
  const [viewType, setViewType] = useState<ViewType>("month");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number>();
  const [selectedDateDetails, setSelectedDateDetails] = useState<
    CustomCalendarEvent[] | null
  >(null);

  const [selectedMonth, setSelectedMonth] = useState<number>();

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

  const weeks: { day: number; monthOffset: number }[][] = [];
  let week: { day: number; monthOffset: number }[] = [];

  const lastDayOfPrevMonth: number = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    0
  ).getDate();

  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
  let dayFromLastMonth = lastDayOfPrevMonth - adjustedFirstDay + 1;

  // Start the first week with empty days until the first day of the month
  for (let i = 0; i < adjustedFirstDay; i++) {
    week.push({ day: dayFromLastMonth++, monthOffset: -1 });
  }

  // Add the days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    week.push({ day, monthOffset: 0 });
    if (week.length === 7) {
      weeks.push([...week]);
      week = [];
    }
  }

  let dayFromNextMonth = 1;
  while (week.length < 7) {
    week.push({ day: dayFromNextMonth++, monthOffset: 1 });
  }

  if (week.length > 0) {
    weeks.push(week);
  }

  const handleDateClick = (day: number, monthOffset: number) => {
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + monthOffset,
      day
    );

    setSelectedDate(selectedDate);
    setSelectedDay(day);
    setSelectedMonth(currentMonth.getMonth() + monthOffset);

    const clickedDateDetails = props.events.filter((event) =>
      areDatesEqual(event.date, selectedDate)
    );

    setSelectedDateDetails(clickedDateDetails || null);
  };

  function getEventsForDay(day: {
    day: number;
    monthOffset: number;
  }): CustomCalendarEvent[] {
    const dateToCompare = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + day.monthOffset,
      day.day
    );

    return props.events
      .filter((event) => areDatesEqual(event.date, dateToCompare))
      .sort((a, b) => {
        // Zuerst nach "All Day" sortieren: true (1) sollte nach oben, false (-1) nach unten
        if (a.isAllDay !== b.isAllDay) {
          return a.isAllDay ? -1 : 1;
        }
        // Danach alphabetisch nach dem Namen sortieren
        return a.name.localeCompare(b.name);
      });
  }

  useEffect(() => {
    const today = new Date();
    setSelectedDate(today);
    setSelectedDay(today.getDate());
    setSelectedMonth(today.getMonth());

    const todayEvents = props.events.filter((event) =>
      areDatesEqual(event.date, today)
    );
    setSelectedDateDetails(todayEvents || null);
  }, [props.events]);

  // Hilfsfunktionen für die Wochenansicht
  const getWeekStartDate = (date: Date): Date => {
    const day = date.getDay();
    // In JavaScript ist Sonntag 0, wir wollen aber Montag als ersten Tag
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(new Date(date).setDate(diff));
  };

  const getWeekRangeText = (date: Date): string => {
    const weekStart = getWeekStartDate(date);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return `${weekStart.getDate()}. - ${weekEnd.getDate()}. ${weekEnd.toLocaleString(
      "de-DE",
      { month: "long" }
    )} ${weekEnd.getFullYear()}`;
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  // Hilfsfunktion zur Berechnung der Ereignishöhe basierend auf der Dauer
  const calculateEventHeight = (event: CustomCalendarEvent): number => {
    if (event.isAllDay) return 30;

    const startTime = event.dateFrom || event.date;
    const endTime =
      event.dateTo ||
      new Date(new Date(startTime).setHours(startTime.getHours() + 1));

    // Berechne die Dauer in Minuten und konvertiere zu Pixeln (1 Minute = 1 Pixel)
    return (endTime.getTime() - startTime.getTime()) / (1000 * 60);
  };

  // Dropdown-Komponente für die Ansichtsauswahl
  const ViewTypeSelector = () => {
    return (
      <div className="Calendar-view-selector">
        <select
          value={viewType}
          onChange={(e) => setViewType(e.target.value as ViewType)}
          className="view-type-dropdown"
        >
          <option value="month">Monatsansicht</option>
          <option value="week">Wochenansicht</option>
        </select>
      </div>
    );
  };

  // Funktion zur Berechnung der Kalenderwoche
  const getWeekNumber = (date: Date): number => {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  };

  // Komponente für die Wochenansicht
  const WeekView = () => {
    const weekStart = getWeekStartDate(selectedDate);
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
      <div className="Calendar-week-view">
        {/* Wochentage-Header */}
        <div className="Calendar-week-header">
          {weekDays.map((day, index) => (
            <div key={`weekday-${index}`} className="Calendar-week-day-header">
              <div className="weekday-name">
                {day.toLocaleString("de-DE", { weekday: "short" })}
              </div>
              <div className="weekday-date">{day.getDate()}</div>
            </div>
          ))}
        </div>

        {/* Zeitraster mit Ereignissen */}
        <div className="Calendar-week-grid">
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
                  const dayEvents = props.events.filter(
                    (event) =>
                      areDatesEqual(event.date, day) &&
                      new Date(event.dateFrom || event.date).getHours() === hour
                  );

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
                            height: event.isAllDay
                              ? "30px"
                              : `${calculateEventHeight(event)}px`,
                          }}
                        >
                          {truncateText(event.name, 20)}
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

  return (
    <div className={"Calendar"}>
      <Container>
        <Row className={"Calendar-header-container"}>
          <Col className={"Calendar-button-container"} md={1}>
            <Button
              className={"Calendar-button Calendar-button-left"}
              onClick={() => {
                if (viewType === "month") {
                  setCurrentMonth(
                    new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
                  );
                } else {
                  goToPreviousWeek();
                }
              }}
            >
              <FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: 25 }} />
            </Button>
          </Col>
          <Col md={3}>
            <h1 className="Calendar-header-title">
              {viewType === "month"
                ? `${currentMonth.toLocaleString("default", {
                    month: "long",
                  })} ${currentMonth.getFullYear()}`
                : `KW ${getWeekNumber(
                    selectedDate
                  )} / ${selectedDate.getFullYear()}`}
            </h1>
          </Col>
          <Col className={"Calendar-button-container"} md={1}>
            <Button
              className={"Calendar-button Calendar-button-right"}
              onClick={() => {
                if (viewType === "month") {
                  setCurrentMonth(
                    new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))
                  );
                } else {
                  goToNextWeek();
                }
              }}
            >
              <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: 25 }} />
            </Button>
          </Col>
          <Col md={2}>
            <ViewTypeSelector />
          </Col>
        </Row>
        <Row>
          {viewType === "month" ? (
            <MonthButtons
              setCurrentMonth={setCurrentMonth}
              currentMonth={currentMonth}
            />
          ) : (
            <WeekButtons
              setCurrentWeek={setSelectedDate}
              currentWeek={selectedDate}
            />
          )}
        </Row>

        <Row>
          <Col
            md={viewType === "month" ? 10 : 12}
            className={"Calendar-Grid-Container"}
          >
            {viewType === "month" ? (
              <div>
                <div className="Calendar-day-names">
                  <WeekDays />
                </div>
                {weeks.map(
                  (
                    week: { day: number; monthOffset: number }[],
                    index: number
                  ) => (
                    <div className="Calendar-days" key={index}>
                      {week.map(
                        (
                          day: { day: number; monthOffset: number },
                          index: number
                        ) => {
                          const dayEvents = getEventsForDay(day);
                          return (
                            <div
                              key={index}
                              className="Calendar-day"
                              style={{
                                background:
                                  day.monthOffset == 0 ? "#ffffff" : "#f3f3f3",
                                borderColor:
                                  day.day === selectedDay &&
                                  currentMonth.getMonth() + day.monthOffset ===
                                    selectedMonth
                                    ? "#9da4bd"
                                    : "#d7d7d7",
                                borderWidth:
                                  day.day === selectedDay &&
                                  currentMonth.getMonth() + day.monthOffset ===
                                    selectedMonth
                                    ? 3
                                    : 1,
                              }}
                              onClick={() =>
                                handleDateClick(day.day, day.monthOffset)
                              }
                            >
                              <Container className={"Calendar-day-container"}>
                                <Row>
                                  <Col>
                                    <div
                                      className={"Calendar-day-header"}
                                      style={{
                                        background:
                                          day.monthOffset == 0
                                            ? "#d7d7d7"
                                            : "#e7e7e7",
                                      }}
                                    >
                                      {day.day !== 0 ? day.day : ""}
                                    </div>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col>
                                    {dayEvents
                                      .slice(0, 5)
                                      .map(
                                        (
                                          _event: CustomCalendarEvent,
                                          index: number
                                        ) => (
                                          <div
                                            className={"Calendar-day-body"}
                                            key={index}
                                            style={{ background: _event.color }}
                                          >
                                            {truncateText(_event.name, 15)}
                                            <br />
                                            {_event.dateFrom && (
                                              <>
                                                {new Date(
                                                  _event.dateFrom
                                                ).toLocaleTimeString("de-DE", {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                })}
                                                {" - "}
                                                {new Date(
                                                  _event.dateTo ||
                                                    new Date(
                                                      _event.dateFrom
                                                    ).setHours(
                                                      new Date(
                                                        _event.dateFrom
                                                      ).getHours() + 1
                                                    )
                                                ).toLocaleTimeString("de-DE", {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                })}
                                              </>
                                            )}
                                          </div>
                                        )
                                      )}
                                    {dayEvents.length > 5 && (
                                      <div
                                        className={"Calendar-day-body"}
                                        style={{
                                          background: "rgba(155,155,155,0.58)",
                                        }}
                                      >
                                        + {dayEvents.length - 5} mehr
                                      </div>
                                    )}
                                  </Col>
                                </Row>
                              </Container>
                            </div>
                          );
                        }
                      )}
                    </div>
                  )
                )}
              </div>
            ) : (
              <WeekView />
            )}
          </Col>

          {viewType === "month" && (
            <Col md={2}>
              <CalendarDetails
                events={selectedDateDetails}
                day={selectedDate}
              />
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
};

const WeekDays = () => {
  const weekDays = [
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
    "Sonntag",
  ];
  return (
    <>
      {weekDays.map((weekDay, index) => (
        <div key={index} className="Calendar-week-day">
          {weekDay}
        </div>
      ))}
    </>
  );
};

export default CustomCalendar;
