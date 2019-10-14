import React from 'react';
import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Nav,
  NavItem, NavLink, TabContent, TabPane} from 'reactstrap';
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import './Styles/home.css'
import light_on from './assets/lightbulb_on.svg'
import light_off from './assets/lightbulb_off.svg'
import fan_on from './assets/fan_on.svg'
import fan_off from './assets/fan_off.svg'
import socketIOClient from 'socket.io-client'

export default class Home extends React.Component {
  constructor(){
    super();
    this.state = {
      endpoint: "192.168.15.11:4001",
      received: '',
      light_img: light_off,
      fan_img: fan_off,

      red: 0,
      green: 0,
      blue: 0,
      active_tab: '1',
    };
    this.socket = socketIOClient(this.state.endpoint);
    this.old_command = "";
    this.send('serial', 'get_status');
  }

  // sending sockets
  send = (topic, data) => {
    var command = {data: data};
    this.socket.emit(topic, command);
  }
  ///

  handleRedChange = (event) => {
    this.setState({
      red: event.target.value
    });
  }
  handleGreenChange = (event) => {
    this.setState({
      green: event.target.value
    });
  }
  handleBlueChange = (event) => {
    this.setState({
      blue: event.target.value
    });
  }
  handleRedComplete = (event) => {
    var command = 'r_slider:'+event.target.value;
    this.send('serial', command);
  }
  handleGreenComplete = (event) => {
    var command = 'g_slider:'+event.target.value;
    this.send('serial', command);
  }
  handleBlueComplete = (event) => {
    var command = 'b_slider:'+event.target.value;
    this.send('serial', command);
  }

  render() {
    this.socket.on('arduino', (data) => {
      if(data != this.old_command){
        console.log(data);
        if(data.indexOf('response') != -1){
      		if(data.indexOf('light_on') != -1){
            this.setState({
              light_img: light_on
            });
      		}
          else if(data.indexOf('light_off') != -1){
            this.setState({
              light_img: light_off
            });
      		}
          else if(data.indexOf('fan_on') != -1){
            this.setState({
              fan_img: fan_on
            });
      		}
          else if(data.indexOf('fan_off') != -1){
            this.setState({
              fan_img: fan_off
            });
    		  }
        }
        this.old_command = data;
      }
    })
    return(
      <div className="home">
      <p>
        <div className="card_div">
          <Card>
          <img src={this.state.light_img} width="150" height="150"/>
          <CardBody>
            <CardTitle>Lâmpada{"\n"}</CardTitle>
            <p>
            <Button color="success" onClick={() => this.send('serial', 'light_on')}>Ligar</Button>
            <Button color="danger" onClick={() => this.send('serial', 'light_off')}>Desligar</Button>
            </p>
          </CardBody>
          </Card>
        </div>

        <div className="card_div">
          <Card>
          <img src={this.state.fan_img} width="150" height="150"/>
          <CardBody>
            <CardTitle>Ventilador{"\n"}</CardTitle>
            <p>
            <Button color="success" onClick={() => this.send('serial', 'fan_on')}>Ligar</Button>
            <Button color="danger" onClick={() => this.send('serial', 'fan_off')}>Desligar</Button>
            </p>
          </CardBody>
          </Card>
        </div>
      </p>


      <p>
        <div className="card_div">
          <Card>
          <CardBody>
          <CardTitle><h2>Fita de LED</h2>{"\n"}</CardTitle>
          <Nav tabs>
            <NavItem>
              <NavLink
              onClick={() => {this.setState({active_tab: '1'}); this.send('serial', 'strip_color_on');}}>
                RGB
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
              onClick={() => {this.setState({active_tab: '2'}); this.send('serial', 'strip_music_on');}}>
                Música
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.active_tab}>
          <TabPane tabId="1">
              <p>
              <div className="sliderDiv">
                <input
                  id="red"
                  type="range"
                  className="slider red"
                  min="0" max="255"
                  value={this.state.red}
                  onChange={this.handleRedChange}
                  onMouseUp={this.handleRedComplete}
                  step="1"/>
                  <h3>{this.state.red}</h3>
              </div>
              </p>

              <p>
              <div className="sliderDiv">
                <input
                  id="green"
                  type="range"
                  className="slider green"
                  min="0" max="255"
                  value={this.state.green}
                  onChange={this.handleGreenChange}
                  onMouseUp={this.handleGreenComplete}
                  step="1"/>
                  <h3>{this.state.green}</h3>
              </div>
              </p>

              <p>
              <div className="sliderDiv">
                <input
                  id="blue"
                  type="range"
                  className="slider blue"
                  min="0" max="255"
                  value={this.state.blue}
                  onChange={this.handleBlueChange}
                  onMouseUp={this.handleBlueComplete}
                  step="1"/>
                  <h3>{this.state.blue}</h3>
              </div>
              </p>
          </TabPane>
          </TabContent>
          </CardBody>
          </Card>
        </div>
      </p>
      </div>
    );
  }
}
