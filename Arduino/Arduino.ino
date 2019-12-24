#include <FastLED.h>

#define LED_PIN     38
#define NUM_LEDS    40
#define BRIGHTNESS  64
#define LED_TYPE    WS2811
#define COLOR_ORDER GRB
CRGB leds[NUM_LEDS];
CRGBPalette16 currentPalette;
TBlendType    currentBlending;
extern CRGBPalette16 myRedWhiteBluePalette;
extern const TProgmemPalette16 myRedWhiteBluePalette_p PROGMEM;

#define RELAY_A 50
#define RELAY_FAN 48
#define RELAY_LIGHT 44
#define RELAY_D 42
#define LIGHT_STATUS A15

#define RED 2
#define GREEN 3
#define BLUE 4

#define MIC A7

String message = "", strip_command = "clear", strip_status = "clear";
bool strip_color = true, strip_music = false;
bool light = false, light_old = false;
bool send_status = false;
int light_noread = 0;

float rcv_bass = 0, rcv_level = 0;
int r_slider = 0, g_slider = 0, b_slider = 0;
float noise = 120;

bool first_clap = false, second_clap = false;
long first_clap_start = 0.0, second_clap_start = 0.0;

void setup() {
  pinMode(RELAY_A, OUTPUT);
  pinMode(RELAY_FAN, OUTPUT);
  pinMode(RELAY_LIGHT, OUTPUT);
  pinMode(RELAY_D, OUTPUT);
  pinMode(LIGHT_STATUS, INPUT);
  pinMode(RED, OUTPUT);
  pinMode(GREEN, OUTPUT);
  pinMode(BLUE, OUTPUT);
  pinMode(MIC, INPUT);
  Serial.begin(250000);
  FastLED.addLeds<LED_TYPE, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection( TypicalLEDStrip );
  FastLED.setBrightness(  BRIGHTNESS );
  currentPalette = RainbowColors_p;
  currentBlending = LINEARBLEND;
  delay(500);
}

void loop() {
  while(Serial.available()){
    delay(2);
    char c = Serial.read();
    message += c;
  }
  if(message.length() > 0){
    if(message.equals("light_on/")){
      if(!light){
        digitalWrite(RELAY_LIGHT, !digitalRead(RELAY_LIGHT));
        light = true;
        light_old = true;
        light_noread = 0;
        Serial.println("response light_on");
      }
    }
    else if(message.equals("light_off/")){
      if(light){
        digitalWrite(RELAY_LIGHT, !digitalRead(RELAY_LIGHT));
        light = false;
        light_old = false;
        light_noread = 200;
        Serial.println("response light_off");
      }
    }
    if(message.equals("fan_on/")){
      digitalWrite(RELAY_FAN, HIGH);
      Serial.println("response fan_on");
    }
    else if(message.equals("fan_off/")){
      digitalWrite(RELAY_FAN, LOW);
      Serial.println("response fan_off");
    }
    if(message.equals("strip_music_on/")){
      strip_command = "music_on";
      strip_status = "music";
      strip_music = true;
      strip_color = false;
      Serial.println("response strip_music_on");
      sendStatus();
    }
    else if(message.equals("strip_music_off/")){
      strip_command = "clear";
      strip_status = "clear";
      strip_music = false;
      strip_color = false;
      Serial.println("response strip_music_off");
    }
    else if(message.equals("strip_color_on/")){
      strip_command = "strip_color_on";
      strip_status = "color";
      strip_music = false;
      strip_color = true;
      Serial.println("response strip_color_on");
      sendStatus();
    }
    else if(message.equals("strip_color_off/")){
      strip_command = "clear";
      strip_status = "clear";
      strip_music = false;
      strip_color = false;
      Serial.println("response strip_color_off");
    }
    else if(message.indexOf("red") != -1 || message.indexOf("green") != -1 || message.indexOf("blue") != -1){
      strip_command = message;
      // Serial.println("response color update");
    }
//    else if(message.indexOf("bass:") != -1){
//      rcv_bass = message.substring(5).toInt();
//    }
//    else if(message.indexOf("level:") != -1){
//      rcv_level = message.substring(6).toInt();
//    }
    else if(message.indexOf("r_slider:") != -1){
      r_slider = message.substring(9).toInt();
      sendStatus();
    }
    else if(message.indexOf("g_slider:") != -1){
      g_slider = message.substring(9).toInt();
      sendStatus();
    }
    else if(message.indexOf("b_slider:") != -1){
      b_slider = message.substring(9).toInt();
      sendStatus();
    }
    else if(message.equals("get_status/")){
      sendStatus();
    }
    message = "";
  }
  if(light_noread == 0){
    sendLightStatus(false);
  }else{
    light_noread--;
  }
  handleStrip();
  if(!strip_music)handleClaps();
  //digitalWrite(RELAY_FAN, HIGH);
  delay(20);
//  rcv_bass = 0;
}

void sendStatus(){
  //Ventilador
  if(digitalRead(RELAY_FAN) == 1){
    Serial.println("response fan_on");
  }else{
    Serial.println("response fan_off");
  }
  //Fita de led
  if(strip_status.equals("music")){
    Serial.println("response led red:200 green:200 blue:200");
  }else{
    Serial.println("response led red:"+String(r_slider+100)+" green:"+String(g_slider+100)+" blue:"+String(b_slider+100));
  }
  sendLightStatus(true);
}

void sendLightStatus(bool ignore_change){
  if(analogRead(LIGHT_STATUS) >= 400){
    light = true;
  }else{
    light = false;
  }
  if((light != light_old) && (!ignore_change)){
    if(light){
      Serial.println("response light_on");
    }else{
      Serial.println("response light_off");
    }
    light_old = light;
  }
  else if (ignore_change){
    if(light){
      Serial.println("response light_on");
    }else{
      Serial.println("response light_off");
    }
  }
}

void handleClaps(){
  float signal_max = 0;
  float signal_min = 1023;
  int sample_window = 50, average_window = 10;
  float clap_interval = 300, claps_end_validation = 500;
  unsigned long start = millis();
  while(millis() - start < sample_window){
    float data = analogRead(MIC);

    if(data > signal_max){
      signal_max = data;
    }
    if(data < signal_min){
      signal_min = data;
    }
  }

  float amplitude = (signal_max - signal_min)*(5.0/1023.0);

  float average = 0;
  float old_amp = 0, new_amp = 0;
  for(int i = 0; i < 2; i++){
    for(int j = 0; j < average_window; j++){
      average += analogRead(MIC)*(5.0/1023.0);
    }
    average = average/average_window;
    if(i == 0) old_amp = average;
    else new_amp = average;
  }
  float average_diff = new_amp-old_amp;
  if(average_diff < 0) average_diff = 0;

  long between_claps = millis() - first_clap_start;
  if(between_claps > clap_interval) first_clap = false;

  long after_claps = millis() - second_clap_start;
  if(after_claps > claps_end_validation && second_clap){
    first_clap = false;
    second_clap = false;
    digitalWrite(RELAY_LIGHT, digitalRead(!RELAY_LIGHT));
  }

  if(amplitude >= 0.8 && average_diff > 0.00){
    if(!first_clap && !second_clap){
      first_clap = true;
      first_clap_start = millis();
    }
    else if(!second_clap){
      second_clap = true;
      second_clap_start = millis();
    }else{
      first_clap = false;
      second_clap = false;
    }
  }
}
