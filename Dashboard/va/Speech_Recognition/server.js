var express = require('express');
var app = express();
app.use(express.static('public'));
var server = app.listen(3000);
var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', function newConnection(socket) {
  console.log('New connection: ', socket.id);
});
