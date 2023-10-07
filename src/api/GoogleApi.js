import { gapi } from "gapi-script";

gapi.load('client:auth2', () => {
  gapi.client.init({
    clientId: 'YOUR_CLIENT_ID',
    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
    scope: 'https://www.googleapis.com/auth/calendar'
  }).then(() => {
    // Now you can use the gapi client
    listEventsForNextYear();
  });
});

function authenticate() {
  return gapi.auth2.getAuthInstance()
    .signIn({ scope: "https://www.googleapis.com/auth/calendar.readonly" })
    .then(() => console.log("Sign-in successful"),
      err => console.error("Error signing in", err));
}

function loadCalendarApi() {
  return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest")
    .then(() => console.log("GAPI client loaded for API"),
      err => console.error("Error loading GAPI client for API", err));
}

function listEventsForNextYear() {
  const today = new Date();
  const nextYear = new Date();
  nextYear.setFullYear(today.getFullYear() + 1);

  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': today.toISOString(),
    'timeMax': nextYear.toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 2500,  // Set to maximum allowed value
    'orderBy': 'startTime'
  }).then(response => {
    const events = response.result.items;
    if (events.length) {
      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        const when = event.start.dateTime ? event.start.dateTime : event.start.date;
        console.log(`${event.summary} (${when})`);
      }
    } else {
      console.log('No upcoming events found.');
    }
  });
}
