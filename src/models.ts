export interface MobileCalendarEvent {
    eventId: string;
    date: Date; // Startzeit des Termins
    endTime?: Date; // Endzeit des Termins (optional)
    isAllDay?: boolean; // Ganztägiger Termin
    name: string;
    description: string;
    color: string;
    location?: string;
    categoryNumber?: string;
  }
  
  export interface MobileCalendarProps {
    events: MobileCalendarEvent[];
  }