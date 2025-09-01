import React from 'react';
import "./MonthWeekSwitch.scss";

interface MonthWeekSwitchProps {
  isWeekView: boolean;
  setWeekView: (value: boolean) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const MonthWeekSwitch: React.FC<MonthWeekSwitchProps> = ({ 
  isWeekView, 
  setWeekView, 
  disabled = false,
  size = 'medium',
  className = ''
}) => {
  const handleKeyDown = (event: React.KeyboardEvent, isWeek: boolean) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!disabled) {
        setWeekView(isWeek);
      }
    }
  };

  const handleArrowKeys = (event: React.KeyboardEvent) => {
    if (disabled) return;
    
    if (event.key === 'ArrowLeft' && isWeekView) {
      event.preventDefault();
      setWeekView(false);
    } else if (event.key === 'ArrowRight' && !isWeekView) {
      event.preventDefault();
      setWeekView(true);
    }
  };

  return (
    <div 
      className={`calendar-toggle ${size} ${disabled ? 'disabled' : ''} ${className}`}
      role="radiogroup"
      aria-label="Kalenderansicht auswählen"
      onKeyDown={handleArrowKeys}
    >
      <div 
        className={`calendar-toggle__indicator ${isWeekView ? 'right' : 'left'}`}
        aria-hidden="true"
      />
      <button
        type="button"
        className={`calendar-toggle__btn ${!isWeekView ? 'active' : ''}`}
        onClick={() => !disabled && setWeekView(false)}
        onKeyDown={(e) => handleKeyDown(e, false)}
        disabled={disabled}
        role="radio"
        aria-checked={!isWeekView}
        aria-label="Monatsansicht"
      >
        <span className="calendar-toggle__btn-text">Monat</span>
      </button>
      <button
        type="button"
        className={`calendar-toggle__btn ${isWeekView ? 'active' : ''}`}
        onClick={() => !disabled && setWeekView(true)}
        onKeyDown={(e) => handleKeyDown(e, true)}
        disabled={disabled}
        role="radio"
        aria-checked={isWeekView}
        aria-label="Wochenansicht"
      >
        <span className="calendar-toggle__btn-text">Woche</span>
      </button>
    </div>
  );
};

export default MonthWeekSwitch;