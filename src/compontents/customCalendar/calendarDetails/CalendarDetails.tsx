
import './CalendarDetails.scss'
import { CustomCalendarDates } from "../CustomCalendar.tsx";


export interface CalendarDetailsProps {
   title: string
  dateDetails: CustomCalendarDates | null;

}


const CalendarDetails = ({ title, dateDetails }: CalendarDetailsProps) => {
  return (
    <div className="calendar-details">
      <h2>{title}</h2>
      {dateDetails ? (
        <div>
          <p>Name: {dateDetails.name}</p>
          <p>Description: {dateDetails.description}</p>
          <p>Date: {dateDetails.date.toDateString()}</p>
          <div style={{ background: dateDetails.color }} />
        </div>
      ) : (
        <p>No date selected</p>
      )}
    </div>
  );
}

export default CalendarDetails