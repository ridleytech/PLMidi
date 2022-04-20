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
  noteOnPressUser,
  noteOnReleaseUser,
  noteOnReleaseUserHvrOut,
  setChordAccidental,
} from "../chord-display/events";
import { setAccidentalKeyboard } from "../chord-display/keyboard";
// import * as piano1 from "../sf2/piano1";
// console.log("piano1: " + JSON.stringify(piano1));
//const tools = require("../soundfont/acoustic_grand_piano-mp3.js");

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
    //this.tempoSlider = document.querySelector("#input-k");
    this.tempoInput = document.querySelector("#tempo");
    this.pitchInput = document.querySelector("#pitch");

    this.barField = document.querySelector("#bar");
    this.beatField = document.querySelector("#beat");
    this.progressSlider = document.querySelector("#progressSlider");

    this.accidentalSwitch = document.querySelector("#accidentalSwitch");
    this.speedLbl = document.querySelector("#speed");

    this.loopSlider = document.querySelector("#ds");
    this.loopSlider2 = document.getElementById("noslider");
    this.loopSlider3 = document.getElementById("noslider2");
    this.speedslider = document.getElementById("noslider3");

    this.app = document.getElementById("#app");

    this.loopStart = 0;
    this.loopEnd = 100;
    this.currentProgress = 0;

    this.bars = 1;
    this.beats = 1;
    this.displayBeat = 1;
    this.tempoOffset = 70;
    this.transposeVal = 0;
    this.transposeStr = "M";
    this.showSharp = false;
    this.songTimer = null;
    this.manageMidiEnabled = true;
    this.buttonHovered = false;
    this.currentSounds = [];

    this.ke = null;

    this.playButton.onmouseout = () => {
      this.buttonHovered = false;
      //console.log("hovered: " + this.buttonHovered);
    };

    this.playButton.onmouseover = () => {
      this.buttonHovered = true;
      //console.log("hovered: " + this.buttonHovered);
    };

    this.playButton.onmouseover = () => {
      this.buttonHovered = false;
      //console.log("hovered: " + this.buttonHovered);
    };

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

      this.assignKeys();
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

  assignKeys() {
    for (let i = 21; i < 21 + 88; i++) {
      const keyElement = document.getElementById(`note-${i}`);
      keyElement.onmousedown = () => {
        this.playKeyTouch(keyElement.id);
      };

      keyElement.onmouseup = () => {
        this.releaseKeyTouch(keyElement.id);
      };

      keyElement.onmouseout = () => {
        this.releaseKeyHvrOut(keyElement.id);
      };
    }
  }

  releaseKeyTouch = (key) => {
    //console.log("release key: " + key);

    let noteNumber = parseInt(key.replace("note-", ""));
    //let noteName = Note.fromMidi(noteNumber);

    // console.log("noteNumber: " + noteNumber);
    // console.log("noteName: " + noteName);

    // if (!this.piano.isSustainPedalPressed) {
    //   this.instrument.stop();
    // }

    const theSound = this.currentSounds.find((x) => x.noteID === noteNumber);
    //console.log("theSound: " + JSON.stringify(theSound));

    if (!this.piano.isSustainPedalPressed && theSound) {
      //theSound.stop(); // changed 2/21/02
    }

    this.currentSounds = this.currentSounds.filter(
      (x) => x.noteID != noteNumber
    );

    //console.log("stop playing");

    noteOnReleaseUser(noteNumber);
  };

  releaseKeyHvrOut = (key) => {
    //console.log("release key: " + key);

    let noteNumber = parseInt(key.replace("note-", ""));
    //let noteName = Note.fromMidi(noteNumber);

    // console.log("noteNumber: " + noteNumber);
    // console.log("noteName: " + noteName);

    noteOnReleaseUserHvrOut(noteNumber);
  };

  playKeyTouch = (key) => {
    //console.log("key: " + key);
    //return;
    let noteNumber = parseInt(key.replace("note-", ""));
    //let noteName = Note.fromMidi(noteNumber);

    // console.log("noteNumber: " + noteNumber);
    // console.log("noteName: " + noteName);

    if (this.instrument) {
      let keyEvent = this.instrument.play(
        noteNumber,
        this.safeAudioContext.currentTime,
        {
          gain: (76 / 100) * this.volume,
          duration: SUSTAINED_NOTE_DURATION,
        }
      );

      keyEvent.noteID = noteNumber;
      //console.log("keyEvent: " + JSON.stringify(keyEvent));

      this.currentSounds.push(keyEvent);
    }

    noteOnPressUser(noteNumber);
  };

  async setInstrument(instrumentUrl) {
    //console.log("instrumentUrl: " + instrumentUrl);
    this.instrument = await SoundFont.instrument(
      this.safeAudioContext,
      instrumentUrl
      // {
      //   destination: this.reverbNode,
      // }
    );

    //    this.instrument = Soundfont.instrument(this.safeAudioContext, '/soundfonts/clavinet-mp3.js').then(()=>{console.log("sf loaded")})

    // this.instrument = await Soundfont.instrument(
    //   this.safeAudioContext,
    //   instrumentUrl
    // ).then(() => {
    //   console.log("sf loaded");
    // });

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

          //timeSig.innerHTML = this.timeSig;

          //console.log("time sig set: " + this.timeSig);
        }
      }

      this.player.on("endOfFile", function () {
        // Do something when end of the file has been reached.
        //console.log("end of file reached");
        //this.stopMidi()
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
    });
  }

  playBtnClicked = () => {
    //console.log("playBtnClicked");

    this.manageMidi();
  };

  keyboardSpaceClicked = () => {
    //console.log("keyboardSpaceClicked");

    if (this.buttonHovered) {
      return;
    }

    this.manageMidi();
  };

  getSongTime2() {
    return (this.player.totalTicks / this.player.division / 120) * 60;
  }

  getSongTimeRemaining2() {
    return Math.round(
      ((this.player.totalTicks - this.player.getCurrentTick()) /
        this.player.division /
        120) *
        60
    );
  }

  checkSongProgress() {
    //var time = this.player.getSongTime();
    var time = this.getSongTime2();

    //console.log("currentTick: " + this.player.getCurrentTick());

    // if ((this.player.getCurrentTick() / 4) % 4 == 0) {
    //   console.log("add one");
    // }

    //console.log("time: " + time);

    //var remaining = this.player.getSongTimeRemaining();
    var remaining = this.getSongTimeRemaining2();

    if (remaining == 0) {
      this.stopMidi();
      return;
    }

    //console.log("remaining: " + remaining);
    //console.log("currentBar: " + currentBar);

    var t = time - remaining;

    songLength.innerHTML = new Date(t * 1000).toISOString().substr(11, 8);

    //console.log("time: " + t);

    //bpm = 120
    //bps = 2

    var bps = this.tempo / 60;

    var currentBeat = bps + t;
    // /console.log("time: " + t + " currentBeat: " + currentBeat);

    var currentBar = currentBeat % 4;

    // console.log(
    //   "t: " +
    //     t +
    //     " currentBeat: " +
    //     currentBeat +
    //     " remaining: " +
    //     remaining +
    //     " time: " +
    //     time +
    //     " currentBar: " +
    //     currentBar +
    //     " bps: " +
    //     bps
    // );

    if (currentBeat % 4 == 0) {
      if (this.lastBeat == currentBeat) {
        return;
      }

      //this.bars++;
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

      if (this.displayBeat > 4) {
        this.displayBeat = 1;
      }
    }

    this.bars = Math.floor(currentBeat / 4) + 1;

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
    this.loopSlider3.noUiSlider.set([null, this.currentProgress]);
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
      this.playInstrumentMidiNote(event.velocity, newNote);

      //this.piano.setKey(event.noteNumber, keyEvent);

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

    //console.log("note off index: " + newNote);
    noteOff(newNote);

    //manage chord display

    var newNoteName = event.noteName;

    if (this.transposeVal > 0) {
      var distStr = this.transposeVal.toString() + this.transposeStr;
      newNoteName = Note.transpose(event.noteName, distStr);
      //console.log("remove newNoteName: " + newNoteName + " distStr: " + distStr);
    }

    const theSound = this.currentSounds.find((x) => x.noteID === newNote);
    //console.log("theSound: " + JSON.stringify(theSound));

    if (!this.piano.isSustainPedalPressed && theSound) {
      theSound.stop();
    }

    this.currentSounds = this.currentSounds.filter((x) => x.noteID != newNote);

    // if (!this.piano.isSustainPedalPressed) {
    //   this.instrument.stop(newNote);
    // }

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

  onControllerChange(event) {
    this.handleSustain(event);
  }

  handleSustain(event) {
    //to do
    //stop notes currently playing

    // console.log("event: " + JSON.stringify(event));
    // console.log("number: " + event.number + " val: " + event.value);

    if (event.number === 64) {
      // Sustain Pedal Change

      //console.log("sus event val: " + event.value);
      this.piano.setSustainPedal(event.value);

      //console.log(this.piano.isSustainPedalPressed ? "Pressed" : "Released");

      if (!this.piano.isSustainPedalPressed) {
        this.piano.paintReleasedKey2(1081);

        //console.log("stop sustain");
        //this.instrument.stop();

        // this.currentSounds.forEach((sound) => {
        //   sound.stop();
        // });

        //this.currentSounds = [];

        this.piano
          .getSustainedKeys()
          .forEach((sustainedKey) => sustainedKey.stop());
      } else {
        this.piano.paintPressedKey2(1081);
      }
    }
  }

  playInstrumentMidiNote(velocity, note) {
    //console.log("play file note");
    let keyEvent = this.instrument.play(
      note,
      this.safeAudioContext.currentTime,
      {
        gain: (velocity / 100) * this.volume,
        duration: this.piano.isSustainPedalPressed
          ? SUSTAINED_NOTE_DURATION
          : NON_SUSTAINED_NOTE_DURATION,
      }
    );

    keyEvent.noteID = note;
    //console.log("keyEvent: " + JSON.stringify(keyEvent));

    this.currentSounds.push(keyEvent);
  }

  stopInstrumentMidiNote(note) {
    //console.log("stop note: " + note);

    const theSound = this.currentSounds.find((x) => x.noteID === note);
    //console.log("theSound: " + JSON.stringify(theSound));

    if (!this.piano.isSustainPedalPressed) {
      theSound.stop();
    }

    this.currentSounds = this.currentSounds.filter((x) => x.noteID != note);
    //console.log("cs len: " + this.currentSounds.length);
  }

  playKeyboardInstrumentMidiNote(velocity, note) {
    //console.log("play note: " + note);
    let keyEvent = this.instrument.play(
      note,
      this.safeAudioContext.currentTime,
      {
        gain: velocity * this.volume,
        duration: this.piano.isSustainPedalPressed
          ? SUSTAINED_NOTE_DURATION
          : NON_SUSTAINED_NOTE_DURATION,
      }
    );

    keyEvent.noteID = note;
    //console.log("keyEvent: " + JSON.stringify(keyEvent));

    this.currentSounds.push(keyEvent);
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
    //set accidental for main chord display
    setChordAccidental(sharps);
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

    //this.pauseMidi();

    //console.log("pause playback prevent play speed glitch");
    if (this.currentlyPlaying) {
      this.player.pause();
    }

    this.tempo = tempo;
    //console.log("new tempo: " + this.tempo);

    this.player.setTempo(this.tempo);

    var newVal = parseInt(tempo) - parseInt(this.tempoOffset);
    //console.log("new tempo val for slider: " + newVal);

    //this.tempoSlider.value = newVal;
    this.speedslider.noUiSlider.set(newVal);

    if (this.currentlyPlaying) {
      //console.log("resume play after speed change");
      setTimeout(() => {
        this.player.play();
      }, 500);
    }
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

    //this.tempoSlider.value = newVal;
    this.speedslider.noUiSlider.set(newVal);
  }

  setStartLoop() {
    if (!this.isLooping) {
      return;
    }

    //console.log("setStartLoop: " + this.currentProgress);

    this.loopStart = this.currentProgress;

    //this.loopSlider.val[0] = this.loopStart;

    this.loopSlider2.noUiSlider.set([this.loopStart, this.loopEnd]);
    this.loopSlider3.noUiSlider.set([
      this.loopStart,
      this.currentProgress,
      this.loopEnd,
    ]);

    //console.log("this.loopSlider: " + this.loopSlider.value[0]);
  }

  setEndLoop() {
    if (!this.isLooping) {
      return;
    }

    //console.log("setEndLoop: " + this.currentProgress);

    this.loopEnd = this.currentProgress;

    this.loopSlider2.noUiSlider.set([this.loopStart, this.loopEnd]);
    this.loopSlider3.noUiSlider.set([
      this.loopStart,
      this.currentProgress,
      this.loopEnd,
    ]);
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

      this.loopStart = 0;
      this.loopEnd = 100;

      this.loopSlider2.noUiSlider.set([this.loopStart, this.loopEnd]);
      this.loopSlider3.noUiSlider.set([
        this.loopStart,
        this.currentProgress,
        this.loopEnd,
      ]);
    } else {
      this.loopButton.classList.add("loopEnabled");
      //this.sliderWrapper.style.display = "block";
      this.noSliderWrapper.style.display = "block";

      this.isLooping = true;

      this.startLoopButton.style.color = "#fcff02";
      this.endLoopButton.style.color = "#fcff02";
    }
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

    // var tt = this.player.getTotalTicks();
    // console.log("ticks: " + tt);
  }

  manageMidi() {
    //console.log("manage midi");

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

  movePlayheadFwd() {
    if (this.currentProgress < 100) {
      this.currentProgress += 1;
      this.player.skipToPercent(parseInt(this.currentProgress));

      this.progressSlider.value = this.currentProgress;
      this.loopSlider3.noUiSlider.set([null, this.currentProgress]);
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
      this.loopSlider3.noUiSlider.set([null, this.currentProgress]);

      if (this.currentlyPlaying) {
        fadeAllNotes();
        this.currentNotes = [];
        this.refresh();
        this.player.play();
      }
    }
  }

  playMidi() {
    //console.log("playMidi");
    // var time = this.player.getSongTime();
    // console.log("time: " + time);
    //console.log("this.player.totalTicks: " + this.player.totalTicks);

    // var remaining = this.player.getSongTimeRemaining();
    // console.log("remaining: " + remaining);

    //console.log("play midi tempo:" + this.tempo);

    // var tt = this.player.getTotalTicks();
    // console.log("ticks: " + tt);

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
    this.piano.paintReleasedKey2(1081);

    this.bars = 1;
    this.lastBeat = 1;
    this.lastCurrentBeat = 1;
    this.displayBeat = 1;

    this.barField.innerHTML = this.bars.toString();
    this.beatField.innerHTML = ": " + this.displayBeat.toString();
    songLength.innerHTML = new Date(0 * 1000).toISOString().substr(11, 8);
    this.progressSlider.value = this.currentProgress;
    this.loopSlider3.noUiSlider.set([null, this.currentProgress]);

    this.currentNotes = [];
    this.refresh();
  }
}
