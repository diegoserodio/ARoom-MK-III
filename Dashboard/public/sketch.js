var socket;

function setup() {
	createCanvas(windowWidth, windowHeight);
	socket = io.connect('http://localhost:3000');
	socket.on('mouse', function receiveMsg(data) {
		console.log('Received:', data);
	});
	socket.on('data', function receiveDataMsg(data) {
		console.log('Received:', data);
	});
}

function draw() {
	background(100, 0, 100);
}

function mouseDragged() {
	console.log('Sending data: ', mouseX);
	socket.emit('mouse', {stats: mouseX});
}
