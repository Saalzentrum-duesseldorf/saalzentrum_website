import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import './BackButton.scss';

interface BackButtonProps {
  selectedDay?: any; // Replace with your actual day type
  onBackClick: () => void;
  onBackToHomePageClick: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'minimal' | 'elevated';
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  selectedDay,
  onBackClick,
  onBackToHomePageClick,
  disabled = false,
  size = 'medium',
  variant = 'default',
  className = ''
}) => {
  const isInDayView = Boolean(selectedDay);
  
  const handleClick = () => {
    if (disabled) return;
    
    if (isInDayView) {
      onBackClick();
    } else {
      onBackToHomePageClick();
    }
  };

  return (
    <div className="back-button-container">
      <Button
        className={`nav-button back-button ${size} ${variant} ${isInDayView ? 'day-view' : 'home-view'} ${disabled ? 'disabled' : ''} ${className}`}
        onClick={handleClick}
        disabled={disabled}
      >
        <div className="back-button__content">
          <FontAwesomeIcon 
            icon={faArrowLeft} 
            className="back-button__arrow" 
          />
        </div>
        
        {/* Ripple effect */}
        <div className="back-button__ripple"></div>
        
        {/* Glow effect */}
        <div className="back-button__glow"></div>
    
      </Button>
    </div>
  );
};

export default BackButton;