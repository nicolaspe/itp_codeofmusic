/* nps
 * by nicolas escarpentier
 *
 * feat:
 * - MIDIUSB library
 * - MIDI beat clock
 * 
 * v 0.0.1
 */


// === LIBRARIES & INIT
#include <MIDIUSB.h>

// metro init
#define led_pin 6
bool led_state = false;

// MIDI clock init
uint8_t ppqn = 0;   // pulse per quarter bar
uint8_t quar = 0;   // quarter bar
uint8_t bars = 0;   // bars count
uint8_t sign = 4;   // time signature in quarter notes

// SLIDER input
#define slider_pin A6
uint16_t slid = 0;


void setup() {
  Serial.begin(115200);
  Serial.println("nps v_0.0.1");
  Serial.println("======="); Serial.println();

  // initialize pins
  pinMode(led_pin, OUTPUT);
  pinMode(slider_pin, INPUT);
}


// === LOOP
void loop() {
  // MIDI packet msg init
  midiEventPacket_t msg_in;

  // receive a packet and decode it
  do {
    msg_in = MidiUSB.read();

    // nothing to do!
    if (msg_in.header == 0) {
      break;
    }
    
    // time clock 1111000 = 0xF8
    else if (msg_in.byte1 == 0xF8) {
      pulse_beat();
    }
    
    // start 11111010 = 0xFA
    else if (msg_in.byte1 == 0xFA) { }
    
    // stop 11111100 = 0xFC
    else if (msg_in.byte1 == 0xFC) {
      reset_counters();
    }
    
  } while(msg_in.header!=0);
}



// === CONTROL functions
void pulse_beat() {
  // add a pulse to the counter
  ++ppqn;

  // each quarter quarter
  if (ppqn%12 == 0){
    // play 4 notes
    for (int i=0; i<4; i++){
      
    }
    note_on(1, 60, 100);
//    note_on(1, 64, 100);
//    note_on(1, 67, 100);
//    note_on(1, 50, 100);
    MidiUSB.flush();
  }
  if (ppqn%12 == 8){
    note_off(1, 60, 0);
//    note_on(1, 64, 100);
//    note_on(1, 67, 100);
//    note_on(1, 50, 100);
    MidiUSB.flush();
  }
  
  // when 24 ppqn, move a quarter
  if (ppqn == 24){
    ppqn = 0;
    ++quar;

    led_state = !led_state;
    digitalWrite(led_pin, led_state);
  }
  
  // when a bar is complete according to specified time signature
  if (quar == sign){
    quar = 0;
    ++bars;
  }
}

void reset_counters() {
  ppqn = 0;
  quar = 0;
  bars = 0;
  digitalWrite(led_pin, 0);
}



// === MIDI functions
void note_on(byte channel, byte pitch, byte velocity) {
  midiEventPacket_t noteOn = {0x09, 0x90 | channel, pitch, velocity};
  MidiUSB.sendMIDI(noteOn);
  MidiUSB.flush();
}

void note_off(byte channel, byte pitch, byte velocity) {
  midiEventPacket_t noteOff = {0x08, 0x80 | channel, pitch, velocity};
  MidiUSB.sendMIDI(noteOff);
  MidiUSB.flush();
}


