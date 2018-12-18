const uint8_t SLID_PIN  = 16; // A2
const uint8_t KNOB_PIN  = 17; // A3
const uint8_t PITCH_PIN = 20; // A6
const uint8_t VOL_PIN   = 15; // A1

void setup() {
  // Serial comm
  Serial.begin(9600);
  
  // set pins
  pinMode(SLID_PIN, INPUT);
  pinMode(KNOB_PIN, INPUT);
  pinMode(PITCH_PIN, INPUT);
  pinMode(VOL_PIN, INPUT);

}

void loop() {
  // put your main code here, to run repeatedly:
  float val = analogRead(SLID_PIN);
  Serial.println(val);
}
