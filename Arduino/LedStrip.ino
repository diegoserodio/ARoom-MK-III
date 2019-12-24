int strip[NUM_LEDS];
int count = 0, red = 0, green = 0, blue = 0;


// void handleStrip(String command){
//   if(command.equals("clear")){
//     stripClear();
//   }
//   else if(command.indexOf("color_on") != -1){
//     if(command.indexOf("red") != -1){
//       red = command.substring(command.indexOf(":")+1).toInt();
//     }
//     else if(command.indexOf("green") != -1){
//       green = command.substring(command.indexOf(":")+1).toInt();
//     }
//     else if(command.indexOf("blue") != -1){
//       blue = command.substring(command.indexOf(":")+1).toInt();
//     }
//     Serial.println("Color updated");
//     //stripDisplay(red, green, blue);
//   }
// }

void handleStrip(){
  if(strip_color){
    //Serial.println("Color On");
    stripDisplay(r_slider, g_slider, b_slider);
  }
  else if(strip_music){
    //Serial.println("Music On");
    //Serial.println(rcv_bass);
    //Serial.println(rcv_level);
    stripMusic();
  }else{
    //Serial.println("Strip Off");
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
//        strip[left] = 1;
//        strip[right] = 1;
      }else{
        leds[left].setRGB(0, 0, 0);
        leds[right].setRGB(0, 0, 0);
//        strip[left] = 0;
//        strip[right] = 0;
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

//void stripMusic(int bass, int level){
//  int r = 0, g = 0, b = 0;
//  r = random(map(bass, 0 , NUM_LEDS, 0, 255));
//  for( int i = 0; i < NUM_LEDS; i++) {
//    if(strip[i] != 1)leds[i].setRGB(r, g, b);
//  }
//  if(rcv_bass >= 15){
//      r = random(map(level, 0 , NUM_LEDS, 255, 0));
//      g = random(map(level, 0 , NUM_LEDS, 255, 0));
//      b = random(map(level, 0 , NUM_LEDS, 255, 0));
//      for( int i = 0; i < NUM_LEDS/2; i++) {
//        int left = (NUM_LEDS/2)-i-1;
//        int right = (NUM_LEDS/2)+i;
//        if(i < level){
//          leds[left].setRGB(r, g, b);
//          leds[right].setRGB(r, g, b);
//          strip[left] = 1;
//          strip[right] = 1;
//        }else{
//          strip[left] = 0;
//          strip[right] = 0;
//        }
//      }
//    }
//  FastLED.show();
//  analogWrite(RED, r);
//  analogWrite(GREEN, g);
//  analogWrite(BLUE, b);
//}

// void stripMusic(int bass, int level){
//   int r = 0, g = 0, b = 0;
//   if(count != 0){
//     level = normalize(level, 0, NUM_LEDS);
//     bass = normalize(bass, 0, NUM_LEDS);
//     r = random(map(bass, 0 , NUM_LEDS, 0, 255));
//     for( int i = 0; i < NUM_LEDS; i++) {
//       if(strip[i] != 1)leds[i].setRGB(r, g, b);
//     }
//   }
//   if(count >= 15){
//     r = random(map(level, 0 , NUM_LEDS, 255, 0));
//     g = random(map(level, 0 , NUM_LEDS, 255, 0));
//     b = random(map(level, 0 , NUM_LEDS, 255, 0));
//     for( int i = 0; i < NUM_LEDS/2; i++) {
//       int left = (NUM_LEDS/2)-i-1;
//       int right = (NUM_LEDS/2)+i;
//       if(i < level){
//         leds[left].setRGB(r, g, b);
//         leds[right].setRGB(r, g, b);
//         strip[left] = 1;
//         strip[right] = 1;
//       }else{
//         strip[left] = 0;
//         strip[right] = 0;
//       }
//     }
//     count = 0;
//   }else{
//     count++;
//   }
//   FastLED.show();
// }

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
