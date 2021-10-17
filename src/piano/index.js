import { SUSTAINED_NOTE_DURATION } from "../utils/constants";

const PIANO_KEYS_COUNT = 88;
const FIRST_KEY_NOTE_NUMBER = 21;

export class FancyPiano {
  constructor(document) {
    //console.log("FancyPiano");

    this.keys = new Array(PIANO_KEYS_COUNT);
    this.isSustainPedalPressed = false;
    this.setKey = this.setKey.bind(this);
    this.svg = document.getElementById("piano-keyboard");
    //this.svg2 = document.getElementById("sustain-pedal");
    this.svg3 = document.getElementById("sustain-pedal2");
  }

  repaintKeys() {
    console.log(
      "FIRST_KEY_NOTE_NUMBER: " +
        FIRST_KEY_NOTE_NUMBER +
        " PIANO_KEYS_COUNT: " +
        PIANO_KEYS_COUNT
    );
    for (let i = 21; i < FIRST_KEY_NOTE_NUMBER + PIANO_KEYS_COUNT; i++) {
      //this.paintReleasedKey(i);
    }
  }

  paintPressedKey(noteNumber) {
    //console.log("paintPressedKey");

    this.svg.getElementById(noteNumber).classList.add("pressed");
  }

  paintPressedKey2() {
    //console.log("paintPressedKey2");

    //enable sustain pedal

    this.svg3.classList.add("pressed2");
  }

  paintReleasedKey(noteNumber) {
    //console.log("paintReleasedKey");

    try {
      this.svg.getElementById(noteNumber).removeAttribute("style");
      this.svg.getElementById(noteNumber).classList.remove("pressed");
    } catch {
      console.error("Could not repaint key " + noteNumber);
    }
  }

  paintReleasedKey2(noteNumber) {
    //disable sustain pedal

    try {
      this.svg3.classList.remove("pressed2");
    } catch {
      console.error("Could not repaint key " + noteNumber);
    }
  }

  setKey(number, event) {
    this.keys[number] = event;
    this.paintPressedKey(number);
  }

  stopKey(number) {
    this.paintReleasedKey(number);
    return this.isSustainPedalPressed ? null : this.keys[number];
  }

  setSustainPedal(intensity) {
    this.isSustainPedalPressed = intensity >= 64;
  }

  getSustainedKeys() {
    return this.keys.filter(
      (keyEvent) => keyEvent.duration === SUSTAINED_NOTE_DURATION
    );
  }
}
