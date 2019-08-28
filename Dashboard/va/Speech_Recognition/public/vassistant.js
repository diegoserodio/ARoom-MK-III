class Assistant{
  constructor(a_name, user_name, a_synth){
    this.a_name = a_name;
    this.user_name = user_name;
    this.synth = a_synth;
  }

  handle(command){
    var response = "";
    if(command.indexOf('seu') != -1 && command.indexOf('nome') != -1){
      response = "Meu nome é "+this.a_name;
      this.speak(response);
    }
    return response;
  }

  speak(phrase){
      if (this.synth.speaking) {
          console.error('speechSynthesis.speaking');
          return;
      }
      var utterThis = new SpeechSynthesisUtterance(phrase);
      utterThis.onend = function (event) {
          console.log('SpeechSynthesisUtterance.onend');
      }
      utterThis.onerror = function (event) {
          console.error('SpeechSynthesisUtterance.onerror');
      }
      utterThis.voice = this.synth.getVoices()[14];
      utterThis.pitch = 0.7;
      utterThis.rate = 1.2;
      this.synth.speak(utterThis);
  }
}

window.SpeechRecognition = window.SpeechRecognition || window.
webkitSpeechRecognition;
var synth = window.speechSynthesis;

var assistant = new Assistant('Raquel', 'Diego', synth);

const recognition = new SpeechRecognition();
recognition.interimResults = true;

recognition.addEventListener('result', e =>{
  var response = '';
  var recognition_array = Array.from(e.results);
  const transcript = recognition_array
  .map(result => result[0])[0].transcript;
  const isFinal = recognition_array[0].isFinal;
  if(isFinal)response = assistant.handle(transcript);
  document.getElementById('user_command').innerHTML = assistant.user_name+": "+transcript;
  document.getElementById('assistant_response').innerHTML = assistant.a_name+": "+response;
});

recognition.addEventListener('end', recognition.start);

recognition.start();
