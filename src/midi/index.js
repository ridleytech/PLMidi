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
import { Note, Midi } from "@tonaljs/tonal";

import { chordToHtml, keyToHtml } from "../chord-display/chords";
import {
  noteOn,
  noteOff,
  fadeAllNotes,
  noteOnPress,
  noteOnRelease,
} from "../chord-display/events";
import { setAccidentalKeyboard } from "../chord-display/keyboard";

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
    this.keySig = document.querySelector("#keySig");
    this.timeSig = null;
    this.currentlyPlaying = false;
    this.playButton = document.querySelector("#play-piece");
    this.loopButton = document.querySelector("#loop-piece");
    this.startLoopButton = document.querySelector("#start-loop");
    this.endLoopButton = document.querySelector("#end-loop");

    this.songLength = document.querySelector("#songLength");
    this.tempoSlider = document.querySelector("#input-k");
    this.tempoInput = document.querySelector("#tempo");
    this.pitchInput = document.querySelector("#pitch");

    this.barField = document.querySelector("#bar");
    this.beatField = document.querySelector("#beat");
    this.progressSlider = document.querySelector("#progressSlider");

    this.accidentalSwitch = document.querySelector("#accidentalSwitch");
    this.speedLbl = document.querySelector("#speed");

    this.loopSlider = document.querySelector("#ds");
    this.loopSlider2 = document.getElementById("noslider");

    this.loopStart = 0;
    this.loopEnd = 100;
    this.currentProgress = 0;

    this.bars = 1;
    this.beats = 1;
    this.displayBeat = 1;
    this.tempoOffset = 70;
    this.transposeVal = 0;
    this.transposeStr = "M";
    this.showSharp = true;

    //this.noSliderWrapper = document.getElementById("noSliderWrapper");

    setTimeout(() => {
      // this.sliderWrapper = document.querySelector(".slider-wrapper");
      // this.sliderWrapper.style.display = "none";
      this.noSliderWrapper = document.getElementById("noSliderWrapper");
      this.noSliderWrapper.style.display = "none";
      //console.log("sl: " + this.sliderWrapper);

      // this.pianoKeyNames = document.querySelector(".piano-key-name");
      // var hideKeys = true;

      // if (hideKeys) {
      //   this.pianoKeyNames.style.display = "none";
      // }

      for (let i = 21; i < 21 + 88; i++) {
        //this.paintReleasedKey(i);

        const keyElement = document.getElementById(`note-${i}`);
        keyElement.onmousedown = () => {
          this.playKey(keyElement.id);
        };

        keyElement.onmouseup = () => {
          this.releaseKey(keyElement.id);
        };
      }
    }, 200);

    //console.log("loopButton: " + this.loopButton);

    this.isLooping = false;
    this.loopTimer = null;
    this.songTimer = null;
    this.scales = [
      "C",
      "Db",
      "D",
      "Eb",
      "E",
      "F",
      "Gb",
      "G",
      "Ab",
      "A",
      "Bb",
      "B",
      "C",
      "Db",
      "D",
      "Eb",
      "E",
      "F",
      "Gb",
      "G",
      "Ab",
      "A",
      "Bb",
      "B",
      "C",
    ];

    this.scaleIndex = 12;
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

  releaseKey = (key) => {
    //console.log("release key: " + key);

    let noteNumber = parseInt(key.replace("note-", ""));
    let noteName = Note.fromMidi(noteNumber);

    // console.log("noteNumber: " + noteNumber);
    // console.log("noteName: " + noteName);

    noteOnRelease(noteNumber);
  };

  playKey = (key) => {
    //console.log("key: " + key);
    //return;
    let noteNumber = parseInt(key.replace("note-", ""));
    let noteName = Note.fromMidi(noteNumber);

    // console.log("noteNumber: " + noteNumber);
    // console.log("noteName: " + noteName);

    let keyEvent = this.instrument.play(
      noteNumber,
      this.safeAudioContext.currentTime,
      {
        gain: (76 / 100) * this.volume,
        duration: NON_SUSTAINED_NOTE_DURATION,
      }
    );

    noteOnPress(noteNumber);
  };

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
          if (this.intialTempoSet == false) {
            //this.tempo = event.data;
            //console.log("set initial tempo");
          }
          this.intialTempoSet = true;
          //console.log("tempo set event");
          this.player.setTempo(this.tempo);
        } else if (event.name === "Key Signature") {
          //console.log("key sig event: " + JSON.stringify(event));
          //Randall to do. This returns undefined
          //this.keySig = event.keySignature;
          //console.log("key sig set: " + this.keySig);
          //keySig.innerHTML = this.keySig;
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
      //console.log("current tick: " + JSON.stringify(currentTick));
      // Do something while player is playing
      // (this is repeatedly triggered within the play loop)
    });
  }

  checkSongProgress() {
    var time = this.player.getSongTime();
    //console.log("time: " + time);

    var remaining = this.player.getSongTimeRemaining();
    //console.log("remaining: " + remaining);

    var t = time - remaining;

    songLength.innerHTML = new Date(t * 1000).toISOString().substr(11, 8);

    //console.log("time: " + t);

    //bpm = 120
    //bps = 2

    var bps = this.tempo / 60;

    var currentBeat = bps + t;
    // /console.log("time: " + t + " currentBeat: " + currentBeat);

    if (currentBeat % 4 == 0) {
      if (this.lastBeat == currentBeat) {
        return;
      }

      this.bars++;
      this.lastBeat = currentBeat;

      this.currentBeat = 1;
      this.displayBeat = 1;
    } else {
      //this.displayBeat++;
      if (this.lastCurrentBeat == currentBeat) {
        return;
      }

      this.lastCurrentBeat = currentBeat;
      this.displayBeat++;
    }

    this.barField.innerHTML = this.bars.toString();
    this.beatField.innerHTML = ": " + this.displayBeat.toString();
  }

  checkPer() {
    //console.log("checkPer");

    var per = this.player.getSongPercentRemaining();
    //console.log("\nper remaining: " + per + "\n");

    this.currentProgress = 100 - per;
    //console.log("this.currentProgress: " + this.currentProgress);

    if (this.isLooping) {
      //debug loop

      if (this.currentProgress >= this.loopEnd) {
        console.log("rewind");
        this.player.skipToPercent(this.loopStart);
        this.player.play();
        return;
      }
    }

    this.progressSlider.value = this.currentProgress;
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
    // console.log("\nevent.noteNumber: " + event.noteNumber);
    //console.log("\nevent.noteName: " + event.noteName);
    var newNote = event.noteNumber + this.transposeVal;
    //console.log("newNote: " + newNote);

    var newNoteName = event.noteName;

    if (this.transposeVal > 0) {
      var distStr = this.transposeVal.toString() + this.transposeStr;
      newNoteName = Note.transpose(event.noteName, distStr);
      console.log("add newNoteName: " + newNoteName + " distStr: " + distStr);
    }

    if (event.velocity === 0) {
      this.onNoteOffEvent(event);
    } else {
      //console.log("velocity: " + event.velocity);
      let keyEvent = this.instrument.play(
        newNote,
        this.safeAudioContext.currentTime,
        {
          gain: (event.velocity / 100) * this.volume,
          duration: NON_SUSTAINED_NOTE_DURATION,
        }
      );

      // duration: this.piano.isSustainPedalPressed
      //       ? SUSTAINED_NOTE_DURATION
      //       : NON_SUSTAINED_NOTE_DURATION,

      //this.piano.setKey(event.noteNumber, keyEvent);

      //noteOn(event.noteNumber);
      noteOn(newNote);

      //manage chord display

      var accidentalName = Midi.midiToNoteName(newNote, {
        pitchClass: true,
        sharps: this.showSharp,
      });

      newNoteName = accidentalName;

      if (!this.currentNotes.includes(newNoteName)) {
        this.currentNotes.push(newNoteName);
        //highlightNote(noteNumber);
      }
      this.currentNotes.sort();
      this.refresh();
    }
  }

  onNoteOffEvent(event) {
    // const keyToStop = this.piano.stopKey(event.noteNumber);
    // if (keyToStop) keyToStop.stop();

    var newNote = event.noteNumber + this.transposeVal;

    //noteOff(event.noteNumber);
    noteOff(newNote);

    //manage chord display

    var newNoteName = event.noteName;

    if (this.transposeVal > 0) {
      var distStr = this.transposeVal.toString() + this.transposeStr;
      newNoteName = Note.transpose(event.noteName, distStr);
      //console.log("remove newNoteName: " + newNoteName + " distStr: " + distStr);
    }

    var accidentalName = Midi.midiToNoteName(newNote, {
      pitchClass: true,
      sharps: this.showSharp,
    });

    newNoteName = accidentalName;

    const index = this.currentNotes.indexOf(newNoteName);
    if (index > -1) {
      this.currentNotes.splice(index, 1);
      //fadeNote(noteNumber);
    }
    this.refresh();
  }

  setAccidental() {
    //console.log("setAccidental midi: " + this.accidentalSwitch.checked);

    var sharps = true;

    if (this.accidentalSwitch.checked) {
      sharps = false;
    }

    //console.log("midi sharps: " + sharps);

    this.showSharp = sharps;
    setAccidentalKeyboard(sharps);
  }

  refresh() {
    //const notes = this.currentNotes.map(Note.fromMidi).map(Note.pc);

    const notes = this.currentNotes;

    //console.log("\nnotes: " + JSON.stringify(notes));

    const chords = notes.length > 2 ? detectChord(notes) : [];

    //console.log("chords: " + JSON.stringify(chords));

    this.setNotesHtml(notes.map(keyToHtml).join(" "));
    if (chords && chords.length) {
      const chord = chords[0];
      // this.setChordHtml(chordToHtml(chord));

      // if (previousChord) {
      //   fadeTonics();
      // }

      //highlightTonic(chord.tonic);
      this.previousChord = chord;
    } else {
      //this.setChordHtml("");
      //fadeTonics();
    }
  }

  setSliderTempo(val) {
    //console.log("val: " + val);

    var newVal = parseInt(val) + parseInt(this.tempoOffset);
    //console.log("new set tempo: " + newVal);

    //this.tempoInput.value = newVal;

    var speedPercentage = (newVal / 120) * 100;

    //console.log("speedPercentage: " + speedPercentage.toFixed(0));

    this.speedLbl.innerHTML = speedPercentage.toFixed(0).toString() + "%";

    this.setTempo(newVal);
  }

  setSliderPitch(val) {
    //console.log("val: " + val);

    var newVal = parseInt(val);
    //console.log("new set pitch: " + newVal);

    //this.tempoInput.value = newVal;

    this.setPitch(newVal);
  }

  setPitch(val) {}

  updateTempoInput(val) {
    //console.log("set tempo: " + val);

    var newVal = parseInt(val) + parseInt(this.tempoOffset);
    //console.log("turn tempo: " + newVal);

    var speedPercentage = (newVal / 120) * 100;

    //console.log("speedPercentage: " + speedPercentage.toFixed(0));

    this.speedLbl.innerHTML = speedPercentage.toFixed(0).toString() + "%";

    this.tempoInput.value = newVal;
  }

  updatePitchSlider(val) {
    //console.log("set tempo: " + val);

    fadeAllNotes();
    //this.pauseMidi();
    if (this.currentlyPlaying) {
      this.playMidi();
    }

    var newVal = parseInt(val);
    //console.log("pitch: " + newVal);
    this.transposeVal = newVal;
    this.pitchInput.innerHTML = newVal.toString() + " st";

    this.keySig.innerHTML = this.scales[this.transposeVal + 12] + " Major";
  }

  movePlayhead(val) {
    //console.log("set progress: " + val);

    this.currentProgress = val;

    if (this.currentlyPlaying) {
      fadeAllNotes();
      this.playMidi();
    }

    //this.pauseMidi();
  }

  setNotesHtml(html) {
    //console.log("notes html: " + html);
    notesDisplay.innerHTML = html;
  }

  // setChordHtml(html) {
  //   //console.log("chord html: " + html);
  //   chordDisplay1.innerHTML = html;
  // }

  setTempo(tempo) {
    //console.log("setTempo change tempo: " + tempo);

    this.intialTempoSet = true;

    this.pauseMidi();

    this.tempo = tempo;
    //console.log("new tempo: " + this.tempo);

    this.player.setTempo(this.tempo);

    var newVal = parseInt(tempo) - parseInt(this.tempoOffset);
    //console.log("new tempo val for slider: " + newVal);

    this.tempoSlider.value = newVal;
  }

  setTempoInput(tempo) {
    //console.log("change tempo input: " + tempo);
    this.pauseMidi();

    this.tempo = tempo;
    //console.log("new tempo from input: " + this.tempo);

    this.setTempo(tempo);

    var newVal = parseInt(tempo) - parseInt(this.tempoOffset);
    //console.log("new tempo val for slider: " + newVal);

    var speedPercentage = (tempo / 120) * 100;

    //console.log("speedPercentage input: " + speedPercentage.toFixed(0));

    this.speedLbl.innerHTML = speedPercentage.toFixed(0).toString() + "%";

    this.tempoSlider.value = newVal;
  }

  //https://metroui.org.ua/double-slider.html

  setStartLoop() {
    if (!this.isLooping) {
      return;
    }
    //console.log("setStartLoop");

    this.loopStart = this.currentProgress;

    //this.loopSlider.val[0] = this.loopStart;

    this.loopSlider2.noUiSlider.set([this.loopStart, this.loopEnd]);

    //console.log("this.loopSlider: " + this.loopSlider.value[0]);
  }

  setEndLoop() {
    if (!this.isLooping) {
      return;
    }

    //console.log("setEndLoop");

    this.loopEnd = this.currentProgress;

    this.loopSlider2.noUiSlider.set([this.loopStart, this.loopEnd]);

    //this.loopSlider[1].value = this.loopEnd;
  }

  manageLoop() {
    //console.log("manage loop");

    if (this.isLooping) {
      this.loopButton.classList.remove("loopEnabled");
      this.isLooping = false;
      //this.sliderWrapper.style.display = "none";
      this.noSliderWrapper.style.display = "none";

      this.startLoopButton.style.color = "gray";
      this.endLoopButton.style.color = "gray";
    } else {
      this.loopButton.classList.add("loopEnabled");
      //this.sliderWrapper.style.display = "block";
      this.noSliderWrapper.style.display = "block";

      this.isLooping = true;

      this.startLoopButton.style.color = "#fcff02";
      this.endLoopButton.style.color = "#fcff02";
    }
  }

  setLoopRange(val) {
    //console.log("type: " + typeof val);

    //console.log("slr: " + val);

    var vals = val.split(",");

    //console.log("vals: " + vals);

    //console.log("type: " + typeof vals);

    this.loopStart = parseInt(vals[0].trim());
    this.loopEnd = 100 - parseInt(vals[1].trim());

    // console.log("loopStart: " + this.loopStart);
    // console.log("loopEnd: " + this.loopEnd);
  }

  async setMidi(midiUrl) {
    //console.log("midiUrl: " + midiUrl);
    // "../assets/chopin_etude_rev.mid"
    this.midi = await fetch(midiUrl).then((response) => response.arrayBuffer());
    this.player.loadArrayBuffer(this.midi);

    //console.log("set midi");

    if (this.intialTempoSet == true) {
      this.tempo = 120;
      this.setTempo(this.tempo);
      this.tempoInput.value = this.tempo;

      this.transposeVal = 0;
      this.pitchInput.innerHTML = this.transposeVal.toString() + " st";
      this.keySig.innerHTML = this.scales[this.transposeVal + 12] + " Major";

      this.currentNotes = [];
      this.refresh();
    }
  }

  manageMidi() {
    //console.log("manage midi");

    // return;
    if (this.currentlyPlaying) {
      //console.log("playing");
      this.pauseMidi();
      this.currentlyPlaying = false;
    } else {
      //console.log("paused");
      this.currentlyPlaying = true;
      this.playMidi();
    }
  }

  // skipTo() {
  //   console.log("skip to 20%");
  //   this.player.skipToPercent(10);
  //   this.player.play();
  // }

  movePlayheadFwd() {
    if (this.currentProgress < 100) {
      this.currentProgress += 1;
      this.player.skipToPercent(parseInt(this.currentProgress));

      this.progressSlider.value = this.currentProgress;
      if (this.currentlyPlaying) {
        fadeAllNotes();
        this.currentNotes = [];
        this.refresh();
        this.player.play();
      }
    }
  }

  movePlayheadBwd() {
    if (this.currentProgress > 0) {
      this.currentProgress -= 1;
      this.player.skipToPercent(parseInt(this.currentProgress));

      this.progressSlider.value = this.currentProgress;
      if (this.currentlyPlaying) {
        fadeAllNotes();
        this.currentNotes = [];
        this.refresh();
        this.player.play();
      }
    }
  }

  playMidi() {
    //console.log("play midi tempo:" + this.tempo);
    fadeAllNotes();
    this.currentNotes = [];
    this.refresh();

    this.playButton.classList.add("paused");

    clearInterval(this.loopTimer);
    this.loopTimer = setInterval(() => {
      this.checkPer();
    }, 1000);

    clearInterval(this.songTimer);
    this.songTimer = setInterval(() => {
      this.checkSongProgress();
    }, 50);

    // if (this.isLooping) {
    //   this.player.skipToPercent(this.loopStart);
    // } else {
    //   //resume play from current position if/when loop turned off
    //   this.player.skipToPercent(this.currentProgress);
    // }

    this.player.skipToPercent(this.currentProgress);

    this.player.play();
  }

  pauseMidi() {
    this.playButton.classList.remove("paused");
    this.currentlyPlaying = false;
    clearInterval(this.loopTimer);
    clearInterval(this.songTimer);

    this.player.pause();
  }

  stopMidi() {
    clearInterval(this.loopTimer);
    clearInterval(this.songTimer);
    //console.log("stop midi");
    this.player.stop();
    this.currentlyPlaying = false;
    this.playButton.classList.remove("paused");

    if (this.isLooping) {
      this.currentProgress = this.loopStart;
    } else {
      this.currentProgress = 0;
    }

    fadeAllNotes();
    this.bars = 1;
    this.lastBeat = 1;
    this.lastCurrentBeat = 1;
    this.displayBeat = 1;
    // var tt = this.player.getTotalTicks();
    // console.log("ticks: " + tt);

    this.barField.innerHTML = this.bars.toString();
    this.beatField.innerHTML = ": " + this.displayBeat.toString();
    songLength.innerHTML = new Date(0 * 1000).toISOString().substr(11, 8);
    this.progressSlider.value = this.currentProgress;

    this.currentNotes = [];
    this.refresh();
  }
}
