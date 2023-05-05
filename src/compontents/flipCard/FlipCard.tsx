import "./FlipCard.scss";

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
            <svg></svg>
          </div>
          <p>Kalender</p>
        </a>
      </div>
      <div className={"col-6"}>
        <a href="#" className="card education">
          <div className="overlay"></div>
          <div className="circle">

          </div>
          <p>Tickets</p>
        </a>
      </div>
    </div>
  );
}

export default FlipCard;
