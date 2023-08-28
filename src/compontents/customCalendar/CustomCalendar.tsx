import "./CustomCalendar.scss";
import { useState } from "react";
import { Col, Row, Container, Button } from "reactstrap";
import { Dialog } from "@mui/material";

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

    <Button className={"Calendar-month-button"} onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(0)))}>Jan</Button>
    <Button className={"Calendar-month-button"} onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(1)))}>Feb</Button>
    <Button className={"Calendar-month-button"} onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(2)))}>Mär</Button>
    <Button className={"Calendar-month-button"} onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(3)))}>Apr</Button>
    <Button className={"Calendar-month-button"} onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(4)))}>Mai</Button>
    <Button className={"Calendar-month-button"} onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(5)))}>Jun</Button>
    <Button className={"Calendar-month-button"} onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(6)))}>Jul</Button>
    <Button className={"Calendar-month-button"} onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(7)))}>Aug</Button>
    <Button className={"Calendar-month-button"} onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(8)))}>Sep</Button>
    <Button className={"Calendar-month-button"} onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(9)))}>Okt</Button>
    <Button className={"Calendar-month-button"} onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(10)))}>Nov</Button>
    <Button className={"Calendar-month-button"} onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(11)))}>Dez</Button>

      <div>
        <div className="Calendar-day-names">
          <div className="Calendar-week-day"> Sun</div>
          <div className="Calendar-week-day"> Mon</div>
          <div className="Calendar-week-day"> Tue</div>
          <div className="Calendar-week-day"> Wed</div>
          <div className="Calendar-week-day"> Thu</div>
          <div className="Calendar-week-day"> Fri</div>
          <div className="Calendar-week-day"> Sat</div>
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
                            onClick={() => {setShowDialog(true)}}
                          >
                            {new Date(
                              currentMonth.getFullYear(),
                              currentMonth.getMonth(),
                              day).toString() === _date.date.toString() ? _date.name : ""}
                             <Dialog style={{background: "none"}} open={showDialog}> {
                               _date.name + "  " + _date.description
                             } </Dialog>
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
    </div>
  );
};

export default CustomCalendar;
