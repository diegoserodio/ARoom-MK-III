import React from 'react';
import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button} from 'reactstrap';
import './Styles/home.css'
import light_on from './assets/lightbulb_on.svg'
import light_off from './assets/lightbulb_off.svg'
import socketIOClient from 'socket.io-client'

export default class Home extends React.Component {
  constructor(){
    super();
    this.state = {
      endpoint: "192.168.15.10:4001",
      received: '',
      light_img: light_off
    };

    this.socket = socketIOClient(this.state.endpoint);
  }

  // sending sockets
  send = (topic, data) => {
    const socket = socketIOClient(this.state.endpoint);
    var command = {data: data};
    socket.emit(topic, command);
  }
  ///

  render() {
    this.socket.on('arduino', (data) => {
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
      }
    })
    return(
      <div className="home">
        <div className="card_div">
          <Card>
          <img src={this.state.light_img} width="200" height="200"/>
          <CardBody>
            <CardTitle>Lâmpada{"\n"}</CardTitle>
            <p>
            <Button color="success" onClick={() => this.send('serial', 'light_on')}>Ligar</Button>
            <Button color="danger" onClick={() => this.send('serial', 'light_off')}>Desligar</Button>
            </p>
          </CardBody>
          </Card>
        </div>
      </div>
    );
  }
}
