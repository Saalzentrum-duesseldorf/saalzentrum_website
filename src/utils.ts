import { CustomCalendarEvent } from "./components/calendar/customCalendar/desktop/CustomCalendar";
import { MobileCalendarEvent } from "./models";

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

export const roomPatterns: { [key: string]: string } = {
  "Saalzentrum-3-0-Saal 1": "Saal 1",
  "Saalzentrum-3-Nebenraum 1B": "Nebenraum 1B",
  "Saalzentrum-3-Saal 2": "Saal 2",
  "Saalzentrum-3-Nebenraum 2B": "Nebenraum 2B",
  "Saalzentrum-3-Saal 3": "Saal 3",
  "Saalzentrum-3-Nebenraum 3B": "Nebenraum 3B",
  "Saalzentrum-3-Saal 4": "Saal 4",
  "Saalzentrum-3-Nebenraum 4B": "Nebenraum 4B",
  "Saalzentrum-3-Besprechungsraum": "Besprechungsraum",
};

export enum Resources {
  "Saal 1" = "Saalzentrum-3-0-Saal 1",
  "Nebenraum 1B" = "Saalzentrum-3-Nebenraum 1B",
  "Saal 2" = "Saalzentrum-3-Saal 2",
  "Nebenraum 2B" = "Saalzentrum-3-Nebenraum 2B",
  "Saal 3" = "Saalzentrum-3-0-Saal 3",
  "Nebenraum 3B" = "Saalzentrum-3-Nebenraum 3B",
  "Saal 4" = "Saalzentrum-3-Saal 4",
  "Nebenraum 4B" = "Saalzentrum-3-Nebenraum 4B",
  "Besprechungsraum" = "Saalzentrum-3-Besprechungsraum",
  "andere" = "andere",
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
  const roomNumber = numberMatch ? ` ${numberMatch[0]}` : "";
  return `Raum${roomNumber}`;
}

export enum RoomColor {
  "Saal 1" = "#96ac83",
  "Nebenraum 1B" = "#c6cbdd",
  "Saal 2" = "#d8715c",
  "Nebenraum 2B" = "#8c7e77",
  "Saal 3" = "#667f7c",
  "Nebenraum 3B" = "#6471a2",
  "Saal 4" = "#d7d7d7",
  "Nebenraum 4B" = "#eabd9e",
  "Besprechungsraum" = "#e29eea",
  "andere" = "#4d7946",
}

export enum ColorIdToColor {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  "11" = "#dc4328",
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  "3" = "#9847a1",
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  "4" = "#d8715c",
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  "8" = "#8c7e77",
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  "10" = "#4d7946",
  "undefined" = "#757DC4",
}

export function getEventHeight(
  event: CustomCalendarEvent,
  hourBlockHight = 40
): number {
  if (event.dateFrom && event.dateTo) {
    const durationInHours =
      (event.dateTo.getTime() - event.dateFrom.getTime()) / (1000 * 60 * 60);
    return durationInHours * hourBlockHight; // hourBlockHight ist die Höhe eines hour-blocks
  }
  return 40; // Standardhöhe, falls dateFrom oder dateTo nicht definiert sind
}

