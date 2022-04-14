import Note from "tonal/note";
//import Note from "tonal";
import { Note as Note2, Interval } from "@tonaljs/tonal";
import { chord as detectChord } from "tonal/detect";
import {
  highlightNote,
  fadeNote,
  highlightNoteUser,
  fadeNoteUser,
  fadeNoteHvrOut,
  highlightTonic,
  fadeTonics,
  setChordHtml,
  setNotesHtml,
  setPitchWheel,
  setModWheel,
} from "./ui";
import { chordToHtml, keyToHtml } from "./chords";
import { setAccidentalKeyboard } from "./keyboard";

const resultDiv = document.getElementById("testResult");

const currentNotes = [];
let currentPitch = 0;
let currentModulation = 0;

let previousChord = null;

let lastNoteTimer = null;
var lastNoteSeconds = 0;
var isSharps = false;

export function noteOn(noteNumber) {
  //console.log("noteOn events: " + noteNumber);
  if (!currentNotes.includes(noteNumber)) {
    currentNotes.push(noteNumber);
    highlightNote(noteNumber);
  }
  currentNotes.sort();
  refresh();
}

export function setChordAccidental(val) {
  isSharps = val;
}

export function noteOnPressUser(noteNumber) {
  highlightNoteUser(noteNumber);
}

export function noteOnReleaseUser(noteNumber) {
  fadeNoteUser(noteNumber);
}

export function noteOnReleaseUserHvrOut(noteNumber) {
  fadeNoteHvrOut(noteNumber);
}

export function noteOff(noteNumber) {
  //console.log("noteOff events: " + noteNumber);
  const index = currentNotes.indexOf(noteNumber);
  if (index > -1) {
    currentNotes.splice(index, 1);
    fadeNote(noteNumber);
  }
  refresh();
}

export function fadeAllNotes() {
  for (let i = 21; i < 108; i++) {
    fadeNote(i);
  }
}

export function pitchWheel(pitch) {
  currentPitch = pitch;
  setPitchWheel(pitch);
}

export function modWheel(mod) {
  currentModulation = mod;
  setModWheel(currentModulation);
}

function onEvent(...args) {
  //console.log(...args);
}

function startTimer() {
  lastNoteTimer = setInterval(() => {
    lastNoteSeconds++;

    //console.log("lastNoteSeconds: " + lastNoteSeconds);

    if (lastNoteSeconds == 2) {
      //console.log("timer done");
      //setChordHtml("");
      clearTimer();
    }
  }, 1000);
}

function clearTimer() {
  clearInterval(lastNoteTimer);
}

function setAcc(note) {
  return Note.fromMidi(note, true);
}

function refresh() {
  //console.log("\ncurrentNotes: " + JSON.stringify(currentNotes));

  var notes = []; // = currentNotes.map((n) => Note.fromMidi(n, true));

  //.map(element => fn(element, params))

  currentNotes.forEach((e) => {
    var val = Note2.fromMidiSharps(e);
    // var fl = Note.fromMidi(e);
    // console.log("fl: " + fl);
    // console.log("sh: " + sh);

    if (!isSharps) {
      val = Note2.fromMidi(e);
    }

    notes.push(val);

    //console.log("no notes");
  });
  //  const notes = currentNotes.map(Note.fromMidi).map(Note.pc);

  notes = notes.map(Note.pc);

  var chords;

  console.log("\nnotes: " + JSON.stringify(notes));

  //notes = ["D#", "G", "A#", "D"];

  if (notes.length > 2) {
    chords = detectChord(notes);
  } else {
    if (notes.length == 2) {
      const distance = Interval.distance(notes[0], notes[1]);
      //console.log("str: " + notes.toString());

      console.log("distance: " + distance);
    }

    chords = [];
    previousChord = null;
  }

  // if (notes.length == 0) {
  //   //console.log("no notes");
  //   fadeAllNotes2();
  // }

  setNotesHtml(notes.map(keyToHtml).join(" "));

  if (chords && chords.length) {
    const chord = chords[0];
    setChordHtml(chordToHtml(chord));

    //to do: add midi keyboard testing

    // console.log("chord: " + JSON.stringify(chord));

    // var c = chord.tonic + chord.name;

    // if (c == "Cmaj7") {
    //   //console.log("yup");

    //   resultDiv.innerHTML = "CORRECT";
    // }

    if (previousChord) {
      fadeTonics();
    }

    //show displayed chords longer

    clearTimer();
    lastNoteTimer = null;
    startTimer();
    lastNoteSeconds = 0;

    //highlightTonic(chord.tonic);
    previousChord = chord;
  } else {
    // if (previousChord) {
    //   setChordHtml(chordToHtml(previousChord));
    // }
    setChordHtml(notes.join(" "));
    //console.log("show single notes: " + JSON.stringify(notes));

    fadeTonics();

    //setChordHtml(""); //orig setting
  }
}

export const controller = onEvent.bind(this, "controller");
export const polyPressure = onEvent.bind(this, "polyPressure");
