import React, { useEffect, useMemo, useState } from 'react';
import { CustomCalendarEvent } from '../customCalendar/desktop/CustomCalendar';
import { ColorIdToColor, RoomColor, Resources, roomPatterns } from '../../../utils';
import './KioskView.scss';

interface KioskEvent {
  id: string;
  title: string;
  time: string;
  duration: string;
  color: string;
}

interface RoomData {
  name: string;
  events: KioskEvent[];
  color: string;
}

type ArrowDirection = 'left' | 'right' | 'up-left' | 'up-right';

const ArrowIcon: React.FC<{ direction: ArrowDirection }> = ({ direction }) => {
  // Minimalistisches, skalierbares Pfeil-Icon (Stroke-only)
  const paths = {
    left: (
      <g>
        <polyline points="10,4 4,10 10,16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="4" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </g>
    ),
    right: (
      <g>
        <polyline points="14,4 20,10 14,16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="20" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </g>
    ),
    'up-left': (
      <g>
        <polyline points="10,4 4,4 4,10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="4" y1="4" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </g>
    ),
    'up-right': (
      <g>
        <polyline points="14,4 20,4 20,10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="20" y1="4" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </g>
    ),
  } as const;

  return (
    <svg className="arrow-icon" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {paths[direction]}
    </svg>
  );
};

