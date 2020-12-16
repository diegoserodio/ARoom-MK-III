/* global gapi */

import React from 'react';
import { } from 'reactstrap';

import apiConfig from './../../apiKeys'

export default class Calendar extends React.Component {
  constructor(){
    super();
    this.state = {
      gapiReady: false,
      events: [],
    }
  }

  componentDidMount = () => {
    this.handleClientLoad();
    this.eventInterval = setInterval(
      () => this.listUpcomingEvents(),
      60000
    );
  }

  componentWillUnmount() {
    clearInterval(this.eventInterval);
  }
      /**
       *  On load, called to load the auth2 library and API client library.
       */
      handleClientLoad() {
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/api.js";
        document.body.appendChild(script);

        script.onload = () => {
            gapi.load('client:auth2', this.initClient.bind(this));
        }
      }

      /**
       *  Initializes the API client library and sets up sign-in state
       *  listeners.
       */
      initClient() {
        let that = this;
        gapi.client.init({
          apiKey: apiConfig.CALENDAR_API_KEY,
          clientId: apiConfig.CALENDAR_API_ID,
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
          scope: "https://www.googleapis.com/auth/calendar"
        }).then(function () {
          that.handleAuth();
        }, function(error) {
          console.log(error);
        });
      }

      handleAuth(event) {
        let that = this;
        gapi.auth2.getAuthInstance().signIn().then(function () {
          that.setState({ gapiReady: true });
          that.listUpcomingEvents();
        });
      }


      /**
       * Print the summary and start datetime/date of the next ten events in
       * the authorized user's calendar. If no events are found an
       * appropriate message is printed.
       */
      listUpcomingEvents() {
        let that = this;
        gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        }).then(function(response) {
          var events = response.result.items;
          if (events.length > 0) {
            that.setState({ events: events });
          }
        });
      }

      getEvents(event){
        if(event.summary==='Acordar')return null;
        let date = event.start.date;
        if(date == null){
          let _date = new Date(event.start.dateTime);
          let year = _date.getFullYear();
          let month = _date.getMonth()+1;
          let day = _date.getDate();
          if(day<10) day = '0'+day;
          if(month<10) month = '0'+month;
          date = year+'-'+month+'-'+day;
        }
        date =
          date.split('-')[2] + '/' +
          date.split('-')[1] + '/' +
          date.split('-')[0];
        let startHour = new Date(event.start.dateTime).getHours();
        let startMin = new Date(event.start.dateTime).getMinutes();
        let endHour = new Date(event.end.dateTime).getHours();
        let endMin = new Date(event.end.dateTime).getMinutes();
        if(startHour<10) startHour = '0'+startHour
        if(startMin<10) startMin = '0'+startMin
        if(endHour<10) endHour = '0'+endHour
        if(endMin<10) endMin = '0'+endMin
        return [
          <div>
            <hr style={{background:'#fff'}}/>
            <div className="eventCard">
              <h3>{event.summary}</h3>
              <h6>Data:&nbsp;{date}</h6>
              {startHour ? <h6>Começo:&nbsp;{startHour}:{startMin}&nbsp;&nbsp;Término:&nbsp;{endHour}:{endMin}</h6> : <h6>Dia todo</h6>}
            </div>
          </div>
        ];
      }

      renderEvents(){
        let eventList = [];
        if(this.state.gapiReady){
          let {events} = this.state;
            let count = 0;
            for(let i = 0; i<events.length; i++){
              let eventItem = this.getEvents(events[i]);
              if(eventItem!==null){
                eventList.push(eventItem);
                count++;
              }
              if(count>=3)break;
            }
        }
        return eventList;
      }



  render() {
    return(
      <div className="row d-flex justify-content-end">
      <div
        className="col-6"
        style={{
          margin:10,
          padding:5,
          paddingLeft:10,
          paddingRight:10,
          background:'rgba(128,128,128,0.9)',
          borderRadius:15,
          fontSize:20,
          color:'#fff'
        }}>
        <h2 className="row d-flex justify-content-center"
          style={{
            color:'#fff'
          }}><b>Agenda</b></h2>
          {this.renderEvents()}
      </div>
      </div>
    );
  }
}
