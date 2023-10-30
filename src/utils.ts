import { CustomCalendarEvent } from "./compontents/customCalendar/CustomCalendar.tsx";

export function truncateText(text: string, maxLength: number): string {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
}


export function areDatesEqual(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function isOverlapping(event1: CustomCalendarEvent, event2: CustomCalendarEvent): boolean {
  if (event1.dateFrom && event1.dateTo && event2.dateFrom && event2.dateTo) {
    return (event1.dateFrom.getTime() < event2.dateTo.getTime() && event1.dateTo.getTime() > event2.dateFrom.getTime());
  }
  return false;
}

export const parseDateToReadableString = (date: Date) => {
  return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
};

export function getOverlappingEvents(event: CustomCalendarEvent, events?: CustomCalendarEvent[]): CustomCalendarEvent[] {
  if (!events) {
    return [];
  }
  return events.filter(e => isOverlapping(e, event));

}


