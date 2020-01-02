int strip[NUM_LEDS];
int count = 0, red = 0, green = 0, blue = 0;

void handleStrip(){
  if(strip_color){
    stripDisplay(r_slider, g_slider, b_slider);
  }
  else if(strip_music){
    stripMusic();
  }else{
    stripClear();
  }
}

void stripMusic(){
  float amplitude = getAmplitude(MIC);
  int r = random(map(amplitude, 0 , NUM_LEDS, 0, 255));
  int g = random(map(amplitude, 0 , NUM_LEDS, 0, 255));
  int b = random(map(amplitude, 0 , NUM_LEDS, 0, 255));
  if(amplitude <= 10){
    g = 0;
    b = 0;
    for( int i = 0; i < NUM_LEDS; i++) {
      leds[i].setRGB(r, g, b);
    }
  }else{
    for( int i = 0; i < NUM_LEDS/2; i++) {
      int left = (NUM_LEDS/2)-i-1;
      int right = (NUM_LEDS/2)+i;
      if(i < amplitude){
        leds[left].setRGB(r, g, b);
        leds[right].setRGB(r, g, b);
      }else{
        leds[left].setRGB(0, 0, 0);
        leds[right].setRGB(0, 0, 0);
      }
    }
  }
  FastLED.show();
  analogWrite(RED, r);
  analogWrite(GREEN, g);
  analogWrite(BLUE, b);
}

float getAmplitude(int mic){
  int sample_window = 40;
  float signal_max = 0;
  float signal_min = 1023;
  long start = millis();
  while(millis() - start < sample_window){
    float data = analogRead(mic);

    if(data > signal_max){
      signal_max = data;
    }
    if(data < signal_min){
      signal_min = data;
    }
  }

  float amplitude = signal_max - signal_min - noise;

  if(amplitude < 0) amplitude = 0;

  return map(amplitude, 0, 100, 0, NUM_LEDS);
}

void stripDisplay(byte r, byte g, byte b){
  for( int i = 0; i < NUM_LEDS; i++) {
    leds[i].setRGB( r, b, g);
  }
  FastLED.show();
  analogWrite(RED, r);
  analogWrite(GREEN, g);
  analogWrite(BLUE, b);
}

void stripClear(){
  FastLED.clear();
  FastLED.show();
  analogWrite(RED, 0);
  analogWrite(GREEN, 0);
  analogWrite(BLUE, 0);
}

int normalize(int value, int min, int max){
  if(value >= max) return max;
  else if(value <= min) return min;
  return value;
}
