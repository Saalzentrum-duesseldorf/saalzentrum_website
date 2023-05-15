import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { EventContentArg } from "@fullcalendar/core";
import './Calendar.scss';

const events = [
  { title: 'Meeting', start: new Date() }
]

export function Calendar() {
  return (
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView='dayGridMonth'
        weekends={false}
        events={events}
        eventContent={renderEventContent}
      />
  )
}

// a custom render function
function renderEventContent(eventInfo:EventContentArg) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}