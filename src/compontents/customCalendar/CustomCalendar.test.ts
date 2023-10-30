// src/__tests__/utils.test.js

import { isOverlapping } from '../../utils.ts';
import {expect} from '@jest/globals';
import { CustomCalendarEvent } from "./CustomCalendar.tsx";



describe('isOverlapping', () => {
  it('should return true for overlapping events', () => {
    const event1: CustomCalendarEvent = {
      eventId: '1',
      date: new Date(2023, 10, 1),
      name: 'Event 1',
      description: 'Event 1 description',
      color: 'red',
      dateFrom: new Date(2023, 10, 1, 10, 0),
      dateTo: new Date(2023, 10, 1, 12, 0),
    };

    const event2: CustomCalendarEvent = {
      eventId: '2',
      date: new Date(2023, 10, 1),
      name: 'Event2',
      description: 'Event2 description',
      color: 'blue',
      dateFrom: new Date(2023, 10, 1, 10, 0),
      dateTo: new Date(2023, 10, 1, 12, 0),
    };

    expect(isOverlapping(event1, event2)).toBe(true);
  });

  it('should return false for non-overlapping events', () => {
   const event1: CustomCalendarEvent = {
      eventId: '1',
      date: new Date(2023, 10, 1),
      name: 'Event 1',
      description: 'Event 1 description',
      color: 'red',
      dateFrom: new Date(2023, 10, 1, 10, 0),
      dateTo: new Date(2023, 10, 1, 12, 0),
    };

    const event2: CustomCalendarEvent = {
      eventId: '2',
      date: new Date(2023, 10, 1),
      name: 'Event2',
      description: 'Event2 description',
      color: 'blue',
      dateFrom: new Date(2023, 10, 1, 13, 0),
      dateTo: new Date(2023, 10, 1, 15, 0),
   }


    expect(isOverlapping(event1, event2)).toBe(false);
  });




  it('should return true if second event is overlapping', () => {
    const event1: CustomCalendarEvent = {
      eventId: '1',
      date: new Date(2023, 10, 1),
      name: 'Event 1',
      description: 'Event 1 description',
      color: 'red',
      dateFrom: new Date(2023, 10, 1, 13, 0),
      dateTo: new Date(2023, 10, 1, 14, 0),
    };

    const event2: CustomCalendarEvent = {
      eventId: '2',
      date: new Date(2023, 10, 1),
      name: 'Event2',
      description: 'Event2 description',
      color: 'blue',
      dateFrom: new Date(2023, 10, 1, 10, 0),
      dateTo: new Date(2023, 10, 1, 13, 0),
    }
    
    expect(isOverlapping(event1, event2)).toBe(false);
  });

});
