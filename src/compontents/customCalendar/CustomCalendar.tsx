import "./CustomCalendar.scss";
import { useEffect, useState } from "react";
import { Col, Row, Container, Button } from "reactstrap";
import CalendarDetails from "./calendarDetails/CalendarDetails.tsx";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';


export interface CustomCalendarEvent {
  eventId: string;
  date: Date;
  dateFrom?: Date;
  dateTo?: Date;
  isAllDay?: boolean;
  name: string;
  description: string;
  color: string;
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

  useEffect(() => {
    console.log(selectedDate);
    console.log(selectedDateDetails);
  }, [selectedDate, selectedDateDetails]);

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

  function areDatesEqual(date1: Date, date2: Date) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
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

          <Col md={8}>
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
                      ) => (
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
                                {props.events.map(
                                  (
                                    _event: CustomCalendarEvent,
                                    index: number
                                  ) => {
                                    if (
                                      areDatesEqual(
                                        new Date(
                                          currentMonth.getFullYear(),
                                          currentMonth.getMonth(),
                                          day.day
                                        ),
                                        _event.date
                                      )
                                    ) {
                                      return (
                                        <div
                                          className={"Calendar-day-body"}
                                          key={index}
                                          style={{ background: _event.color }}
                                        >
                                          {_event.name}
                                        </div>
                                      );
                                    }
                                    return null;
                                  }
                                )}
                              </Col>
                            </Row>
                          </Container>
                        </div>
                      )
                    )}
                  </div>
                )
              )}
            </div>
          </Col>

          <Button
            className={"Calendar-button Calendar-button-right"}
            onClick={() =>
              setCurrentMonth(
                new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))
              )
            }
          >
           <FontAwesomeIcon icon={faArrowRight}/>
          </Button>

          <Col md={4} style={{paddingLeft: 40}}>
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

const parseDateToReadableString = (date: Date) => {
  return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
};

interface MonthButtonsProps {
  setCurrentMonth: (date: Date) => void;
  currentMonth: Date;
}

const MonthButtons: React.FC<MonthButtonsProps> = ({
  setCurrentMonth,
  currentMonth,
}) => {
  const months = [
    "Jan",
    "Feb",
    "Mär",
    "Apr",
    "Mai",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Dez",
  ];
  return (
    <Row>
      {months.map((month, index) => (
        <Col md={1} key={index}>
          <Button
            key={index}
            className={"Calendar-month-button"}
            onClick={() =>
              setCurrentMonth(new Date(currentMonth.setMonth(index)))
            }
          >
            {month}
          </Button>
        </Col>
      ))}
    </Row>
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
