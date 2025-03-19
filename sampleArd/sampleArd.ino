#include "Arduino_SensorKit.h"
void setup() {
  Serial.begin(9600);  // Start Serial communication
  Environment.begin();

  // Set digital pins 2 to 13 as input with internal pull-up resistors
  
  for (int pin = 2; pin <= 13; pin++) {
    pinMode(pin, INPUT_PULLUP);  // sets pins 2 to 13 as digital inputs
  }

}

void loop() {
  if (Serial.available()) {
    Serial.read();  // Read handshake byte (not used)
  }

  // Read analog inputs (can be a var float)
  float a0 = analogRead(A0);
  float a1 = analogRead(A1);
  float a2 = analogRead(A2);
  float a3 = analogRead(A3);
  float a4 = analogRead(A4);
  float a5 = analogRead(A5);

  // Read digital inputs (binary logic)
  
  int d2 = !digitalRead(2);  // Invert logic 
  int d3 = !digitalRead(3);  
  int d4 = !digitalRead(4);  
  int d5 = !digitalRead(5);  
  int d6 = !digitalRead(6);  
  int d7 = !digitalRead(7);  
  int d8 = !digitalRead(8);  
  int d9 = !digitalRead(9);  
  int d10 = !digitalRead(10);  
  int d11 = !digitalRead(11);  
  int d12 = !digitalRead(12);  
  int d13 = !digitalRead(13);

  // Send values as CSV
  Serial.print(a0); Serial.print(",");
  Serial.print(a1); Serial.print(",");
  Serial.print(a2); Serial.print(",");
  Serial.print(a3); Serial.print(",");
  Serial.print(a4); Serial.print(",");
  Serial.print(a5); Serial.print(",");

  Serial.print(d2); Serial.print(",");
  Serial.print(d3); Serial.print(",");
  Serial.print(d4); Serial.print(",");
  Serial.print(d5); Serial.print(",");
  Serial.print(d6); Serial.print(",");
  Serial.print(d7); Serial.print(",");
  Serial.print(d8); Serial.print(",");
  Serial.print(d9); Serial.print(",");
  Serial.print(d10); Serial.print(",");
  Serial.print(d11); Serial.print(",");
  Serial.print(d12); Serial.print(",");
  Serial.println(d13);  // newline
  

  delay(50);  // delay
}
