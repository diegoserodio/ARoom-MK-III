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
      time: {hours: new Date().getHours(),
             minutes: new Date().getMinutes(),
             seconds: new Date().getSeconds(),
             day: new Date().getDay(),
             date: new Date().getDate(),
             month: new Date().getMonth(),},
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
    let hours_ = new Date().getHours()+1;
    let minutes_ = new Date().getMinutes();
    let seconds_ = new Date().getSeconds();
    if(hours_ < 10) hours_ = '0'+hours_;
    if(minutes_ < 10) minutes_ = '0'+minutes_;
    if(seconds_ < 10) seconds_ = '0'+seconds_;
    let day = new Date().getDay();
    let date = new Date().getDate();
    let month = new Date().getMonth();

    day = dateFormater.formateWeekday(day);
    month = dateFormater.formateMonth(month);

    this.setState({
      time: {hours: hours_,
             minutes: minutes_,
             seconds: seconds_,
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
