import React from 'react';
import { } from 'reactstrap';
import './../Styles/process.css';
import Speech from "speak-tts";

export default class Process extends React.Component {
  constructor(){
    super();
    this.state = {

    };
    this.speech = new Speech();
  }

  componentDidMount(){
    this.init();
  }

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
    if(command.includes('horas')){
      let hour = new Date().getHours();
      this.speech
        .speak({
          text: 'Agora são'+hour+'horas',
          queue: false,
          listeners: {
            onstart: () => {
              console.log("Start utterance");
            },
            onend: () => {
              console.log("End utterance");
            },
            onresume: () => {
              console.log("Resume utterance");
            },
          }
        })
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
