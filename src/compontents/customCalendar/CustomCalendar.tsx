import "./CustomCalendar.scss";
import { useState } from "react";
import { Col, Row, Container, Button } from "reactstrap";
import CalendarDetails from "./calendarDetails/CalendarDetails.tsx";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import {
  areDatesEqual,
  parseDateToReadableString,
  truncateText,
} from "../../utils.ts";
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

  let dayFromLastMonth = lastDayOfPrevMonth - firstDay + 1;

  // Start the first week with empty days until the first day of the month
  for (let i = 0; i < firstDay; i++) {
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

  function getEventsForDay(day: number): CustomCalendarEvent[] {
    return props.events.filter((event) =>
      areDatesEqual(
        event.date,
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      )
    );
  }

  return (
    <div className={"Calendar"}>
      <Container>
        <Row>
          <h1 style={{ fontSize: 40 }} className="Calendar-header">
            {currentMonth.toLocaleString("default", { month: "long" })}{" "}
            {currentMonth.getFullYear()}
          </h1>
        </Row>

        <Row>
          <Col md={1}>
            <Row>
              <Button
                className={"Calendar-button Calendar-button-left"}
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
                  )
                }
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </Button>

              <Button
                className={"Calendar-button Calendar-button-right"}
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))
                  )
                }
              >
                <FontAwesomeIcon icon={faArrowRight} />
              </Button>
            </Row>
          </Col>

          <Col md={9}>
            <MonthButtons
              setCurrentMonth={setCurrentMonth}
              currentMonth={currentMonth}
            />

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
                        const dayEvents = getEventsForDay(day.day);
                        return (
                          <div
                            key={index}
                            className="Calendar-day"
                            style={{
                              borderColor:
                                day.day === selectedDay &&
                                currentMonth.getMonth() + day.monthOffset ===
                                  selectedMonth
                                  ? "red"
                                  : "grey",
                            }}
                            onClick={() =>
                              handleDateClick(day.day, day.monthOffset)
                            }
                          >
                            <Container className={"Calendar-day-container"}>
                              <Row>
                                <Col>
                                  <div className={"Calendar-day-header"}>
                                    {day.day !== 0 ? day.day : ""}
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col>
                                  {dayEvents
                                    .slice(0, 2)
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
                                  {dayEvents.length > 2 && (
                                    <div
                                      className={
                                        "Calendar-day-body More-Indicator"
                                      }
                                    >
                                      +{dayEvents.length - 2} more
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
            <CalendarDetails
              title={"Kalender details"}
              events={selectedDateDetails}
              day={parseDateToReadableString(selectedDate)}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};
const WeekDays = () => {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return (
    <>
      {weekDays.map((weekDay, index) => (
        <div key={index} className="Calendar-week-day">
          {" "}
          {weekDay}{" "}
        </div>
      ))}
    </>
  );
};

export default CustomCalendar;
