class Socket {
  constructor(path) {
    this.path = path;
    this.socket = socket;
    this.socket = io.connect(path);
  }

  watchChanges(){
    this.socket.on('mouse', function receiveMsg(data) {
  		console.log('Received from mouse:', data);
  	});
  	this.socket.on('data', function receiveDataMsg(data) {
  		console.log('Received from data:', data);
  	});
  }

  emit(topic, info){
    this.socket.emit(topic, info);
  }

  test(){
    console.log("The test was successful!!!");
  }
}
