import React from "react";
import { Col, Button } from "react-bootstrap";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import "./CalendarControls.scss";

interface CalendarControlsProps {
  selectedResource: string;
  onResourceChange: (event: any) => void;
  onGoToCurrentWeek: () => void;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
}

const CalendarControls: React.FC<CalendarControlsProps> = ({
  selectedResource,
  onResourceChange,
  onGoToCurrentWeek,
  disabled = false,
  size = "medium",
}) => {
  const handleResourceChange = (event: any) => {
    if (!disabled) {
      onResourceChange(event);
    }
  };

  const handleCurrentWeekClick = () => {
    if (!disabled) {
      onGoToCurrentWeek();
    }
  };

  return (
    <>
      <Col md={2} className={`today-col ${size} ${disabled ? "disabled" : ""}`}>
        <Button
          className="today-button"
          onClick={handleCurrentWeekClick}
          disabled={disabled}
          aria-label="Zur aktuellen Woche navigieren"
        >
          <span className="today-button__text">Diese Woche</span>
          <div className="today-button__ripple"></div>
          <div className="today-button__glow"></div>
        </Button>
      </Col>
      <Col
        md={2}
        className={`resource-col ${size} ${disabled ? "disabled" : ""}`}
      >
        <FormControl
          size="small"
          fullWidth
          className="resource-select-control"
          disabled={disabled}
        >
          <InputLabel
            id="week-resource-label"
            className="resource-select-label"
          >
            Raum wählen
          </InputLabel>
          <Select
            labelId="week-resource-label"
            value={selectedResource}
            label="Raum wählen"
            onChange={handleResourceChange}
            className="resource-select"
            MenuProps={{
              PaperProps: {
                className: "resource-menu-paper",
              },
            }}
          >
            {roomArray.map((room) => (
              <MenuItem
                key={room}
                value={room === "Alle Räume" ? "" : room}
                className="resource-menu-item"
              >
                <span className="menu-item-text">{room}</span>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Col>
    </>
  );
};

const roomArray = [
  "Alle Räume",
  "Saal 1",
  "Nebenraum 1B",
  "Saal 2",
  "Nebenraum 2B",
  "Saal 3",
  "Nebenraum 3B",
  "Saal 4",
  "Nebenraum 4B",
  "Besprechungsraum 2OG",
  "Sonstiges",
];

export default CalendarControls;
