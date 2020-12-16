/* global gapi */

export function createEvent(summary, start, end) {
  start = new Date(start);
  if(end===undefined){
    end = new Date(start.toISOString());
    end.setHours( end.getHours() + 1 );
  }else{
    end = new Date(end);
  }
  var event = {
    'summary': summary,
    'start': {
      'dateTime': start.toISOString(),
      'timeZone': 'America/Sao_Paulo'
    },
    'end': {
      'dateTime': end.toISOString(),
      'timeZone': 'America/Sao_Paulo'
    },
  };

  var request = gapi.client.calendar.events.insert({
    'calendarId': 'primary',
    'resource': event
  });

  request.execute(function(event) {
    console.log('Event created: ' + event.htmlLink);
  });
}

export function listUpcomingEvents(date) {
  return gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  }).then(res => {
    let events = res.result.items;
    if(events.length > 0){
      return events.filter(e => e.start.date!==undefined && e.start.date.includes(date)
      || e.start.dateTime!==undefined && e.start.dateTime.includes(date));
    }
  });
}
