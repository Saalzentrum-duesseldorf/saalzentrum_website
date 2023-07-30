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

export default function GoogleCalendar () {

    return (
      <div className={"calendar"}>
        <div className={'burgerMenu-container'}>
          <BurgerMenu/>
        </div>

        <div className={'page-header'}>
          <img className={'calendar-image'} src={'calendar.jpg'} alt={'calendar_image'}/>
        </div>

        <div className={'calendar-container'}>
          {/*TODO: Customizable Calendar*/}
          {/*<div className={'monthButtonsContainer'}>*/}
          {/*  <Button className={'monthButtons'}>Januar</Button>*/}
          {/*  <Button className={'monthButtons'}>Februar</Button>*/}
          {/*  <Button className={'monthButtons'}>März</Button>*/}
          {/*  <Button className={'monthButtons'}>April</Button>*/}
          {/*  <Button className={'monthButtons'}>Mai</Button>*/}
          {/*  <Button className={'monthButtons'}>Juni</Button>*/}
          {/*  <Button className={'monthButtons'}>Juli</Button>*/}
          {/*  <Button className={'monthButtons'}>August</Button>*/}
          {/*  <Button className={'monthButtons'}>September</Button>*/}
          {/*  <Button className={'monthButtons'}>Oktober</Button>*/}
          {/*  <Button className={'monthButtons'}>November</Button>*/}
          {/*  <Button className={'monthButtons'}>Dezember</Button>*/}
          {/*</div>*/}
        <Calendar apiKey={API_KEY} calendars={calendars} styles={styles} showFooter={false} language={'DE'} />
        </div>

      </div>
    );

}

