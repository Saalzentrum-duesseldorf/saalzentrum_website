import React from 'react';
import { Col, Button } from 'react-bootstrap';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import './CalendarControls.scss';

interface CalendarControlsProps {
  selectedResource: string;
  onResourceChange: (event: any) => void;
  onGoToCurrentWeek: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const CalendarControls: React.FC<CalendarControlsProps> = ({
  selectedResource,
  onResourceChange,
  onGoToCurrentWeek,
  disabled = false,
  size = 'medium'
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
      <Col md={2} className={`today-col ${size} ${disabled ? 'disabled' : ''}`}>
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
      <Col md={2} className={`resource-col ${size} ${disabled ? 'disabled' : ''}`}>
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
                className: 'resource-menu-paper'
              }
            }}
          >
            <MenuItem value="" className="resource-menu-item">
              <span className="menu-item-text">Alle Räume</span>
            </MenuItem>
            <MenuItem value="Saal 1" className="resource-menu-item">
              <span className="menu-item-text">Saal 1</span>
            </MenuItem>
            <MenuItem value="Nebenraum 1B" className="resource-menu-item">
              <span className="menu-item-text">Nebenraum 1B</span>
            </MenuItem>
            <MenuItem value="Saal 2" className="resource-menu-item">
              <span className="menu-item-text">Saal 2</span>
            </MenuItem>
            <MenuItem value="Nebenraum 2B" className="resource-menu-item">
              <span className="menu-item-text">Nebenraum 2B</span>
            </MenuItem>
            <MenuItem value="Saal 3" className="resource-menu-item">
              <span className="menu-item-text">Saal 3</span>
            </MenuItem>
            <MenuItem value="Nebenraum 3B" className="resource-menu-item">
              <span className="menu-item-text">Nebenraum 3B</span>
            </MenuItem>
            <MenuItem value="Saal 4" className="resource-menu-item">
              <span className="menu-item-text">Saal 4</span>
            </MenuItem>
            <MenuItem value="Nebenraum 4B" className="resource-menu-item">
              <span className="menu-item-text">Nebenraum 4B</span>
            </MenuItem>
            <MenuItem value="Besprechungsraum" className="resource-menu-item">
              <span className="menu-item-text">Besprechungsraum 2OG</span>
            </MenuItem>
            <MenuItem value="andere" className="resource-menu-item">
              <span className="menu-item-text">Sonstiges</span>
            </MenuItem>
          </Select>
        </FormControl>
      </Col>
    </>
  );
};

export default CalendarControls;