int led = LED_BUILTIN;
int count = 0;
const int msg_length = 3;
char msg[msg_length];

void setup() {
  pinMode(led, OUTPUT);
  Serial.begin(256000);
}

void loop() {
  // if(Serial.available() > 0){
  //   char data = Serial.read();
  //   if(data == '/'){
  //     count = 0;
  //     Serial.println(getInt(msg));
  //   }
  //   else{
  //     msg[count] = data;
  //     count++;
  //   }
  // }
  Serial.write("HELLO MY CONRADS\n");
  delay(1000);
}

int getInt(char data[]){
  int result = 1;
  for(int i = 0; i < msg_length; i++){
    result += (data[i]-'0')*pow(10, msg_length-1-i);
  }
  return result;
}

String getString(char data_[]){
  char result[msg_length];
  for(int i = 0; i < sizeof(result)/sizeof(result[0]); i++){
    result[i] = data_[i];
  }
  String str(result);
  return result;
}
