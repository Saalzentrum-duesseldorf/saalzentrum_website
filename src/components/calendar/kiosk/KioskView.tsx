import React, { useEffect, useMemo, useState } from 'react';
import { CustomCalendarEvent } from '../customCalendar/desktop/CustomCalendar';
import './KioskView.scss';
import { parseEvent, RoomColor } from '../../../utils';

interface KioskEvent {
  id: string;
  title: string;
  time: string;
  duration: string;
  color: string;
  isNext?: boolean;
  nextEvent?: {
    id: string;
    title: string;
    time: string;
    duration: string;
    color: string;
  };
}

interface RoomData {
  name: string;
  events: KioskEvent[];
  color: string;
}

type ArrowDirection = 'left' | 'right' | 'up-left' | 'up-right';

const ArrowIcon: React.FC<{ direction: ArrowDirection }> = ({ direction }) => {
  // Größere, aber elegante Pfeil-Icons für Kiosk
  const paths = {
    left: (
      <g>
        <polyline points="18,4 6,12 18,20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="6" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </g>
    ),
    right: (
      <g>
        <polyline points="6,4 18,12 6,20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="18" y1="12" x2="1" y2="12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </g>
    ),
    'up-left': (
      <g>
        <polyline points="18,4 4,4 4,20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </g>
    ),
    'up-right': (
      <g>
        <polyline points="6,4 20,4 20,20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </g>
    ),
  } as const;

  return (
    <svg className="arrow-icon" width="30" height="30" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
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

    const roomEvents = events
      .filter(event => event.location === roomName)
      .sort((a, b) => {
        const timeA = a.dateFrom || a.date;
        const timeB = b.dateFrom || b.date;
        return timeA.getTime() - timeB.getTime();
      });


    // Aktueller Termin (1h vor bis 1h nach Start)
    const currentEvent = roomEvents.find(event => {
      const start = event.dateFrom || event.date;
      if (!start) return false;
      const windowStart = new Date(start.getTime() - 60 * 60 * 1000); // 1h vor Start
      const windowEnd = new Date(start.getTime() + 60 * 60 * 1000);   // 1h nach Start
      return now >= windowStart && now <= windowEnd;
    });

    // Nächster Termin (in den nächsten 2,5 Stunden) - nur wenn aktueller Termin läuft
    // UND es ist ein anderer Termin als der aktuelle
    const nextEvent = currentEvent ? roomEvents.find(event => {
      const start = event.dateFrom || event.date;
      if (!start) return false;
      const twoAndHalfHoursFromNow = new Date(now.getTime() + 2.5 * 60 * 60 * 1000);
      // Stelle sicher, dass es ein anderer Termin ist als der aktuelle
      return start > now && 
             start <= twoAndHalfHoursFromNow && 
             event.eventId !== currentEvent.eventId;
    }) : null;

    const result: KioskEvent[] = [];

    if (currentEvent) {
      const event: KioskEvent = {
        id: currentEvent.eventId,
        title: currentEvent.name,
        time: currentEvent.dateFrom ? formatTime(currentEvent.dateFrom) : 'Ganztägig',
        duration: currentEvent.dateFrom && currentEvent.dateTo ? calculateDuration(currentEvent.dateFrom, currentEvent.dateTo) : '',
        color: currentEvent.color,
        isNext: false
      };

      // Füge nächsten Termin als zusätzliche Eigenschaften hinzu
      if (nextEvent) {
        event.nextEvent = {
          id: nextEvent.eventId,
          title: nextEvent.name,
          time: nextEvent.dateFrom ? formatTime(nextEvent.dateFrom) : 'Ganztägig',
          duration: nextEvent.dateFrom && nextEvent.dateTo ? calculateDuration(nextEvent.dateFrom, nextEvent.dateTo) : '',
          color: nextEvent.color
        };
      }

      result.push(event);
    }

    return result;
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
            .filter(Boolean);

          todayEvents = getCurrentDateEvents(parsedEvents);
          console.log('Today', todayEvents);
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
        {roomCard(rooms)}
      </main>
    </div>
  );
};

const roomCard = (rooms: RoomData[]) => {
  const roomConfigs = [
    { index: 2, direction: 'up-left' as ArrowDirection, text: 'Treppe hoch links', className: 'room-3' },
    { index: 3, direction: 'up-right' as ArrowDirection, text: 'Treppe hoch rechts', className: 'room-4' },
    { index: 0, direction: 'left' as ArrowDirection, text: 'links', className: 'room-1' },
    { index: 1, direction: 'right' as ArrowDirection, text: 'rechts', className: 'room-2' },
  ];

  return (
    <div className="rooms-grid">
      {roomConfigs.map(config => (
        <div key={config.className} className={`room-card ${config.className}`} style={{'--room-color': rooms[config.index].color} as React.CSSProperties}>
          <div className="room-header">
            <h2 className="room-name">{rooms[config.index].name}</h2>
            <div className="room-direction">
              <ArrowIcon direction={config.direction} />
              <span>{config.text}</span>
            </div>
            <div className={`room-indicator ${rooms[config.index].events.length > 0 ? 'has-event' : ''}`}></div>
          </div>
          <div className="events-list">
            {rooms[config.index].events.length > 0 ? (
              rooms[config.index].events.map(event => (
                <div key={event.id} className="event-item">
                  <div className="event-time">{event.time}</div>
                  <div className="event-title">{event.title}</div>
                  {event.duration && <div className="event-duration">{event.duration}</div>}
                  
                  {/* Nächster Termin als Abschnitt */}
                  {event.nextEvent && (
                    <div className="next-event-section">
                      <div className="next-event-label">Als nächstes in diesem Saal:</div>
                      <div className="next-event-time">{event.nextEvent.time}</div>
                      <div className="next-event-title">{event.nextEvent.title}</div>
                      {event.nextEvent.duration && <div className="next-event-duration">{event.nextEvent.duration}</div>}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-events">Keine Termine jetzt</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default KioskView;