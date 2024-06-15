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
  "room9" = "besprechungsraum2og@saalzentrum-duesseldorf.de",
  "other" = "sonstiges@saalzentrum-duesseldorf.de"
}


// Function to find room key by email
export function findRoomByEmail(email?: string): string {
  for (const roomKey in Resources) {
    if (Resources[roomKey as keyof typeof Resources] === email) {
      return roomKey; // Returns 'room1', 'room2', ..., 'other'
    }
  }
  return "Unknown"; // Fallback if no email matches
}

// Function to prettify the room key
export function prettifyRoomKey(roomKey: string): string {
  const numberMatch = roomKey.match(/\d+/); // Extracts the number part, if present
  const roomNumber = numberMatch ? ` ${numberMatch[0]}` : '';
  return `Room${roomNumber}`;
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
  "besprechungsraum2og@saalzentrum-duesseldorf.de" = "#e29eea",
  "sonstiges@saalzentrum-duesseldorf.de" = "#4d7946"

}

export function getEventHeight(event: CustomCalendarEvent): number {
  if (event.dateFrom && event.dateTo) {
    const durationInHours =
      (event.dateTo.getTime() - event.dateFrom.getTime()) / (1000 * 60 * 60);
    return durationInHours * 40; // 40px ist die Höhe eines hour-blocks
  }
  return 40; // Standardhöhe, falls dateFrom oder dateTo nicht definiert sind
}

export function getEventTopPosition(event: CustomCalendarEvent): number {
  if (event.dateFrom) {
    return (event.dateFrom.getMinutes() / 60) * 40; // 40px ist die Höhe eines hour-blocks
  }
  return 0;
}

export function getEventsForHour(
  hour: number,
  events: CustomCalendarEvent[] | null
): CustomCalendarEvent[] {
  if (!events) return [];
  return events.filter((event) => {
    if (event.isAllDay) return false; // Exclude all-day events
    const eventStartHour = event.dateFrom?.getHours();
    return eventStartHour === hour;
  });
}

export function containsAllDayEvent(events: CustomCalendarEvent[] | null): boolean {
  if (events) {
    for (const element of events) {
      if (element.isAllDay) {
        return true;
      }
    }
  }
  return false;
}

export function showCollectorDialog() {
  const scriptUrl = "https://saalzentrum-duesseldorf.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/-3o5b4z/b/4/b0105d975e9e59f24a3230a22972a71a/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=en-GB&collectorId=54badd66";

  const script = document.createElement('script');
  script.src = scriptUrl;
  script.async = true;
  script.onload = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.ATL_JQ_PAGE_PROPS = {
      "triggerFunction": function(showCollectorDialog: any) {
        // Requires that jQuery is available!
        showCollectorDialog();
      }
    };
  };

  document.body.appendChild(script);

  // Cleanup: remove script on component unmount
  return () => {
    document.body.removeChild(script);
  };
}


