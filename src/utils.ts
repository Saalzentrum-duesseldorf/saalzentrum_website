import { CustomCalendarEvent } from "./compontents/customCalendar/CustomCalendar.tsx";

export function truncateText(text: string, maxLength: number): string {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
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

export function isOverlapping(
  event1: CustomCalendarEvent,
  event2: CustomCalendarEvent
): boolean {
  if (event1.dateFrom && event1.dateTo && event2.dateFrom && event2.dateTo) {
    return (
      event1.dateFrom.getTime() < event2.dateTo.getTime() &&
      event1.dateTo.getTime() > event2.dateFrom.getTime()
    );
  }
  return false;
}

export const parseDateToReadableString = (date: Date) => {
  return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
};

export function getOverlappingEvents(
  event: CustomCalendarEvent,
  events?: CustomCalendarEvent[] | null
): CustomCalendarEvent[] {
  if (!events) {
    return [];
  }
  return events.filter((e) => isOverlapping(e, event));
}

export enum Resources {
  "room1" = "jtatwcook@gmail.com",
  "room2" = "room2",
  "room3" = "room3",
  "room4" = "room4",
  "room5" = "room5",
  "room6" = "room6",
  "room7" = "room7",
  "room8" = "room8",
}

export enum ColorEmail {
  "#00b5ff" = "jtatwcook@gmail.com",
  "blue" = "room2",
  "green" = "room3",
  "yellow" = "room4",
  "orange" = "room5",
  "purple" = "room6",
  "pink" = "room7",
  "grey" = "room8",
}

export enum EmailColor {
  "jtatwcook@gmail.com" = "#4b388a",
  "room2" = "blue",
  "room3" = "green",
  "room4" = "yellow",
  "room5" = "orange",
  "room6" = "purple",
  "room7" = "pink",
  "room8" = "grey",
}


