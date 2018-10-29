# Sequencing all around

For this assignment I expanded on my previous sequencers, to take a more immersive multi-instrumental approach. I got really excited with it, and while it's not fully finished (and the WebVR changed again so that version doesn't work), the changes it would need are minimal, as the base is already there.

[To play with the space sequencer click on this link](https://nicolaspe.github.io/itp_codeofmusic/code/space_sequencer.html),
[or follow this link to see the code](https://github.com/nicolaspe/itp_codeofmusic/blob/master/code/07_spaceseq.js).


# User controls
First, I started by defining the things I wanted to be able to control. Being able to select a scale and mode was essential, as was the octave in use. Later, this octave was used as the middle octave and the other instruments are steps up or down from it.

The bpm was something easy to implement, but the time signature and the bars to display in each sequencer ended up being left behind. As I kept going, I got excited developing other parts, but I left them there just to remind myself to implement them later. This is mostly because it has to do more with graphic interface elements rather than logic of music.

Finally, a key aspect was deciding how the user would interact with this piece. I have been feeling hindered by the point-and-click approach, as it severely hinders the speed or variety of actions. Instead, I took an approach more present in video games: **mouse to aim, and keyboard (keys 0-8) to execute different actions (apply a different note)**.


## music in (web)VR and further developments
A big inspiration for this project was the idea of entering an environment to compose music. In this sense, instruments would surround you and would each have different properties. Ideally, the phone would be connected to a MIDI keyboard, which would highly expand on this project. It already uses MIDI notes, doing the proper transformations to frequency to play them, so it just would be a thing of implementing MIDI input.
