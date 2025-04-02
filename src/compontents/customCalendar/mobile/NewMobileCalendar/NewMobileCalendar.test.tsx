import { render, screen, fireEvent } from "@testing-library/react";
import NewMobileCalendar, { MobileCalendarEvent } from "./NewMobileCalendar";
import '@testing-library/jest-dom';

const mockEvents: MobileCalendarEvent[] = [
  {
    eventId: "1",
    date: new Date(2025, 2, 30, 8, 0), // 30. März 2025, 8:00 Uhr
    name: "Meeting",
    description: "Team Meeting",
    color: "#FF5733",
    location: "Room A",
    isAllDay: false,
  },
  {
    eventId: "2",
    date: new Date(2025, 2, 30, 10, 0), // 30. März 2025, 10:00 Uhr
    name: "Workshop",
    description: "React Workshop",
    color: "#33FF57",
    location: "Room B",
    isAllDay: false,
  },
];

describe("NewMobileCalendar Component", () => {
  it("renders the calendar header", () => {
    render(<NewMobileCalendar events={mockEvents} />);
    expect(screen.getByText("März")).toBeInTheDocument(); // Aktueller Monat
  });

  it("renders the days of the week", () => {
    render(<NewMobileCalendar events={mockEvents} />);
    const daysOfWeek = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
    daysOfWeek.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it("renders events for the selected day", () => {
    render(<NewMobileCalendar events={mockEvents} />);
    fireEvent.click(screen.getByText("30")); // Wähle den 30. März
    expect(screen.getByText("Meeting")).toBeInTheDocument();
    expect(screen.getByText("Workshop")).toBeInTheDocument();
  });

  it("navigates to the previous month", () => {
    render(<NewMobileCalendar events={mockEvents} />);
    fireEvent.click(screen.getByRole("button", { name: /chevron-left/i })); // Klicke auf den "Zurück"-Button
    expect(screen.getByText("Februar")).toBeInTheDocument(); // Der Monat sollte Februar sein
  });

  it("navigates to the next month", () => {
    render(<NewMobileCalendar events={mockEvents} />);
    fireEvent.click(screen.getByRole("button", { name: /chevron-right/i })); // Klicke auf den "Weiter"-Button
    expect(screen.getByText("April")).toBeInTheDocument(); // Der Monat sollte April sein
  });

  it("navigates to today when clicking the 'Heute' button", () => {
    render(<NewMobileCalendar events={mockEvents} />);
    fireEvent.click(screen.getByText("Heute")); // Klicke auf den "Heute"-Button
    const today = new Date();
    const todayFormatted = today.toLocaleString("de-DE", {
      weekday: "short",
      day: "numeric",
      month: "long",
    });
    expect(screen.getByText(todayFormatted)).toBeInTheDocument(); // Der heutige Tag sollte angezeigt werden
  });

  it("renders the room dropdown", () => {
    render(<NewMobileCalendar events={mockEvents} />);
    expect(screen.getByText("Raum wählen")).toBeInTheDocument(); // Dropdown sollte angezeigt werden
  });

  it("filters events by room", () => {
    render(<NewMobileCalendar events={mockEvents} />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "Room A" } }); // Wähle "Room A" aus
    fireEvent.click(screen.getByText("30")); // Wähle den 30. März
    expect(screen.getByText("Meeting")).toBeInTheDocument(); // Event in Room A sollte angezeigt werden
    expect(screen.queryByText("Workshop")).not.toBeInTheDocument(); // Event in Room B sollte nicht angezeigt werden
  });

  it("scrolls to 8:00 when a day is selected", () => {
    const { container } = render(<NewMobileCalendar events={mockEvents} />);
    const scrollContainer = container.querySelector(".scrollable-body");
    fireEvent.click(screen.getByText("30")); // Wähle den 30. März
    expect(scrollContainer?.scrollTop).toBeGreaterThan(0); // Scrollposition sollte sich ändern
  });
});