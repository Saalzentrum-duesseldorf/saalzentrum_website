import "./MobileCalendar.scss";
import { useEffect, useState } from "react";
import MobileCalendarDetails from "./MobileCalendarDetails.tsx";
import { useSwipeable } from "react-swipeable";
import { areDatesEqual, parseDateToStringWithWrittenOutMonth, showCollectorDialog } from "../../../utils.ts";
import { CustomCalendarEvent, CustomCalendarProps } from "../CustomCalendar.tsx";
import DropdownCalendar from "./DropdownCalendar.tsx";
import { Link } from "react-router-dom";

const MobileCalendar = (props: CustomCalendarProps) => {
  const [currentDay, setCurrentDay] = useState(new Date());
  const [transitionClass, setTransitionClass] = useState("");
  const [selectedDateDetails, setSelectedDateDetails] = useState<
    CustomCalendarEvent[] | null
  >(null);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (!visible) {
        setTransitionClass("mobile-calendar-details-exit-to-left");
        updateDay(1);
      }
    },
    onSwipedRight: () => {
      if (!visible) {
        setTransitionClass("mobile-calendar-details-exit-to-right");
        updateDay(-1);
      }
    },
    onTransitionEnd: () => {
      setTransitionClass("");
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const updateEventsForDay = (day: Date) => {
    const eventsForDay = props.events.filter((event) =>
      areDatesEqual(event.date, day)
    );
    setSelectedDateDetails(eventsForDay || null);
  };

  useEffect(() => {
    if (props.events.length > 0) {
      updateEventsForDay(currentDay); // Only call on significant changes
    }
  }, [props.events, currentDay]); // Ensure dependencies are correctly listed


  const updateDay = (offset: number) => {
    requestAnimationFrame(() => {
      const newDay = new Date(
        currentDay.getFullYear(),
        currentDay.getMonth(),
        currentDay.getDate() + offset
      );
      setCurrentDay(newDay);
      updateEventsForDay(newDay);
      setTransitionClass(offset > 0 ? "mobile-calendar-details-enter-from-right" : "mobile-calendar-details-enter-from-left");
    });
  };

  const handleDateChange = (newDate: Date) => {
    setCurrentDay(newDate);
    updateEventsForDay(newDate);
  };
  const [visible, setVisible] = useState(false);


  return (
    <div {...swipeHandlers} className="mobile-calendar">

      <div className={transitionClass} onTransitionEnd={() => setTransitionClass("")}>
        <div className="mobile-calendar-details-header">

          <div className={'container center burgerMenu'}>
            <nav role="navigation">
              <div id="menuToggle">
                <input type="checkbox" />

                <span></span>
                <span></span>
                <span></span>

                <ul id="menu">
                  <Link to="/">
                    <li>Startseite</li>
                  </Link>
                  <Link to="/calendar">
                    <li>Kalender</li>
                  </Link>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
                  {/* @ts-ignore*/}
                  <Link onClick={showCollectorDialog}>
                    <li>Tickets</li>
                  </Link>
                </ul>
              </div>
            </nav>
          </div>

          {parseDateToStringWithWrittenOutMonth(currentDay)} {currentDay.toLocaleDateString('de-DE', { weekday: 'long' })}
          <button onClick={() => setVisible(!visible)} className="calendar-toggle">
            <span className="calendar-toggle-icon">{visible ? '▲' : '▼'}</span>
          </button>
          <DropdownCalendar onSelectDate={handleDateChange} visible={visible} value={currentDay} />

        </div>
        <MobileCalendarDetails events={selectedDateDetails} day={currentDay}/>


      </div>
    </div>
  );
};

export default MobileCalendar;