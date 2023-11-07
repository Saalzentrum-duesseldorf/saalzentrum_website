import { Button, Col, Row } from "reactstrap";
import "./MonthButtons.scss";

export interface MonthButtonsProps {
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

export default MonthButtons;
