import Note from "tonal/note";
//import Note from "tonal";
import { Note as Note2, Interval, Key } from "@tonaljs/tonal";
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
const nextBtn = document.getElementById("nextBtn");

const currentNotes = [];
let currentPitch = 0;
let currentModulation = 0;

let previousChord = null;

let lastNoteTimer = null;
var lastNoteSeconds = 0;
var isSharps = false;

var isTesting = true;
var currentTest = "progressions";

var currentAnswer;

var guessTimer;
var currentGuess;
var guessEnabled = true;
var progressionChords; // = ["Em7", "Dm7", "Fmaj7"];
var progressionNumbers;
var progressionChordAnswers; // = [];
var progressionTotals; // = 4;
var progressionIndex; // = 0;

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
  //console.log("noteOnPressUser");
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
  var intervalString = "";

  //console.log("\nnotes: " + JSON.stringify(notes));

  //notes = ["D#", "G", "A#", "D"];

  if (notes.length > 2) {
    chords = detectChord(notes);

    if (chords.length > 0) {
      //console.log("chords: " + JSON.stringify(chords));
    } else {
      //to do
      //try filtering out duplicate notes from array to capture intervals
      //check interval
      // if (notes.length > 1) {
      //   console.log("check interval1");
      //   //const distance = notes.map(Interval.distance);
      //   const distance = Interval.distance(notes[0], notes[1]);
      //   //console.log("str: " + notes.toString());
      //   //console.log("distance: " + distance);
      //   var info = Interval.get(distance);
      //   console.log("info1: " + JSON.stringify(info));
      //   var quality = getSemitones(info.semitones);
      //   intervalString = notes[0] + " " + quality;
      //   //console.log("displayString: " + intervalString);
      // }
    }
  } else {
    if (notes.length == 2) {
      //console.log("check interval");

      const distance = Interval.distance(notes[0], notes[1]);

      //console.log("str: " + notes.toString());
      //console.log("distance: " + distance);

      var info = Interval.get(distance);

      //console.log("info: " + JSON.stringify(info));

      var quality = getSemitones(info.semitones);

      intervalString = notes[0] + " " + quality;

      //console.log("displayString: " + intervalString);
    }

    chords = [];
    previousChord = null;
  }

  // if (notes.length == 0) {
  //   //console.log("no notes");
  //   fadeAllNotes2();
  // }

  //console.log("intervalString: " + intervalString);

  setNotesHtml(notes.map(keyToHtml).join(" "));

  if (chords && chords.length) {
    const chord = chords[0];

    setChordHtml(chordToHtml(chord));

    //to do: add midi keyboard testing

    if (isTesting && guessEnabled) {
      currentGuess = chord.tonic + chord.name;

      if (currentTest == "chords") {
        console.log("currentGuess: " + currentGuess);
        //currentAnswer = "Cmaj7";

        if (!guessTimer) {
          guessTimer = setTimeout(() => {
            //console.log("start guess timer");
            //console.log("lastNoteSeconds: " + lastNoteSeconds);

            //Chord.notes("CMaj7") // => ["C", "E", "G", "B"]
            //Chord.notes("C", "maj7") // => ["C", "E", "G", "B"]

            //console.log("chord: " + JSON.stringify(chord));

            guessEnabled = false;

            checkGuess();
          }, 500);
        }
      } else if (currentTest == "progressions") {
        if (!guessTimer) {
          guessTimer = setTimeout(() => {
            guessEnabled = false;

            checkProgressionGuess();
          }, 500);
        }
      }
    }

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
    if (notes.length > 1 && intervalString != "") {
      //console.log("show it");
      setChordHtml(intervalString);
    } else {
      setChordHtml(notes.join(" "));
    }

    //console.log("show single notes: " + JSON.stringify(notes));

    fadeTonics();

    //setChordHtml(""); //orig setting
  }
}

