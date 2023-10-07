import "./CustomCalendar.scss";
import { useState } from "react";
import { Col, Row, Container, Button } from "reactstrap";
import { Dialog } from "@mui/material";
import CalendarDetails from "./calendarDetails/CalendarDetails.tsx";

export interface CustomCalendarDates {
  date: Date;
  name: string;
  description: string;
  color: string;
}

export interface CustomCalendarProps {
  dates: CustomCalendarDates[];
}

const CustomCalendar = (props: CustomCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showDialog, setShowDialog] = useState(false);

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

  const weeks: number[][] = [];
  let week: number[] = [];

  // Start the first week with empty days until the first day of the month
  for (let i = 0; i < firstDay; i++) {
    week.push(0);
  }

  // Add the days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);

    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  // Add any remaining empty days to the last week
  while (week.length < 7) {
    week.push(0);
  }
  weeks.push(week);

  return (
    <div className={"Calendar"}>
      <h1 className="Calendar-header">
        {currentMonth.toLocaleString("default", { month: "long" })}{" "}
        {currentMonth.getFullYear()}
      </h1>
      <div className="Calendar-button-container">
        <Button
          className={"Calendar-button"}
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
            )
          }
        >
          Vorheriger Monat
        </Button>

        <Button
          className={"Calendar-button"}
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))
            )
          }
        >
          Nächster Monat
        </Button>
      </div>

      <MonthButtons
        setCurrentMonth={setCurrentMonth}
        currentMonth={currentMonth}
      />

      <div>
        <div className="Calendar-day-names">
          <WeekDays />
        </div>
        {weeks.map((week: number[], index: number) => (
          <div className="Calendar-days" key={index}>
            {week.map((day: number, index: number) => (
              <div key={index} className="Calendar-day">
                <Container className={"Calendar-day-container"}>
                  <Row>
                    <Col>
                      <div className={"Calendar-day-header"}>
                        {day !== 0 ? day : ""}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      {props.dates.map(
                        (_date: CustomCalendarDates, index: number) => (
                          <div
                            className={"Calendar-day-body"}
                            key={index}
                            style={{ background: _date.color }}
                            onClick={() => {
                              setShowDialog(true);
                            }}
                          >
                            {new Date(
                              currentMonth.getFullYear(),
                              currentMonth.getMonth(),
                              day
                            ).toString() === _date.date.toString()
                              ? _date.name
                              : ""}
                            <Dialog
                              style={{ background: "none" }}
                              open={showDialog}
                            >
                              {" "}
                              {_date.name + " " + _date.description}{" "}
                            </Dialog>
                          </div>
                        )
                      )}
                    </Col>
                  </Row>
                </Container>
              </div>
            ))}
          </div>
        ))}
      </div>
      <CalendarDetails title={"Kalender details"} />
    </div>
  );
};

const MonthButtons = (setCurrentMonth: any, currentMonth: Date) => {
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
    <>
      {months.map((month, index) => (
        <Button
          key={index}
          className={"Calendar-month-button"}
          onClick={() =>
            setCurrentMonth(new Date(currentMonth.setMonth(index)))
          }
        >
          {month}
        </Button>
      ))}
    </>
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
