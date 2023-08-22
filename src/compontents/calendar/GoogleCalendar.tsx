import Calendar from "@ericz1803/react-google-calendar";
import "./Calendar.scss";
import { css } from "@emotion/react";
import BurgerMenu from "../menu/BurgerMenu.tsx";

const API_KEY = "AIzaSyCkk_ciI_yU9yjgi6MCmpmO5zQ_6Io13kU";

const styles = {
  calendar: {
    borderWidth: "2px",
    width: "1200px",
    height: "744px",
  },

  today: css`
    color: green;
    border: 3px solid #3a78ff6d;
  `,
};

export default function GoogleCalendar() {
  return (
    <div className={"calendar"}>
      <div className={"burgerMenu-container"}>
        <BurgerMenu />
      </div>

      <div className={"page-header"}>
        <img
          className={"calendar-image"}
          src={"calendar.jpg"}
          alt={"calendar_image"}
        />
      </div>

      <div className={"calendar-container"}>
        <Calendar
          apiKey={API_KEY}
          calendars={{
            calendarId: "ht3jlfaac5lfd6263ulfh4tql8@group.calendar.google.com",
            color: "#5681FFF4",
          }}
          styles={styles}
          showFooter={false}
          language={"DE"}
        />
      </div>
    </div>
  );
}
