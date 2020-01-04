var express = require('express');
var app = express();
app.use(express.static('public'));
var server = app.listen(4001, '0.0.0.0');
var socket = require('socket.io');
var io = socket(server);

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const serialport = new SerialPort('/dev/ttyACM0', { baudRate: 250000 });
const parser = new Readline();
serialport.pipe(parser);

// EVA
const {Wit, log} = require('node-wit');
const client = new Wit({accessToken: 'JG2IEWS64CS6D7CH4245E3DPWSLBK6D4'});

let stats = {
  light: false,
  fan: false,
  led: {
    color: false,
    music: false,
    red: 0,
    blue: 0,
    green: 0,
  }
};

parser.on('data', function sendMsg(data){
  if(data.includes('light_on')) stats.light = true;
  else if(data.includes('light_off')) stats.light = false;
  else if(data.includes('fan_on')) stats.fan = true;
  else if(data.includes('fan_off')) stats.fan = false;
  else if(data.includes('led')){
    stats.led.red = parseInt(data.substring(17, 20))-100;
    stats.led.green = parseInt(data.substring(27, 30))-100;
    stats.led.blue = parseInt(data.substring(36, 39))-100;
    if(stats.led.red == 300 && stats.led.green == 300 && stats.led.blue == 300){
      stats.led.music = true;
      stats.led.color = false;
    }else{
      stats.led.music = false;
      stats.led.color = true;
    }
  }
  io.emit('arduino', data);
});

io.on('connection', function newConnection(socket) {
  console.log('New connection: ', socket.id);
  socket.on('serial', function handleSerial(command) {
    console.log('Sending Arduino command:', command);
    serialport.write(new Buffer(command.data+'/'));
  });
  socket.on('eva', function handleEVA(command) {
    console.log('Received EVA command:', command);
  });
});


// client.message('Ligue o ventilador', {})
// .then((data) => {
//   console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));
// })
// .catch(console.error);
