# Harmonic Spiral

For this assignment I worked with [Max Horwich](https://wp.nyu.edu/maxhorwich/) to combine his knowledge of Tone.js, my knowledge of three.js and both out musical ideas.

Following the traditional spiral representation of pitch, we created a 7-note spiral (in C major) that spans across 4 octaves. Users can create patterns by selecting the notes, which are played by a polyphonic FM-synth. At the same time, a parallel harmony is created and displayed in the transparent spiral above the main one. How many notes this harmony sits above the base one can be modified by pressing the `1`-`7` keys.

[You can play with this here](https://nicolaspe.github.io/harmonic_spiral/) or [see the code here](https://github.com/nicolaspe/harmonic_spiral).

<figure>

  <figcaption>Playing with the harmonic spiral</figcaption>
</figure>
<br>


## Subtractive interfaces

I have been obsessed with creating some sort of "subtractive" creation but not for sounds, but for patterns. In the same way as one applies filters to remove and shape frequencies from a rich noise pattern, I want to start with complex patterns or a rich array of notes and filter out some of them to create complex textures. All this in the form of a MIDI controller (which I have been creating as well), to have the possibility of linking it to any instrument.

### Controls

The key aspect when designing an interface is deciding which elements can be altered and which ones the user can control directly. Some of these parameters can be influenced directly, with precise control over what is being controlled (as pressing a key in a synth triggers exactly that note) or just giving the user a hint of what will happen perceptually, manipulating several parameters at once. I would rather move in this latter category, giving users a more restrictive control but that feels more consistent with the philosophy of complex textures I want to create.

For a first approach, I will limit the amount of controls available to only four:
- **Range**: a knob to control the range of notes that will be available for filtering
- **Arpeggio/Texture**: a toggle switch to change between these two modes
- **Filter**: a knob that controls the shape of the filter to be applied. It will be rather obscure for the user as they won't know exactly how the filters are shaped in order to promote exploration
- **Pitch**: the "main" control which selects the base note around which the filtering will occur. It is a slider to give it a feel away from the discrete approach of keys

<figure>
  ![Interface of the subtractive texturer]()
  <figcaption>Interface of the subtractive texturer</figcaptio>
</figure>
