import "./FlipCard.scss";

import Pin from '../../assets/pin-pinned-priority-svgrepo-com.svg'

import Calendar from '../../assets/calendar-date-event-svgrepo-com.svg'
import { Link } from "react-router-dom";
import { useEffect } from "react";


function FlipCard() {

  useEffect(() => {
    const scriptUrl = "https://saalzentrum-duesseldorf.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/-3o5b4z/b/4/b0105d975e9e59f24a3230a22972a71a/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=en-GB&collectorId=54badd66";

    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.ATL_JQ_PAGE_PROPS = {
        "triggerFunction": function(showCollectorDialog: any) {
          // Requires that jQuery is available!
          jQuery("#myCustomTrigger").click(function(e) {
            e.preventDefault();
            showCollectorDialog();
          });
        }
      };
    };

    document.body.appendChild(script);

    // Cleanup: remove script on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
        <Link id={"myCustomTrigger"} className="card education" to={""}>

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
