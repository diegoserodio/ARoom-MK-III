import React from 'react';
import { } from 'reactstrap';
import dateFormater from './../Helpers/dateFormaters'

import Calendar from './Components/calendar';
import Relay from './Components/arduino';
import Weather from './Components/weather';
import VA from './../VA/VA';

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
    let hours = new Date().getHours();
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
      <div className="container-fluid" style={{padding:0}}>
        <div className="row" style={{width:'100%'}}>

          <div
            className="col-lg-3"
            style={{
              color:'#fff',
              paddingLeft:40
            }}>
            <div
              style={{
                fontSize:80,
                textShadow:'-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000'
              }}>
              {this.state.time.hours}:{this.state.time.minutes}:{this.state.time.seconds}
            </div>
            <div
              style={{
                fontSize:35,
                textShadow:'-0.5px -0.5px 0 #000,0.5px -0.5px 0 #000,-0.5px 0.5px 0 #000,0.5px 0.5px 0 #000',
              }}>
              {this.state.time.day}&nbsp;{this.state.time.date}&nbsp;{this.state.time.month}
            </div>
          </div>

          <div className="col-lg-6">
            <Relay />
            <Calendar />
          </div>

          <div className="col-lg-3">
            <Weather />
          </div>
        </div>
      </div>
    );
  }
}
