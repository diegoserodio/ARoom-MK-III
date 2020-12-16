import fetch from 'isomorphic-fetch';
import socketIOClient from 'socket.io-client'
import apiConfig from './../apiKeys'

import { getWeather } from './../APIs/Weather.js'
import { listUpcomingEventsToday } from './../APIs/Calendar.js'
import { phatic, confirm, NLG_weather, NLG_alarm } from './NLG'

let socket = socketIOClient(apiConfig.ARDUINO_ENDPOINT);

let arduino_res = '';

socket.on('arduino', (data) => {
    if(data.indexOf('response') !== -1){
      if(data.indexOf('light_on') !== -1){
        arduino_res = '*A luz foi acesa*';
      }
      else if(data.indexOf('light_off') !== -1){
        arduino_res = '*A luz foi apagada*';
      }
      else if(data.indexOf('fan_on') !== -1){
        arduino_res = '*O ventilador foi ligado*';
      }
      else if(data.indexOf('fan_off') !== -1){
        arduino_res = '*O ventilador foi desligado*';
      }
      else if(data.indexOf('led') !== -1){
        arduino_res = '*A cor da fita de LED foi alterada*';
      }
    }
});

export function GET_arduino_res() {
  let response = arduino_res;
  arduino_res = '';
  return response
}
