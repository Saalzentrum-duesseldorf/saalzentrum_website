import { CustomCalendarEvent } from "./compontents/customCalendar/CustomCalendar.tsx";

export function truncateText(text: string, maxLength: number): string {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

export function areDatesEqual(date1?: Date, date2?: Date) {
  if (!date1 || !date2) {
    return false;
  }
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

export const parseDateToStringWithWrittenOutMonth = (date: Date): string => {
  const months = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ];
  return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
}

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
  "room1" = "saal1@saalzentrum-duesseldorf.de",
  "room2" = "nebensaal1b@saalzentrum-duesseldorf.de",
  "room3" = "saal2@saalzentrum-duesseldorf.de",
  "room4" = "nebensaal2b@saalzentrum-duesseldorf.de",
  "room5" = "saal3@saalzentrum-duesseldorf.de",
  "room6" = "nebensaal3b@saalzentrum-duesseldorf.de",
  "room7" = "saal4@saalzentrum-duesseldorf.de",
  "room8" = "nebensaal4b@saalzentrum-duesseldorf.de",
  "room9" = "besprechungsraum2og@saalzentrum-duesseldorf.de"
}

export enum EmailColor {
  "saal1@saalzentrum-duesseldorf.de" = "#96ac83",
  "nebensaal1b@saalzentrum-duesseldorf.de" =   "#c6cbdd",
  "saal2@saalzentrum-duesseldorf.de" = "#d8715c",
  "nebensaal2b@saalzentrum-duesseldorf.de" = "#8c7e77",
  "saal3@saalzentrum-duesseldorf.de" = "#667f7c",
  "nebensaal3b@saalzentrum-duesseldorf.de" = "#6471a2",
  "saal4@saalzentrum-duesseldorf.de" = "#d7d7d7",
  "nebensaal4b@saalzentrum-duesseldorf.de" = "#eabd9e",
  "besprechungsraum2og@saalzentrum-duesseldorf.de" = "#e29eea"
}


