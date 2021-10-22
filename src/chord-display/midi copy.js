/* source: https://github.com/cwilso/midi-synth/blob/master/js/midi.js */
import { FancyPiano } from "../piano";
import { FancyMidiPlayer } from "../midi/";
import SoundFont from "soundfont-player";
import {
  SUSTAINED_NOTE_DURATION,
  NON_SUSTAINED_NOTE_DURATION,
} from "../utils/constants";

import {
  noteOff,
  noteOn,
  controller,
  pitchWheel,
  modWheel,
  polyPressure,
} from "./events";
import { setChordHtml, setNotesHtml, setAppError, setAppLoaded } from "./ui";
import { getSetting, setSetting } from "./settings";

const PREFERRED_MIDI = ["mpk", "key", "piano"];

const CMD_NOTE_OFF = 8;
const CMD_NOTE_ON = 9;
const CMD_AFTERTOUCH = 10;
const CMD_CC = 11;
const CMD_PITCHBEND = 14;
const NOTE_CC_MODWHEEL = 1;
const SUS_ON = 11;

var piano = new FancyPiano(document);
var instrument = null;
var audioContext = window.AudioContext || window.webkitAudioContext || false;
var safeAudioContext = new audioContext();
var volume = 3;

var enableKeyboard = true;

//var fmp = new FancyMidiPlayer(document);

console.log("FancyMidiPlayer: " + FancyMidiPlayer);

const instrumentUrl =
  "https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/gh-pages/FatBoy/bright_acoustic_piano-mp3.js";

function playInstrumentMidiNote(note, velocity) {
  // console.log("note: " + note + " vel: " + velocity);
  // console.log("safeAudioContext.currentTime: " + safeAudioContext.currentTime);
  //console.log("piano.isSustainPedalPressed: " + piano.isSustainPedalPressed);
  console.log("try");

  //fmp.manageMidi();

  return;

  if (fmp.instrument) {
    console.log("play!");
    fmp.instrument.play(note, fmp.safeAudioContext.currentTime, {
      gain: velocity * fmp.volume,
      duration: fmp.piano.isSustainPedalPressed
        ? SUSTAINED_NOTE_DURATION
        : NON_SUSTAINED_NOTE_DURATION,
    });
  }
}

async function setInstrument() {
  // console.log("setInstrument: " + instrumentUrl);
  // console.log("safeAudioContext: " + safeAudioContext);

  instrument = await SoundFont.instrument(safeAudioContext, instrumentUrl);

  //console.log("instrument: " + instrument);
}

// if (enableKeyboard) {
//   setInstrument().then(() => {
//     //console.log("instrument set");
//   });
// }

function midiMessageReceived(ev) {
  let cmd = ev.data[0] >> 4;
  let channel = ev.data[0] & 0xf;
  let noteNumber = ev.data[1];
  let velocity = ev.data[2];

  // if (cmd != 15) {
  //   console.log("cmd: " + cmd);
  // }

  if (cmd == SUS_ON) {
    //console.log("sustain");

    //console.log("" + ev.data[0] + " " + ev.data[1] + " " + ev.data[2]);

    // if(ev.data[2] == 127) == pressed
    piano.setSustainPedal(ev.data[2]);
  }

  if (channel === 9) return;
  if (cmd === CMD_NOTE_OFF || (cmd === CMD_NOTE_ON && velocity === 0)) {
    // with MIDI, note on with velocity zero is the same as note off
    // note off
    noteOff(noteNumber);
  } else if (cmd === CMD_NOTE_ON) {
    // note on
    //console.log("keyboard controller noteon");

    if (enableKeyboard) {
      noteOn(noteNumber, velocity / 127.0);
      playInstrumentMidiNote(noteNumber, velocity / 127.0);
    }
  } else if (cmd === CMD_CC) {
    if (noteNumber === NOTE_CC_MODWHEEL) {
      modWheel(velocity / 127.0);
    } else {
      controller(noteNumber, velocity / 127.0);
    }
  } else if (cmd === CMD_PITCHBEND) {
    // pitch wheel
    pitchWheel((velocity * 128.0 + noteNumber - 8192) / 8192.0);
  } else if (cmd === CMD_AFTERTOUCH) {
    // poly aftertouch
    polyPressure(noteNumber, velocity / 127);
  } else {
    //console.log('' + ev.data[0] + ' ' + ev.data[1] + ' ' + ev.data[2])
  }
}

let selectMIDI = null;
let midiAccess = null;
let midiIn = null;

export function selectMIDIIn(ev) {
  if (midiIn) midiIn.onmidimessage = null;
  let id = ev.target[ev.target.selectedIndex].value;
  if (typeof midiAccess.inputs === "function")
    //Old Skool MIDI inputs() code
    midiIn = midiAccess.inputs()[ev.target.selectedIndex];
  else midiIn = midiAccess.inputs.get(id);
  if (midiIn) midiIn.onmidimessage = midiMessageReceived;

  setSetting("midiIn", midiIn.name.toString());
}

function populateMIDIInSelect() {
  const midiInSetting = getSetting("midiIn");

  // clear the MIDI input select
  selectMIDI.options.length = 0;
  if (midiIn && midiIn.state == "disconnected") midiIn = null;
  let firstInput = null;

  let inputs = midiAccess.inputs.values();
  for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
    input = input.value;
    const str = input.name.toString();

    if (!firstInput) {
      firstInput = input;
    }

    let preferred = false;

    if (midiIn && midiIn === input) {
      preferred = true;
    }

    if (
      !midiIn &&
      midiInSetting &&
      str.toLowerCase().indexOf(midiInSetting.toLowerCase()) !== -1
    ) {
      preferred = true;
    }

    for (const pref of PREFERRED_MIDI) {
      if (!midiIn && str.toLowerCase().indexOf(pref) !== -1) {
        preferred = true;
      }
    }

    selectMIDI.appendChild(
      new Option(input.name, input.id, preferred, preferred)
    );

    if (preferred) {
      midiIn = input;
      midiIn.onmidimessage = midiMessageReceived;
    }
  }
  if (!midiIn) {
    midiIn = firstInput;
    if (midiIn) midiIn.onmidimessage = midiMessageReceived;
  }
}

function midiConnectionStateChange(e) {
  console.log(
    `connection: ${e.port.name} ${e.port.connection} ${e.port.state}`
  );
  populateMIDIInSelect();
}

function onMIDIStarted(midi) {
  midiAccess = midi;
  setAppLoaded();
  selectMIDI = document.getElementById("midiIn");
  midi.onstatechange = midiConnectionStateChange;
  populateMIDIInSelect();
}

function onMIDISystemError(err) {
  setAppError("Cannot initialize MIDI");
  console.log(`MIDI not initialized - error encountered: ${err.code}`);
}

export function initializeMidi() {
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(onMIDIStarted, onMIDISystemError);
  } else {
    setAppError("Your browser has no MIDI features.");
  }
}
