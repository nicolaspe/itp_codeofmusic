# MIDI logic and arpeggios

For the past few months I have been a bit obsessed with making small MIDI devices for different particular needs. I see it as an experimentation on fabrication, modularity, sound and functionality. So, it is only natural for me to do these exercises in a way that can ported easily to MIDI format easily, and at the same time, to have sketches that could potentially be connected to MIDI devices as well.



### MIDI beat clock

In order to experiment with this, I looked back at the previous assignment, as it seemed more natural to do so on a sequencer. Seeing the [Transport documentation](https://tonejs.github.io/docs/dev/Transport) I saw that it has a `PPQ` property: how many pulses (or ticks) it has per quarter note (ppqn). This is what MIDI broadcasts to synchronize multiple devices: the [MIDI beat clock](https://en.wikipedia.org/wiki/MIDI_beat_clock). The only difference is that MIDI has 24 ppqn and the Tone Transport has (by default) 192 (eight times more). So, instead of "slowing" Tone down, I kept the speed and just scheduled a `beat_clock` function every `8i` (eight ticks), and it works perfectly!

```javascript
Tone.Transport.scheduleRepeat(beat_clock, "8i");

function beat_clock(){
  ppqn++;
  if (ppqn >= 24){
    ppqn = 0;
    beat = ( ++beat )%16;

    // check for this beat on every isntrument
    for ( let j = 0; j < blocks.x; j++ ) {
      if ( audio_grid[beat][j] && audio_sampl[j].loaded ) {
        audio_sampl[j].start();
      }
    }
  }
}
```

See the [full code here](https://github.com/nicolaspe/itp_codeofmusic/blob/master/code/02_drummachine.js) or [play with the sketch!](https://nicolaspe.github.io/itp_codeofmusic/code/drummachine.html)



### Arpeggios, different timings and interactivity hell

My biggest problem right now with p5js and the pie sequencers is not the shape or logic, is the interactivity. In p5 (and 2D), you don't have a raycaster to do simple "hover" interactions, so creating more than one circular grid where you can click to add elements and change the time signature is hell. And even in what I ended up doing, I found it impossible to create something on the lines of what I wanted. Instead, I ended up using more HTML elements (that are still very annoying), and trying to work around them.

For this week I wanted to explore making arpeggios and scheduling them independently from the current sequencer by using the `Transport.scheduleRepeat` function. In the beginning, I wanted to expand on the previous sequencer and trigger these arpeggios only once whenever it was their turn, but soon the interaction issues made it apparent that doing so would not be possible on the time frame.

![My pentatonic arpeggio tester]("cod_03_pentamelodic.png")

So I decided just to focus on the scheduling of each event independently and being able to stop them later on. For the notes, I picked the five possible pentatonic scales that can be created with only the black keys on the piano (see [here for the Wikipedia link](https://en.wikipedia.org/wiki/Pentatonic_scale#Five_black-key_pentatonic_scales_of_the_piano)). The slider on top controls every how many `ticks` each note of the arpeggio is played.

<!-- video -->

One of the things I learned is that I should have a different `Tone.Synth` for each arpeggio, as it cannot play simultaneous notes (obviously). Also, I didn't focus on the sound, as that will be part of a future class and didn't want to lose time on that end.


See the [code here](https://github.com/nicolaspe/itp_codeofmusic/blob/master/code/03_pentamelodic.js) or play with the [pentamelodic here](https://nicolaspe.github.io/itp_codeofmusic/code/pentamelodic.html).
