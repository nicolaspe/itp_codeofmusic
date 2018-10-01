# MIDI logic and arpeggios

For the past few months I have been a bit obsessed with making small MIDI devices for different particular needs. I see it as an experimentation on fabrication, modularity, sound and functionality. So, it is only natural for me to do these exercises in a way that can ported easily to MIDI format easily, and at the same time, to have sketches that could potentially be connected to MIDI devices as well.



### MIDI beat clock

In order to experiment with this, I looked back at the previous assignment, as it seemed more natural to do so on a sequencer. Seeing the [Transport documentation](https://tonejs.github.io/docs/dev/Transport) I saw that it has a `PPQ` property: how many pulses (or ticks) it has per quarter note (ppqn). This is what MIDI broadcasts to synchronize multiple devices: the [MIDI beat clock](https://en.wikipedia.org/wiki/MIDI_beat_clock). The only difference is that MIDI has 24 ppqn and the Tone Transport has (by default) 192 (eight times more).



### Arpeggios, different timings and interactivity hell

My biggest problem right now with p5js and the pie sequencers is not the shape or logic, is the interactivity. In p5 (and 2D), you don't have a raycaster to do simple "hover" interactions, so creating more than one circular grid where you can click to add elements and change the time signature is hell. And even in what I ended up doing, I found it impossible to create something on the lines of what I wanted. Instead, I ended up using more HTML elements (that are still very annoying), and trying to work around them.
