//import { selectMIDIIn } from "./midi";
import { render } from "./ui";
import qs from "qs";

const DEFAULT_SETTINGS = {
  midiIn: null,
  noteStart: "A0",
  noteEnd: "C8",
  latinNotationEnabled: false,
  pitchWheelEnabled: false,
  modWheelEnabled: false,
  colorNote: "#2bce1f",
  colorNote2: "#f6fa43",
  colorPitchWheelDown: "#bf3a2b",
  colorPitchWheelUp: "#44ffaa",
  colorModWheel: "#44bbff",
  hideKeyboard: false,
  hideNotes: false,
  hideChord: false,
  hideBassNote: false,
  hideKeyName: false,
  hideTonic: false,
};

let customSettings = {};

export function getSetting(name) {
  // if (name == "colorNote") {
  //   console.log("customSettings: " + name + " : " + customSettings[name]);
  // } else if (name == "colorNote2") {
  //   console.log("customSettings: " + name + " : " + customSettings[name]);
  // }

  return customSettings[name] !== undefined
    ? customSettings[name]
    : DEFAULT_SETTINGS[name];
}

export function setSetting(name, value) {
  window.localStorage.setItem(name, value);

  customSettings[name] = value;
  saveQueryParams();

  updateKeys();
}

function updateKeys() {
  var headTag = document.getElementsByTagName("head")[0];

  let keysSheet = document.getElementById("keysSheet");
  headTag.removeChild(keysSheet);

  var style = document.createElement("style");
  style.id = "keysSheet";
  style.type = "text/css";
  style.innerHTML =
    ".note.white.active .piano-key { fill: " +
    getSetting("colorNote") +
    "; } .note.black.active .piano-key {fill: " +
    getSetting("colorNote") +
    ";}.note.white.activeRight .piano-key {fill: " +
    getSetting("colorNote2") +
    ";} .note.black.activeRight .piano-key { fill: " +
    getSetting("colorNote2") +
    "; }";
  headTag.appendChild(style);
}

function qsValueDecoder(str, decoder, charset) {
  if (!Number.isNaN(Number(str))) return Number(str);
  if (str === "true") return true;
  if (str === "false") return false;

  // https://github.com/ljharb/qs/blob/master/lib/utils.js
  let strWithoutPlus = str.replace(/\+/g, " ");
  if (charset === "iso-8859-1") {
    // unescape never throws, no try...catch needed:
    return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
  }
  // utf-8
  try {
    return decodeURIComponent(strWithoutPlus);
  } catch (e) {
    return strWithoutPlus;
  }
}

function parseQueryParams() {
  //console.log("window.location.search: " + window.location.search);

  var search = window.location.search;

  if (!search) {
    //console.log("no url vals");

    if (window.localStorage.getItem("colorNote")) {
      //console.log("ls colorNote: " + window.localStorage.getItem("colorNote"));

      search = "?colorNote=" + window.localStorage.getItem("colorNote");
    }

    if (window.localStorage.getItem("colorNote2")) {
      // console.log(
      //   "ls colorNote2: " + window.localStorage.getItem("colorNote2")
      // );

      if (!window.localStorage.getItem("colorNote")) {
        search = "?colorNote2=" + window.localStorage.getItem("colorNote2");
      } else {
        search =
          search + "&colorNote2=" + window.localStorage.getItem("colorNote2");
      }
    }
  }

  const newSettings = qs.parse(search, {
    depth: 0,
    parseArrays: false,
    ignoreQueryPrefix: true,
    decoder: qsValueDecoder,
  });

  //console.log("newSettings: " + JSON.stringify(newSettings));

  Object.assign(customSettings, newSettings);

  const queryParams = qs.stringify(newSettings, { addQueryPrefix: true });

  window.history.pushState(newSettings, "settings update", queryParams);

  updateKeys();
}

function saveQueryParams() {
  const queryParams = qs.stringify(customSettings, { addQueryPrefix: true });
  window.history.pushState(customSettings, "settings update", queryParams);
}

function onSettingChange(setting, evt) {
  if (setting === "midiIn") {
    selectMIDIIn(evt);
    render(true);
    return;
  }

  const { target } = evt;

  // console.log(
  //   "setting: " + setting + " type: " + target.type + " val: " + target.value
  // );

  if (target.type === "checkbox") {
    setSetting(setting, !!target.checked);
  }

  if (target.type === "text" || target.type === "color") {
    setSetting(setting, target.value);
  }

  render();
}

export function initSettings() {
  parseQueryParams();

  for (const setting of Object.keys(DEFAULT_SETTINGS)) {
    const element = document.getElementById(setting);
    if (element.type === "checkbox") {
      element.checked = getSetting(setting);
    }
    if (element.type === "text" || element.type === "color") {
      element.value = getSetting(setting);
    }

    element.addEventListener("input", onSettingChange.bind(null, setting));
  }
}
