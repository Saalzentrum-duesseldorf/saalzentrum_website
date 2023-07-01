import React from "react";
import Calendar from "@ericz1803/react-google-calendar";
import "./Calendar.scss";
import { css } from "@emotion/react";
import BurgerMenu from "../menu/BurgerMenu.tsx";

const API_KEY = "";
const calendars = [
  {
    calendarId: "ht3jlfaac5lfd6263ulfh4tql8@group.calendar.google.com",
    color: "#5681FFF4", //optional, specify color of calendar 2 events
  },
];

const styles = {
  //you can use object styles (no import required)
  calendar: {
    borderWidth: "2px", //make outer edge of calendar thicker
    width: "1200px",
    height: "900px",
  },

  //you can also use emotion's string styles
  today: css`
    /* highlight today by making the text red and giving it a red border */
    color: green;
    border: 3px solid #3A78FF6D;
  `,
};

export class GoogleCalendar extends React.Component {
  render() {
    return (
      <div className={"calendar"}>
        <div className={'burgerMenu-container'}>
          <BurgerMenu/>
        </div>

        <div className={'header'}>
          <img className={'calendar-image'} src={'calendar.jpg'} alt={'calendar_image'}/>
        </div>

        <div className={'calendar-container'}>
        <Calendar apiKey={API_KEY} calendars={calendars} styles={styles} showFooter={false} language={'DE'} />
        </div>

      </div>
    );
  }
}
