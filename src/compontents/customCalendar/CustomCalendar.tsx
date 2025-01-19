import "./CustomCalendar.scss";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "reactstrap";
import CalendarDetails from "./calendarDetails/CalendarDetails.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { areDatesEqual, truncateText } from "../../utils.ts";
import MonthButtons from "./monthButtons/MonthButtons.tsx";

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

  function getEventsForDay(day: { day: number; monthOffset: number }): CustomCalendarEvent[] {
    const dateToCompare = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + day.monthOffset,
      day.day
    );

    return props.events
      .filter(event => areDatesEqual(event.date, dateToCompare))
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

  return (
    <div className={"Calendar"}>
      <Container>
        <Row className={"Calendar-header-container"}>
          <Col className={"Calendar-button-container"} md={1}>
            <Button
              className={"Calendar-button Calendar-button-left"}
              onClick={() =>
                setCurrentMonth(
                  new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
                )
              }
            >
              <FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: 25 }} />
            </Button>
          </Col>
          <Col md={3}>
            <h1 className="Calendar-header-title">
              {currentMonth.toLocaleString("default", { month: "long" })}{" "}
              {currentMonth.getFullYear()}
            </h1>
          </Col>
          <Col className={"Calendar-button-container"} md={1}>
            <Button
              className={"Calendar-button Calendar-button-right"}
              onClick={() =>
                setCurrentMonth(
                  new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))
                )
              }
            >
              <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: 25 }} />
            </Button>
          </Col>
        </Row>

        <Row>
          <MonthButtons
            setCurrentMonth={setCurrentMonth}
            currentMonth={currentMonth}
          />
        </Row>

        <Row>
          <Col md={10} className={"Calendar-Grid-Container"}>
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
                                  : 1
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
                                          : "#e7e7e7"
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
                                        </div>
                                      )
                                    )}
                                  {dayEvents.length > 5 && (
                                    <div className={"Calendar-day-body"}>
                                      + {dayEvents.length - 5} more
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
          </Col>

          <Col md={2}>
            <CalendarDetails events={selectedDateDetails} day={selectedDate} />
          </Col>
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
    "Sonntag"
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
