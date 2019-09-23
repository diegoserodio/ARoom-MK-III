// window.SpeechRecognition = window.SpeechRecognition || window.
// webkitSpeechRecognition;
// var synth = window.speechSynthesis;
// const recognition = new SpeechRecognition();
let socket, assistant, mic, fft;
let top_panel, bot_left_panel, bot_right_panel;
let r_slider, g_slider, b_slider, r_slider_old, g_slider_old, b_slider_old;
let strip_mode_btn = 0, strip_color_sts = false, strip_music_sts = false;
let button = [];
let old_bass = 0;

let btnOn_img, btnOff_img, back_img, next_img,
rgbOff_img, rgbOn_img, musicOff_img, musicOn_img;

function preload() {
  btnOn_img = loadImage('assets/toggle_on.png');
	btnOff_img = loadImage('assets/toggle_off.png');
  back_img = loadImage('assets/back.png');
  next_img = loadImage('assets/next.png');
  rgbOff_img = loadImage('assets/rgb_off.png');
  rgbOn_img = loadImage('assets/rgb_on.png');
  musicOff_img = loadImage('assets/music_off.png');
  musicOn_img = loadImage('assets/music_on.png');
}

let clock;

function setup() {
	createCanvas(windowWidth, windowHeight);
	// assistant = new Assistant('raquel', 'diego', synth);
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
	socket = io.connect('http://192.168.15.10:3000');
	watchChanges();
	top_panel =  new Panel(
		10,
		10,
		windowWidth-20,
		windowHeight/2-10
	);
	bot_left_panel =  new Panel(
		10,
		windowHeight/2+10,
		windowWidth/2-10,
		windowHeight-410
	);
	bot_right_panel =  new Panel(
		windowWidth/2+10,
		windowHeight/2+10,
		width-700,
		windowHeight-410
	);
  button[0] = new Button(
		windowWidth-150,
		windowHeight/2+50,
		100,
		50,
	);
	button[1] = new Button(
		windowWidth-150,
		windowHeight/2+100,
		100,
		50,
	);
  button[2] = new Button(
		windowWidth/2-350,
		windowHeight/2+100,
		50,
		50,
    back_img,
    back_img,
	);
  button[3] = new Button(
		windowWidth/2-250,
		windowHeight/2+75,
		100,
		100,
    rgbOn_img,
    rgbOff_img
	);
  button[4] = new Button(
		windowWidth/2-100,
		windowHeight/2+100,
		50,
		50,
    next_img,
    next_img
	);
  //Create the sliders
  r_slider = createSlider(0, 255, 0);
  r_slider.position(50, windowHeight/2+100);
  g_slider = createSlider(0, 255, 0);
  g_slider.position(50, windowHeight/2+150);
  b_slider = createSlider(0, 255, 0);
  b_slider.position(50, windowHeight/2+200);
  r_slider_old = r_slider.value();
  g_slider_old = g_slider.value();
  b_slider_old = b_slider.value();
  clock = new Clock();
}

// listen_for_commands();

function draw() {
	background(46, 49, 54);
	drawElements();
	drawTexts();
  drawTopPanelElements();
	changeCursor();
  // setTimeout(handleStrip, 1000);
  handleStrip();
}

function handleStrip() {
  var command = {data: ''};
  if(strip_music_sts){
    let spectrum = fft.analyze();
    let bass_sum = 0;
    for(var i = 90; i < 211; i++){
      bass_sum += map(spectrum[i], 100, 255, 0, 20);
    }
    let bass = bass_sum/120;
    if(bass <= 0) bass = 0;
    bass = floor(bass);
    command.data = "bass:"+bass;
    let diff = abs(bass-old_bass);
    if(bass != 0 && diff >= 1){
      socket.emit('serial', command);
    }
  }
  else if(strip_color_sts){
      if(r_slider.value() != r_slider_old){
        command.data = "r_slider:"+r_slider.value();
        r_slider_old = r_slider.value();
        socket.emit('serial', command);
      }
      if(g_slider.value() != g_slider_old){
        command.data = "g_slider:"+g_slider.value();
        g_slider_old = g_slider.value();
        socket.emit('serial', command);
      }
      if(b_slider.value() != b_slider_old){
        command.data = "b_slider:"+b_slider.value();
        b_slider_old = b_slider.value();
        socket.emit('serial', command);
      }
  }
}

function mousePressed() {
    getAudioContext().resume()
}

function drawTopPanelElements() {
  // Greeting
  var date = new Date();
  textSize(32);
  fill(255);
  if(date.getHours() < 12){
    text('Bom dia', 50, 50);
  }
  else if(date.getHours() < 18){
    text('Boa tarde', 50, 50);
  }else{
    text('Boa noite', 50, 50);
  }

  //Frequency visualizer
  if(strip_music_sts){
    let spectrum = fft.analyze();
    let sum = 0;
    noStroke();
    for(var i = 0; i < spectrum.length; i++){
      sum += map(spectrum[i], 0, 255, 0, 250);
      if(i%30 == 0 && i != 0){
        let amp = sum/30;
        fill(255, 0, 0);
        rect(i+20, windowHeight/2-1-amp, 15, 5);
        fill(0, 255, 0);
        rect(i+20, windowHeight/2-1-amp+5, 15, amp-5);
        sum = 0;
      }
    }
  }
  //Time
  clock.draw();
}

function drawTexts() {
  stroke(0);
  //Led strip
  textSize(25);
  fill(255);
  text('Fita de LED', 20, windowHeight/2+50);
  textSize(20);
	fill(255, 0 , 0);
  text('R:', 20, windowHeight/2+120);
  fill(0, 255 , 0);
  text('G:', 20, windowHeight/2+170);
  fill(0, 0 , 255);
  text('B:', 20, windowHeight/2+220);
  //Relays
	textSize(25);
	fill(255);
	text('Luz', bot_right_panel.x+20, button[0].y+30);
	text('Ventilador', bot_right_panel.x+20, button[1].y+30);
}

