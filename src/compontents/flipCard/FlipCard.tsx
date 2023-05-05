import "./FlipCard.scss";

import Pin from '../../assets/pin-pinned-priority-svgrepo-com.svg'

import Calendar from '../../assets/calendar-date-event-svgrepo-com.svg'


function FlipCard() {
  return (
    <div className={"card-body container row"}>
      <link
        href="https://fonts.googleapis.com/css?family=Open+Sans"
        rel="stylesheet"
      />

      <div className={"col-6"}>
        <a href="#" className="card education">
          <div className="overlay"></div>
          <div className="circle">
            <img src={Calendar} className={'svgItem'} alt="React Logo" />
          </div>
          <p>Kalender</p>
        </a>
      </div>
      <div className={"col-6 card2"}>
        <a href="#" className="card education">

          <div className="overlay"> </div>
          <div className="circle">
            <img src={Pin} className={'svgItem'} alt="React Logo" />
          </div>
          <p>Tickets</p>
        </a>
      </div>
    </div>
  );
}

export default FlipCard;
