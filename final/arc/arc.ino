#include <Audio.h>
#include <Wire.h>
#include <SPI.h>
#include <SD.h>
#include <SerialFlash.h>



// === INTERFACE 
const uint8_t SLID_PIN  = 16; // A2
const uint8_t KNOB_PIN  = 17; // A3
const uint8_t PITCH_PIN = 20; // A6
const uint8_t VOL_PIN   = 15; // A1


// GUItool: begin automatically generated code
AudioSynthWaveformDc     dc1;            //xy=80,300
AudioSynthWaveformSine   sine1;          //xy=80,80
AudioSynthNoisePink      pink1;          //xy=80,170
AudioSynthWaveform       waveform1;      //xy=80,440
AudioMixer4              mixer2;         //xy=215,575
AudioFilterBiquad        biquad1;        //xy=215,170
AudioEffectDelay         delay1;         //xy=215,80
AudioSynthWaveformSineModulated sine_fm1;       //xy=220,300
AudioSynthWaveformSineModulated sine_fm2;       //xy=220,340
AudioSynthWaveformSineModulated sine_fm3;       //xy=220,380
AudioFilterBiquad        biquad2;        //xy=355,575
AudioMixer4              mixer1;         //xy=365,55
AudioSynthWaveformDc     dc2;            //xy=370,235
AudioSynthWaveformSine   sine2;          //xy=370,275
AudioMixer4              mixer3;         //xy=370,345
AudioMixer4              mixer4;         //xy=500,250
AudioOutputI2S           i2s1;           //xy=500,575
AudioEffectMultiply      multiply1;      //xy=620,330
AudioEffectEnvelope      envelope1;      //xy=620,380
AudioEffectFlange        flange1;        //xy=620,430
AudioConnection          patchCord1(dc1, sine_fm1);
AudioConnection          patchCord2(dc1, sine_fm2);
AudioConnection          patchCord3(dc1, sine_fm3);
AudioConnection          patchCord4(sine1, delay1);
AudioConnection          patchCord5(pink1, biquad1);
AudioConnection          patchCord6(waveform1, 0, mixer3, 3);
AudioConnection          patchCord7(mixer2, biquad2);
AudioConnection          patchCord8(biquad1, 0, mixer2, 1);
AudioConnection          patchCord9(delay1, 0, mixer1, 0);
AudioConnection          patchCord10(delay1, 1, mixer1, 1);
AudioConnection          patchCord11(delay1, 2, mixer1, 2);
AudioConnection          patchCord12(delay1, 3, mixer1, 3);
AudioConnection          patchCord13(sine_fm1, 0, mixer3, 0);
AudioConnection          patchCord14(sine_fm2, 0, mixer3, 1);
AudioConnection          patchCord15(sine_fm3, 0, mixer3, 2);
AudioConnection          patchCord16(biquad2, 0, i2s1, 0);
AudioConnection          patchCord17(biquad2, 0, i2s1, 1);
AudioConnection          patchCord18(mixer1, 0, mixer2, 0);
AudioConnection          patchCord19(dc2, 0, mixer4, 0);
AudioConnection          patchCord20(sine2, 0, mixer4, 1);
AudioConnection          patchCord21(mixer3, 0, multiply1, 1);
AudioConnection          patchCord22(mixer4, 0, multiply1, 0);
AudioConnection          patchCord23(multiply1, 0, mixer2, 2);
// GUItool: end automatically generated code

AudioControlSGTL5000 codec;




void setup() {
  // Serial comm
  Serial.begin(9600);
  
  // assign audio memory
  AudioMemory(20);
  codec.enable();
  codec.volume(1.2);
  
  // set pins
  pinMode(SLID_PIN, INPUT);
  pinMode(KNOB_PIN, INPUT);
  pinMode(PITCH_PIN, INPUT);

  // starting values
  // --delay-sine
  sine1.amplitude(0.8);
  sine1.frequency(330);
  delay1.delay(0, 0.0);
  delay1.delay(1, 0.1);
  delay1.delay(2, 0.3);
  delay1.delay(3, 0.6);
  // --pink-noise
  pink1.amplitude(0.8);
  biquad1.setLowpass(0, 220, 10);
  // --fm-synth
  dc1.amplitude(50); // modulation
  sine_fm1.amplitude(0.8);
  sine_fm1.frequency(330);
  sine_fm2.amplitude(0.8);
  sine_fm2.frequency(330);
  sine_fm3.amplitude(0.8);
  sine_fm3.frequency(330);
  dc2.amplitude(1.0);
  sine2.amplitude(1.0);
  sine2.frequency(20);
  waveform1.begin(WAVEFORM_SAWTOOTH);
  // --final-mix
  biquad2.setLowpass(0, 330, 10);
  biquad2.setHighpass(1, 16000, 10);

  // mixers
  // --delay-sine
  mixer1.gain(0, 0.2);
  mixer1.gain(1, 0.2);
  mixer1.gain(2, 0.2);
  mixer1.gain(3, 0.2);
  // --main mix
  mixer2.gain(0, 0.4);
  mixer2.gain(1, 0.2);
  mixer2.gain(2, 0.8);
  // --tremolo switch
  mixer3.gain(0, 0.0);
  mixer3.gain(1, 1.0);

  // Initialize processor and memory measurements
  AudioProcessorUsageMaxReset();
  AudioMemoryUsageMaxReset();
  
}

void loop() {
  // read values
  int val_slid  = analogRead(SLID_PIN);
  int val_knob  = analogRead(KNOB_PIN);
  int val_pitch = analogRead(PITCH_PIN);
  int val_vol = analogRead(VOL_PIN);
//  Serial.println(val_knob);

  // --final-mix
  float lowpass  = map(val_slid, 0, 1023, 220, 1100);
  float highpass = 0;
  if(val_slid < 512){
    highpass = map(val_slid, 0, 512, 16000, 12000);
  } else {
    highpass = map(val_slid, 0, 1023, 12000, 1100);
  }
  biquad2.setLowpass(lowpass, 330, 10);
  biquad2.setHighpass(highpass, 16000, 10);
  // --final-mix_vol
  float vol = map(val_vol, 0, 1023, 0.05, 1.20);
  
//  mixer2.gain(0, vol*0.7);
//  mixer2.gain(1, vol*0.4);
//  mixer2.gain(2, vol*1.0);
  

  // --tremolo
  float trem_freq = 0;
  if(val_knob < 512){
    trem_freq = map(val_knob, 0, 1023, 1., 5.);
  } else {
    trem_freq = map(val_knob, 0, 1023, 5., 150.);
  }
  
  // --pitch
  float pitch = map(val_pitch, 0, 1023, 220, 660);

  sine_fm1.frequency(pitch);
  sine_fm2.frequency(pitch * 1.50);
  sine_fm3.frequency(pitch * 1.75);
  
}

