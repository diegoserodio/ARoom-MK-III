int led = LED_BUILTIN;
String message = "";

void setup() {
  pinMode(led, OUTPUT);
  Serial.begin(250000);
}

void loop() {
  while(Serial.available()){
    delay(2);
    char c = Serial.read();
    message += c;
  }
  if(message.length() > 0){
    if(message.equals("ledon/")){
      digitalWrite(led, HIGH);
      Serial.println("Arduino: Led foi aceso");
    }
    else if(message.equals("ledoff/")){
      digitalWrite(led, LOW);
      Serial.println("Arduino: Led foi apagado");
    }
    message = "";
  }
}
