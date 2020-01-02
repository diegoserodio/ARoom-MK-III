import React from 'react';
import { } from 'reactstrap';
import './Styles/arduino.css'
import socketIOClient from 'socket.io-client'

import on from './assets/on.png'
import off from './assets/off.png'


export default class Relay extends React.Component {
  constructor(){
    super();
    this.state = {
      endpoint: "192.168.15.12:4001",
      light_img: off,
      fan_img: off,
      ledstrip: {
        red: 0,
        green: 0,
        blue: 0
      },
    }
    this.socket = socketIOClient(this.state.endpoint);
    this.old_command = "";
  }

  componentDidMount = () => {
    this.send('serial', 'get_status');
  }

  // sending sockets
  send = (topic, data) => {
    var command = {data: data};
    this.socket.emit(topic, command);
  }
  ///

  render() {
    this.socket.on('arduino', (data) => {
      if(data != this.old_command){
        console.log(data);
        if(data.indexOf('response') != -1){
      		if(data.indexOf('light_on') != -1){
            this.setState({
              light_img: on
            });
      		}
          else if(data.indexOf('light_off') != -1){
            this.setState({
              light_img: off
            });
      		}
          else if(data.indexOf('fan_on') != -1){
            this.setState({
              fan_img: on
            });
      		}
          else if(data.indexOf('fan_off') != -1){
            this.setState({
              fan_img: off
            });
    		  }
          else if(data.indexOf('led') != -1){
            let red = parseInt(data.substring(17, 20))-100;
            let green = parseInt(data.substring(27, 30))-100;
            let blue = parseInt(data.substring(36, 39))-100;
            if(red == 300 && green == 300 && blue == 300){
              this.state.ledstrip.red = 200;
              this.state.ledstrip.green = 200;
              this.state.ledstrip.blue = 200;
            }else{
              this.state.ledstrip.red = red;
              this.state.ledstrip.green = green;
              this.state.ledstrip.blue = blue;
            }
    		  }
        }
        this.old_command = data;
      }
    })

    return(
      <div id="room_stats">
          <div className="relay">
          Lâmpada&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
          <img src={this.state.light_img} height="20" width="40"/>
          <div className="relay">
          Ventilador&nbsp;&nbsp;&nbsp;
          </div>
          <img src={this.state.fan_img} height="20" width="40"/>
          <div className="relay">
          Fita de LED
          </div>
          <div id="led_indicator" style={{background: 'rgb('+this.state.ledstrip.red+','+this.state.ledstrip.green+','+this.state.ledstrip.blue+')'}}></div>
      </div>
    );
  }
}
