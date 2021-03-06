import Note from "tonal/note";
import { range } from "./utils";
import { getSetting } from "./settings";
import {
  render as renderKeyboard,
  setPitchWheel,
  setModWheel,
} from "./keyboard";

const LAYOUT_SETTINGS = [
  "hideKeyboard",
  "hideNotes",
  "hideChord",
  "hideBassNote",
  "hideKeyName",
  "hideTonic",
];

const appContainer = document.getElementById("app");
const chordDisplay = document.getElementById("chordDisplay1");
const notesDisplay = document.getElementById("notesDisplay");

export { setPitchWheel, setModWheel };

export function highlightNote(noteNumber, className = "active") {
  //console.log("highlightNote UI: " + noteNumber);
  // console.log("key elem str: " + `note-${noteNumber}`);
  const keyElement = document.getElementById(`note-${noteNumber}`);
  //console.log("keyElement: " + JSON.stringify(keyElement));

  const keyElementDisplayNote = document.getElementById(
    `note-${noteNumber}-display`
  );

  if (!keyElement) {
    //console.log("not key element");
    return;
  }

  keyElement.classList.add("autoSelect");

  if (noteNumber > 64) {
    keyElement.classList.add("activeRight");
    //keyElementDisplayNote.classList.add("activeRight");
  } else {
    keyElement.classList.add("active");
    //keyElementDisplayNote.classList.add("active");
  }

  //keyElement.classList.add(className);
  keyElementDisplayNote.classList.add(className);
}

export function highlightNoteUser(noteNumber, className = "activeUser") {
  //console.log("highlightNote: " + noteNumber);
  // console.log("key el str: " + `note-${noteNumber}`);
  const keyElement = document.getElementById(`note-${noteNumber}`);
  //console.log("keyElement: " + JSON.stringify(keyElement));

  const keyElementDisplayNote = document.getElementById(
    `note-${noteNumber}-display`
  );

  if (!keyElement) {
    //console.log("not key element");
    return;
  }

  if (noteNumber > 64) {
    keyElement.classList.add("activeUserRight");
  } else {
    keyElement.classList.add(className);
  }

  keyElementDisplayNote.classList.add("active2");
}

export function fadeNote(noteNumber) {
  //console.log("fadeNote UI: " + noteNumber);
  //console.log("fadeNote");

  const keyElement = document.getElementById(`note-${noteNumber}`);

  const keyElementDisplayNote = document.getElementById(
    `note-${noteNumber}-display`
  );
  if (!keyElement) return;

  keyElement.classList.remove("autoSelect");
  //keyElement.classList.remove("active");
  keyElement.classList.remove("activeUser");

  if (noteNumber > 64) {
    keyElement.classList.remove("activeRight");
    //keyElementDisplayNote.classList.add("activeRight");
  } else {
    keyElement.classList.remove("active");
    //keyElementDisplayNote.classList.add("active");
  }

  //keyElement.classList.remove("activeUser");
  keyElementDisplayNote.classList.remove("active");
  keyElementDisplayNote.classList.remove("active2");
}

export function fadeNoteUser(noteNumber) {
  //console.log("fadeNoteUser: " + noteNumber);

  //console.log("fadeNoteUser");

  const keyElement = document.getElementById(`note-${noteNumber}`);

  //check this

  const keyElementDisplayNote = document.getElementById(
    `note-${noteNumber}-display`
  );
  if (!keyElement) return;
  //keyElement.classList.remove("activeUser");

  if (noteNumber > 64) {
    keyElement.classList.remove("activeUserRight");
  } else {
    keyElement.classList.remove("activeUser");
  }

  // if (keyElement.classList.contains("autoSelect")) {
  //   //console.log("dont fade");
  //   return;
  // }
  //keyElement.classList.remove("autoSelect");

  keyElementDisplayNote.classList.remove("active2");
}

export function fadeNoteHvrOut(noteNumber) {
  //console.log("fadeNoteHvrOut: " + noteNumber);
  //console.log("fadeNoteHvrOut");

  const keyElement = document.getElementById(`note-${noteNumber}`);
  //console.log("keyElement:" + JSON.stringify(keyElement));
  if (keyElement.classList.contains("autoSelect")) {
    //console.log("dont fade");
    return;
  }
  const keyElementDisplayNote = document.getElementById(
    `note-${noteNumber}-display`
  );
  //keyElement.classList.remove("autoSelect");

  //if (!keyElement) return;

  //keyElement.classList.remove("activeUser");

  if (noteNumber > 64) {
    keyElement.classList.remove("activeUserRight");
  } else {
    keyElement.classList.remove("activeUser");
  }

  keyElementDisplayNote.classList.remove("active2");
}

export function highlightTonic(tonic) {
  const notes = range(0, 10).map((oct) => Note.midi(`${tonic}${oct}`));

  for (const note of notes) {
    highlightNote(note, "tonic");
  }
}

export function fadeTonics() {
  const elements = document.querySelectorAll(".tonic");

  if (elements && elements.length) {
    for (const element of elements) {
      element.classList.remove("tonic");
    }
  }
}

export function setChordHtml(html) {
  chordDisplay.innerHTML = html;
}

export function setNotesHtml(html) {
  notesDisplay.innerHTML = html;
}

export function setLayoutSettings() {
  for (const setting of LAYOUT_SETTINGS) {
    const value = getSetting(setting);

    if (value) {
      appContainer.classList.add(setting);
    } else {
      appContainer.classList.remove(setting);
    }
  }
}

export function setAppLoaded(message) {
  appContainer.classList.add("loaded");
}

export function setAppError(message) {
  appContainer.classList.add("error");
  //setChordHtml("Error");
  setChordHtml("");

  setNotesHtml(message);
}

export function render(reset) {
  setLayoutSettings();
  renderKeyboard(reset);
}
