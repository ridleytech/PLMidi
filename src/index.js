import { FancyMidiPlayer } from "./midi";
import "babel-polyfill";
const createMusicalPiece = (id, name, path) => ({ id, name, path });
import "html-midi-player";
import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.css";

import {
  noteOff,
  noteOn,
  controller,
  pitchWheel,
  modWheel,
  polyPressure,
} from "./chord-display/events";
import {
  setChordHtml,
  setNotesHtml,
  setAppError,
  setAppLoaded,
} from "./chord-display/ui";
import { getSetting, setSetting } from "./chord-display/settings";

const PREFERRED_MIDI = ["mpk", "key", "piano"];

const CMD_NOTE_OFF = 8;
const CMD_NOTE_ON = 9;
const CMD_AFTERTOUCH = 10;
const CMD_CC = 11;
const CMD_PITCHBEND = 14;
const NOTE_CC_MODWHEEL = 1;
const SUS_ON = 11;

const enableKeyboard = false;

var url = "https://pianolessonwithwarren.com/dev_site";

//url = "http://localhost:8888/pianolesson";

const pieces = [
  createMusicalPiece(
    0,
    "Pass Me Not - Advanced",
    "../assets/midi/Pass Me Not - Advanced.mid"
  ),
];

var isChromium = window.chrome;
var winNav = window.navigator;
var vendorName = winNav.vendor;
var isOpera = typeof window.opr !== "undefined";
var isIEedge = winNav.userAgent.indexOf("Edg") > -1;
var isIOSChrome = winNav.userAgent.match("CriOS");

if (isIOSChrome) {
  // is Google Chrome on IOS
} else if (
  isChromium !== null &&
  typeof isChromium !== "undefined" &&
  vendorName === "Google Inc." &&
  isOpera === false &&
  isIEedge === false
) {
  // is Google Chrome
} else {
  alert("Please use Google Chrome for the best experience.");
  // not Google Chrome
}

var instrumentUrl =
  "https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/gh-pages/FatBoy/bright_acoustic_piano-mp3.js";

//instrumentUrl = "https://pianolessonwithwarren.com/dev_site/PLMidi/soundfont/acoustic_grand_piano-mp3.js";

const setAppBusy = (isBusy) => {
  const playButton = document.querySelector("#play-piece");
  const stopButton = document.querySelector("#stop-piece");
  const loopButton = document.querySelector("#loop-piece");
  const startLoopButton = document.querySelector("#start-loop");
  const endLoopButton = document.querySelector("#end-loop");

  //const pauseButton = document.querySelector("#pause-piece");
  //const skipToButton = document.querySelector("#skip-to");
  const musicalPiecesSelect = document.querySelector("#musical-pieces");

  if (isBusy) {
    playButton.setAttribute("disabled", true);
    stopButton.setAttribute("disabled", true);
    loopButton.setAttribute("disabled", true);
    startLoopButton.setAttribute("disabled", true);
    endLoopButton.setAttribute("disabled", true);

    //musicalPiecesSelect.setAttribute("disabled", true);
  } else {
    playButton.removeAttribute("disabled");
    stopButton.removeAttribute("disabled");
    loopButton.removeAttribute("disabled");
    startLoopButton.removeAttribute("disabled");
    endLoopButton.removeAttribute("disabled");

    //musicalPiecesSelect.removeAttribute("disabled");
  }
};

var slider = document.getElementById("noslider");

noUiSlider.create(slider, {
  start: [0, 100],
  connect: true,
  range: {
    min: 0,
    max: 100,
  },
});

const fmp = new FancyMidiPlayer(document);
setAppBusy(true);
fmp.setInstrument(instrumentUrl).then(() => {
  const playButton = document.querySelector("#play-piece");
  const stopButton = document.querySelector("#stop-piece");
  const loopButton = document.querySelector("#loop-piece");
  const startLoopButton = document.querySelector("#start-loop");
  const endLoopButton = document.querySelector("#end-loop");

  playButton.addEventListener("click", handleCheckboxEvent, true);
  playButton.addEventListener("keyup", handleCheckboxEvent, true);

  function handleCheckboxEvent(e) {
    e.preventDefault();

    if (e.keyCode === 32) {
      // console.log("space bar. no");
    } else {
      //console.log("click");
      fmp.playBtnClicked();
    }
  }

  stopButton.onclick = fmp.stopMidi.bind(fmp);
  loopButton.onclick = fmp.manageLoop.bind(fmp);
  startLoopButton.onclick = fmp.setStartLoop.bind(fmp);
  endLoopButton.onclick = fmp.setEndLoop.bind(fmp);

  changePiece(0);
});

const changePiece = (pieceId) => {
  //console.log("pieceid: " + pieceId);

  setAppBusy(true);
  fmp.stopMidi();

  //console.log("current path: " + pieces[pieceId].path);
  fmp.setMidi(pieces[pieceId].path).then(() => setAppBusy(false));
};

