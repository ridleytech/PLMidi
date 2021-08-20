import { chord as detectChord } from "tonal/detect";
import { chordToHtml, keyToHtml } from "./chord-display/chords";
//import { highlightTonic, fadeTonics, setChordHtml, setNotesHtml } from "./ui";

var currentNotes = ["C", "E", "G", "B", "D"];
//currentNotes = ["b3", "e3", "g3"];
var previousChord;

showNotes();

function showNotes() {
  //const notes = currentNotes.map(Note.fromMidi).map(Note.pc);

  const notes = currentNotes;

  console.log("notes: " + JSON.stringify(notes));

  const chords = notes.length > 2 ? detectChord(notes) : [];

  console.log("chords: " + JSON.stringify(chords));

  setNotesHtml(notes.map(keyToHtml).join(" "));
  if (chords && chords.length) {
    const chord = chords[0];
    setChordHtml(chordToHtml(chord));

    if (previousChord) {
      //fadeTonics();
    }

    //highlightTonic(chord.tonic);
    previousChord = chord;
  } else {
    setChordHtml("");
    //fadeTonics();
  }
}

function setNotesHtml(html) {
  console.log("notes html: " + html);
  notesDisplay.innerHTML = html;
}

function setChordHtml(html) {
  console.log("chord html: " + html);
  chordDisplay.innerHTML = html;
}
