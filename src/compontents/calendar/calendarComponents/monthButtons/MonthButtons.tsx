import { Button, Col, Row } from "reactstrap";
import "./MonthButtons.scss";

export interface MonthButtonsProps {
  setCurrentMonth: (date: Date) => void;
  currentMonth: Date;
}

const MonthButtons: React.FC<MonthButtonsProps> = ({
                                                     setCurrentMonth,
                                                     currentMonth
                                                   }) => {
  const months = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember"
  ];
  return (
    <Row className={"Calendar-month-button-Container"}>
      {months.map((month, index) => (
        <Col key={index}>
          <Button
            key={index}
            className={"Calendar-month-button"}

            style={{

              color: `${
                currentMonth.getMonth() === index ? "#5977d7" : "#afaeae"
              }`
            }}

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

export default MonthButtons;