export function getEventTopPosition(
  event: CustomCalendarEvent,
  hourBlockHight = 40
): number {
  if (event.dateFrom) {
    return (event.dateFrom.getMinutes() / 60) * hourBlockHight; // hourBlockHight ist die Höhe eines hour-blocks
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

export function containsAllDayEvent(
  events: CustomCalendarEvent[] | null
): boolean {
  if (events) {
    for (const element of events) {
      if (element.isAllDay) {
        return true;
      }
    }
  }
  return false;
}

export const getPreviousDay = (date: Date) => {
  const previousDay = new Date(date);
  previousDay.setDate(previousDay.getDate() - 1);
  return previousDay;
};

export const getNextDay = (date: Date) => {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  return nextDay;
};

export const getPreviousDayEvents = (
  events: MobileCalendarEvent[],
  selectedDay: Date
) => {
  if (!selectedDay) return [];
  return events.filter((event) =>
    areDatesEqual(event.date, getPreviousDay(selectedDay))
  );
};

export const getNextDayEvents = (
  events: MobileCalendarEvent[],
  selectedDay: Date
) => {
  if (!selectedDay) return [];
  return events.filter((event) =>
    areDatesEqual(event.date, getNextDay(selectedDay))
  );
};

// Format date to display in header (e.g., "Mo, 16. März")
export const formatDateForHeader = (date: Date) => {
  const dayOfWeek = date.toLocaleString("de-DE", { weekday: "short" });
  const day = date.getDate();
  const month = date.toLocaleString("de-DE", { month: "long" });
  return `${dayOfWeek}, ${day}. ${month}`;
};


export const filterEventsByRoom = (
  resource: string,
  events: MobileCalendarEvent[]
): MobileCalendarEvent[] => {
  const result = events?.filter((event) => event.location === resource);

  if (resource != "" && result) {
    return result;
  }
  return events;
};

export function showCollectorDialog() {
  const scriptUrl =
    "https://saalzentrum-duesseldorf.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/-3o5b4z/b/4/b0105d975e9e59f24a3230a22972a71a/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=en-GB&collectorId=54badd66";

  const script = document.createElement("script");
  script.src = scriptUrl;
  script.async = true;
  script.onload = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.ATL_JQ_PAGE_PROPS = {
      triggerFunction: function (showCollectorDialog: any) {
        // Requires that jQuery is available!
        showCollectorDialog();
      },
    };
  };

  document.body.appendChild(script);

  // Cleanup: remove script on component unmount
  return () => {
    document.body.removeChild(script);
  };
}

// Generate calendar weeks array
export const generateCalendarDays = (
  currentMonth: Date,
  selectedRoom: string,
  events: MobileCalendarEvent[]
) => {
  const weeks = [];
  let week = [];

  const daysInMonth: number = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDay: number = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday as first day

  // Add days from previous month
  const lastDayOfPrevMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    0
  ).getDate();

  for (let i = 0; i < firstDayOfWeek; i++) {
    week.push({
      day: lastDayOfPrevMonth - firstDayOfWeek + i + 1,
      monthOffset: -1,
      events: [],
    });
  }

  // Add days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    const dayEvents = filterEventsByRoom(selectedRoom, events).filter((event) =>
      areDatesEqual(event.date, date)
    );

    week.push({
      day,
      monthOffset: 0,
      events: dayEvents,
      date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day),
    });

    if (week.length === 7) {
      weeks.push([...week]);
      week = [];
    }
  }

  // Add days from next month
  let nextMonthDay = 1;
  while (week.length < 7 && week.length > 0) {
    week.push({
      day: nextMonthDay++,
      monthOffset: 1,
      events: [],
      date: new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        nextMonthDay - 1
      ),
    });
  }

  if (week.length > 0) {
    weeks.push(week);
  }

  return weeks;
};

 // Scroll to 8:00 when a day is selected
  export const scrollTo8AM = (scrollContainerRef: React.RefObject<HTMLElement>) => {
    if (scrollContainerRef.current) {
      // Find all hour blocks
      const hourBlocks =
        scrollContainerRef.current.querySelectorAll(".hour-block");

      // Locate the "8:00" block
      const targetBlock = Array.from(hourBlocks).find(
        (block) =>
          block.querySelector(".hour-label")?.textContent?.trim() === "8:00"
      );

      if (targetBlock) {
        // Scroll to the "8:00" block
        targetBlock.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        console.warn("8:00 block not found");
      }
    }
  };

  export const parseLocationToRoomKey = (event: any): string | undefined => {
    const location = event.location as string;

    if (!location) {
      return Resources.andere;
    }

    const rooms = location.split(', ');

    for (const room of rooms) {
      for (const pattern in roomPatterns) {
        if (room.startsWith(pattern)) {
          return roomPatterns[pattern];
        }
      }
    }

    return event.location;
  };

  export const parseEvent = (event: any): CustomCalendarEvent | null => {
    // Parse location if available
    const location = parseLocationToRoomKey(event);

    // Check for startDate and endDate fields
    if (event.startDate && event.endDate) {
      // Convert startDate and endDate to Date objects
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);

      return {
        eventId: event.eventId,
        date: startDate, // For all-day events
        dateFrom: event.allDay ? undefined : startDate,
        dateTo: event.allDay ? undefined : endDate,
        isAllDay: event.allDay,
        name: event.summary || "", // Fallback if `summary` is missing
        description: event.description || "", // Fallback if `description` is missing
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        color: event.colorId ? ColorIdToColor[ event.colorId] : ColorIdToColor["undefined"], // Default color if colorId is null
        location: location,
      };
    }

    return null; // Return null if data is incomplete
  };