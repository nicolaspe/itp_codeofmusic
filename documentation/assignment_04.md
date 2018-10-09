# Broken textures

This week's assignment was provided a lot of learning and frustrations, but I got around those problems and created some nice synth-based soundscape.



## Chord base
Doing the chord base was not that complex, but I just had to figure out some functions for them to work as expected. I wanted the chords to play as long as I pressed the corresponding keys, so the `keydown` event only called `triggerAttack`, leaving the `keyup` with the `releaseAll` function. That function took me a while to discover, as `triggerRelease` needs the specific notes to release (which works fine for a piano, but no so well for chords the way I was playing them).

```javascript
function onKeyDown( keyname ){
	switch( keyname ){
		case 'a':
		synth_sq.triggerAttack(["A2", "F#3", "G2"]);
		break;
	case 's':
		synth_fm.triggerAttack(["A3", "C3", "F3"]);
		break;
	case 'd':
		synth_xm.triggerAttack(["D3", "A3", "F#3"]);
			break;
	}
}
function onKeyUp( keyname ){
	switch( keyname ){
		case 'a':
			synth_sq.releaseAll();
			break;
		case 's':
			synth_fm.releaseAll();
			break;
		case 'd':
			synth_xm.releaseAll();
			break;
  }
}
```



## Broken patterns
The thing that didn't really work was using patterns or sequences. I copied the code from some of the examples in the Tone.js site, but when triggered, they would do... something I didn't get nor expect. It would take them several seconds to stop after I pressed the corresponding key, and while the sound texture was not bad, the lack of control was something I could not feel satisfied with.

```javascript
stasis = new Tone.Sequence( function(time, note) {
	synths[ patterns[3] ].triggerAttackRelease(note, time);
}, ["A4", "E4", "A4", "A3", "E4", "A4"], "8n" );
stasis.loop = 0;

function onKeyDown( keyname ){
	switch( keyname ){
		case 'q':
			tritone.start();
			break;
		case 'w':
			calm.start();
			break;
		case 'e':
			suspense.start();
			break;
		case 'r':
			stasis.start();
			break;
	}
}
function onKeyUp( keyname ){
	switch( keyname ){
		case 'p':
			tritone.stop();
			calm.stop();
			suspense.stop();
			stasis.stop();
			break;
	}
}
```


So in the end, I just looked back on my previous assignment and replicated (with some minor changes) the scheduled function to play these progressions. I still feel the need to learn how to trigger them once and have them in a separate thread, but I think I need to understand Tone.js better first.

```javascript
case 'k':
	if( prog_id == 0 ){
		prog_id = Tone.Transport.scheduleRepeat( play_progression );
	}
	break;
case 'l':
	Tone.Transport.cancel( prog_id );
	prog_id = 0;
	break;
```
