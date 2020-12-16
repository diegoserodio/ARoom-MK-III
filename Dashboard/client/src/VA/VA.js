//------------------------IMPORT CORE ELEMENTS-----------------------------

import React from "react"
import socketIOClient from 'socket.io-client'
import { handleCommand } from './Process'
import { createEvent, listUpcomingEventsToday } from './../APIs/Calendar.js'
import { GET_arduino_res } from './Surveillance'
import apiConfig from './../apiKeys'

//------------------------IMPORT STYLES-----------------------------

import './../Styles/VA.css'
import va_on from './Assets/va_on.png'
import va_off from './Assets/va_off.png'

//------------------------SPEECH RECOGNITION-----------------------------

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new SpeechRecognition()
let utter = new SpeechSynthesisUtterance();


recognition.continous = true
recognition.interimResults = true
recognition.lang = 'pt-BR'

utter.rate = 1.2;
utter.pitch = 1;


//------------------------COMPONENT-----------------------------

export default class VA extends React.Component {
  constructor() {
    super()
    this.state = {
      endpoint: "192.168.0.170:4001",
      speaking: false,
      avatar: va_off,
      active: false,
      waiting: false,
      user_command: '',
      va_answer: '',
      user:{name:'Diego'},
      va:{name:'Edith'}
    }
    this.va_name = ['edite', 'edith'];
    this.socket = socketIOClient(apiConfig.ARDUINO_ENDPOINT);
    this.voice = null;
  }

//------------------------EVENT RECOGNITION-----------------------------

  async componentDidMount(){
    recognition.start();
    let synth = window.speechSynthesis;
    recognition.onresult = e => {
      const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
      if(e.results[0].isFinal){
        if(this.state.active)handleCommand(this.va_name, transcript).then(this.speak);
      }
      this.setState({user_command:transcript})
    }

    // event when recognition finishes
    recognition.onend = e => {
      if(!this.state.speaking){
        recognition.start();
      }
    }

    // event when text has is spoken
    utter.onstart = () => {
      this.setState({speaking:true});
      recognition.stop();
  	}

    // event after text has been spoken
  	utter.onend = () => {
      recognition.start();
      this.setState({speaking:false});
    }

    //------------------------SURVEILLANCE-----------------------------
    this.checkArduino = setInterval(
      () => {
        let res = GET_arduino_res();
        if(this.state.waiting && res!==''){
          this.setState({va_answer:res});
          this.setState({waiting:false});
        }
      },
      100
    );
  }

  componentWillUnmount() {
    clearInterval(this.checkArduino);
  }

//------------------------ACTIONS-----------------------------

  toggleVA = () => {
    if(this.state.active){
      this.setState({avatar:va_off, active:false, user_command:'', va_answer:''});
      this.speak("Assistente desativada");
    }else{
      this.setState({avatar:va_on, active:true});
      this.speak("Assistente ativada");
    }
  }

  speak = (answer) => {
    let va_answer=answer;
    if(answer.length>65){
      va_answer = [<h4>{answer.slice(0, 65)}</h4>,<h4>{answer.slice(65)}</h4>];
    }
  	utter.text = answer;
    this.setState({va_answer:answer});

  	// speak
  	if(answer!=='...' && !answer.includes('*')){
      window.speechSynthesis.speak(utter);
    }else{
      this.setState({waiting:true});
    }
  }

//------------------------RENDER VISUALS-----------------------------

  render() {
    return (
      <div>
        <div className="togglecontainer">
          <img src={this.state.avatar} onClick={this.toggleVA} style={{fill: '#ffffff'}} height="90" width="90"/>
        </div>
        {this.state.user_command!=='' && <div className="textbox" id="user">
          {this.state.user.name}: {this.state.user_command}
        </div>}
        <div>
        {this.state.va_answer!=='' &&
          <div className="textbox" id="vaTop">
            {this.state.va.name}: {this.state.va_answer.length>60 ? this.state.va_answer.slice(0,61) : this.state.va_answer}
          </div>}
        {this.state.va_answer.length>65 &&
          <div className="textbox" id="vaBot">
            {this.state.va_answer.length>137 ? this.state.va_answer.slice(0,134)+'...' : this.state.va_answer.slice(61)}
          </div>}
        </div>
      </div>
    )
  }
}
