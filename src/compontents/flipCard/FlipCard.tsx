import "./FlipCard.scss";

import Pin from '../../assets/pin-pinned-priority-svgrepo-com.svg'

import Calendar from '../../assets/calendar-date-event-svgrepo-com.svg'
import { Link } from "react-router-dom";


function FlipCard() {
  return (
    <div className={"card-body row"}>
      <link
        href="https://fonts.googleapis.com/css?family=Open+Sans"
        rel="stylesheet"
      />

      <div className={"col-6 cardLeft"}>
        <Link to="/calendar" className="card education">
          <div className="overlay"></div>
          <div className="circle">
            <img src={Calendar} className={'svgItem'} alt="Calendar" />
          </div>
          <p>Kalender</p>
        </Link>
      </div>
      <div className={"col-6 cardRight"}>
        <Link to="/tickets" className="card education">

          <div className="overlay"> </div>
          <div className="circle">
            <img src={Pin} className={'svgItem'} alt="Tickets" />
          </div>
          <p>Tickets</p>
        </Link>
      </div>
    </div>
  );
}

export default FlipCard;
