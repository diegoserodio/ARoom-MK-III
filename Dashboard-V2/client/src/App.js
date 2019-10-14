import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './Styles/normalize.css';
import SideBar from './sidebar';
import Home from './home';
// import socketIOClient from 'socket.io-client'

// Making the App component
class App extends Component {
  constructor() {
    super();
    // this.state = {
    //   endpoint: "192.168.15.10:4001",
    //   received: ''
    // };
    //
    // this.socket = socketIOClient(this.state.endpoint);

  }

  // sending sockets
  // send = (topic, data) => {
  //   const socket = socketIOClient(this.state.endpoint);
  //   var command = {data: data};
  //   socket.emit(topic, command);
  // }
  ///

  // render method that renders in code if the state is updated
  render() {
    // this.socket.on('arduino', (data) => {
    //   if(data.indexOf('response') != -1){
    // 		if(data.indexOf('light_on') != -1){
    //       this.setState({
    //         received: 'Light On'
    //       });
    // 		}
    //     else if(data.indexOf('light_off') != -1){
    //       this.setState({
    //         received: 'Light Off'
    //       });
    // 		}
    //   }
    // })
    return (
      <div>
      <script src="https://sdk.scdn.co/spotify-player.js"></script>
        <SideBar />
        <Home />
      </div>
    )
  }
}

export default App;
