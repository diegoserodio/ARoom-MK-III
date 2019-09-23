var express = require('express');
var app = express();
app.use(express.static('public'));
var server = app.listen(3000, '0.0.0.0');
var socket = require('socket.io');
var io = socket(server);

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const serialport = new SerialPort('/dev/ttyACM0', { baudRate: 250000 });
const parser = new Readline();
serialport.pipe(parser);

parser.on('data', function sendMsg(data){
  io.sockets.emit('arduino', data);
});

io.sockets.on('connection', function newConnection(socket) {
  console.log('New connection: ', socket.id);
  socket.on('mouse', function mouseMsg(data) {
    socket.broadcast.emit('mouse', data);
    console.log(data);
  });
  socket.on('serial', function handleSerial(command) {
    console.log('Received serial command:', command);
    serialport.write(new Buffer(command.data+'/'));
  });
});
