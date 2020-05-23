import googleAPI from "./gapi";
import weekPeriod from "./weekPeriod";

const { first, last } = weekPeriod();

const calendar_configuration = {
  api_key: process.env.OSITE_GOOGLE_API_KEY,
  url: process.env.OSITE_GOOGLE_CALENDAR_NAME,
  start: first,
  end: last,
};

window.onload(() => {
    googleAPI
        .getAllCalendars(calendar_configuration)
        .then((events) => {
            document.getElementById("calendar")
        })
        .catch((err) => console.log(err));
});
