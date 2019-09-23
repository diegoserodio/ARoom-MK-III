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

String message = "", strip_command = "clear", strip_status = "clear";
bool strip_color = false, strip_music = false;
bool light = false, light_old = false;
int light_noread = 0;

int rcv_bass = 0, rcv_level = 0;
int r_slider = 0, g_slider = 0, b_slider = 0;

void setup() {
  pinMode(RELAY_A, OUTPUT);
  pinMode(RELAY_FAN, OUTPUT);
  pinMode(RELAY_LIGHT, OUTPUT);
  pinMode(RELAY_D, OUTPUT);
  pinMode(LIGHT_STATUS, INPUT);
  pinMode(RED, OUTPUT);
  pinMode(GREEN, OUTPUT);
  pinMode(BLUE, OUTPUT);
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
    else if(message.indexOf("bass:") != -1){
      rcv_bass = message.substring(5).toInt();
    }
    else if(message.indexOf("level:") != -1){
      rcv_level = message.substring(6).toInt();
    }
    else if(message.indexOf("r_slider:") != -1){
      r_slider = message.substring(9).toInt();
    }
    else if(message.indexOf("g_slider:") != -1){
      g_slider = message.substring(9).toInt();
    }
    else if(message.indexOf("b_slider:") != -1){
      b_slider = message.substring(9).toInt();
    }
    message = "";
  }
  if(light_noread == 0){
    sendLightStatus();
  }else{
    light_noread--;
  }
  handleStrip();
  sendStatus();
  delay(20);
  rcv_bass = 0;
}
void sendStatus(){
  //Ventilador
  if(digitalRead(RELAY_FAN) == 1){
    Serial.println("response fan_on");
  }else{
    Serial.println("response fan_off");
  }
  //Fita de led
  if(strip_status.equals("clear")){
    Serial.println("response strip_music_off");
    Serial.println("response strip_color_off");
  }
  else if(strip_status.equals("music")){
    Serial.println("response strip_music_on");
    Serial.println("response strip_color_off");
  }
  else if(strip_status.equals("color")){
    Serial.println("response strip_color_on");
    Serial.println("response strip_music_off");
  }
}

void sendLightStatus(){
  if(analogRead(LIGHT_STATUS) >= 400){
    light = true;
  }else{
    light = false;
  }
  if(light != light_old){
    if(light){
      Serial.println("response light_on");
    }else{
      Serial.println("response light_off");
    }
    light_old = light;
  }
}
