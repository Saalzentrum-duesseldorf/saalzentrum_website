import './CalendarSkeleton.scss';    

const CalendarSkeleton = () => (
    <div className="calendar-skeleton">
      {[...Array(24)].map((_, index) => (
        <div key={index} className="skeleton-hour">
          <div className="skeleton-time"></div>
          <div className="skeleton-event"></div>
        </div>
      ))}
    </div>
  );

  export default CalendarSkeleton;