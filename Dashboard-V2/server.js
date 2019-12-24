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

var old_command = "";

parser.on('data', function sendMsg(data){
  // if(data != old_command){
  //   console.log('Received Arduino responde:', data);
  //   io.emit('arduino', data);
  //   old_command = data;
  // }
  io.emit('arduino', data);
});

io.on('connection', function newConnection(socket) {
  console.log('New connection: ', socket.id);
  socket.on('serial', function handleSerial(command) {
    console.log('Sending Arduino command:', command);
    serialport.write(new Buffer(command.data+'/'));
  });
});

// const fetch = require('node-fetch');
//
// const weatherURL =
// `http://api.openweathermap.org/data/2.5/forecast?id=3471291&APPID=3c4cd77d32d078ed79bda23362cc591d`
//
// fetch(weatherURL)
//   .then(res => res.text())
//   .then(data => console.log("Data List Loaded", data))
//   .catch(error => console.dir(error));
