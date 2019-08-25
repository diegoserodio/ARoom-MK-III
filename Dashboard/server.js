var express = require('express');
var SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
var app = express();
var server = app.listen(3000);

var serialport = new SerialPort("/dev/ttyACM0" , {baudRate : 256000});
const parser = new Readline();
serialport.pipe(parser);

app.use(express.static('public'));

var socket = require('socket.io');
var io = socket(server);

parser.on('data', line => console.log(`> ${line}`));

io.sockets.on('connection', function newConnection(socket) {
  console.log('New connection: ', socket.id);
  socket.on('mouse', function mouseMsg(data) {
    socket.broadcast.emit('mouse', data);
    console.log(data);
    serialport.write(new Buffer(data.stats.toString()+'/'));
  });
});
