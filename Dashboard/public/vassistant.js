class Assistant{
  constructor(a_name, user_name, synth){
    this.a_name = a_name;
    this.user_name = user_name;
    this.synth = synth;
    this.topic = '';
    this.command = {data: ''};
    this.listening = false;
    this.validation = "";
  }

  handle(command){
    var response = "";
    command += this.validation;
    command = command.toLowerCase();
    if(command == this.a_name){
      response = "Pois não";
      this.validation = this.a_name;
      this.listening = true;
    }
    else if(command.indexOf(this.a_name) != -1){
      if(command.indexOf('seu') != -1 && command.indexOf('nome') != -1){
        response = "Meu nome é "+this.a_name;
      }
      else if(command.indexOf('acende') != -1 && command.indexOf('luz') != -1){
        response = "Acendendo a luz";
        this.topic = 'serial';
        this.command.data = "light_on";
      }
      else if(command.indexOf('apaga') != -1 && command.indexOf('luz') != -1){
        response = "Apagando a luz";
        this.topic = 'serial';
        this.command.data = "light_off";
      }
      else if(command.indexOf('liga') != -1 && command.indexOf('ventilador') != -1){
        response = "Ligando o ventilador";
        this.topic = 'serial';
        this.command.data = "fan_on";
      }
      else if(command.indexOf('desliga') != -1 && command.indexOf('ventilador') != -1){
        response = "Desligando o ventilador";
        this.topic = 'serial';
        this.command.data = "fan_off";
      }
      if(response != ""){
        this.validation = "";
        this.listening = false;
      }
    }
    this.speak(response);
    return response;
  }

  speak(phrase){
      if (this.synth.speaking) {
          console.error('speechSynthesis.speaking');
          return;
      }
      var utterThis = new SpeechSynthesisUtterance(phrase);
      utterThis.onerror = function (event) {
          console.error('SpeechSynthesisUtterance.onerror');
      }
      utterThis.voice = this.synth.getVoices()[14];
      utterThis.pitch = 0.8;
      utterThis.rate = 1.2;
      this.synth.speak(utterThis);
  }
}
