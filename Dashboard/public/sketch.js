window.SpeechRecognition = window.SpeechRecognition || window.
webkitSpeechRecognition;
var synth = window.speechSynthesis;

let socket, assistant;
const recognition = new SpeechRecognition();;

function setup() {
	createCanvas(windowWidth, windowHeight);
	socket = new Socket('http://localhost:3000');
	assistant = new Assistant('Raquel', 'Diego', synth);
	socket.watchChanges();
}

listen_for_commands();

function draw() {
	if(assistant.listening){
		background(200, 200, 200);
	}else{
		background(100, 0, 100);
	}
}

function listen_for_commands(){
	recognition.interimResults = true;
	recognition.addEventListener('result', e =>{
	  var response = '';
	  var recognition_array = Array.from(e.results);
	  const transcript = recognition_array
	  .map(result => result[0])[0].transcript;
	  const isFinal = recognition_array[0].isFinal;
	  if(isFinal){
			response = assistant.handle(transcript);
			console.log('Sending command: ', assistant.topic, assistant.command);
			socket.emit(assistant.topic, assistant.command);
			assistant.topic = '';
			assistant.command.data = '';
		}
	});
	recognition.addEventListener('end', recognition.start);
	recognition.start();
}
