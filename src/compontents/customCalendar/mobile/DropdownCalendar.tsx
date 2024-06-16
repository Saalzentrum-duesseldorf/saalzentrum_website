import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // default styles
import './DropdownCalendar.scss';
import { useSwipeable } from 'react-swipeable';

interface DropdownCalendarProps {
  onSelectDate: any;
  visible: boolean;
  value: Date;
}

const DropdownCalendar = (props: DropdownCalendarProps) => {


  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (props.visible) { // Only react to swipes if the calendar is visible
        const nextMonth = new Date(props.value.getFullYear(), props.value.getMonth() + 1);
        props.onSelectDate(nextMonth);
      }
    },
    onSwipedRight: () => {
      if (props.visible) {
        const prevMonth = new Date(props.value.getFullYear(), props.value.getMonth() - 1);
        props.onSelectDate(prevMonth);
      }
    },
    trackTouch: true,
    trackMouse: true,
    // @ts-ignore
    preventDefaultTouch: true  // This might be the correct replacement
  });

  return (
    <div className="dropdown-calendar-container" {...handlers}>
      {props.visible && (
        <Calendar
          onChange={props.onSelectDate}
          value={props.value}
          maxDetail="month"
          className="react-calendar"
        />
      )}
    </div>
  );
};

export default DropdownCalendar;
