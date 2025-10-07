import "./MonthView.scss";
import { useEffect, useState, useMemo, useCallback } from "react";
import { CustomCalendarProps, CustomCalendarEvent } from "../CustomCalendar.tsx";
import CalendarDetails from "../calendarDetails/CalendarDetails.tsx";
import { Col, Container, Row } from "reactstrap";
import { areDatesEqual, truncateText } from "../../../../../utils.ts";

export interface MonthViewProps extends CustomCalendarProps {
  currentMonth: Date;
  onNavigateToToday?: () => void;
}

/**
 * Represents a day in the calendar grid with its position relative to the current month
 */
interface CalendarDay {
  day: number;
  monthOffset: number; // -1: previous month, 0: current month, 1: next month
}

/**
 * MonthView component displays a calendar month view with event details
 * Features:
 * - Interactive day selection
 * - Event display with color coding
 * - Overflow handling for days with many events
 * - Previous/next month day display
 */
const MonthView = (props: MonthViewProps) => {
  // State for selected date and its details
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number>();
  const [selectedDateDetails, setSelectedDateDetails] = useState<
    CustomCalendarEvent[] | null
  >(null);
  const [selectedMonth, setSelectedMonth] = useState<number>();

  /**
   * Handles clicking on a calendar day
   * Updates selected date and filters events for that day
   */
  const handleDateClick = useCallback(
    (day: number, monthOffset: number) => {
      const clickedDate = new Date(
        props.currentMonth.getFullYear(),
        props.currentMonth.getMonth() + monthOffset,
        day
      );

      setSelectedDate(clickedDate);
      setSelectedDay(day);
      setSelectedMonth(props.currentMonth.getMonth() + monthOffset);

      // Filter events for the clicked date
      const clickedDateEvents = props.events.filter((event) =>
        areDatesEqual(event.date, clickedDate)
      );

      setSelectedDateDetails(clickedDateEvents || null);
    },
    [props.currentMonth, props.events]
  );

  /**
   * Generates the calendar grid structure
   * Memoized to avoid recalculation on every render
   */
  const calendarWeeks = useMemo(() => {
    const daysInMonth = new Date(
      props.currentMonth.getFullYear(),
      props.currentMonth.getMonth() + 1,
      0
    ).getDate();

    const firstDay = new Date(
      props.currentMonth.getFullYear(),
      props.currentMonth.getMonth(),
      1
    ).getDay();

    const lastDayOfPrevMonth = new Date(
      props.currentMonth.getFullYear(),
      props.currentMonth.getMonth(),
      0
    ).getDate();

    const weeks: CalendarDay[][] = [];
    let currentWeek: CalendarDay[] = [];

    // Adjust first day: Convert Sunday (0) to Monday-based week (Monday = 0, Sunday = 6)
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    let dayFromPrevMonth = lastDayOfPrevMonth - adjustedFirstDay + 1;

    // Add days from previous month to fill the first week
    for (let i = 0; i < adjustedFirstDay; i++) {
      currentWeek.push({ day: dayFromPrevMonth++, monthOffset: -1 });
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push({ day, monthOffset: 0 });

      // Start new week when current week is full
      if (currentWeek.length === 7) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    }

    // Fill remaining days with next month's days
    let dayFromNextMonth = 1;
    while (currentWeek.length < 7) {
      currentWeek.push({ day: dayFromNextMonth++, monthOffset: 1 });
    }

    // Add the final week if it has any days
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  }, [props.currentMonth]);

  /**
   * Gets and sorts events for a specific calendar day
   * Memoized to avoid filtering and sorting on every render
   */
  const getEventsForDay = useCallback(
    (calendarDay: CalendarDay): CustomCalendarEvent[] => {
      const targetDate = new Date(
        props.currentMonth.getFullYear(),
        props.currentMonth.getMonth() + calendarDay.monthOffset,
        calendarDay.day
      );

      return props.events
        .filter((event) => areDatesEqual(event.date, targetDate))
        .sort((a, b) => {
          // Sort all-day events first, then by name
          if (a.isAllDay !== b.isAllDay) {
            return a.isAllDay ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        });
    },
    [props.currentMonth, props.events]
  );

  /**
   * Determines if a day should be highlighted as selected
   */
  const isDaySelected = useCallback(
    (calendarDay: CalendarDay): boolean => {
      return (
        calendarDay.day === selectedDay &&
        props.currentMonth.getMonth() + calendarDay.monthOffset ===
          selectedMonth
      );
    },
    [selectedDay, selectedMonth, props.currentMonth]
  );

  /**
   * Determines if a day is today
   */
  const isToday = useCallback(
    (calendarDay: CalendarDay): boolean => {
      const today = new Date();
      const targetDate = new Date(
        props.currentMonth.getFullYear(),
        props.currentMonth.getMonth() + calendarDay.monthOffset,
        calendarDay.day
      );
      return areDatesEqual(targetDate, today);
    },
    [props.currentMonth]
  );

  /**
   * Initialize with today's date and events on component mount or when events change
   */
  useEffect(() => {
    const today = new Date();
    setSelectedDate(today);
    setSelectedDay(today.getDate());
    setSelectedMonth(today.getMonth());

    // Filter today's events
    const todayEvents = props.events.filter((event) =>
      areDatesEqual(event.date, today)
    );
    setSelectedDateDetails(todayEvents || null);
  }, [props.events]);

  /**
   * Check if current month is different from today's month
   */
  const isNotCurrentMonth = useMemo(() => {
    const today = new Date();
    return (
      props.currentMonth.getMonth() !== today.getMonth() ||
      props.currentMonth.getFullYear() !== today.getFullYear()
    );
  }, [props.currentMonth]);

  /**
   * Navigate back to current month
   */
  const handleBackToToday = useCallback(() => {
    const today = new Date();
    setSelectedDate(today);
    setSelectedDay(today.getDate());
    setSelectedMonth(today.getMonth());

    // Filter today's events
    const todayEvents = props.events.filter((event) =>
      areDatesEqual(event.date, today)
    );
    setSelectedDateDetails(todayEvents || null);

    // Call parent navigation function if provided
    if (props.onNavigateToToday) {
      props.onNavigateToToday();
    }
  }, [props.events, props.onNavigateToToday]);

  return (
    <>
      {/* Back to Today Button - only show when not in current month */}
      {isNotCurrentMonth && (
        <div className="back-to-today-container">
          <button 
            className="back-to-today-btn" 
            onClick={handleBackToToday}
            title="Zurück zum aktuellen Monat"
          >
            📅 Heute
          </button>
        </div>
      )}

      {/* Calendar Grid */}
      <Col md={10} className="Calendar-Grid-Container">
        <div>
          {/* Week day headers */}
          <div className="Calendar-day-names">
            <WeekDays />
          </div>

          {/* Calendar weeks */}
          {calendarWeeks.map((week, weekIndex) => (
            <div className="Calendar-days" key={weekIndex}>
              {week.map((calendarDay, dayIndex) => {
                const dayEvents = getEventsForDay(calendarDay);
                const isSelected = isDaySelected(calendarDay);
                const isCurrentMonth = calendarDay.monthOffset === 0;
                const isTodayDay = isToday(calendarDay);

                return (
                  <CalendarDayCell
                    key={dayIndex}
                    calendarDay={calendarDay}
                    events={dayEvents}
                    isSelected={isSelected}
                    isCurrentMonth={isCurrentMonth}
                    isToday={isTodayDay}
                    onDateClick={handleDateClick}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </Col>

      {/* Event Details Sidebar */}
      <Col md={2}>
        <CalendarDetails events={selectedDateDetails} day={selectedDate} />
      </Col>
    </>
  );
};

/**
 * Individual calendar day cell component
 * Separated for better organization and potential performance optimization
 */
interface CalendarDayCellProps {
  calendarDay: CalendarDay;
  events: CustomCalendarEvent[];
  isSelected: boolean;
  isCurrentMonth: boolean;
  isToday: boolean;
  onDateClick: (day: number, monthOffset: number) => void;
}

const CalendarDayCell = ({
  calendarDay,
  events,
  isSelected,
  isCurrentMonth,
  isToday,
  onDateClick,
}: CalendarDayCellProps) => {
  const MAX_VISIBLE_EVENTS = 5;

  const handleClick = useCallback(() => {
    onDateClick(calendarDay.day, calendarDay.monthOffset);
  }, [calendarDay, onDateClick]);

  return (
    <div
      className="Calendar-day"
      style={{
        background: isCurrentMonth ? "#ffffff" : "#f3f3f3",
        borderColor: isSelected ? "#9da4bd" : "#d7d7d7",
        borderWidth: isSelected ? 3 : 1,
        boxShadow: isToday && !isSelected ? "0 2px 8px rgba(95, 99, 104, 0.15)" : "none",
      }}
      onClick={handleClick}
    >
      <Container className="Calendar-day-container">
        {/* Day number header */}
        <Row>
          <Col>
            <div
              className="Calendar-day-header"
              style={{
                background: isCurrentMonth ? (isToday ? "#90a3da" : "#d7d7d7") : "#e7e7e7",
                color: isToday ? "#5f6368" : "inherit",
                fontWeight: isToday ? "600" : "normal",
                }}
            >
              {calendarDay.day}
            </div>
          </Col>
        </Row>

        {/* Events list */}
        <Row>
          <Col>
            {/* Display up to MAX_VISIBLE_EVENTS */}
            {events.slice(0, MAX_VISIBLE_EVENTS).map((event, index) => (
              <div
                className="Calendar-day-body"
                key={index}
                style={{ background: event.color }}
                title={event.name} // Tooltip for truncated text
              >
                {truncateText(event.name, 15)}
              </div>
            ))}

            {/* Show overflow indicator if there are more events */}
            {events.length > MAX_VISIBLE_EVENTS && (
              <div
                className="Calendar-day-body"
                style={{ background: "rgba(155,155,155,0.58)" }}
                title={`${events.length - MAX_VISIBLE_EVENTS} weitere Termine`}
              >
                + {events.length - MAX_VISIBLE_EVENTS} mehr
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

/**
 * Week day headers component
 * Displays German weekday names starting with Monday
 */
const WeekDays = () => {
  const weekDays = [
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
    "Sonntag",
  ];

  return (
    <>
      {weekDays.map((weekDay, index) => (
        <div key={index} className="Calendar-week-day">
          {weekDay}
        </div>
      ))}
    </>
  );
};

export default MonthView;
