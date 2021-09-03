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
    //console.log("FanceyMidiPlayer");
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
    this.currentlyPlaying = false;
    this.playButton = document.querySelector("#play-piece");
    this.loopButton = document.querySelector("#loop-piece");

    setTimeout(() => {
      this.sliderWrapper = document.querySelector(".slider-wrapper");
      console.log("sl: " + this.sliderWrapper);
      this.sliderWrapper.style.display = "none";
    }, 50);

    console.log("loopButton: " + this.loopButton);

    this.isLooping = false;
    this.loopTimer = null;
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
        //console.log("controller event: " + JSON.stringify(event));
        this.onControllerChange(event);
      } else if (event.name === "Note on") {
        //console.log("note one event: " + JSON.stringify(event));
        this.onNoteOnEvent(event);
      } else if (event.name === "Note off") {
        //console.log("note off event: " + JSON.stringify(event));
        this.onNoteOffEvent(event);
      } else {
        //console.log("other event: " + JSON.stringify(event));

        if (event.name === "Set Tempo") {
          this.intialTempoSet = true;
          this.tempo = event.data;
          //console.log("tempo set");
        } else if (event.name === "Key Signature") {
          this.keySig = event.keySignature;
          //console.log("key sig set: " + this.keySig);

          keySig.innerHTML = this.keySig;
        } else if (event.name === "Time Signature") {
          this.timeSig = event.timeSignature;

          timeSig.innerHTML = this.timeSig;

          //console.log("time sig set: " + this.timeSig);
        }
      }
    });

    this.player.on("endOfFile", function () {
      // Do something when end of the file has been reached.
      console.log("end of file reached");
    });

    this.player.on("fileLoaded", function () {
      // Do something when file is loaded
      //console.log("loaded: " + JSON.stringify(this.player));
    });

    this.player.on("playing", function (currentTick) {
      console.log("current tick: " + currentTick);
      // Do something while player is playing
      // (this is repeatedly triggered within the play loop)
    });
  }

  checkPer() {
    //console.log("checkPer");

    if (this.isLooping) {
      var per = this.player.getSongPercentRemaining();
      console.log("per: " + per);

      //debug loop

      if (per <= 97) {
        console.log("rewind");
        this.player.skipToPercent(0);
        this.player.play();
        return;
      }
    }
  }

  onControllerChange(event) {
    if (event.number === 64) {
      // Sustain Pedal Change
      this.piano.setSustainPedal(event.value);

      //console.log(this.piano.isSustainPedalPressed ? "Pressed" : "Released");

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
    //console.log("notes html: " + html);
    notesDisplay.innerHTML = html;
  }

  setChordHtml(html) {
    //console.log("chord html: " + html);
    chordDisplay1.innerHTML = html;
  }

  setTempo(tempo) {
    this.tempo = tempo;
    //console.log("tempo: " + this.tempo);

    this.player.setTempo(tempo);
  }

  //https://metroui.org.ua/double-slider.html

  manageLoop() {
    console.log("manage loop");

    if (this.isLooping) {
      this.loopButton.classList.remove("loopEnabled");
      this.isLooping = false;
      this.sliderWrapper.style.display = "none";
    } else {
      this.loopButton.classList.add("loopEnabled");
      this.sliderWrapper.style.display = "block";

      this.isLooping = true;
    }
  }

  async setMidi(midiUrl) {
    //console.log("midiUrl: " + midiUrl);
    // "../assets/chopin_etude_rev.mid"
    this.midi = await fetch(midiUrl).then((response) => response.arrayBuffer());
    this.player.loadArrayBuffer(this.midi);
  }

  manageMidi() {
    console.log("manage midi");

    // this.playMidi();

    // return;
    if (this.currentlyPlaying) {
      //console.log("playing");
      this.pauseMidi();
      this.currentlyPlaying = false;
      this.playButton.classList.remove("paused");
    } else {
      //console.log("paused");
      this.currentlyPlaying = true;
      this.playMidi();

      this.playButton.classList.add("paused");
    }
  }

  skipTo() {
    console.log("skip to 20%");
    this.player.skipToPercent(10);
    this.player.play();
  }

  playMidi() {
    clearInterval(this.loopTimer);
    this.loopTimer = setInterval(() => {
      this.checkPer();
    }, 1000);

    this.player.play();
  }

  pauseMidi() {
    clearInterval(this.loopTimer);

    this.player.pause();
  }

  stopMidi() {
    clearInterval(this.loopTimer);
    //console.log("stop midi");
    this.player.stop();
    this.currentlyPlaying = false;
    this.playButton.classList.remove("paused");

    this.piano.repaintKeys();
  }
}