// const musicalPiecesSelect = document.querySelector("#musical-pieces");
// musicalPiecesSelect.onchange = (evt) => changePiece(evt.target.value);

// const musicalPiecesSelectForm = document.querySelector("#musical-piece");
// musicalPiecesSelectForm.onchange = (evt) => changePiece2(evt.target.value);

document.querySelector("#input-k").addEventListener("input", function (e) {
  //console.log("e: " + e.target.value);

  fmp.updateTempoInput(e.target.value);
});

document.querySelector("#input-k").addEventListener("change", function (e) {
  //console.log("e: " + e.target.value);

  fmp.setSliderTempo(e.target.value);
});

document
  .querySelector("#input-pitch-k")
  .addEventListener("input", function (e) {
    //console.log("e: " + e.target.value);

    fmp.updatePitchSlider(e.target.value);
  });

document
  .querySelector("#progressSlider")
  .addEventListener("input", function (e) {
    //console.log("progress: " + e.target.value);

    fmp.movePlayhead(e.target.value);
  });

document.querySelector("#tempo").addEventListener("change", function (e) {
  //console.log("e: " + e.target.value);

  fmp.setTempoInput(e.target.value);
});

document
  .querySelector("#accidentalSwitch")
  .addEventListener("change", function (e) {
    //console.log("e: " + JSON.stringify(e.checked));

    fmp.setAccidental(e.target.value);
  });

//control playback with keyboard

document.body.onkeyup = function (e) {
  if (e.keyCode == 32) {
    //spacebar
    fmp.keyboardSpaceClicked();
  } else if (e.keyCode == 37) {
    //left
    fmp.movePlayheadBwd();
  } else if (e.keyCode == 39) {
    //right
    fmp.movePlayheadFwd();
  }
};

const fn = document.querySelector("#file-name");

document.querySelector("#musical-piece").addEventListener(
  "change",
  function (e) {
    var file = this.files[0];

    //fn.style.marginRight = "10px";
    fn.style.marginBottom = "8px";
    fn.style.height = "15px";
    fn.innerHTML = file.name;

    console.log("the file: ", file);

    if (!file) return;

    var fd = new FormData();
    fd.append("afile", file);
    // These extra params aren't necessary but show that you can include other data.
    //fd.append("username", "Groucho");

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url + "/PLMidi/upload.php", true);

    xhr.upload.onprogress = function (e) {
      if (e.lengthComputable) {
        var percentComplete = (e.loaded / e.total) * 100;
        console.log(percentComplete + "% uploaded");
      }
    };

    xhr.onload = function () {
      if (this.status == 200) {
        var resp = JSON.parse(this.response);

        //console.log("Server got:", resp);

        if (resp.data.uploadData.status == "media upload") {
          //console.log("we good: " + resp.data.uploadData.filename);

          downloadFile(resp.data.uploadData.filename);
        }

        // var image = document.createElement("img");
        // image.src = resp.dataUrl;
        // document.body.appendChild(image);
      }
    };

    xhr.send(fd);
  },
  false
);

const downloadFile = (path) => {
  console.log("path b4: " + path);

  var newpath = url + "/PLMidi/uploads/" + path;

  console.log("download path: " + newpath);

  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      //document.getElementById("demo").innerHTML = this.responseURL;

      var newPiece = createMusicalPiece(99, "New Track", newpath);

      setAppBusy(true);
      fmp.stopMidi();

      console.log("current selected path: " + newPiece.path);
      fmp.setMidi(newPiece.path).then(() => setAppBusy(false));
    }
  };
  xhttp.open("GET", newpath);
  xhttp.send();
};

var initialized = false;

if (!initialized && enableKeyboard) {
  initializeMidi();
  initialized = true;
}

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

    fmp.handleSustain({ number: 64, value: ev.data[2] });
  }

  if (channel === 9) return;
  if (cmd === CMD_NOTE_OFF || (cmd === CMD_NOTE_ON && velocity === 0)) {
    // with MIDI, note on with velocity zero is the same as note off
    // note off
    noteOff(noteNumber);
    stopInstrumentMidiNote(noteNumber);
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

function stopInstrumentMidiNote(noteNumber) {
  if (fmp.instrument) {
    fmp.stopInstrumentMidiNote(noteNumber);
  }
}

function playInstrumentMidiNote(noteNumber, velocity) {
  //console.log("playInstrumentMidiNote top");
  if (fmp.instrument) {
    fmp.playKeyboardInstrumentMidiNote(velocity, noteNumber);
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
  // console.log(
  //   `controller connected: ${e.port.name} ${e.port.connection} ${e.port.state}`
  // );
  populateMIDIInSelect();
}

function onMIDIStarted(midi) {
  //console.log("onMIDIStarted cd");
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

// pieces
//   .map((piece) => {
//     const option = document.createElement("option");
//     option.id = piece.id;
//     option.value = piece.id;
//     option.innerHTML = piece.name;
//     option.selected = piece.id === 0;
//     return option;
//   })
//   .forEach((pieceOption) => musicalPiecesSelect.append(pieceOption));
