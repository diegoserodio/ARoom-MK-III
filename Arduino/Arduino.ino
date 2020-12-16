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

String message = "";
bool strip_color = true, strip_music = false;
bool light = false, light_old = false;
int light_noread = 0;

int r_slider = 0, g_slider = 0, b_slider = 0;
float noise = 120;

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
  digitalWrite(RELAY_FAN, LOW);
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
    else if(message.equals("fan_on/")){
      digitalWrite(RELAY_FAN, HIGH);
      Serial.println("response fan_on");
    }
    else if(message.equals("fan_off/")){
      digitalWrite(RELAY_FAN, LOW);
      Serial.println("response fan_off");
    }
    else if(message.equals("strip_music_on/")){
      strip_music = true;
      strip_color = false;
      Serial.println("response led red:400 green:400 blue:400");
    }
    else if(message.equals("strip_color_on/")){
      strip_music = false;
      strip_color = true;
      Serial.println("response led red:"+String(r_slider+100)+" green:"+String(g_slider+100)+" blue:"+String(b_slider+100));
    }
    else if(message.equals("strip_off/")){
      strip_music = false;
      strip_color = false;
      Serial.println("response led red:100 green:100 blue:100");
    }
    else if(message.indexOf("r_slider:") != -1){
      r_slider = message.substring(9).toInt();
      Serial.println("response led red:"+String(r_slider+100)+" green:"+String(g_slider+100)+" blue:"+String(b_slider+100));
    }
    else if(message.indexOf("g_slider:") != -1){
      g_slider = message.substring(9).toInt();
      Serial.println("response led red:"+String(r_slider+100)+" green:"+String(g_slider+100)+" blue:"+String(b_slider+100));
    }
    else if(message.indexOf("b_slider:") != -1){
      b_slider = message.substring(9).toInt();
      Serial.println("response led red:"+String(r_slider+100)+" green:"+String(g_slider+100)+" blue:"+String(b_slider+100));
    }
    else if(message.indexOf("rgb:") != -1){
      strip_music = false;
      strip_color = true;
      r_slider = message.substring(4,7).toInt()-100;
      g_slider = message.substring(8,11).toInt()-100;
      b_slider = message.substring(12).toInt()-100;
      Serial.println("response led red:"+String(r_slider+100)+" green:"+String(g_slider+100)+" blue:"+String(b_slider+100));
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
  delay(20);
}

void sendStatus(){
  //Ventilador
  if(digitalRead(RELAY_FAN) == 1){
    Serial.println("response fan_on");
  }else{
    Serial.println("response fan_off");
  }
  //Fita de led
  if(strip_music){
    Serial.println("response led red:400 green:400 blue:400");
  }else{
    Serial.println("response led red:"+String(r_slider+100)+" green:"+String(g_slider+100)+" blue:"+String(b_slider+100));
  }
  //Lâmpada
  if(analogRead(LIGHT_STATUS) >= 400){
    Serial.println("response light_on");
  }else{
    Serial.println("response light_off");
  }
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
