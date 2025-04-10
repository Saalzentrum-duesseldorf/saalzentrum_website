import { Button, Col, Row } from "reactstrap";
import "./WeekButtons.scss";

export interface WeekButtonsProps {
  setCurrentWeek: (date: Date) => void;
  currentWeek: Date;
}

const WeekButtons: React.FC<WeekButtonsProps> = ({
  setCurrentWeek,
  currentWeek,
}) => {
  // Funktion, um die Kalenderwochen des aktuellen Jahres zu berechnen
  const getWeeksInYear = (year: number) => {
    const weeks: Date[] = [];
    const firstDayOfYear = new Date(year, 0, 1);
    let currentWeekStart = new Date(firstDayOfYear);

    // Gehe durch das Jahr und füge jede Woche hinzu
    while (currentWeekStart.getFullYear() === year) {
      weeks.push(new Date(currentWeekStart));
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }

    return weeks;
  };

  const weeks = getWeeksInYear(currentWeek.getFullYear());

  return (
    <Row className={"Calendar-week-button-Container"}>
      {weeks.map((weekStart, index) => (
        <Col key={index}>
          <Button
            key={index}
            className={"Calendar-week-button"}
            style={{
              color: `${
                currentWeek.getTime() === weekStart.getTime()
                  ? "#5977d7"
                  : "#afaeae"
              }`,
            }}
            onClick={() => setCurrentWeek(new Date(weekStart))}
          >
            KW {index + 1}
          </Button>
        </Col>
      ))}
    </Row>
  );
};

export default WeekButtons;