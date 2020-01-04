import React from 'react';
import { } from 'reactstrap';
import './../Styles/process.css';
import Speech from "speak-tts";
import socketIOClient from 'socket.io-client'

export default class Process extends React.Component {
  constructor(){
    super();
    this.state = {
      endpoint: "192.168.15.12:4001",
    };
    this.speech = new Speech();
    this.socket = socketIOClient(this.state.endpoint);
    this.old_command = "";
  }

  componentDidMount(){
    this.init();
  }

  // sending sockets
  send = (topic, data) => {
    var command = {data: data};
    this.socket.emit(topic, command);
  }
  ///

  init(){
    this.speech
      .init({
        volume: 0.5,
        lang: "pt-BR",
        rate: 1.2,
        pitch: 1,
        voice:'Google português do Brasil',
      })
      .then(data => {
        console.log("Speech is ready", data);
      })
      .catch(e => {
        console.error("An error occured while initializing : ", e);
      });
  }

  processCommand(command){
    if(command!=''){
      console.log(command);
      this.send('eva', command);
      // this.speech
      //   .speak({
      //     text: 'Comando '+command+' enviado com sucesso',
      //     queue: false,
      //     listeners: {
      //       onstart: () => {
      //         console.log("Start utterance");
      //       },
      //       onend: () => {
      //         console.log("End utterance");
      //       },
      //       onresume: () => {
      //         console.log("Resume utterance");
      //       },
      //     }
      //   })
    }
  }

  render() {
    return(
      <div className="main">
        {this.processCommand(this.props.command)}
      </div>
    );
  }
}