function checkProgressionGuess() {
  progressionChordAnswers.push(currentGuess);
  console.log("progressionChords: " + JSON.stringify(progressionChordAnswers));
  guessTimer = null;
  guessEnabled = true;

  if (progressionChordAnswers.length == progressionTotals) {
    //check answer
    console.log("end test");

    resultDiv.innerHTML = "CORRECT";
    guessEnabled = false;

    return;
  } else if (currentAnswer != currentGuess) {
    console.log("error");
  }

  progressionIndex++;

  currentAnswer = progressionChords[progressionIndex];

  console.log("currentAnswer: " + currentAnswer);

  var format = "Play ";

  progressionNumbers.forEach((element, ind) => {
    if (ind == progressionIndex) {
      format +=
        "<span style='color:#1f9716'>" + progressionNumbers[ind] + "</span>";
    } else {
      format += progressionNumbers[ind];
    }

    if (ind < progressionNumbers.length - 1) {
      format += ", ";
    }
  });

  progressionIndex;

  resultDiv.innerHTML = format;
}

function checkGuess() {
  console.log(
    "currentGuess: " + currentGuess + " currentAnswer: " + currentAnswer
  );

  if (currentTest == "chords") {
    if (currentGuess == currentAnswer) {
      console.log("yup");

      resultDiv.innerHTML = "CORRECT";
    } else {
      console.log("nope");

      resultDiv.innerHTML = "INCORRECT";
    }
  }

  nextBtn.style.visibility = "visible";
  guessTimer = null;
}

function getSemitones(s) {
  var str;
  if (s == 0) {
    str = "Octave";
  } else if (s == 1) {
    str = "Minor 2nd";
  } else if (s == 2) {
    str = "Major 2nd";
  } else if (s == 3) {
    str = "Minor 3rd";
  } else if (s == 4) {
    str = "Major 3rd";
  } else if (s == 5) {
    str = "Perfect 4th";
  } else if (s == 6) {
    //str = "Diminished 5th";
    str = "Tritone";
  } else if (s == 7) {
    str = "Perfect 5th";
  } else if (s == 8) {
    str = "Minor 6th";
  } else if (s == 9) {
    str = "Major 6th";
  } else if (s == 10) {
    str = "Minor 7th";
  } else if (s == 11) {
    str = "Major 7th";
  }

  return str;
}

function ordinal(n) {
  var s = ["th", "st", "nd", "rd"];
  var v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function setCurrentQuestion(answer) {
  //console.log("setCurrentQuestion: " + answer);
  currentAnswer = answer;
  guessEnabled = true;
  currentTest = "chords";
}

// setTimeout(() => {
//   initProgressions();
// }, 2000);

export function initProgressions(data) {
  progressionChords = data.progressionChords;
  progressionNumbers = data.progressionNumbers;
  progressionChordAnswers = [];
  progressionTotals = progressionNumbers.length;
  progressionIndex = 0;
  currentAnswer = progressionChords[progressionIndex];

  // var format =
  //   "Play <span style='color:#1f9716'>" +
  //   progressionNumbers[0] +
  //   "</span>, " +
  //   progressionNumbers[1] +
  //   ", " +
  //   progressionNumbers[2] +
  //   "";

  var format = "Play ";

  progressionNumbers.forEach((element, ind) => {
    if (ind == progressionIndex) {
      format +=
        "<span style='color:#1f9716'>" + progressionNumbers[ind] + "</span>";
    } else {
      format += progressionNumbers[ind];
    }

    if (ind < progressionNumbers.length - 1) {
      format += ", ";
    }
  });

  progressionIndex;

  resultDiv.innerHTML = format;
  //resultDiv.innerHTML = "Play " + progressionNumbers.toString();

  console.log("currentAnswer: " + currentAnswer);
  currentTest = "progressions";
}

export const controller = onEvent.bind(this, "controller");
export const polyPressure = onEvent.bind(this, "polyPressure");
