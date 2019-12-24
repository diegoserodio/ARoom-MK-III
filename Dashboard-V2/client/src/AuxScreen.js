import React from 'react';
import { } from 'reactstrap';
import './Styles/AuxScreen.css'
import dateFormater from './Helpers/dateFormaters'

import Calendar from './calendar';
import Relay from './arduino';
import Weather from './weather';

export default class AuxScreen extends React.Component {
  constructor(){
    super();
    this.state = {
      time: {hours: '',
             minutes: '',
             seconds: '',
             day: '',
             date: '',
             month: ''},
    };
  }

  componentDidMount = () => {
    this.timeInterval = setInterval(
      () => this.time(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
  }

  time() {
    let hours = new Date().getHours()+1;
    let minutes = new Date().getMinutes();
    let seconds = new Date().getSeconds();
    if(hours < 10) hours = '0'+hours;
    if(minutes < 10) minutes = '0'+minutes;
    if(seconds < 10) seconds = '0'+seconds;
    let day = new Date().getDay();
    let date = new Date().getDate();
    let month = new Date().getMonth();

    day = dateFormater.formateWeekday(day);
    month = dateFormater.formateMonth(month);

    this.setState({
      time: {hours: hours,
             minutes: minutes,
             seconds: seconds,
             day: day,
             date: date,
             month: month}
    });
  }

  render() {
    return(
      <div className="main">

        <div id="clock">
          {this.state.time.hours}:{this.state.time.minutes}:{this.state.time.seconds}
        </div>
        <div id="date">
          {this.state.time.day}&nbsp;{this.state.time.date}&nbsp;{this.state.time.month}
        </div>

        <Relay />

        <div id="calendar">
          <h3>Agenda</h3>
          <Calendar />
        </div>

        <Weather />

      </div>
    );
  }
}
