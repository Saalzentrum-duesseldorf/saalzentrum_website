import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // default styles
import './DropdownCalendar.scss';
import { useSwipeable } from 'react-swipeable';

const DropdownCalendar = ({ onSelectDate, visible, value  }) => {

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (visible) { // Only react to swipes if the calendar is visible
        const nextMonth = new Date(value.getFullYear(), value.getMonth() + 1);
        onSelectDate(nextMonth);
      }
    },
    onSwipedRight: () => {
      if (visible) {
        const prevMonth = new Date(value.getFullYear(), value.getMonth() - 1);
        onSelectDate(prevMonth);
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  return (
    <div className="dropdown-calendar-container" {...handlers}>
      {visible && (
        <Calendar
          onChange={onSelectDate}
          value={value}
          maxDetail="month"
          className="react-calendar"
        />
      )}
    </div>
  );
};

export default DropdownCalendar;