const KioskView: React.FC = () => {
  const [rooms, setRooms] = useState<RoomData[]>([
    { name: 'Saal 1', events: [], color: RoomColor['Saal 1'] },
    { name: 'Saal 2', events: [], color: RoomColor['Saal 2'] },
    { name: 'Saal 3', events: [], color: RoomColor['Saal 3'] },
    { name: 'Saal 4', events: [], color: RoomColor['Saal 4'] },
  ]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayEventsState, setTodayEventsState] = useState<CustomCalendarEvent[]>([]);

  const isMock = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('mock') === '1' || params.get('mock') === 'true';
  }, []);

  const parseLocation = (event: any): string | undefined => {
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

    return Resources.andere;
  };

  const parseEvent = (event: any): CustomCalendarEvent | null => {
    const location = parseLocation(event);
    
    if (event.startDate && event.endDate) {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);

      return {
        eventId: event.eventId,
        date: startDate,
        dateFrom: event.allDay ? undefined : startDate,
        dateTo: event.allDay ? undefined : endDate,
        isAllDay: event.allDay,
        name: event.summary || "",
        description: event.description || "",
        color: event.colorId
          ? ColorIdToColor[String(event.colorId) as keyof typeof ColorIdToColor]
          : ColorIdToColor["undefined"],
        location: location,
      };
    }
    return null;
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('de-DE', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const calculateDuration = (start: Date, end: Date): string => {
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return diffMinutes > 0 ? `${diffHours}h ${diffMinutes}m` : `${diffHours}h`;
    }
    return `${diffMinutes}m`;
  };

  const getCurrentDateEvents = (events: CustomCalendarEvent[]): CustomCalendarEvent[] => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    return events.filter(event => {
      if (event.isAllDay) {
        return event.date >= startOfDay && event.date <= endOfDay;
      }
      return event.dateFrom && event.dateFrom >= startOfDay && event.dateFrom <= endOfDay;
    });
  };

  const convertToKioskEvents = (events: CustomCalendarEvent[], roomName: string, now: Date): KioskEvent[] => {
    const matching = events
      .filter(event => event.location === roomName)
      .filter(event => {
        // Nur zeitbasierte Events berücksichtigen
        const start = event.dateFrom || event.date;
        const end = event.dateTo || event.date;
        if (!start || !end) return false;
        const windowStart = new Date(start.getTime() - 60 * 60 * 1000); // 1h vor Start
        const windowEnd = new Date(start.getTime() + 60 * 60 * 1000);   // 1h nach Start
        return now >= windowStart && now <= windowEnd;
      })
      .sort((a, b) => {
        const timeA = a.dateFrom || a.date;
        const timeB = b.dateFrom || b.date;
        return timeA.getTime() - timeB.getTime();
      });

    const first = matching[0];
    if (!first) return [];

    return [{
      id: first.eventId,
      title: first.name,
      time: first.dateFrom ? formatTime(first.dateFrom) : 'Ganztägig',
      duration: first.dateFrom && first.dateTo ? calculateDuration(first.dateFrom, first.dateTo) : '',
      color: first.color,
    }];
  };

  const buildMockEvents = (): CustomCalendarEvent[] => {
    const mk = (
      id: string,
      offsetMinutes: number,
      durationMinutes: number,
      name: string,
      location: string,
      color: string
    ): CustomCalendarEvent => {
      const start = new Date(new Date().getTime() + offsetMinutes * 60000);
      const end = new Date(start.getTime() + durationMinutes * 60000);
      return {
        eventId: id,
        date: start,
        dateFrom: start,
        dateTo: end,
        isAllDay: false,
        name,
        description: '',
        color,
        location,
      };
    };

    return [
      mk('m4', -30, 120, 'Ost', 'Saal 3', RoomColor['Saal 3']),
      mk('m4', 30, 120, 'Oberkassel', 'Saal 1', RoomColor['Saal 2']),
      mk('m4', 20, 120, 'Chinesisch', 'Saal 2', RoomColor['Saal 2']),

    ];
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let todayEvents: CustomCalendarEvent[] = [];

        if (isMock) {
          todayEvents = buildMockEvents();
        } else {
          const response = await fetch('https://saalzentrum-duesseldorf.de:8445/getAllEvents');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          const parsedEvents: CustomCalendarEvent[] = data
            .map(parseEvent)
            .filter(Boolean) as CustomCalendarEvent[];

          todayEvents = getCurrentDateEvents(parsedEvents);
        }
        setTodayEventsState(todayEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 300000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [isMock]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Recompute visible room events live on time change using cached today's events
  useEffect(() => {
    if (!todayEventsState || todayEventsState.length === 0) return;
    setRooms(prevRooms =>
      prevRooms.map(room => ({
        ...room,
        events: convertToKioskEvents(todayEventsState, room.name, currentTime),
      }))
    );
  }, [currentTime, todayEventsState]);

  const formatCurrentTime = (): string => {
    return currentTime.toLocaleString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="kiosk-view">
      <header className="kiosk-header">
        <div className="header-content">
          <h1 className="kiosk-title">Saalzentrum Düsseldorf</h1>
          <div className="current-time">{formatCurrentTime()}</div>
        </div>
      </header>

      <main className="kiosk-main">
        <div className="rooms-grid">
          <div className="room-card room-3" style={{'--room-color': rooms[2].color} as React.CSSProperties}>
            <div className="room-header">
              <h2 className="room-name">{rooms[2].name}</h2>
              <div className="room-direction"><ArrowIcon direction="up-left" /><span>Treppe hoch links</span></div>
              <div className="room-indicator"></div>
            </div>
            <div className="events-list">
              {rooms[2].events.length > 0 ? (
                rooms[2].events.map(event => (
                  <div key={event.id} className="event-item">
                    <div className="event-time">{event.time}</div>
                    <div className="event-title">{event.title}</div>
                    {event.duration && <div className="event-duration">{event.duration}</div>}
                  </div>
                ))
              ) : (
                <div className="no-events">Keine Termine jetzt</div>
              )}
            </div>
          </div>

          <div className="room-card room-4" style={{'--room-color': rooms[3].color} as React.CSSProperties}>
            <div className="room-header">
              <h2 className="room-name">{rooms[3].name}</h2>
              <div className="room-direction"><ArrowIcon direction="up-right" /><span>Treppe hoch rechts</span></div>
              <div className="room-indicator"></div>
            </div>
            <div className="events-list">
              {rooms[3].events.length > 0 ? (
                rooms[3].events.map(event => (
                  <div key={event.id} className="event-item">
                    <div className="event-time">{event.time}</div>
                    <div className="event-title">{event.title}</div>
                    {event.duration && <div className="event-duration">{event.duration}</div>}
                  </div>
                ))
              ) : (
                <div className="no-events">Keine Termine heute</div>
              )}
            </div>
          </div>

          <div className="room-card room-1" style={{'--room-color': rooms[0].color} as React.CSSProperties}>
            <div className="room-header">
              <h2 className="room-name">{rooms[0].name}</h2>
              <div className="room-direction"><ArrowIcon direction="left" /><span>links</span></div>
              <div className="room-indicator"></div>
            </div>
            <div className="events-list">
              {rooms[0].events.length > 0 ? (
                rooms[0].events.map(event => (
                  <div key={event.id} className="event-item">
                    <div className="event-time">{event.time}</div>
                    <div className="event-title">{event.title}</div>
                    {event.duration && <div className="event-duration">{event.duration}</div>}
                  </div>
                ))
              ) : (
                <div className="no-events">Keine Termine heute</div>
              )}
            </div>
          </div>

          <div className="room-card room-2" style={{'--room-color': rooms[1].color} as React.CSSProperties}>
            <div className="room-header">
              <h2 className="room-name">{rooms[1].name}</h2>
              <div className="room-direction"><ArrowIcon direction="right" /><span>rechts</span></div>
              <div className="room-indicator"></div>
            </div>
            <div className="events-list">
              {rooms[1].events.length > 0 ? (
                rooms[1].events.map(event => (
                  <div key={event.id} className="event-item">
                    <div className="event-time">{event.time}</div>
                    <div className="event-title">{event.title}</div>
                    {event.duration && <div className="event-duration">{event.duration}</div>}
                  </div>
                ))
              ) : (
                <div className="no-events">Keine Termine heute</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KioskView;