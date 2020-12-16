import React from 'react';
import { } from 'reactstrap';
import './../../Styles/arduino.css'
import socketIOClient from 'socket.io-client'
import apiConfig from './../../apiKeys'
import { HuePicker } from 'react-color';

import on from './../Assets/on.png'
import off from './../Assets/off.png'


export default class Relay extends React.Component {
  constructor(){
    super();
    this.state = {
      endpoint: "192.168.15.16:4001",
      light_status: false,
      light_img: off,
      fan_status: false,
      fan_img: off,
      ledstrip: {
        red: 0,
        green: 0,
        blue: 0
      },
      background: {
        r: 51,
        g: 51,
        b: 51,
        a: 1,
      },
      showPicker: false
    }
    this.socket = socketIOClient(apiConfig.ARDUINO_ENDPOINT);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeComplete = this.handleChangeComplete.bind(this);
    this.old_command = "";
  }

  componentDidMount = () => {
    this.send('serial', 'get_status');
  }

  // sending sockets
  send(topic, data){
    var command = {data: data};
    this.socket.emit(topic, command);
  }
  ///

  renderColorPicker(){
    return (
      <div className="d-flex justify-content-between align-items-center pl-3 pr-3 pb-2">
      <HuePicker
        color={ this.state.background }
        onChange={ this.handleChange }
        onChangeComplete={ this.handleChangeComplete }
      />
      </div>
    )
  }

  handleChange(color, event){
    this.setState({background:color.rgb})
  }

  handleChangeComplete(color, event) {
    let {r,g,b} = color.rgb;
    let request = `rgb:${r+100} ${g+100} ${b+100}`;
    this.send('serial', request);
  }

  toggle(device){
    let { fan_status, light_status } = this.state;
    let request = '';
    if(device==='fan'){
      if(fan_status) request = 'fan_off'
      else request = 'fan_on'
    }
    else if(device==='light'){
      if(light_status) request = 'light_off'
      else request = 'light_on'
    }
    this.send('serial', request);
  }

  render() {
    let {showPicker} = this.state;
    let {r,g,b} = this.state.background;
    this.socket.on('arduino', (data) => {
      if(data !== this.old_command){
        console.log(data);
        if(data.indexOf('response') !== -1){
      		if(data.indexOf('light_on') !== -1){
            this.setState({
              light_status: true,
              light_img: on
            });
      		}
          else if(data.indexOf('light_off') !== -1){
            this.setState({
              light_status: false,
              light_img: off
            });
      		}
          else if(data.indexOf('fan_on') !== -1){
            this.setState({
              fan_status: true,
              fan_img: on
            });
      		}
          else if(data.indexOf('fan_off') !== -1){
            this.setState({
              fan_status: false,
              fan_img: off
            });
    		  }
          else if(data.indexOf('led') !== -1){
            let red = parseInt(data.substring(17, 20))-100;
            let green = parseInt(data.substring(27, 30))-100;
            let blue = parseInt(data.substring(36, 39))-100;
            let background = {
              r: 200,
              g: 200,
              b: 200
            }
            if(red !== 300 || green !== 300 || blue !== 300){
              background.r = red;
              background.g = green;
              background.b = blue;
            }
            this.setState({background:background})
    		  }
        }
        this.old_command = data;
      }
    })

    return(
      <div className="row d-flex justify-content-end">
      <div
        className="col-6"
        style={{
          margin:10,
          padding:5,
          background:'rgba(128,128,128,0.7)',
          borderRadius:15
        }}>
          <div
            className="btn d-flex justify-content-between align-items-center p-3"
            style={{fontSize:20,color:'#fff'}}
            onClick={() => this.toggle('light')}
          >
            Lâmpada
            <img src={this.state.light_img} height="20" width="40"/>
          </div>
          <div
            className="btn d-flex justify-content-between align-items-center p-3"
            style={{fontSize:20,color:'#fff'}}
            onClick={() => this.toggle('fan')}
          >
            Ventilador
            <img src={this.state.fan_img} height="20" width="40"/>
          </div>
          <div
            className="btn d-flex justify-content-between align-items-center p-3"
            style={{fontSize:20,color:'#fff'}}
            onClick={() => {
              this.setState({showPicker:!showPicker});
              this.send('serial', 'strip_color_on');
            }}>
            Fita de LED
            <div
              style={{
                background: 'rgb('+r+','+g+','+b+')',
                width:40,
                height:20,
                borderRadius:20
              }} />
          </div>
          {showPicker && this.renderColorPicker()}
      </div>
      </div>
    );
  }
}