function drawElements() {
	top_panel.draw();
	bot_left_panel.draw();
	bot_right_panel.draw();
	for(var i = 0; i < button.length; i++){
    button[i].draw();
	}
  //Bottom left
  switch (strip_mode_btn) {
    case 0:
      if(strip_color_sts){
        button[3].on_img = rgbOn_img;
        button[3].off_img = rgbOn_img;
      }else{
        button[3].on_img = rgbOff_img;
        button[3].off_img = rgbOff_img;
      }
      break;
    case 1:
    if(strip_music_sts){
      button[3].on_img = musicOn_img;
      button[3].off_img = musicOn_img;
    }else{
      button[3].on_img = musicOff_img;
      button[3].off_img = musicOff_img;
    }
      break;
    default:
      break;
  }
}

function mouseClicked() {
	var command = {data: ''};
	if(button[0].mouseOver()){
		if(button[0].status){
			command.data = 'light_off';
		}else{
			command.data = 'light_on';
		}
		//console.log('Sending Command: ', 'serial', command.data);
		socket.emit('serial', command);
	}
	if(button[1].mouseOver()){
		if(button[1].status){
			command.data = 'fan_off';
		}else{
			command.data = 'fan_on';
		}
		socket.emit('serial', command);
	}
  if(button[2].mouseOver()){
		strip_mode_btn--;
    if(strip_mode_btn < 0) strip_mode_btn = 0;
	}
  if(button[3].mouseOver()){
    switch (strip_mode_btn) {
      case 0:
        if(strip_color_sts){
          command.data = 'strip_color_off';
          strip_color_sts = !strip_color_sts;
        }else{
          command.data = 'strip_color_on';
          strip_color_sts = !strip_color_sts;
        }
        break;
      case 1:
        if(strip_music_sts){
          command.data = 'strip_music_off';
          strip_music_sts = !strip_music_sts;
        }else{
          command.data = 'strip_music_on';
          strip_music_sts = !strip_music_sts;
        }
        break;
      default:
        break;
    }
    socket.emit('serial', command);
    console.log(command);
	}
  if(button[4].mouseOver()){
    strip_mode_btn++
    if(strip_mode_btn > 2) strip_mode_btn = 2;
	}
}

function arduinoUpdate(data) {
	if(data.indexOf('response') != -1){
		if(data.indexOf('light_on') != -1){
			button[0].status = true;
		}
		else if(data.indexOf('light_off') != -1){
			button[0].status = false;
		}
		if(data.indexOf('fan_on') != -1){
			button[1].status = true;
		}
		else if(data.indexOf('fan_off') != -1){
			button[1].status = false;
		}
    // if(data.indexOf('strip_music_on') != -1){
		// 	// button[3].status = true;
    //   strip_music_sts = true;
		// }
		// else if(data.indexOf('strip_music_off') != -1){
		// 	// button[3].status = false;
    //   strip_music_sts = false;
		// }
    // if(data.indexOf('strip_color_on') != -1){
		// 	// button[3].status = true;
    //   strip_color_sts = true;
		// }
		// else if(data.indexOf('strip_color_off') != -1){
		// 	// button[3].status = false;
    //   strip_color_sts = false;
		// }
	}else{
    console.log(data);
  }
}

function watchChanges() {
	socket.on('arduino', function receiveArduinoMsg(data) {
		// console.log('Received from Arduino:', data);
		arduinoUpdate(data);
	});
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

function changeCursor() {
	if(mouseX >= button[0].x && mouseX <= button[0].x+button[0].width
	&& mouseY >= button[0].y && mouseY <= button[0].y+button[0].height){
		cursor(HAND);
	}
	else if(mouseX >= button[1].x && mouseX <= button[1].x+button[1].width
	&& mouseY >= button[1].y && mouseY <= button[1].y+button[1].height){
		cursor(HAND);
	}
  else if(mouseX >= button[2].x && mouseX <= button[2].x+button[2].width
	&& mouseY >= button[2].y && mouseY <= button[2].y+button[2].height){
		cursor(HAND);
	}
  else if(mouseX >= button[3].x && mouseX <= button[3].x+button[3].width
	&& mouseY >= button[3].y && mouseY <= button[3].y+button[3].height){
		cursor(HAND);
	}
  else if(mouseX >= button[4].x && mouseX <= button[4].x+button[4].width
	&& mouseY >= button[4].y && mouseY <= button[4].y+button[4].height){
		cursor(HAND);
	}
	else{
		cursor(ARROW);
	}
}

const colors = {
	red: {
		r: 255,
		g: 0,
		b: 0
	},
	green: {
		r: 0,
		g: 255,
		b: 0
	},
	blue: {
		r: 0,
		g: 0,
		b: 255
	},
}

class Button {
	constructor(x, y, width, height, on_img = btnOn_img, off_img = btnOff_img) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.status = false;
    this.on_img = on_img;
    this.off_img = off_img;
	}

	draw(){
		if(this.status)image(this.on_img, this.x, this.y, this.width, this.height);
		else image(this.off_img, this.x, this.y, this.width, this.height);
	}

	mouseOver(){
		if(mouseX >= this.x && mouseX <= this.x+this.width
		&& mouseY >= this.y && mouseY <= this.y+this.height){
			return true;
		}else{
		  return false;
		}
	}
}

class Panel {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.round_corners = 5;
		this.color = {r:78, g:83, b:92}
	}

	draw(){
		noStroke();
		fill(this.color.r, this.color.g, this.color.b);
		rect(this.x, this.y, this.width, this.height, this.round_corners);
	}
}
