import { FancyPiano } from "../piano";
import SoundFont from "soundfont-player";
import MidiPlayer from "midi-player-js";
import "regenerator-runtime/runtime";
import {
  SUSTAINED_NOTE_DURATION,
  NON_SUSTAINED_NOTE_DURATION,
} from "../utils/constants";
import ReverbJS from "reverb.js";
import { chord as detectChord } from "tonal/detect";

import { chordToHtml, keyToHtml } from "../chord-display/chords";
import { noteOn, noteOff } from "../chord-display/events";

export class FancyMidiPlayer {
  constructor(document) {
    console.log("FanceyMidiPlayer");
    this.audioContext =
      window.AudioContext || window.webkitAudioContext || false;
    this.safeAudioContext = new this.audioContext();
    this.instrument = null;
    this.midi = null;
    this.player = null;
    this.piano = new FancyPiano(document);
    this.volume = 3;
    this.currentNotes = [];
    this.previousChord = null;
    this.tempo = 120;
    this.intialTempoSet = false;
    this.keySig = null;
    this.timeSig = null;
    //JS.extend(this.safeAudioContext);

    // 2) Load the impulse response; upon load, connect it to the audio output.
    // const reverbUrl = "../assets/reverb/Basement.m4a";
    // this.reverbNode = this.safeAudioContext.createReverbFromUrl(
    //   reverbUrl,
    //   function () {
    //     this.reverbNode.connect(this.safeAudioContext.destination);
    //   }.bind(this)
    // );
  }

  async setInstrument(instrumentUrl) {
    this.instrument = await SoundFont.instrument(
      this.safeAudioContext,
      instrumentUrl
      // {
      //   destination: this.reverbNode,
      // }
    );

    this.player = new MidiPlayer.Player((event) => {
      if (event.name === "Controller Change") {
        console.log("controller event: " + JSON.stringify(event));

        this.onControllerChange(event);
      } else if (event.name === "Note on") {
        console.log("note one event: " + JSON.stringify(event));

        this.onNoteOnEvent(event);
      } else if (event.name === "Note off") {
        console.log("note off event: " + JSON.stringify(event));

        this.onNoteOffEvent(event);
      } else {
        console.log("other event: " + JSON.stringify(event));

        if (event.name === "Set Tempo") {
          this.intialTempoSet = true;
          this.tempo = event.data;
          console.log("tempo set");
        } else if (event.name === "Key Signature") {
          this.keySig = event.keySignature;
          console.log("key sig set: " + this.keySig);

          keySig.innerHTML = this.keySig;
        } else if (event.name === "Time Signature") {
          this.timeSig = event.timeSignature;

          timeSig.innerHTML = this.timeSig;

          console.log("time sig set: " + this.timeSig);
        }
      }
    });
  }

  onControllerChange(event) {
    if (event.number === 64) {
      // Sustain Pedal Change
      this.piano.setSustainPedal(event.value);
      console.log(this.piano.isSustainPedalPressed ? "Pressed" : "Released");
      if (!this.piano.isSustainPedalPressed) {
        this.piano.paintReleasedKey2(1081);

        this.piano
          .getSustainedKeys()
          .forEach((sustainedKey) => sustainedKey.stop());
      } else {
        this.piano.paintPressedKey2(1081);
      }
    }
  }

  onNoteOnEvent(event) {
    if (event.velocity === 0) {
      this.onNoteOffEvent(event);
    } else {
      let keyEvent = this.instrument.play(
        event.noteName,
        this.safeAudioContext.currentTime,
        {
          gain: (event.velocity / 100) * this.volume,
          duration: this.piano.isSustainPedalPressed
            ? SUSTAINED_NOTE_DURATION
            : NON_SUSTAINED_NOTE_DURATION,
        }
      );
      //this.piano.setKey(event.noteNumber, keyEvent);
      noteOn(event.noteNumber);

      //manage chord display

      if (!this.currentNotes.includes(event.noteName)) {
        this.currentNotes.push(event.noteName);
        //highlightNote(noteNumber);
      }
      this.currentNotes.sort();
      this.refresh();
    }
  }

  onNoteOffEvent(event) {
    // const keyToStop = this.piano.stopKey(event.noteNumber);
    // if (keyToStop) keyToStop.stop();

    noteOff(event.noteNumber);

    //manage chord display

    const index = this.currentNotes.indexOf(event.noteName);
    if (index > -1) {
      this.currentNotes.splice(index, 1);
      //fadeNote(noteNumber);
    }
    this.refresh();
  }

  refresh() {
    //const notes = this.currentNotes.map(Note.fromMidi).map(Note.pc);

    const notes = this.currentNotes;

    console.log("notes: " + JSON.stringify(notes));

    const chords = notes.length > 2 ? detectChord(notes) : [];

    console.log("chords: " + JSON.stringify(chords));

    this.setNotesHtml(notes.map(keyToHtml).join(" "));
    if (chords && chords.length) {
      const chord = chords[0];
      this.setChordHtml(chordToHtml(chord));

      // if (previousChord) {
      //   fadeTonics();
      // }

      //highlightTonic(chord.tonic);
      this.previousChord = chord;
    } else {
      this.setChordHtml("");
      //fadeTonics();
    }
  }

  setNotesHtml(html) {
    console.log("notes html: " + html);
    notesDisplay.innerHTML = html;
  }

  setChordHtml(html) {
    console.log("chord html: " + html);
    chordDisplay1.innerHTML = html;
  }

  setTempo(tempo) {
    this.tempo = tempo;
    //console.log("tempo: " + this.tempo);

    this.player.setTempo(tempo);
  }

  async setMidi(midiUrl) {
    //console.log("midiUrl: " + midiUrl);
    // "../assets/chopin_etude_rev.mid"
    this.midi = await fetch(midiUrl).then((response) => response.arrayBuffer());
    this.player.loadArrayBuffer(this.midi);
  }

  playMidi() {
    this.player.play();
  }

  pauseMidi() {
    this.player.pause();
  }

  stopMidi() {
    //console.log("stop midi");
    this.player.stop();
    this.piano.repaintKeys();
  }
}
