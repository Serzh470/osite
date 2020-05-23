import { formatRFC3339 } from "date-fns";

export default {
  /*
   * Get events from all calendars specified and created specified number of recurring events
   */
  getAllCalendars: (config) => {
    const start = encodeURIComponent(formatRFC3339(config.start));
    const end = encodeURIComponent(formatRFC3339(config.end));

    const url = `https://content.googleapis.com/calendar/v3/calendars/${config.url}/events`;
    const query = `?key=${config.api_key}&singleEvents=true&orderBy=startTime&timeMin=${start}&timeMax=${end}`;

    return fetch(url + query)
      .then((res) => res.json())
      .then((res) => {
        const items = res.items;

        const events = items.map((e) => {
          // account for all day events and arbitrarily set time to 8am-5pm
          const start = e.start.date
            ? new Date(`${e.start.date}T08:00:00`)
            : new Date(e.start.dateTime);
          const end = e.end.date
            ? new Date(`${e.start.date}T05:00:00`)
            : new Date(e.end.dateTime);

          return {
            title: e.summary,
            start: start,
            end: end,
            description: e.description,
            location: e.location,
            glink: e.htmlLink,
            meta: e,
          };
        });

        return events;
      });
  },
};