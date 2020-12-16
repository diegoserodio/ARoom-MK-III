import fetch from 'isomorphic-fetch';
import socketIOClient from 'socket.io-client'
import apiConfig from './../apiKeys'

import { getWeather } from './../APIs/Weather.js'
import { createEvent, listUpcomingEvents } from './../APIs/Calendar.js'
import { phatic, confirm, NLG_weather, NLG_alarm , NLG_agenda} from './NLG'

let understanding = true;

let endpoint = "192.168.0.170:4001";
let socket = socketIOClient(apiConfig.ARDUINO_ENDPOINT);

export async function handleCommand(va_name, c){
  let answer = '';
  let command = c.toLowerCase();
  if(command.includes(va_name[0]) || command.includes(va_name[1])){
    understanding = true;
    if(command === va_name[0] || command === va_name[1])return phatic();
  }

  if(understanding){
    let req = command.replace(va_name[0], '').replace(va_name[1], '');
    return wit(req);
  }
  return answer
}

async function wit(command){
  let req = command.trim().replace(/ /g, '%20');
  console.log("Fetching response...");
  let result = '';
  const promisse = await fetch(
      `https://api.wit.ai/message?q=${req}`,
      {
        method: 'GET',
        headers: {Authorization: `Bearer ${apiConfig.WIT_TOKEN}`}
      }
    )
    .then(response => response.json())
    .then(json =>  result=processJson(json));
  return result
}

function processJson(json){
  let relayIntents = ['fan', 'light'];
  console.log(json);
  let recognitionError = true;

  //Checking if some information was returned
  if(!json.error){
    if(json.entities.intent !== undefined){
      let entities = json.entities;
      let intent = entities.intent[0].value;

      //----------------------------RELAY----------------------------
      if(relayIntents.indexOf(intent) !== -1){
        //Checking for complete information
        if(entities.state !== undefined){
          let state = entities.state[0].value;
          let request = intent+'_'+state;
          understanding=false;
          send('serial', request);
          return '...';
        }
      }

      //----------------------------STRIP----------------------------
      else if(intent==='strip'){
        const strip_dict = {
          'vermelho': '355 100 100',
          'vermelha': '355 100 100',
          'verde': '100 355 100',
          'azul': '100 100 355',
          'amarelo': '355 355 100',
          'amarela': '355 355 100',
          'cinza': '227 227 227',
          'branco': '355 355 355',
          'branca': '355 355 355',
          'rosa': '355 100 355',
          'roxo': '200 100 300',
          'roxa': '200 100 300',
          'ciano': '100 355 355',
          'cinza': '200 200 200',
          'marrom': '200 150 100',
        };
        //Checking for complete information
        if(entities.color !== undefined){
          let color = entities.color[0].value;
          let request = 'rgb:'+strip_dict[color];
          understanding=false;
          send('serial', request);
          return '...';
        }else if(entities.state !== undefined){
          let state = entities.state[0].value;
          let request;
          if(state==='off')request = intent+'_'+state;
          else if(state==='on')request = 'rgb:'+strip_dict['branco'];
          understanding=false;
          send('serial', request);
          return '...';
        }
      }

      //----------------------------WEATHER----------------------------
      else if(intent==='get_weather'){
        let city = undefined, datetime = undefined;
        //Checking for complete information
        if(entities.city !== undefined){
          city = entities.city[0].value;
        }
        if(entities.datetime !== undefined){
          datetime = entities.datetime[0].value.split('T')[0];
        }
        understanding=false;
        return(getWeather(city, datetime).then(res => NLG_weather(res, city)));
      }

      //----------------------------PHATIC----------------------------
      else if(intent==='phatic')return phatic();

      //----------------------------CANCEL----------------------------
      else if(intent==='cancel'){
        understanding = false;
        return confirm();
      }

      //----------------------------ALARM----------------------------
      else if(intent==='alarm'){
        understanding = false;
        if(entities.datetime !== undefined){
          let datetime = entities.datetime[0].value;
          createEvent('Acordar', datetime);
          return NLG_alarm(datetime);
        }
      }

      //----------------------------CALENDAR----------------------------
      else if(intent==='post_calendar'){ //Add to calendar
        understanding = false;
        createEvent();
        return 'Ok, criando evento';
      }
      else if(intent==='get_agenda'){ //Check from calendar
        understanding = false;
        let datetime = new Date().toISOString();
        if(entities.datetime !== undefined)datetime = entities.datetime[0].value;
        let date = new Date(datetime).getMonth()+1 +'-'+ new Date(datetime).getDate();
        return listUpcomingEvents(date).then(res => NLG_agenda(res, new Date(datetime).getDay()));
      }
    }
  }
  if(recognitionError){
    return 'Desculpa, não entendi';
  }
}

// sending sockets
function send(topic, data) {
  let command = {data: data};
  socket.emit(topic, command);
}
///
