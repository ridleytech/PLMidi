// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)?\/[^/]+(?:\?.*)?$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"src/chord-display/styles.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"node_modules/tonal/note/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.names = names;
exports.tokenize = tokenize;
exports.props = props;
exports.name = name;
exports.pc = pc;
exports.midi = midi;
exports.freq = freq;
exports.freqToMidi = freqToMidi;
exports.chroma = chroma;
exports.oct = oct;
exports.stepToLetter = stepToLetter;
exports.altToAcc = altToAcc;
exports.fromProps = fromProps;
exports.fromMidi = fromMidi;
exports.simplify = simplify;
exports.enharmonic = enharmonic;
exports.midiToFreq = exports.default = void 0;

/**
 * A collection of functions to manipulate musical notes in scientific notation
 *
 * ## Usage
 *
 * @example
 * import Note from "tonal/note"
 * Note.name("bb2") // => "Bb2"
 * Note.chroma("bb2") // => 10
 * Note.midi("a4") // => 69
 * Note.freq("a4") // => 440
 * Note.oct("G3") // => 3
 *
 * @example
 * const Tonal = require('tonal')
 * Tonal.Note.midi("C4") // => 60
 *
 * ## API
 *
 * @module Note
 */
var _default = {
  tokenize,
  props,
  name,
  names,
  pc,
  oct,
  chroma,
  midi,
  freq,
  fromMidi,
  freqToMidi,
  altToAcc,
  stepToLetter,
  fromProps,
  simplify,
  enharmonic
};
exports.default = _default;
const NAMES = "C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B".split(" ");
/**
 * Get a list of note names (pitch classes) within a octave
 *
 * @param {string} filter - an object with
 * - [boolean] unaltered: defaults to true
 * - [boolean] flats: defaults to false
 * - [boolean] sharps: defaults to false
 * @return {Array<string>} the list of notes
 *
 * @example
 * Note.names() // => [ "C", "D", "E", "F", "G", "A", "B" ]
 * Note.names({ flats: true }) // => [ "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B" ]
 * Note.names({ sharps: true }) // => [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B" ]
 * Note.names({ unaltered: false, flats: true })
 * // => [ "Db", "Eb", "Gb", "Ab", "Bb" ]
 */

function names(types = {}) {
  return NAMES.filter(note => types.unaltered !== false && note[1] === undefined || types.flats === true && note[1] === "b" || types.sharps === true && note[1] === "#");
}

const SHARPS = names({
  sharps: true
});
const FLATS = names({
  flats: true
});
const REGEX = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;
/**
 * Split a string into tokens related to note parts.
 * It returns an array of strings `[letter, accidental, octave, modifier]`
 *
 * It always returns an array
 *
 * @param {string} str
 * @return {Array} an array of note tokens
 * @example
 * Note.tokenize("C#2") // => ["C", "#", "2", ""]
 * Note.tokenize("Db3 major") // => ["D", "b", "3", "major"]
 * Note.tokenize("major") // => ["", "", "", "major"]
 * Note.tokenize("##") // => ["", "##", "", ""]
 * Note.tokenize() // => ["", "", "", ""]
 */

function tokenize(str) {
  if (typeof str !== "string") str = "";
  const m = REGEX.exec(str);
  if (!m) return null;
  return [m[1].toUpperCase(), m[2].replace(/x/g, "##"), m[3], m[4]];
}

const NO_NOTE = Object.freeze({
  pc: null,
  name: null,
  step: null,
  alt: null,
  oct: null,
  octStr: null,
  chroma: null,
  midi: null,
  freq: null
});
const SEMI = [0, 2, 4, 5, 7, 9, 11];

const properties = str => {
  const tokens = tokenize(str);
  if (tokens[0] === "" || tokens[3] !== "") return NO_NOTE;
  const [letter, acc, octStr] = tokens;
  const p = {
    letter,
    acc,
    octStr
  };
  p.pc = p.letter + p.acc;
  p.name = p.pc + octStr;
  p.step = (p.letter.charCodeAt(0) + 3) % 7;
  p.alt = p.acc[0] === "b" ? -p.acc.length : p.acc.length;
  p.oct = octStr.length ? +octStr : null;
  p.chroma = (SEMI[p.step] + p.alt + 120) % 12;
  p.midi = p.oct !== null ? SEMI[p.step] + p.alt + 12 * (p.oct + 1) : null;
  p.freq = midiToFreq(p.midi);
  return Object.freeze(p);
};

let cached = {};
/**
 * Get note properties. It returns an object with the following information:
 *
 * - name {string}: the note name. The letter is always in uppercase
 * - letter {string}: the note letter, always in uppercase
 * - acc {string}: the note accidentals
 * - octave {number}: the octave or null if not present
 * - pc {string}: the pitch class (letter + accidentals)
 * - step {number}: number equivalent of the note letter. 0 means C ... 6 means B.
 * - alt {number}: number equivalent of accidentals (negative are flats, positive sharps)
 * - chroma {number}: number equivalent of the pitch class, where 0 is C, 1 is C# or Db, 2 is D...
 * - midi {number}: the note midi number (IMPORTANT! it can be outside 0 to 127 range)
 * - freq {number}: the frequency using an equal temperament at 440Hz
 *
 * This function *always* returns an object with all this properties, but if it"s
 * not a valid note all properties will be null.
 *
 * The returned object can"t be mutated.
 *
 * @param {string} note - the note name in scientific notation
 * @return {Object} an object with the properties (or an object will all properties
 * set to null if not valid note)
 * @example
 * Note.props("fx-3").name // => "F##-3"
 * Note.props("invalid").name // => null
 * Note.props("C#3").oct // => 3
 * Note.props().oct // => null
 */

function props(str) {
  return cached[str] || (cached[str] = properties(str));
}
/**
 * Given a note name, return the note name or null if not valid note.
 * The note name will ALWAYS have the letter in upercase and accidentals
 * using # or b
 *
 * Can be used to test if a string is a valid note name.
 *
 * @function
 * @param {Pitch|string}
 * @return {string}
 *
 * @example
 * Note.name("cb2") // => "Cb2"
 * ["c", "db3", "2", "g+", "gx4"].map(Note.name) // => ["C", "Db3", null, null, "G##4"]
 */


function name(str) {
  return props(str).name;
}
/**
 * Get pitch class of a note. The note can be a string or a pitch array.
 *
 * @function
 * @param {string|Pitch}
 * @return {string} the pitch class
 * @example
 * Note.pc("Db3") // => "Db"
 * ["db3", "bb6", "fx2"].map(Note.pc) // => [ "Db", "Bb", "F##"]
 */


function pc(str) {
  return props(str).pc;
}

const isMidiRange = m => m >= 0 && m <= 127;
/**
 * Get the note midi number. It always return a number between 0 and 127
 *
 * @function
 * @param {string|Number} note - the note to get the midi number from
 * @return {Integer} the midi number or null if not valid pitch
 * @example
 * Note.midi("C4") // => 60
 * Note.midi(60) // => 60
 * @see midi.toMidi
 */


function midi(note) {
  if (typeof note !== "number" && typeof note !== "string") {
    return null;
  }

  const midi = props(note).midi;
  const value = midi || midi === 0 ? midi : +note;
  return isMidiRange(value) ? value : null;
}
/**
 * Get the frequency from midi number
 *
 * @param {number} midi - the note midi number
 * @param {number} tuning - (Optional) 440 by default
 * @return {number} the frequency or null if not valid note midi
 */


const midiToFreq = (midi, tuning = 440) => typeof midi === "number" ? Math.pow(2, (midi - 69) / 12) * tuning : null;
/**
 * Get the frequency of a note
 *
 * @function
 * @param {string|Number} note - the note name or midi note number
 * @return {number} the frequency
 * @example
 * Note.freq("A4") // => 440
 * Note.freq(69) // => 440
 */


exports.midiToFreq = midiToFreq;

function freq(note) {
  return props(note).freq || midiToFreq(note);
}

const L2 = Math.log(2);
const L440 = Math.log(440);
/**
 * Get the midi number from a frequency in hertz. The midi number can
 * contain decimals (with two digits precission)
 *
 * @param {number} frequency
 * @return {number}
 * @example
 * Note.freqToMidi(220)); //=> 57;
 * Note.freqToMidi(261.62)); //=> 60;
 * Note.freqToMidi(261)); //=> 59.96;
 */

function freqToMidi(freq) {
  const v = 12 * (Math.log(freq) - L440) / L2 + 69;
  return Math.round(v * 100) / 100;
}
/**
 * Return the chroma of a note. The chroma is the numeric equivalent to the
 * pitch class, where 0 is C, 1 is C# or Db, 2 is D... 11 is B
 *
 * @param {string} note - the note name
 * @return {Integer} the chroma number
 * @example
 * Note.chroma("Cb") // => 11
 * ["C", "D", "E", "F"].map(Note.chroma) // => [0, 2, 4, 5]
 */


function chroma(str) {
  return props(str).chroma;
}
/**
 * Get the octave of the given pitch
 *
 * @function
 * @param {string} note - the note
 * @return {Integer} the octave or null if doesn"t have an octave or not a valid note
 * @example
 * Note.oct("C#4") // => 4
 * Note.oct("C") // => null
 * Note.oct("blah") // => undefined
 */


function oct(str) {
  return props(str).oct;
}

const LETTERS = "CDEFGAB";
/**
 * Given a step number return it's letter (0 = C, 1 = D, 2 = E)
 * @param {number} step
 * @return {string} the letter
 * @example
 * Note.stepToLetter(3) // => "F"
 */

function stepToLetter(step) {
  return LETTERS[step];
}

const fillStr = (s, n) => Array(n + 1).join(s);

const numToStr = (num, op) => typeof num !== "number" ? "" : op(num);
/**
 * Given an alteration number, return the accidentals
 * @param {number} alt
 * @return {string}
 * @example
 * Note.altToAcc(-3) // => "bbb"
 */


function altToAcc(alt) {
  return numToStr(alt, alt => alt < 0 ? fillStr("b", -alt) : fillStr("#", alt));
}
/**
 * Creates a note name in scientific notation from note properties,
 * and optionally another note name.
 * It receives an object with:
 * - step: the note step (0 = C, 1 = D, ... 6 = B)
 * - alt: (optional) the alteration. Negative numbers are flats, positive sharps
 * - oct: (optional) the octave
 *
 * Optionally it receives another note as a "base", meaning that any prop not explicitly
 * received on the first parameter will be taken from that base note. That way it can be used
 * as an immutable "set" operator for a that base note
 *
 * @function
 * @param {Object} props - the note properties
 * @param {string} [baseNote] - note to build the result from. If given, it returns
 * the result of applying the given props to this note.
 * @return {string} the note name in scientific notation or null if not valid properties
 * @example
 * Note.from({ step: 5 }) // => "A"
 * Note.from({ step: 1, acc: -1 }) // => "Db"
 * Note.from({ step: 2, acc: 2, oct: 2 }) // => "E##2"
 * Note.from({ step: 7 }) // => null
 * Note.from({alt: 1, oct: 3}, "C4") // => "C#3"
 */


function fromProps(fromProps = {}, baseNote = null) {
  const {
    step,
    alt,
    oct
  } = baseNote ? Object.assign({}, props(baseNote), fromProps) : fromProps;
  const letter = stepToLetter(step);
  if (!letter) return null;
  const pc = letter + altToAcc(alt);
  return oct || oct === 0 ? pc + oct : pc;
}
/**
 * Given a midi number, returns a note name. The altered notes will have
 * flats unless explicitly set with the optional `useSharps` parameter.
 *
 * @function
 * @param {number} midi - the midi note number
 * @param {Object} options = default: `{ sharps: false, pitchClass: false }`
 * @param {boolean} useSharps - (Optional) set to true to use sharps instead of flats
 * @return {string} the note name
 * @example
 * Note.fromMidi(61) // => "Db4"
 * Note.fromMidi(61, { pitchClass: true }) // => "Db"
 * Note.fromMidi(61, { sharps: true }) // => "C#4"
 * Note.fromMidi(61, { pitchClass: true, sharps: true }) // => "C#"
 * // it rounds to nearest note
 * Note.fromMidi(61.7) // => "D4"
 */


function fromMidi(num, options = {}) {
  num = Math.round(num);
  const pcs = options.sharps === true ? SHARPS : FLATS;
  const pc = pcs[num % 12];
  if (options.pitchClass) return pc;
  const o = Math.floor(num / 12) - 1;
  return pc + o;
}
/**
 * Simplify the note: find an enhramonic note with less accidentals.
 *
 * @param {string} note - the note to be simplified
 * @param {object} options
 * - sameAccType: default true. Use same kind of accidentals that source
 * @return {string} the simplfiied note or null if not valid note
 * @example
 * Note.simplify("C##") // => "D"
 * Note.simplify("C###") // => "D#"
 * Note.simplify("C###", { sameAccType : false }) // => "Eb"
 * Note.simplify("B#4") // => "C5"
 */


function simplify(note, options = {}) {
  const {
    alt,
    chroma,
    midi
  } = props(note);
  if (chroma === null) return null;
  const sharps = options.sameAccType === false ? alt < 0 : alt > 0;
  const pitchClass = midi === null;
  return fromMidi(midi || chroma, {
    sharps,
    pitchClass
  });
}
/**
 * Get the simplified and enhramonic note of the given one.
 *
 * @param {string} note
 * @return {string} the enhramonic note
 * @example
 * Note.enharmonic("Db") // => "C#"
 * Note.enhramonic("C") // => "C"
 */


function enharmonic(note) {
  return simplify(note, false);
}
},{}],"src/chord-display/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mixRGB = exports.toRGBA = exports.parseRGB = exports.range = void 0;

var range = function range(min, max) {
  return Array(max - min + 1).fill().map(function (v, n) {
    return n + min;
  });
};

exports.range = range;

var parseRGB = function parseRGB(colorStr) {
  if (typeof colorStr !== 'string' || !colorStr.match(/^#[0-9a-f]{6}$/i)) return null;
  var color = colorStr.toLowerCase();
  var r = parseInt(color.substr(1, 2), 16);
  var g = parseInt(color.substr(3, 2), 16);
  var b = parseInt(color.substr(5, 2), 16);
  return {
    r: r,
    g: g,
    b: b
  };
};

exports.parseRGB = parseRGB;

var toRGBA = function toRGBA(colorStr, alpha) {
  var color = parseRGB(colorStr);
  if (!color) return 'transparent';
  return "rgba(".concat(color.r, ",").concat(color.g, ",").concat(color.b, ",").concat(alpha, ")");
};

exports.toRGBA = toRGBA;

var mixRGB = function mixRGB(colorStr, baseColorStr, mix) {
  var color = parseRGB(colorStr);
  var baseColor = parseRGB(baseColorStr);
  if (!color) return baseColorStr;
  if (!baseColor) return "rgba(".concat(color.r, ",").concat(color.g, ",").concat(color.b, ",").concat(mix, ")");
  return "rgb(".concat(Math.floor(color.r * mix + baseColor.r * (1 - mix)), ",").concat(Math.floor(color.g * mix + baseColor.g * (1 - mix)), ",").concat(Math.floor(color.b * mix + baseColor.b * (1 - mix)), ")");
};

exports.mixRGB = mixRGB;
},{}],"node_modules/@tonaljs/core/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.coordToInterval = coordToInterval;
exports.coordToNote = coordToNote;
exports.decode = decode;
exports.deprecate = deprecate;
exports.distance = distance;
exports.encode = encode;
exports.interval = interval;
exports.isNamed = isNamed;
exports.isPitch = isPitch;
exports.note = note;
exports.tokenizeInterval = tokenizeInterval;
exports.tokenizeNote = tokenizeNote;
exports.transpose = transpose;
exports.stepToLetter = exports.fillStr = exports.altToAcc = exports.accToAlt = void 0;

/**
 * Fill a string with a repeated character
 *
 * @param character
 * @param repetition
 */
const fillStr = (s, n) => Array(Math.abs(n) + 1).join(s);

exports.fillStr = fillStr;

function deprecate(original, alternative, fn) {
  return function (...args) {
    // tslint:disable-next-line
    console.warn(`${original} is deprecated. Use ${alternative}.`);
    return fn.apply(this, args);
  };
}

function isNamed(src) {
  return src !== null && typeof src === "object" && typeof src.name === "string" ? true : false;
}

function isPitch(pitch) {
  return pitch !== null && typeof pitch === "object" && typeof pitch.step === "number" && typeof pitch.alt === "number" ? true : false;
} // The number of fifths of [C, D, E, F, G, A, B]


const FIFTHS = [0, 2, 4, -1, 1, 3, 5]; // The number of octaves it span each step

const STEPS_TO_OCTS = FIFTHS.map(fifths => Math.floor(fifths * 7 / 12));

function encode(pitch) {
  const {
    step,
    alt,
    oct,
    dir = 1
  } = pitch;
  const f = FIFTHS[step] + 7 * alt;

  if (oct === undefined) {
    return [dir * f];
  }

  const o = oct - STEPS_TO_OCTS[step] - 4 * alt;
  return [dir * f, dir * o];
} // We need to get the steps from fifths
// Fifths for CDEFGAB are [ 0, 2, 4, -1, 1, 3, 5 ]
// We add 1 to fifths to avoid negative numbers, so:
// for ["F", "C", "G", "D", "A", "E", "B"] we have:


const FIFTHS_TO_STEPS = [3, 0, 4, 1, 5, 2, 6];

function decode(coord) {
  const [f, o, dir] = coord;
  const step = FIFTHS_TO_STEPS[unaltered(f)];
  const alt = Math.floor((f + 1) / 7);

  if (o === undefined) {
    return {
      step,
      alt,
      dir
    };
  }

  const oct = o + 4 * alt + STEPS_TO_OCTS[step];
  return {
    step,
    alt,
    oct,
    dir
  };
} // Return the number of fifths as if it were unaltered


function unaltered(f) {
  const i = (f + 1) % 7;
  return i < 0 ? 7 + i : i;
}

const NoNote = {
  empty: true,
  name: "",
  pc: "",
  acc: ""
};
const cache$1 = new Map();

const stepToLetter = step => "CDEFGAB".charAt(step);

exports.stepToLetter = stepToLetter;

const altToAcc = alt => alt < 0 ? fillStr("b", -alt) : fillStr("#", alt);

exports.altToAcc = altToAcc;

const accToAlt = acc => acc[0] === "b" ? -acc.length : acc.length;
/**
 * Given a note literal (a note name or a note object), returns the Note object
 * @example
 * note('Bb4') // => { name: "Bb4", midi: 70, chroma: 10, ... }
 */


exports.accToAlt = accToAlt;

function note(src) {
  const cached = cache$1.get(src);

  if (cached) {
    return cached;
  }

  const value = typeof src === "string" ? parse$1(src) : isPitch(src) ? note(pitchName$1(src)) : isNamed(src) ? note(src.name) : NoNote;
  cache$1.set(src, value);
  return value;
}

const REGEX$1 = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;
/**
 * @private
 */

function tokenizeNote(str) {
  const m = REGEX$1.exec(str);
  return [m[1].toUpperCase(), m[2].replace(/x/g, "##"), m[3], m[4]];
}
/**
 * @private
 */


function coordToNote(noteCoord) {
  return note(decode(noteCoord));
}

const mod = (n, m) => (n % m + m) % m;

const SEMI = [0, 2, 4, 5, 7, 9, 11];

function parse$1(noteName) {
  const tokens = tokenizeNote(noteName);

  if (tokens[0] === "" || tokens[3] !== "") {
    return NoNote;
  }

  const letter = tokens[0];
  const acc = tokens[1];
  const octStr = tokens[2];
  const step = (letter.charCodeAt(0) + 3) % 7;
  const alt = accToAlt(acc);
  const oct = octStr.length ? +octStr : undefined;
  const coord = encode({
    step,
    alt,
    oct
  });
  const name = letter + acc + octStr;
  const pc = letter + acc;
  const chroma = (SEMI[step] + alt + 120) % 12;
  const height = oct === undefined ? mod(SEMI[step] + alt, 12) - 12 * 99 : SEMI[step] + alt + 12 * (oct + 1);
  const midi = height >= 0 && height <= 127 ? height : null;
  const freq = oct === undefined ? null : Math.pow(2, (height - 69) / 12) * 440;
  return {
    empty: false,
    acc,
    alt,
    chroma,
    coord,
    freq,
    height,
    letter,
    midi,
    name,
    oct,
    pc,
    step
  };
}

function pitchName$1(props) {
  const {
    step,
    alt,
    oct
  } = props;
  const letter = stepToLetter(step);

  if (!letter) {
    return "";
  }

  const pc = letter + altToAcc(alt);
  return oct || oct === 0 ? pc + oct : pc;
}

const NoInterval = {
  empty: true,
  name: "",
  acc: ""
}; // shorthand tonal notation (with quality after number)

const INTERVAL_TONAL_REGEX = "([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})"; // standard shorthand notation (with quality before number)

const INTERVAL_SHORTHAND_REGEX = "(AA|A|P|M|m|d|dd)([-+]?\\d+)";
const REGEX = new RegExp("^" + INTERVAL_TONAL_REGEX + "|" + INTERVAL_SHORTHAND_REGEX + "$");
/**
 * @private
 */

function tokenizeInterval(str) {
  const m = REGEX.exec(`${str}`);

  if (m === null) {
    return ["", ""];
  }

  return m[1] ? [m[1], m[2]] : [m[4], m[3]];
}

const cache = {};
/**
 * Get interval properties. It returns an object with:
 *
 * - name: the interval name
 * - num: the interval number
 * - type: 'perfectable' or 'majorable'
 * - q: the interval quality (d, m, M, A)
 * - dir: interval direction (1 ascending, -1 descending)
 * - simple: the simplified number
 * - semitones: the size in semitones
 * - chroma: the interval chroma
 *
 * @param {string} interval - the interval name
 * @return {Object} the interval properties
 *
 * @example
 * import { interval } from '@tonaljs/core'
 * interval('P5').semitones // => 7
 * interval('m3').type // => 'majorable'
 */

function interval(src) {
  return typeof src === "string" ? cache[src] || (cache[src] = parse(src)) : isPitch(src) ? interval(pitchName(src)) : isNamed(src) ? interval(src.name) : NoInterval;
}

const SIZES = [0, 2, 4, 5, 7, 9, 11];
const TYPES = "PMMPPMM";

function parse(str) {
  const tokens = tokenizeInterval(str);

  if (tokens[0] === "") {
    return NoInterval;
  }

  const num = +tokens[0];
  const q = tokens[1];
  const step = (Math.abs(num) - 1) % 7;
  const t = TYPES[step];

  if (t === "M" && q === "P") {
    return NoInterval;
  }

  const type = t === "M" ? "majorable" : "perfectable";
  const name = "" + num + q;
  const dir = num < 0 ? -1 : 1;
  const simple = num === 8 || num === -8 ? num : dir * (step + 1);
  const alt = qToAlt(type, q);
  const oct = Math.floor((Math.abs(num) - 1) / 7);
  const semitones = dir * (SIZES[step] + alt + 12 * oct);
  const chroma = (dir * (SIZES[step] + alt) % 12 + 12) % 12;
  const coord = encode({
    step,
    alt,
    oct,
    dir
  });
  return {
    empty: false,
    name,
    num,
    q,
    step,
    alt,
    dir,
    type,
    simple,
    semitones,
    chroma,
    coord,
    oct
  };
}
/**
 * @private
 *
 * forceDescending is used in the case of unison (#243)
 */


function coordToInterval(coord, forceDescending) {
  const [f, o = 0] = coord;
  const isDescending = f * 7 + o * 12 < 0;
  const ivl = forceDescending || isDescending ? [-f, -o, -1] : [f, o, 1];
  return interval(decode(ivl));
}

function qToAlt(type, q) {
  return q === "M" && type === "majorable" || q === "P" && type === "perfectable" ? 0 : q === "m" && type === "majorable" ? -1 : /^A+$/.test(q) ? q.length : /^d+$/.test(q) ? -1 * (type === "perfectable" ? q.length : q.length + 1) : 0;
} // return the interval name of a pitch


function pitchName(props) {
  const {
    step,
    alt,
    oct = 0,
    dir
  } = props;

  if (!dir) {
    return "";
  }

  const calcNum = step + 1 + 7 * oct; // this is an edge case: descending pitch class unison (see #243)

  const num = calcNum === 0 ? step + 1 : calcNum;
  const d = dir < 0 ? "-" : "";
  const type = TYPES[step] === "M" ? "majorable" : "perfectable";
  const name = d + num + altToQ(type, alt);
  return name;
}

function altToQ(type, alt) {
  if (alt === 0) {
    return type === "majorable" ? "M" : "P";
  } else if (alt === -1 && type === "majorable") {
    return "m";
  } else if (alt > 0) {
    return fillStr("A", alt);
  } else {
    return fillStr("d", type === "perfectable" ? alt : alt + 1);
  }
}
/**
 * Transpose a note by an interval.
 *
 * @param {string} note - the note or note name
 * @param {string} interval - the interval or interval name
 * @return {string} the transposed note name or empty string if not valid notes
 * @example
 * import { tranpose } from "@tonaljs/core"
 * transpose("d3", "3M") // => "F#3"
 * transpose("D", "3M") // => "F#"
 * ["C", "D", "E", "F", "G"].map(pc => transpose(pc, "M3)) // => ["E", "F#", "G#", "A", "B"]
 */


function transpose(noteName, intervalName) {
  const note$1 = note(noteName);
  const interval$1 = interval(intervalName);

  if (note$1.empty || interval$1.empty) {
    return "";
  }

  const noteCoord = note$1.coord;
  const intervalCoord = interval$1.coord;
  const tr = noteCoord.length === 1 ? [noteCoord[0] + intervalCoord[0]] : [noteCoord[0] + intervalCoord[0], noteCoord[1] + intervalCoord[1]];
  return coordToNote(tr).name;
}
/**
 * Find the interval distance between two notes or coord classes.
 *
 * To find distance between coord classes, both notes must be coord classes and
 * the interval is always ascending
 *
 * @param {Note|string} from - the note or note name to calculate distance from
 * @param {Note|string} to - the note or note name to calculate distance to
 * @return {string} the interval name or empty string if not valid notes
 *
 */


function distance(fromNote, toNote) {
  const from = note(fromNote);
  const to = note(toNote);

  if (from.empty || to.empty) {
    return "";
  }

  const fcoord = from.coord;
  const tcoord = to.coord;
  const fifths = tcoord[0] - fcoord[0];
  const octs = fcoord.length === 2 && tcoord.length === 2 ? tcoord[1] - fcoord[1] : -Math.floor(fifths * 7 / 12); // If it's unison and not pitch class, it can be descending interval (#243)

  const forceDescending = to.height === from.height && to.midi !== null && from.midi !== null && from.step > to.step;
  return coordToInterval([fifths, octs], forceDescending).name;
}
},{}],"node_modules/@tonaljs/abc-notation/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.abcToScientificNotation = abcToScientificNotation;
exports.distance = distance;
exports.scientificToAbcNotation = scientificToAbcNotation;
exports.tokenize = tokenize;
exports.transpose = transpose;
exports.default = void 0;

var _core = require("@tonaljs/core");

const fillStr = (character, times) => Array(times + 1).join(character);

const REGEX = /^(_{1,}|=|\^{1,}|)([abcdefgABCDEFG])([,']*)$/;

function tokenize(str) {
  const m = REGEX.exec(str);

  if (!m) {
    return ["", "", ""];
  }

  return [m[1], m[2], m[3]];
}
/**
 * Convert a (string) note in ABC notation into a (string) note in scientific notation
 *
 * @example
 * abcToScientificNotation("c") // => "C5"
 */


function abcToScientificNotation(str) {
  const [acc, letter, oct] = tokenize(str);

  if (letter === "") {
    return "";
  }

  let o = 4;

  for (let i = 0; i < oct.length; i++) {
    o += oct.charAt(i) === "," ? -1 : 1;
  }

  const a = acc[0] === "_" ? acc.replace(/_/g, "b") : acc[0] === "^" ? acc.replace(/\^/g, "#") : "";
  return letter.charCodeAt(0) > 96 ? letter.toUpperCase() + a + (o + 1) : letter + a + o;
}
/**
 * Convert a (string) note in scientific notation into a (string) note in ABC notation
 *
 * @example
 * scientificToAbcNotation("C#4") // => "^C"
 */


function scientificToAbcNotation(str) {
  const n = (0, _core.note)(str);

  if (n.empty || !n.oct && n.oct !== 0) {
    return "";
  }

  const {
    letter,
    acc,
    oct
  } = n;
  const a = acc[0] === "b" ? acc.replace(/b/g, "_") : acc.replace(/#/g, "^");
  const l = oct > 4 ? letter.toLowerCase() : letter;
  const o = oct === 5 ? "" : oct > 4 ? fillStr("'", oct - 5) : fillStr(",", 4 - oct);
  return a + l + o;
}

function transpose(note, interval) {
  return scientificToAbcNotation((0, _core.transpose)(abcToScientificNotation(note), interval));
}

function distance(from, to) {
  return (0, _core.distance)(abcToScientificNotation(from), abcToScientificNotation(to));
}

var index = {
  abcToScientificNotation,
  scientificToAbcNotation,
  tokenize,
  transpose,
  distance
};
exports.default = index;
},{"@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js"}],"node_modules/@tonaljs/array/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compact = compact;
exports.permutations = permutations;
exports.range = range;
exports.rotate = rotate;
exports.shuffle = shuffle;
exports.sortedNoteNames = sortedNoteNames;
exports.sortedUniqNoteNames = sortedUniqNoteNames;

var _core = require("@tonaljs/core");

// ascending range
function ascR(b, n) {
  const a = []; // tslint:disable-next-line:curly

  for (; n--; a[n] = n + b);

  return a;
} // descending range


function descR(b, n) {
  const a = []; // tslint:disable-next-line:curly

  for (; n--; a[n] = b - n);

  return a;
}
/**
 * Creates a numeric range
 *
 * @param {number} from
 * @param {number} to
 * @return {Array<number>}
 *
 * @example
 * range(-2, 2) // => [-2, -1, 0, 1, 2]
 * range(2, -2) // => [2, 1, 0, -1, -2]
 */


function range(from, to) {
  return from < to ? ascR(from, to - from + 1) : descR(from, from - to + 1);
}
/**
 * Rotates a list a number of times. It"s completly agnostic about the
 * contents of the list.
 *
 * @param {Integer} times - the number of rotations
 * @param {Array} array
 * @return {Array} the rotated array
 *
 * @example
 * rotate(1, [1, 2, 3]) // => [2, 3, 1]
 */


function rotate(times, arr) {
  const len = arr.length;
  const n = (times % len + len) % len;
  return arr.slice(n, len).concat(arr.slice(0, n));
}
/**
 * Return a copy of the array with the null values removed
 * @function
 * @param {Array} array
 * @return {Array}
 *
 * @example
 * compact(["a", "b", null, "c"]) // => ["a", "b", "c"]
 */


function compact(arr) {
  return arr.filter(n => n === 0 || n);
}
/**
 * Sort an array of notes in ascending order. Pitch classes are listed
 * before notes. Any string that is not a note is removed.
 *
 * @param {string[]} notes
 * @return {string[]} sorted array of notes
 *
 * @example
 * sortedNoteNames(['c2', 'c5', 'c1', 'c0', 'c6', 'c'])
 * // => ['C', 'C0', 'C1', 'C2', 'C5', 'C6']
 * sortedNoteNames(['c', 'F', 'G', 'a', 'b', 'h', 'J'])
 * // => ['C', 'F', 'G', 'A', 'B']
 */


function sortedNoteNames(notes) {
  const valid = notes.map(n => (0, _core.note)(n)).filter(n => !n.empty);
  return valid.sort((a, b) => a.height - b.height).map(n => n.name);
}
/**
 * Get sorted notes with duplicates removed. Pitch classes are listed
 * before notes.
 *
 * @function
 * @param {string[]} array
 * @return {string[]} unique sorted notes
 *
 * @example
 * Array.sortedUniqNoteNames(['a', 'b', 'c2', '1p', 'p2', 'c2', 'b', 'c', 'c3' ])
 * // => [ 'C', 'A', 'B', 'C2', 'C3' ]
 */


function sortedUniqNoteNames(arr) {
  return sortedNoteNames(arr).filter((n, i, a) => i === 0 || n !== a[i - 1]);
}
/**
 * Randomizes the order of the specified array in-place, using the Fisher–Yates shuffle.
 *
 * @function
 * @param {Array} array
 * @return {Array} the array shuffled
 *
 * @example
 * shuffle(["C", "D", "E", "F"]) // => [...]
 */


function shuffle(arr, rnd = Math.random) {
  let i;
  let t;
  let m = arr.length;

  while (m) {
    i = Math.floor(rnd() * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }

  return arr;
}
/**
 * Get all permutations of an array
 *
 * @param {Array} array - the array
 * @return {Array<Array>} an array with all the permutations
 * @example
 * permutations(["a", "b", "c"])) // =>
 * [
 *   ["a", "b", "c"],
 *   ["b", "a", "c"],
 *   ["b", "c", "a"],
 *   ["a", "c", "b"],
 *   ["c", "a", "b"],
 *   ["c", "b", "a"]
 * ]
 */


function permutations(arr) {
  if (arr.length === 0) {
    return [[]];
  }

  return permutations(arr.slice(1)).reduce((acc, perm) => {
    return acc.concat(arr.map((e, pos) => {
      const newPerm = perm.slice();
      newPerm.splice(pos, 0, arr[0]);
      return newPerm;
    }));
  }, []);
}
},{"@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js"}],"node_modules/@tonaljs/collection/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compact = compact;
exports.permutations = permutations;
exports.range = range;
exports.rotate = rotate;
exports.shuffle = shuffle;
exports.default = void 0;

// ascending range
function ascR(b, n) {
  const a = []; // tslint:disable-next-line:curly

  for (; n--; a[n] = n + b);

  return a;
} // descending range


function descR(b, n) {
  const a = []; // tslint:disable-next-line:curly

  for (; n--; a[n] = b - n);

  return a;
}
/**
 * Creates a numeric range
 *
 * @param {number} from
 * @param {number} to
 * @return {Array<number>}
 *
 * @example
 * range(-2, 2) // => [-2, -1, 0, 1, 2]
 * range(2, -2) // => [2, 1, 0, -1, -2]
 */


function range(from, to) {
  return from < to ? ascR(from, to - from + 1) : descR(from, from - to + 1);
}
/**
 * Rotates a list a number of times. It"s completly agnostic about the
 * contents of the list.
 *
 * @param {Integer} times - the number of rotations
 * @param {Array} collection
 * @return {Array} the rotated collection
 *
 * @example
 * rotate(1, [1, 2, 3]) // => [2, 3, 1]
 */


function rotate(times, arr) {
  const len = arr.length;
  const n = (times % len + len) % len;
  return arr.slice(n, len).concat(arr.slice(0, n));
}
/**
 * Return a copy of the collection with the null values removed
 * @function
 * @param {Array} collection
 * @return {Array}
 *
 * @example
 * compact(["a", "b", null, "c"]) // => ["a", "b", "c"]
 */


function compact(arr) {
  return arr.filter(n => n === 0 || n);
}
/**
 * Randomizes the order of the specified collection in-place, using the Fisher–Yates shuffle.
 *
 * @function
 * @param {Array} collection
 * @return {Array} the collection shuffled
 *
 * @example
 * shuffle(["C", "D", "E", "F"]) // => [...]
 */


function shuffle(arr, rnd = Math.random) {
  let i;
  let t;
  let m = arr.length;

  while (m) {
    i = Math.floor(rnd() * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }

  return arr;
}
/**
 * Get all permutations of an collection
 *
 * @param {Array} collection - the collection
 * @return {Array<Array>} an collection with all the permutations
 * @example
 * permutations(["a", "b", "c"])) // =>
 * [
 *   ["a", "b", "c"],
 *   ["b", "a", "c"],
 *   ["b", "c", "a"],
 *   ["a", "c", "b"],
 *   ["c", "a", "b"],
 *   ["c", "b", "a"]
 * ]
 */


function permutations(arr) {
  if (arr.length === 0) {
    return [[]];
  }

  return permutations(arr.slice(1)).reduce((acc, perm) => {
    return acc.concat(arr.map((e, pos) => {
      const newPerm = perm.slice();
      newPerm.splice(pos, 0, arr[0]);
      return newPerm;
    }));
  }, []);
}

var index = {
  compact,
  permutations,
  range,
  rotate,
  shuffle
};
var _default = index;
exports.default = _default;
},{}],"node_modules/@tonaljs/pcset/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chromaToIntervals = chromaToIntervals;
exports.chromas = chromas;
exports.filter = filter;
exports.get = get;
exports.isEqual = isEqual;
exports.isNoteIncludedIn = isNoteIncludedIn;
exports.isSubsetOf = isSubsetOf;
exports.isSupersetOf = isSupersetOf;
exports.modes = modes;
exports.pcset = exports.includes = exports.default = exports.EmptyPcset = void 0;

var _collection = require("@tonaljs/collection");

var _core = require("@tonaljs/core");

const EmptyPcset = {
  empty: true,
  name: "",
  setNum: 0,
  chroma: "000000000000",
  normalized: "000000000000",
  intervals: []
}; // UTILITIES

exports.EmptyPcset = EmptyPcset;

const setNumToChroma = num => Number(num).toString(2);

const chromaToNumber = chroma => parseInt(chroma, 2);

const REGEX = /^[01]{12}$/;

function isChroma(set) {
  return REGEX.test(set);
}

const isPcsetNum = set => typeof set === "number" && set >= 0 && set <= 4095;

const isPcset = set => set && isChroma(set.chroma);

const cache = {
  [EmptyPcset.chroma]: EmptyPcset
};
/**
 * Get the pitch class set of a collection of notes or set number or chroma
 */

function get(src) {
  const chroma = isChroma(src) ? src : isPcsetNum(src) ? setNumToChroma(src) : Array.isArray(src) ? listToChroma(src) : isPcset(src) ? src.chroma : EmptyPcset.chroma;
  return cache[chroma] = cache[chroma] || chromaToPcset(chroma);
}
/**
 * Use Pcset.properties
 * @function
 * @deprecated
 */


const pcset = (0, _core.deprecate)("Pcset.pcset", "Pcset.get", get);
/**
 * Get pitch class set chroma
 * @function
 * @example
 * Pcset.chroma(["c", "d", "e"]); //=> "101010000000"
 */

exports.pcset = pcset;

const chroma = set => get(set).chroma;
/**
 * Get intervals (from C) of a set
 * @function
 * @example
 * Pcset.intervals(["c", "d", "e"]); //=>
 */


const intervals = set => get(set).intervals;
/**
 * Get pitch class set number
 * @function
 * @example
 * Pcset.num(["c", "d", "e"]); //=> 2192
 */


const num = set => get(set).setNum;

const IVLS = ["1P", "2m", "2M", "3m", "3M", "4P", "5d", "5P", "6m", "6M", "7m", "7M"];
/**
 * @private
 * Get the intervals of a pcset *starting from C*
 * @param {Set} set - the pitch class set
 * @return {IntervalName[]} an array of interval names or an empty array
 * if not a valid pitch class set
 */

function chromaToIntervals(chroma) {
  const intervals = [];

  for (let i = 0; i < 12; i++) {
    // tslint:disable-next-line:curly
    if (chroma.charAt(i) === "1") intervals.push(IVLS[i]);
  }

  return intervals;
}
/**
 * Get a list of all possible pitch class sets (all possible chromas) *having
 * C as root*. There are 2048 different chromas. If you want them with another
 * note you have to transpose it
 *
 * @see http://allthescales.org/
 * @return {Array<PcsetChroma>} an array of possible chromas from '10000000000' to '11111111111'
 */


function chromas() {
  return (0, _collection.range)(2048, 4095).map(setNumToChroma);
}
/**
 * Given a a list of notes or a pcset chroma, produce the rotations
 * of the chroma discarding the ones that starts with "0"
 *
 * This is used, for example, to get all the modes of a scale.
 *
 * @param {Array|string} set - the list of notes or pitchChr of the set
 * @param {boolean} normalize - (Optional, true by default) remove all
 * the rotations that starts with "0"
 * @return {Array<string>} an array with all the modes of the chroma
 *
 * @example
 * Pcset.modes(["C", "D", "E"]).map(Pcset.intervals)
 */


function modes(set, normalize = true) {
  const pcs = get(set);
  const binary = pcs.chroma.split("");
  return (0, _collection.compact)(binary.map((_, i) => {
    const r = (0, _collection.rotate)(i, binary);
    return normalize && r[0] === "0" ? null : r.join("");
  }));
}
/**
 * Test if two pitch class sets are numentical
 *
 * @param {Array|string} set1 - one of the pitch class sets
 * @param {Array|string} set2 - the other pitch class set
 * @return {boolean} true if they are equal
 * @example
 * Pcset.isEqual(["c2", "d3"], ["c5", "d2"]) // => true
 */


function isEqual(s1, s2) {
  return get(s1).setNum === get(s2).setNum;
}
/**
 * Create a function that test if a collection of notes is a
 * subset of a given set
 *
 * The function is curryfied.
 *
 * @param {PcsetChroma|NoteName[]} set - the superset to test against (chroma or
 * list of notes)
 * @return{function(PcsetChroma|NoteNames[]): boolean} a function accepting a set
 * to test against (chroma or list of notes)
 * @example
 * const inCMajor = Pcset.isSubsetOf(["C", "E", "G"])
 * inCMajor(["e6", "c4"]) // => true
 * inCMajor(["e6", "c4", "d3"]) // => false
 */


function isSubsetOf(set) {
  const s = get(set).setNum;
  return notes => {
    const o = get(notes).setNum; // tslint:disable-next-line: no-bitwise

    return s && s !== o && (o & s) === o;
  };
}
/**
 * Create a function that test if a collection of notes is a
 * superset of a given set (it contains all notes and at least one more)
 *
 * @param {Set} set - an array of notes or a chroma set string to test against
 * @return {(subset: Set): boolean} a function that given a set
 * returns true if is a subset of the first one
 * @example
 * const extendsCMajor = Pcset.isSupersetOf(["C", "E", "G"])
 * extendsCMajor(["e6", "a", "c4", "g2"]) // => true
 * extendsCMajor(["c6", "e4", "g3"]) // => false
 */


function isSupersetOf(set) {
  const s = get(set).setNum;
  return notes => {
    const o = get(notes).setNum; // tslint:disable-next-line: no-bitwise

    return s && s !== o && (o | s) === o;
  };
}
/**
 * Test if a given pitch class set includes a note
 *
 * @param {Array<string>} set - the base set to test against
 * @param {string} note - the note to test
 * @return {boolean} true if the note is included in the pcset
 *
 * Can be partially applied
 *
 * @example
 * const isNoteInCMajor = isNoteIncludedIn(['C', 'E', 'G'])
 * isNoteInCMajor('C4') // => true
 * isNoteInCMajor('C#4') // => false
 */


function isNoteIncludedIn(set) {
  const s = get(set);
  return noteName => {
    const n = (0, _core.note)(noteName);
    return s && !n.empty && s.chroma.charAt(n.chroma) === "1";
  };
}
/** @deprecated use: isNoteIncludedIn */


const includes = isNoteIncludedIn;
/**
 * Filter a list with a pitch class set
 *
 * @param {Array|string} set - the pitch class set notes
 * @param {Array|string} notes - the note list to be filtered
 * @return {Array} the filtered notes
 *
 * @example
 * Pcset.filter(["C", "D", "E"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ "c2", "d2", "c3", "d3" ])
 * Pcset.filter(["C2"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ "c2", "c3" ])
 */

exports.includes = includes;

function filter(set) {
  const isIncluded = isNoteIncludedIn(set);
  return notes => {
    return notes.filter(isIncluded);
  };
}

var index = {
  get,
  chroma,
  num,
  intervals,
  chromas,
  isSupersetOf,
  isSubsetOf,
  isNoteIncludedIn,
  isEqual,
  filter,
  modes,
  // deprecated
  pcset
}; //// PRIVATE ////

exports.default = index;

function chromaRotations(chroma) {
  const binary = chroma.split("");
  return binary.map((_, i) => (0, _collection.rotate)(i, binary).join(""));
}

function chromaToPcset(chroma) {
  const setNum = chromaToNumber(chroma);
  const normalizedNum = chromaRotations(chroma).map(chromaToNumber).filter(n => n >= 2048).sort()[0];
  const normalized = setNumToChroma(normalizedNum);
  const intervals = chromaToIntervals(chroma);
  return {
    empty: false,
    name: "",
    setNum,
    chroma,
    normalized,
    intervals
  };
}

function listToChroma(set) {
  if (set.length === 0) {
    return EmptyPcset.chroma;
  }

  let pitch;
  const binary = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // tslint:disable-next-line:prefer-for-of

  for (let i = 0; i < set.length; i++) {
    pitch = (0, _core.note)(set[i]); // tslint:disable-next-line: curly

    if (pitch.empty) pitch = (0, _core.interval)(set[i]); // tslint:disable-next-line: curly

    if (!pitch.empty) binary[pitch.chroma] = 1;
  }

  return binary.join("");
}
},{"@tonaljs/collection":"node_modules/@tonaljs/collection/dist/index.es.js","@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js"}],"node_modules/@tonaljs/chord-type/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = add;
exports.addAlias = addAlias;
exports.all = all;
exports.get = get;
exports.keys = keys;
exports.names = names;
exports.removeAll = removeAll;
exports.symbols = symbols;
exports.entries = exports.default = exports.chordType = void 0;

var _core = require("@tonaljs/core");

var _pcset = require("@tonaljs/pcset");

/**
 * @private
 * Chord List
 * Source: https://en.wikibooks.org/wiki/Music_Theory/Complete_List_of_Chord_Patterns
 * Format: ["intervals", "full name", "abrv1 abrv2"]
 */
const CHORDS = [// ==Major==
["1P 3M 5P", "major", "M ^ "], ["1P 3M 5P 7M", "major seventh", "maj7 Δ ma7 M7 Maj7 ^7"], ["1P 3M 5P 7M 9M", "major ninth", "maj9 Δ9 ^9"], ["1P 3M 5P 7M 9M 13M", "major thirteenth", "maj13 Maj13 ^13"], ["1P 3M 5P 6M", "sixth", "6 add6 add13 M6"], ["1P 3M 5P 6M 9M", "sixth/ninth", "6/9 69 M69"], ["1P 3M 6m 7M", "major seventh flat sixth", "M7b6 ^7b6"], ["1P 3M 5P 7M 11A", "major seventh sharp eleventh", "maj#4 Δ#4 Δ#11 M7#11 ^7#11 maj7#11"], // ==Minor==
// '''Normal'''
["1P 3m 5P", "minor", "m min -"], ["1P 3m 5P 7m", "minor seventh", "m7 min7 mi7 -7"], ["1P 3m 5P 7M", "minor/major seventh", "m/ma7 m/maj7 mM7 mMaj7 m/M7 -Δ7 mΔ -^7"], ["1P 3m 5P 6M", "minor sixth", "m6 -6"], ["1P 3m 5P 7m 9M", "minor ninth", "m9 -9"], ["1P 3m 5P 7M 9M", "minor/major ninth", "mM9 mMaj9 -^9"], ["1P 3m 5P 7m 9M 11P", "minor eleventh", "m11 -11"], ["1P 3m 5P 7m 9M 13M", "minor thirteenth", "m13 -13"], // '''Diminished'''
["1P 3m 5d", "diminished", "dim ° o"], ["1P 3m 5d 7d", "diminished seventh", "dim7 °7 o7"], ["1P 3m 5d 7m", "half-diminished", "m7b5 ø -7b5 h7 h"], // ==Dominant/Seventh==
// '''Normal'''
["1P 3M 5P 7m", "dominant seventh", "7 dom"], ["1P 3M 5P 7m 9M", "dominant ninth", "9"], ["1P 3M 5P 7m 9M 13M", "dominant thirteenth", "13"], ["1P 3M 5P 7m 11A", "lydian dominant seventh", "7#11 7#4"], // '''Altered'''
["1P 3M 5P 7m 9m", "dominant flat ninth", "7b9"], ["1P 3M 5P 7m 9A", "dominant sharp ninth", "7#9"], ["1P 3M 7m 9m", "altered", "alt7"], // '''Suspended'''
["1P 4P 5P", "suspended fourth", "sus4 sus"], ["1P 2M 5P", "suspended second", "sus2"], ["1P 4P 5P 7m", "suspended fourth seventh", "7sus4 7sus"], ["1P 5P 7m 9M 11P", "eleventh", "11"], ["1P 4P 5P 7m 9m", "suspended fourth flat ninth", "b9sus phryg 7b9sus 7b9sus4"], // ==Other==
["1P 5P", "fifth", "5"], ["1P 3M 5A", "augmented", "aug + +5 ^#5"], ["1P 3m 5A", "minor augmented", "m#5 -#5 m+"], ["1P 3M 5A 7M", "augmented seventh", "maj7#5 maj7+5 +maj7 ^7#5"], ["1P 3M 5P 7M 9M 11A", "major sharp eleventh (lydian)", "maj9#11 Δ9#11 ^9#11"], // ==Legacy==
["1P 2M 4P 5P", "", "sus24 sus4add9"], ["1P 3M 5A 7M 9M", "", "maj9#5 Maj9#5"], ["1P 3M 5A 7m", "", "7#5 +7 7+ 7aug aug7"], ["1P 3M 5A 7m 9A", "", "7#5#9 7#9#5 7alt"], ["1P 3M 5A 7m 9M", "", "9#5 9+"], ["1P 3M 5A 7m 9M 11A", "", "9#5#11"], ["1P 3M 5A 7m 9m", "", "7#5b9 7b9#5"], ["1P 3M 5A 7m 9m 11A", "", "7#5b9#11"], ["1P 3M 5A 9A", "", "+add#9"], ["1P 3M 5A 9M", "", "M#5add9 +add9"], ["1P 3M 5P 6M 11A", "", "M6#11 M6b5 6#11 6b5"], ["1P 3M 5P 6M 7M 9M", "", "M7add13"], ["1P 3M 5P 6M 9M 11A", "", "69#11"], ["1P 3m 5P 6M 9M", "", "m69 -69"], ["1P 3M 5P 6m 7m", "", "7b6"], ["1P 3M 5P 7M 9A 11A", "", "maj7#9#11"], ["1P 3M 5P 7M 9M 11A 13M", "", "M13#11 maj13#11 M13+4 M13#4"], ["1P 3M 5P 7M 9m", "", "M7b9"], ["1P 3M 5P 7m 11A 13m", "", "7#11b13 7b5b13"], ["1P 3M 5P 7m 13M", "", "7add6 67 7add13"], ["1P 3M 5P 7m 9A 11A", "", "7#9#11 7b5#9 7#9b5"], ["1P 3M 5P 7m 9A 11A 13M", "", "13#9#11"], ["1P 3M 5P 7m 9A 11A 13m", "", "7#9#11b13"], ["1P 3M 5P 7m 9A 13M", "", "13#9"], ["1P 3M 5P 7m 9A 13m", "", "7#9b13"], ["1P 3M 5P 7m 9M 11A", "", "9#11 9+4 9#4"], ["1P 3M 5P 7m 9M 11A 13M", "", "13#11 13+4 13#4"], ["1P 3M 5P 7m 9M 11A 13m", "", "9#11b13 9b5b13"], ["1P 3M 5P 7m 9m 11A", "", "7b9#11 7b5b9 7b9b5"], ["1P 3M 5P 7m 9m 11A 13M", "", "13b9#11"], ["1P 3M 5P 7m 9m 11A 13m", "", "7b9b13#11 7b9#11b13 7b5b9b13"], ["1P 3M 5P 7m 9m 13M", "", "13b9"], ["1P 3M 5P 7m 9m 13m", "", "7b9b13"], ["1P 3M 5P 7m 9m 9A", "", "7b9#9"], ["1P 3M 5P 9M", "", "Madd9 2 add9 add2"], ["1P 3M 5P 9m", "", "Maddb9"], ["1P 3M 5d", "", "Mb5"], ["1P 3M 5d 6M 7m 9M", "", "13b5"], ["1P 3M 5d 7M", "", "M7b5"], ["1P 3M 5d 7M 9M", "", "M9b5"], ["1P 3M 5d 7m", "", "7b5"], ["1P 3M 5d 7m 9M", "", "9b5"], ["1P 3M 7m", "", "7no5"], ["1P 3M 7m 13m", "", "7b13"], ["1P 3M 7m 9M", "", "9no5"], ["1P 3M 7m 9M 13M", "", "13no5"], ["1P 3M 7m 9M 13m", "", "9b13"], ["1P 3m 4P 5P", "", "madd4"], ["1P 3m 5P 6m 7M", "", "mMaj7b6"], ["1P 3m 5P 6m 7M 9M", "", "mMaj9b6"], ["1P 3m 5P 7m 11P", "", "m7add11 m7add4"], ["1P 3m 5P 9M", "", "madd9"], ["1P 3m 5d 6M 7M", "", "o7M7"], ["1P 3m 5d 7M", "", "oM7"], ["1P 3m 6m 7M", "", "mb6M7"], ["1P 3m 6m 7m", "", "m7#5"], ["1P 3m 6m 7m 9M", "", "m9#5"], ["1P 3m 5A 7m 9M 11P", "", "m11A"], ["1P 3m 6m 9m", "", "mb6b9"], ["1P 2M 3m 5d 7m", "", "m9b5"], ["1P 4P 5A 7M", "", "M7#5sus4"], ["1P 4P 5A 7M 9M", "", "M9#5sus4"], ["1P 4P 5A 7m", "", "7#5sus4"], ["1P 4P 5P 7M", "", "M7sus4"], ["1P 4P 5P 7M 9M", "", "M9sus4"], ["1P 4P 5P 7m 9M", "", "9sus4 9sus"], ["1P 4P 5P 7m 9M 13M", "", "13sus4 13sus"], ["1P 4P 5P 7m 9m 13m", "", "7sus4b9b13 7b9b13sus4"], ["1P 4P 7m 10m", "", "4 quartal"], ["1P 5P 7m 9m 11P", "", "11b9"]];
const NoChordType = { ..._pcset.EmptyPcset,
  name: "",
  quality: "Unknown",
  intervals: [],
  aliases: []
};
let dictionary = [];
let index = {};
/**
 * Given a chord name or chroma, return the chord properties
 * @param {string} source - chord name or pitch class set chroma
 * @example
 * import { get } from 'tonaljs/chord-type'
 * get('major') // => { name: 'major', ... }
 */

function get(type) {
  return index[type] || NoChordType;
}

const chordType = (0, _core.deprecate)("ChordType.chordType", "ChordType.get", get);
/**
 * Get all chord (long) names
 */

exports.chordType = chordType;

function names() {
  return dictionary.map(chord => chord.name).filter(x => x);
}
/**
 * Get all chord symbols
 */


function symbols() {
  return dictionary.map(chord => chord.aliases[0]).filter(x => x);
}
/**
 * Keys used to reference chord types
 */


function keys() {
  return Object.keys(index);
}
/**
 * Return a list of all chord types
 */


function all() {
  return dictionary.slice();
}

const entries = (0, _core.deprecate)("ChordType.entries", "ChordType.all", all);
/**
 * Clear the dictionary
 */

exports.entries = entries;

function removeAll() {
  dictionary = [];
  index = {};
}
/**
 * Add a chord to the dictionary.
 * @param intervals
 * @param aliases
 * @param [fullName]
 */


function add(intervals, aliases, fullName) {
  const quality = getQuality(intervals);
  const chord = { ...(0, _pcset.get)(intervals),
    name: fullName || "",
    quality,
    intervals,
    aliases
  };
  dictionary.push(chord);

  if (chord.name) {
    index[chord.name] = chord;
  }

  index[chord.setNum] = chord;
  index[chord.chroma] = chord;
  chord.aliases.forEach(alias => addAlias(chord, alias));
}

function addAlias(chord, alias) {
  index[alias] = chord;
}

function getQuality(intervals) {
  const has = interval => intervals.indexOf(interval) !== -1;

  return has("5A") ? "Augmented" : has("3M") ? "Major" : has("5d") ? "Diminished" : has("3m") ? "Minor" : "Unknown";
}

CHORDS.forEach(([ivls, fullName, names]) => add(ivls.split(" "), names.split(" "), fullName));
dictionary.sort((a, b) => a.setNum - b.setNum);
var index$1 = {
  names,
  symbols,
  get,
  all,
  add,
  removeAll,
  keys,
  // deprecated
  entries,
  chordType
};
exports.default = index$1;
},{"@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/pcset":"node_modules/@tonaljs/pcset/dist/index.es.js"}],"node_modules/@tonaljs/chord-detect/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.detect = detect;
exports.default = void 0;

var _chordType = require("@tonaljs/chord-type");

var _core = require("@tonaljs/core");

var _pcset = require("@tonaljs/pcset");

const namedSet = notes => {
  const pcToName = notes.reduce((record, n) => {
    const chroma = (0, _core.note)(n).chroma;

    if (chroma !== undefined) {
      record[chroma] = record[chroma] || (0, _core.note)(n).name;
    }

    return record;
  }, {});
  return chroma => pcToName[chroma];
};

function detect(source) {
  const notes = source.map(n => (0, _core.note)(n).pc).filter(x => x);

  if (_core.note.length === 0) {
    return [];
  }

  const found = findExactMatches(notes, 1);
  return found.filter(chord => chord.weight).sort((a, b) => b.weight - a.weight).map(chord => chord.name);
}

function findExactMatches(notes, weight) {
  const tonic = notes[0];
  const tonicChroma = (0, _core.note)(tonic).chroma;
  const noteName = namedSet(notes); // we need to test all chormas to get the correct baseNote

  const allModes = (0, _pcset.modes)(notes, false);
  const found = [];
  allModes.forEach((mode, index) => {
    // some chords could have the same chroma but different interval spelling
    const chordTypes = (0, _chordType.all)().filter(chordType => chordType.chroma === mode);
    chordTypes.forEach(chordType => {
      const chordName = chordType.aliases[0];
      const baseNote = noteName(index);
      const isInversion = index !== tonicChroma;

      if (isInversion) {
        found.push({
          weight: 0.5 * weight,
          name: `${baseNote}${chordName}/${tonic}`
        });
      } else {
        found.push({
          weight: 1 * weight,
          name: `${baseNote}${chordName}`
        });
      }
    });
  });
  return found;
}

var index = {
  detect
};
exports.default = index;
},{"@tonaljs/chord-type":"node_modules/@tonaljs/chord-type/dist/index.es.js","@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/pcset":"node_modules/@tonaljs/pcset/dist/index.es.js"}],"node_modules/@tonaljs/scale-type/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = add;
exports.addAlias = addAlias;
exports.all = all;
exports.get = get;
exports.keys = keys;
exports.names = names;
exports.removeAll = removeAll;
exports.scaleType = exports.entries = exports.default = exports.NoScaleType = void 0;

var _core = require("@tonaljs/core");

var _pcset = require("@tonaljs/pcset");

// SCALES
// Format: ["intervals", "name", "alias1", "alias2", ...]
const SCALES = [// 5-note scales
["1P 2M 3M 5P 6M", "major pentatonic", "pentatonic"], ["1P 3M 4P 5P 7M", "ionian pentatonic"], ["1P 3M 4P 5P 7m", "mixolydian pentatonic", "indian"], ["1P 2M 4P 5P 6M", "ritusen"], ["1P 2M 4P 5P 7m", "egyptian"], ["1P 3M 4P 5d 7m", "neopolitan major pentatonic"], ["1P 3m 4P 5P 6m", "vietnamese 1"], ["1P 2m 3m 5P 6m", "pelog"], ["1P 2m 4P 5P 6m", "kumoijoshi"], ["1P 2M 3m 5P 6m", "hirajoshi"], ["1P 2m 4P 5d 7m", "iwato"], ["1P 2m 4P 5P 7m", "in-sen"], ["1P 3M 4A 5P 7M", "lydian pentatonic", "chinese"], ["1P 3m 4P 6m 7m", "malkos raga"], ["1P 3m 4P 5d 7m", "locrian pentatonic", "minor seven flat five pentatonic"], ["1P 3m 4P 5P 7m", "minor pentatonic", "vietnamese 2"], ["1P 3m 4P 5P 6M", "minor six pentatonic"], ["1P 2M 3m 5P 6M", "flat three pentatonic", "kumoi"], ["1P 2M 3M 5P 6m", "flat six pentatonic"], ["1P 2m 3M 5P 6M", "scriabin"], ["1P 3M 5d 6m 7m", "whole tone pentatonic"], ["1P 3M 4A 5A 7M", "lydian #5P pentatonic"], ["1P 3M 4A 5P 7m", "lydian dominant pentatonic"], ["1P 3m 4P 5P 7M", "minor #7M pentatonic"], ["1P 3m 4d 5d 7m", "super locrian pentatonic"], // 6-note scales
["1P 2M 3m 4P 5P 7M", "minor hexatonic"], ["1P 2A 3M 5P 5A 7M", "augmented"], ["1P 2M 3m 3M 5P 6M", "major blues"], ["1P 2M 4P 5P 6M 7m", "piongio"], ["1P 2m 3M 4A 6M 7m", "prometheus neopolitan"], ["1P 2M 3M 4A 6M 7m", "prometheus"], ["1P 2m 3M 5d 6m 7m", "mystery #1"], ["1P 2m 3M 4P 5A 6M", "six tone symmetric"], ["1P 2M 3M 4A 5A 7m", "whole tone", "messiaen's mode #1"], ["1P 2m 4P 4A 5P 7M", "messiaen's mode #5"], ["1P 3m 4P 5d 5P 7m", "minor blues", "blues"], // 7-note scales
["1P 2M 3M 4P 5d 6m 7m", "locrian major", "arabian"], ["1P 2m 3M 4A 5P 6m 7M", "double harmonic lydian"], ["1P 2M 3m 4P 5P 6m 7M", "harmonic minor"], ["1P 2m 2A 3M 4A 6m 7m", "altered", "super locrian", "diminished whole tone", "pomeroy"], ["1P 2M 3m 4P 5d 6m 7m", "locrian #2", "half-diminished", "aeolian b5"], ["1P 2M 3M 4P 5P 6m 7m", "mixolydian b6", "melodic minor fifth mode", "hindu"], ["1P 2M 3M 4A 5P 6M 7m", "lydian dominant", "lydian b7", "overtone"], ["1P 2M 3M 4A 5P 6M 7M", "lydian"], ["1P 2M 3M 4A 5A 6M 7M", "lydian augmented"], ["1P 2m 3m 4P 5P 6M 7m", "dorian b2", "phrygian #6", "melodic minor second mode"], ["1P 2M 3m 4P 5P 6M 7M", "melodic minor"], ["1P 2m 3m 4P 5d 6m 7m", "locrian"], ["1P 2m 3m 4d 5d 6m 7d", "ultralocrian", "superlocrian bb7", "superlocrian diminished"], ["1P 2m 3m 4P 5d 6M 7m", "locrian 6", "locrian natural 6", "locrian sharp 6"], ["1P 2A 3M 4P 5P 5A 7M", "augmented heptatonic"], // Source https://en.wikipedia.org/wiki/Ukrainian_Dorian_scale
["1P 2M 3m 4A 5P 6M 7m", "dorian #4", "ukrainian dorian", "romanian minor", "altered dorian"], ["1P 2M 3m 4A 5P 6M 7M", "lydian diminished"], ["1P 2m 3m 4P 5P 6m 7m", "phrygian"], ["1P 2M 3M 4A 5A 7m 7M", "leading whole tone"], ["1P 2M 3M 4A 5P 6m 7m", "lydian minor"], ["1P 2m 3M 4P 5P 6m 7m", "phrygian dominant", "spanish", "phrygian major"], ["1P 2m 3m 4P 5P 6m 7M", "balinese"], ["1P 2m 3m 4P 5P 6M 7M", "neopolitan major"], ["1P 2M 3m 4P 5P 6m 7m", "aeolian", "minor"], ["1P 2M 3M 4P 5P 6m 7M", "harmonic major"], ["1P 2m 3M 4P 5P 6m 7M", "double harmonic major", "gypsy"], ["1P 2M 3m 4P 5P 6M 7m", "dorian"], ["1P 2M 3m 4A 5P 6m 7M", "hungarian minor"], ["1P 2A 3M 4A 5P 6M 7m", "hungarian major"], ["1P 2m 3M 4P 5d 6M 7m", "oriental"], ["1P 2m 3m 3M 4A 5P 7m", "flamenco"], ["1P 2m 3m 4A 5P 6m 7M", "todi raga"], ["1P 2M 3M 4P 5P 6M 7m", "mixolydian", "dominant"], ["1P 2m 3M 4P 5d 6m 7M", "persian"], ["1P 2M 3M 4P 5P 6M 7M", "major", "ionian"], ["1P 2m 3M 5d 6m 7m 7M", "enigmatic"], ["1P 2M 3M 4P 5A 6M 7M", "major augmented", "major #5", "ionian augmented", "ionian #5"], ["1P 2A 3M 4A 5P 6M 7M", "lydian #9"], // 8-note scales
["1P 2m 2M 4P 4A 5P 6m 7M", "messiaen's mode #4"], ["1P 2m 3M 4P 4A 5P 6m 7M", "purvi raga"], ["1P 2m 3m 3M 4P 5P 6m 7m", "spanish heptatonic"], ["1P 2M 3M 4P 5P 6M 7m 7M", "bebop"], ["1P 2M 3m 3M 4P 5P 6M 7m", "bebop minor"], ["1P 2M 3M 4P 5P 5A 6M 7M", "bebop major"], ["1P 2m 3m 4P 5d 5P 6m 7m", "bebop locrian"], ["1P 2M 3m 4P 5P 6m 7m 7M", "minor bebop"], ["1P 2M 3m 4P 5d 6m 6M 7M", "diminished", "whole-half diminished"], ["1P 2M 3M 4P 5d 5P 6M 7M", "ichikosucho"], ["1P 2M 3m 4P 5P 6m 6M 7M", "minor six diminished"], ["1P 2m 3m 3M 4A 5P 6M 7m", "half-whole diminished", "dominant diminished", "messiaen's mode #2"], ["1P 3m 3M 4P 5P 6M 7m 7M", "kafi raga"], ["1P 2M 3M 4P 4A 5A 6A 7M", "messiaen's mode #6"], // 9-note scales
["1P 2M 3m 3M 4P 5d 5P 6M 7m", "composite blues"], ["1P 2M 3m 3M 4A 5P 6m 7m 7M", "messiaen's mode #3"], // 10-note scales
["1P 2m 2M 3m 4P 4A 5P 6m 6M 7M", "messiaen's mode #7"], // 12-note scales
["1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M", "chromatic"]];
const NoScaleType = { ..._pcset.EmptyPcset,
  intervals: [],
  aliases: []
};
exports.NoScaleType = NoScaleType;
let dictionary = [];
let index = {};

function names() {
  return dictionary.map(scale => scale.name);
}
/**
 * Given a scale name or chroma, return the scale properties
 *
 * @param {string} type - scale name or pitch class set chroma
 * @example
 * import { get } from 'tonaljs/scale-type'
 * get('major') // => { name: 'major', ... }
 */


function get(type) {
  return index[type] || NoScaleType;
}

const scaleType = (0, _core.deprecate)("ScaleDictionary.scaleType", "ScaleType.get", get);
/**
 * Return a list of all scale types
 */

exports.scaleType = scaleType;

function all() {
  return dictionary.slice();
}

const entries = (0, _core.deprecate)("ScaleDictionary.entries", "ScaleType.all", all);
/**
 * Keys used to reference scale types
 */

exports.entries = entries;

function keys() {
  return Object.keys(index);
}
/**
 * Clear the dictionary
 */


function removeAll() {
  dictionary = [];
  index = {};
}
/**
 * Add a scale into dictionary
 * @param intervals
 * @param name
 * @param aliases
 */


function add(intervals, name, aliases = []) {
  const scale = { ...(0, _pcset.get)(intervals),
    name,
    intervals,
    aliases
  };
  dictionary.push(scale);
  index[scale.name] = scale;
  index[scale.setNum] = scale;
  index[scale.chroma] = scale;
  scale.aliases.forEach(alias => addAlias(scale, alias));
  return scale;
}

function addAlias(scale, alias) {
  index[alias] = scale;
}

SCALES.forEach(([ivls, name, ...aliases]) => add(ivls.split(" "), name, aliases));
var index$1 = {
  names,
  get,
  all,
  add,
  removeAll,
  keys,
  // deprecated
  entries,
  scaleType
};
exports.default = index$1;
},{"@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/pcset":"node_modules/@tonaljs/pcset/dist/index.es.js"}],"node_modules/@tonaljs/chord/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chordScales = chordScales;
exports.extended = extended;
exports.get = get;
exports.getChord = getChord;
exports.reduced = reduced;
exports.tokenize = tokenize;
exports.transpose = transpose;
Object.defineProperty(exports, "detect", {
  enumerable: true,
  get: function () {
    return _chordDetect.detect;
  }
});
exports.default = exports.chord = void 0;

var _chordDetect = require("@tonaljs/chord-detect");

var _chordType = require("@tonaljs/chord-type");

var _core = require("@tonaljs/core");

var _pcset = require("@tonaljs/pcset");

var _scaleType = require("@tonaljs/scale-type");

const NoChord = {
  empty: true,
  name: "",
  symbol: "",
  root: "",
  rootDegree: 0,
  type: "",
  tonic: null,
  setNum: NaN,
  quality: "Unknown",
  chroma: "",
  normalized: "",
  aliases: [],
  notes: [],
  intervals: []
}; // 6, 64, 7, 9, 11 and 13 are consider part of the chord
// (see https://github.com/danigb/tonal/issues/55)

const NUM_TYPES = /^(6|64|7|9|11|13)$/;
/**
 * Tokenize a chord name. It returns an array with the tonic and chord type
 * If not tonic is found, all the name is considered the chord name.
 *
 * This function does NOT check if the chord type exists or not. It only tries
 * to split the tonic and chord type.
 *
 * @function
 * @param {string} name - the chord name
 * @return {Array} an array with [tonic, type]
 * @example
 * tokenize("Cmaj7") // => [ "C", "maj7" ]
 * tokenize("C7") // => [ "C", "7" ]
 * tokenize("mMaj7") // => [ null, "mMaj7" ]
 * tokenize("Cnonsense") // => [ null, "nonsense" ]
 */

function tokenize(name) {
  const [letter, acc, oct, type] = (0, _core.tokenizeNote)(name);

  if (letter === "") {
    return ["", name];
  } // aug is augmented (see https://github.com/danigb/tonal/issues/55)


  if (letter === "A" && type === "ug") {
    return ["", "aug"];
  } // see: https://github.com/tonaljs/tonal/issues/70


  if (!type && (oct === "4" || oct === "5")) {
    return [letter + acc, oct];
  }

  if (NUM_TYPES.test(oct)) {
    return [letter + acc, oct + type];
  } else {
    return [letter + acc + oct, type];
  }
}
/**
 * Get a Chord from a chord name.
 */


function get(src) {
  if (src === "") {
    return NoChord;
  }

  if (Array.isArray(src) && src.length === 2) {
    return getChord(src[1], src[0]);
  } else {
    const [tonic, type] = tokenize(src);
    const chord = getChord(type, tonic);
    return chord.empty ? getChord(src) : chord;
  }
}
/**
 * Get chord properties
 *
 * @param typeName - the chord type name
 * @param [tonic] - Optional tonic
 * @param [root]  - Optional root (requires a tonic)
 */


function getChord(typeName, optionalTonic, optionalRoot) {
  const type = (0, _chordType.get)(typeName);
  const tonic = (0, _core.note)(optionalTonic || "");
  const root = (0, _core.note)(optionalRoot || "");

  if (type.empty || optionalTonic && tonic.empty || optionalRoot && root.empty) {
    return NoChord;
  }

  const rootInterval = (0, _core.distance)(tonic.pc, root.pc);
  const rootDegree = type.intervals.indexOf(rootInterval) + 1;

  if (!root.empty && !rootDegree) {
    return NoChord;
  }

  const intervals = Array.from(type.intervals);

  for (let i = 1; i < rootDegree; i++) {
    const num = intervals[0][0];
    const quality = intervals[0][1];
    const newNum = parseInt(num, 10) + 7;
    intervals.push(`${newNum}${quality}`);
    intervals.shift();
  }

  const notes = tonic.empty ? [] : intervals.map(i => (0, _core.transpose)(tonic, i));
  typeName = type.aliases.indexOf(typeName) !== -1 ? typeName : type.aliases[0];
  const symbol = `${tonic.empty ? "" : tonic.pc}${typeName}${root.empty || rootDegree <= 1 ? "" : "/" + root.pc}`;
  const name = `${optionalTonic ? tonic.pc + " " : ""}${type.name}${rootDegree > 1 && optionalRoot ? " over " + root.pc : ""}`;
  return { ...type,
    name,
    symbol,
    type: type.name,
    root: root.name,
    intervals,
    rootDegree,
    tonic: tonic.name,
    notes
  };
}

const chord = (0, _core.deprecate)("Chord.chord", "Chord.get", get);
/**
 * Transpose a chord name
 *
 * @param {string} chordName - the chord name
 * @return {string} the transposed chord
 *
 * @example
 * transpose('Dm7', 'P4') // => 'Gm7
 */

exports.chord = chord;

function transpose(chordName, interval) {
  const [tonic, type] = tokenize(chordName);

  if (!tonic) {
    return chordName;
  }

  return (0, _core.transpose)(tonic, interval) + type;
}
/**
 * Get all scales where the given chord fits
 *
 * @example
 * chordScales('C7b9')
 * // => ["phrygian dominant", "flamenco", "spanish heptatonic", "half-whole diminished", "chromatic"]
 */


function chordScales(name) {
  const s = get(name);
  const isChordIncluded = (0, _pcset.isSupersetOf)(s.chroma);
  return (0, _scaleType.all)().filter(scale => isChordIncluded(scale.chroma)).map(scale => scale.name);
}
/**
 * Get all chords names that are a superset of the given one
 * (has the same notes and at least one more)
 *
 * @function
 * @example
 * extended("CMaj7")
 * // => [ 'Cmaj#4', 'Cmaj7#9#11', 'Cmaj9', 'CM7add13', 'Cmaj13', 'Cmaj9#11', 'CM13#11', 'CM7b9' ]
 */


function extended(chordName) {
  const s = get(chordName);
  const isSuperset = (0, _pcset.isSupersetOf)(s.chroma);
  return (0, _chordType.all)().filter(chord => isSuperset(chord.chroma)).map(chord => s.tonic + chord.aliases[0]);
}
/**
 * Find all chords names that are a subset of the given one
 * (has less notes but all from the given chord)
 *
 * @example
 */


function reduced(chordName) {
  const s = get(chordName);
  const isSubset = (0, _pcset.isSubsetOf)(s.chroma);
  return (0, _chordType.all)().filter(chord => isSubset(chord.chroma)).map(chord => s.tonic + chord.aliases[0]);
}

var index = {
  getChord,
  get,
  detect: _chordDetect.detect,
  chordScales,
  extended,
  reduced,
  tokenize,
  transpose,
  // deprecate
  chord
};
exports.default = index;
},{"@tonaljs/chord-detect":"node_modules/@tonaljs/chord-detect/dist/index.es.js","@tonaljs/chord-type":"node_modules/@tonaljs/chord-type/dist/index.es.js","@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/pcset":"node_modules/@tonaljs/pcset/dist/index.es.js","@tonaljs/scale-type":"node_modules/@tonaljs/scale-type/dist/index.es.js"}],"node_modules/@tonaljs/duration-value/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.names = names;
exports.shorthands = shorthands;
exports.value = exports.fraction = exports.default = void 0;
// source: https://en.wikipedia.org/wiki/Note_value
const DATA = [[0.125, "dl", ["large", "duplex longa", "maxima", "octuple", "octuple whole"]], [0.25, "l", ["long", "longa"]], [0.5, "d", ["double whole", "double", "breve"]], [1, "w", ["whole", "semibreve"]], [2, "h", ["half", "minim"]], [4, "q", ["quarter", "crotchet"]], [8, "e", ["eighth", "quaver"]], [16, "s", ["sixteenth", "semiquaver"]], [32, "t", ["thirty-second", "demisemiquaver"]], [64, "sf", ["sixty-fourth", "hemidemisemiquaver"]], [128, "h", ["hundred twenty-eighth"]], [256, "th", ["two hundred fifty-sixth"]]];
const VALUES = [];
DATA.forEach(([denominator, shorthand, names]) => add(denominator, shorthand, names));
const NoDuration = {
  empty: true,
  name: "",
  value: 0,
  fraction: [0, 0],
  shorthand: "",
  dots: "",
  names: []
};

function names() {
  return VALUES.reduce((names, duration) => {
    duration.names.forEach(name => names.push(name));
    return names;
  }, []);
}

function shorthands() {
  return VALUES.map(dur => dur.shorthand);
}

const REGEX = /^([^.]+)(\.*)$/;

function get(name) {
  const [_, simple, dots] = REGEX.exec(name) || [];
  const base = VALUES.find(dur => dur.shorthand === simple || dur.names.includes(simple));

  if (!base) {
    return NoDuration;
  }

  const fraction = calcDots(base.fraction, dots.length);
  const value = fraction[0] / fraction[1];
  return { ...base,
    name,
    dots,
    value,
    fraction
  };
}

const value = name => get(name).value;

exports.value = value;

const fraction = name => get(name).fraction;

exports.fraction = fraction;
var index = {
  names,
  shorthands,
  get,
  value,
  fraction
}; //// PRIVATE ////

function add(denominator, shorthand, names) {
  VALUES.push({
    empty: false,
    dots: "",
    name: "",
    value: 1 / denominator,
    fraction: denominator < 1 ? [1 / denominator, 1] : [1, denominator],
    shorthand,
    names
  });
}

function calcDots(fraction, dots) {
  const pow = Math.pow(2, dots);
  let numerator = fraction[0] * pow;
  let denominator = fraction[1] * pow;
  const base = numerator; // add fractions

  for (let i = 0; i < dots; i++) {
    numerator += base / Math.pow(2, i + 1);
  } // simplify


  while (numerator % 2 === 0 && denominator % 2 === 0) {
    numerator /= 2;
    denominator /= 2;
  }

  return [numerator, denominator];
}

var _default = index;
exports.default = _default;
},{}],"node_modules/@tonaljs/interval/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromSemitones = fromSemitones;
exports.invert = invert;
exports.names = names;
exports.simplify = simplify;
exports.transposeFifths = transposeFifths;
exports.substract = exports.semitones = exports.quality = exports.num = exports.name = exports.get = exports.distance = exports.default = exports.addTo = exports.add = void 0;

var _core = require("@tonaljs/core");

/**
 * Get the natural list of names
 */
function names() {
  return "1P 2M 3M 4P 5P 6m 7m".split(" ");
}
/**
 * Get properties of an interval
 *
 * @function
 * @example
 * Interval.get('P4') // => {"alt": 0,  "dir": 1,  "name": "4P", "num": 4, "oct": 0, "q": "P", "semitones": 5, "simple": 4, "step": 3, "type": "perfectable"}
 */


const get = _core.interval;
/**
 * Get name of an interval
 *
 * @function
 * @example
 * Interval.name('4P') // => "4P"
 * Interval.name('P4') // => "4P"
 * Interval.name('C4') // => ""
 */

exports.get = get;

const name = name => (0, _core.interval)(name).name;
/**
 * Get semitones of an interval
 * @function
 * @example
 * Interval.semitones('P4') // => 5
 */


exports.name = name;

const semitones = name => (0, _core.interval)(name).semitones;
/**
 * Get quality of an interval
 * @function
 * @example
 * Interval.quality('P4') // => "P"
 */


exports.semitones = semitones;

const quality = name => (0, _core.interval)(name).q;
/**
 * Get number of an interval
 * @function
 * @example
 * Interval.num('P4') // => 4
 */


exports.quality = quality;

const num = name => (0, _core.interval)(name).num;
/**
 * Get the simplified version of an interval.
 *
 * @function
 * @param {string} interval - the interval to simplify
 * @return {string} the simplified interval
 *
 * @example
 * Interval.simplify("9M") // => "2M"
 * Interval.simplify("2M") // => "2M"
 * Interval.simplify("-2M") // => "7m"
 * ["8P", "9M", "10M", "11P", "12P", "13M", "14M", "15P"].map(Interval.simplify)
 * // => [ "8P", "2M", "3M", "4P", "5P", "6M", "7M", "8P" ]
 */


exports.num = num;

function simplify(name) {
  const i = (0, _core.interval)(name);
  return i.empty ? "" : i.simple + i.q;
}
/**
 * Get the inversion (https://en.wikipedia.org/wiki/Inversion_(music)#Intervals)
 * of an interval.
 *
 * @function
 * @param {string} interval - the interval to invert in interval shorthand
 * notation or interval array notation
 * @return {string} the inverted interval
 *
 * @example
 * Interval.invert("3m") // => "6M"
 * Interval.invert("2M") // => "7m"
 */


function invert(name) {
  const i = (0, _core.interval)(name);

  if (i.empty) {
    return "";
  }

  const step = (7 - i.step) % 7;
  const alt = i.type === "perfectable" ? -i.alt : -(i.alt + 1);
  return (0, _core.interval)({
    step,
    alt,
    oct: i.oct,
    dir: i.dir
  }).name;
} // interval numbers


const IN = [1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7]; // interval qualities

const IQ = "P m M m M P d P m M m M".split(" ");
/**
 * Get interval name from semitones number. Since there are several interval
 * names for the same number, the name it's arbitrary, but deterministic.
 *
 * @param {Integer} num - the number of semitones (can be negative)
 * @return {string} the interval name
 * @example
 * Interval.fromSemitones(7) // => "5P"
 * Interval.fromSemitones(-7) // => "-5P"
 */

function fromSemitones(semitones) {
  const d = semitones < 0 ? -1 : 1;
  const n = Math.abs(semitones);
  const c = n % 12;
  const o = Math.floor(n / 12);
  return d * (IN[c] + 7 * o) + IQ[c];
}
/**
 * Find interval between two notes
 *
 * @example
 * Interval.distance("C4", "G4"); // => "5P"
 */


const distance = _core.distance;
/**
 * Adds two intervals
 *
 * @function
 * @param {string} interval1
 * @param {string} interval2
 * @return {string} the added interval name
 * @example
 * Interval.add("3m", "5P") // => "7m"
 */

exports.distance = distance;
const add = combinator((a, b) => [a[0] + b[0], a[1] + b[1]]);
/**
 * Returns a function that adds an interval
 *
 * @function
 * @example
 * ['1P', '2M', '3M'].map(Interval.addTo('5P')) // => ["5P", "6M", "7M"]
 */

exports.add = add;

const addTo = interval => other => add(interval, other);
/**
 * Subtracts two intervals
 *
 * @function
 * @param {string} minuendInterval
 * @param {string} subtrahendInterval
 * @return {string} the substracted interval name
 * @example
 * Interval.substract('5P', '3M') // => '3m'
 * Interval.substract('3M', '5P') // => '-3m'
 */


exports.addTo = addTo;
const substract = combinator((a, b) => [a[0] - b[0], a[1] - b[1]]);
exports.substract = substract;

function transposeFifths(interval, fifths) {
  const ivl = get(interval);
  if (ivl.empty) return "";
  const [nFifths, nOcts, dir] = ivl.coord;
  return (0, _core.coordToInterval)([nFifths + fifths, nOcts, dir]).name;
}

var index = {
  names,
  get,
  name,
  num,
  semitones,
  quality,
  fromSemitones,
  distance,
  invert,
  simplify,
  add,
  addTo,
  substract,
  transposeFifths
};
exports.default = index;

function combinator(fn) {
  return (a, b) => {
    const coordA = (0, _core.interval)(a).coord;
    const coordB = (0, _core.interval)(b).coord;

    if (coordA && coordB) {
      const coord = fn(coordA, coordB);
      return (0, _core.coordToInterval)(coord).name;
    }
  };
}
},{"@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js"}],"node_modules/@tonaljs/midi/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.freqToMidi = freqToMidi;
exports.isMidi = isMidi;
exports.midiToFreq = midiToFreq;
exports.midiToNoteName = midiToNoteName;
exports.toMidi = toMidi;
exports.default = void 0;

var _core = require("@tonaljs/core");

function isMidi(arg) {
  return +arg >= 0 && +arg <= 127;
}
/**
 * Get the note midi number (a number between 0 and 127)
 *
 * It returns undefined if not valid note name
 *
 * @function
 * @param {string|number} note - the note name or midi number
 * @return {Integer} the midi number or undefined if not valid note
 * @example
 * import { toMidi } from '@tonaljs/midi'
 * toMidi("C4") // => 60
 * toMidi(60) // => 60
 * toMidi('60') // => 60
 */


function toMidi(note$1) {
  if (isMidi(note$1)) {
    return +note$1;
  }

  const n = (0, _core.note)(note$1);
  return n.empty ? null : n.midi;
}
/**
 * Get the frequency in hertzs from midi number
 *
 * @param {number} midi - the note midi number
 * @param {number} [tuning = 440] - A4 tuning frequency in Hz (440 by default)
 * @return {number} the frequency or null if not valid note midi
 * @example
 * import { midiToFreq} from '@tonaljs/midi'
 * midiToFreq(69) // => 440
 */


function midiToFreq(midi, tuning = 440) {
  return Math.pow(2, (midi - 69) / 12) * tuning;
}

const L2 = Math.log(2);
const L440 = Math.log(440);
/**
 * Get the midi number from a frequency in hertz. The midi number can
 * contain decimals (with two digits precission)
 *
 * @param {number} frequency
 * @return {number}
 * @example
 * import { freqToMidi} from '@tonaljs/midi'
 * freqToMidi(220)); //=> 57
 * freqToMidi(261.62)); //=> 60
 * freqToMidi(261)); //=> 59.96
 */

function freqToMidi(freq) {
  const v = 12 * (Math.log(freq) - L440) / L2 + 69;
  return Math.round(v * 100) / 100;
}

const SHARPS = "C C# D D# E F F# G G# A A# B".split(" ");
const FLATS = "C Db D Eb E F Gb G Ab A Bb B".split(" ");
/**
 * Given a midi number, returns a note name. The altered notes will have
 * flats unless explicitly set with the optional `useSharps` parameter.
 *
 * @function
 * @param {number} midi - the midi note number
 * @param {Object} options = default: `{ sharps: false, pitchClass: false }`
 * @param {boolean} useSharps - (Optional) set to true to use sharps instead of flats
 * @return {string} the note name
 * @example
 * import { midiToNoteName } from '@tonaljs/midi'
 * midiToNoteName(61) // => "Db4"
 * midiToNoteName(61, { pitchClass: true }) // => "Db"
 * midiToNoteName(61, { sharps: true }) // => "C#4"
 * midiToNoteName(61, { pitchClass: true, sharps: true }) // => "C#"
 * // it rounds to nearest note
 * midiToNoteName(61.7) // => "D4"
 */

function midiToNoteName(midi, options = {}) {
  if (isNaN(midi) || midi === -Infinity || midi === Infinity) return "";
  midi = Math.round(midi);
  const pcs = options.sharps === true ? SHARPS : FLATS;
  const pc = pcs[midi % 12];

  if (options.pitchClass) {
    return pc;
  }

  const o = Math.floor(midi / 12) - 1;
  return pc + o;
}

var index = {
  isMidi,
  toMidi,
  midiToFreq,
  midiToNoteName,
  freqToMidi
};
exports.default = index;
},{"@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js"}],"node_modules/@tonaljs/note/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enharmonic = enharmonic;
exports.fromFreq = fromFreq;
exports.fromFreqSharps = fromFreqSharps;
exports.fromMidi = fromMidi;
exports.fromMidiSharps = fromMidiSharps;
exports.names = names;
exports.sortedNames = sortedNames;
exports.sortedUniqNames = sortedUniqNames;
exports.transposeFifths = transposeFifths;
exports.transposeFrom = exports.transposeBy = exports.transpose = exports.trFrom = exports.trFifths = exports.trBy = exports.tr = exports.simplify = exports.pitchClass = exports.octave = exports.name = exports.midi = exports.get = exports.freq = exports.descending = exports.default = exports.chroma = exports.ascending = exports.accidentals = void 0;

var _core = require("@tonaljs/core");

var _midi = require("@tonaljs/midi");

const NAMES = ["C", "D", "E", "F", "G", "A", "B"];

const toName = n => n.name;

const onlyNotes = array => array.map(_core.note).filter(n => !n.empty);
/**
 * Return the natural note names without octave
 * @function
 * @example
 * Note.names(); // => ["C", "D", "E", "F", "G", "A", "B"]
 */


function names(array) {
  if (array === undefined) {
    return NAMES.slice();
  } else if (!Array.isArray(array)) {
    return [];
  } else {
    return onlyNotes(array).map(toName);
  }
}
/**
 * Get a note from a note name
 *
 * @function
 * @example
 * Note.get('Bb4') // => { name: "Bb4", midi: 70, chroma: 10, ... }
 */


const get = _core.note;
/**
 * Get the note name
 * @function
 */

exports.get = get;

const name = note => get(note).name;
/**
 * Get the note pitch class name
 * @function
 */


exports.name = name;

const pitchClass = note => get(note).pc;
/**
 * Get the note accidentals
 * @function
 */


exports.pitchClass = pitchClass;

const accidentals = note => get(note).acc;
/**
 * Get the note octave
 * @function
 */


exports.accidentals = accidentals;

const octave = note => get(note).oct;
/**
 * Get the note midi
 * @function
 */


exports.octave = octave;

const midi = note => get(note).midi;
/**
 * Get the note midi
 * @function
 */


exports.midi = midi;

const freq = note => get(note).freq;
/**
 * Get the note chroma
 * @function
 */


exports.freq = freq;

const chroma = note => get(note).chroma;
/**
 * Given a midi number, returns a note name. Uses flats for altered notes.
 *
 * @function
 * @param {number} midi - the midi note number
 * @return {string} the note name
 * @example
 * Note.fromMidi(61) // => "Db4"
 * Note.fromMidi(61.7) // => "D4"
 */


exports.chroma = chroma;

function fromMidi(midi) {
  return (0, _midi.midiToNoteName)(midi);
}
/**
 * Given a midi number, returns a note name. Uses flats for altered notes.
 */


function fromFreq(freq) {
  return (0, _midi.midiToNoteName)((0, _midi.freqToMidi)(freq));
}
/**
 * Given a midi number, returns a note name. Uses flats for altered notes.
 */


function fromFreqSharps(freq) {
  return (0, _midi.midiToNoteName)((0, _midi.freqToMidi)(freq), {
    sharps: true
  });
}
/**
 * Given a midi number, returns a note name. Uses flats for altered notes.
 *
 * @function
 * @param {number} midi - the midi note number
 * @return {string} the note name
 * @example
 * Note.fromMidiSharps(61) // => "C#4"
 */


function fromMidiSharps(midi) {
  return (0, _midi.midiToNoteName)(midi, {
    sharps: true
  });
}
/**
 * Transpose a note by an interval
 */


const transpose = _core.transpose;
exports.transpose = transpose;
const tr = _core.transpose;
/**
 * Transpose by an interval.
 * @function
 * @param {string} interval
 * @return {function} a function that transposes by the given interval
 * @example
 * ["C", "D", "E"].map(Note.transposeBy("5P"));
 * // => ["G", "A", "B"]
 */

exports.tr = tr;

const transposeBy = interval => note => transpose(note, interval);

exports.transposeBy = transposeBy;
const trBy = transposeBy;
/**
 * Transpose from a note
 * @function
 * @param {string} note
 * @return {function}  a function that transposes the the note by an interval
 * ["1P", "3M", "5P"].map(Note.transposeFrom("C"));
 * // => ["C", "E", "G"]
 */

exports.trBy = trBy;

const transposeFrom = note => interval => transpose(note, interval);

exports.transposeFrom = transposeFrom;
const trFrom = transposeFrom;
/**
 * Transpose a note by a number of perfect fifths.
 *
 * @function
 * @param {string} note - the note name
 * @param {number} fifhts - the number of fifths
 * @return {string} the transposed note name
 *
 * @example
 * import { transposeFifths } from "@tonaljs/note"
 * transposeFifths("G4", 1) // => "D"
 * [0, 1, 2, 3, 4].map(fifths => transposeFifths("C", fifths)) // => ["C", "G", "D", "A", "E"]
 */

exports.trFrom = trFrom;

function transposeFifths(noteName, fifths) {
  const note = get(noteName);

  if (note.empty) {
    return "";
  }

  const [nFifths, nOcts] = note.coord;
  const transposed = nOcts === undefined ? (0, _core.coordToNote)([nFifths + fifths]) : (0, _core.coordToNote)([nFifths + fifths, nOcts]);
  return transposed.name;
}

const trFifths = transposeFifths;
exports.trFifths = trFifths;

const ascending = (a, b) => a.height - b.height;

exports.ascending = ascending;

const descending = (a, b) => b.height - a.height;

exports.descending = descending;

function sortedNames(notes, comparator) {
  comparator = comparator || ascending;
  return onlyNotes(notes).sort(comparator).map(toName);
}

function sortedUniqNames(notes) {
  return sortedNames(notes, ascending).filter((n, i, a) => i === 0 || n !== a[i - 1]);
}
/**
 * Simplify a note
 *
 * @function
 * @param {string} note - the note to be simplified
 * - sameAccType: default true. Use same kind of accidentals that source
 * @return {string} the simplified note or '' if not valid note
 * @example
 * simplify("C##") // => "D"
 * simplify("C###") // => "D#"
 * simplify("C###")
 * simplify("B#4") // => "C5"
 */


const simplify = noteName => {
  const note = get(noteName);

  if (note.empty) {
    return "";
  }

  return (0, _midi.midiToNoteName)(note.midi || note.chroma, {
    sharps: note.alt > 0,
    pitchClass: note.midi === null
  });
};
/**
 * Get enharmonic of a note
 *
 * @function
 * @param {string} note
 * @param [string] - [optional] Destination pitch class
 * @return {string} the enharmonic note name or '' if not valid note
 * @example
 * Note.enharmonic("Db") // => "C#"
 * Note.enharmonic("C") // => "C"
 * Note.enharmonic("F2","E#") // => "E#2"
 */


exports.simplify = simplify;

function enharmonic(noteName, destName) {
  const src = get(noteName);

  if (src.empty) {
    return "";
  } // destination: use given or generate one


  const dest = get(destName || (0, _midi.midiToNoteName)(src.midi || src.chroma, {
    sharps: src.alt < 0,
    pitchClass: true
  })); // ensure destination is valid

  if (dest.empty || dest.chroma !== src.chroma) {
    return "";
  } // if src has no octave, no need to calculate anything else


  if (src.oct === undefined) {
    return dest.pc;
  } // detect any octave overflow


  const srcChroma = src.chroma - src.alt;
  const destChroma = dest.chroma - dest.alt;
  const destOctOffset = srcChroma > 11 || destChroma < 0 ? -1 : srcChroma < 0 || destChroma > 11 ? +1 : 0; // calculate the new octave

  const destOct = src.oct + destOctOffset;
  return dest.pc + destOct;
}

var index = {
  names,
  get,
  name,
  pitchClass,
  accidentals,
  octave,
  midi,
  ascending,
  descending,
  sortedNames,
  sortedUniqNames,
  fromMidi,
  fromMidiSharps,
  freq,
  fromFreq,
  fromFreqSharps,
  chroma,
  transpose,
  tr,
  transposeBy,
  trBy,
  transposeFrom,
  trFrom,
  transposeFifths,
  trFifths,
  simplify,
  enharmonic
};
exports.default = index;
},{"@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/midi":"node_modules/@tonaljs/midi/dist/index.es.js"}],"node_modules/@tonaljs/roman-numeral/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.names = names;
exports.tokenize = tokenize;
exports.default = void 0;

var _core = require("@tonaljs/core");

const NoRomanNumeral = {
  empty: true,
  name: "",
  chordType: ""
};
const cache = {};
/**
 * Get properties of a roman numeral string
 *
 * @function
 * @param {string} - the roman numeral string (can have type, like: Imaj7)
 * @return {Object} - the roman numeral properties
 * @param {string} name - the roman numeral (tonic)
 * @param {string} type - the chord type
 * @param {string} num - the number (1 = I, 2 = II...)
 * @param {boolean} major - major or not
 *
 * @example
 * romanNumeral("VIIb5") // => { name: "VII", type: "b5", num: 7, major: true }
 */

function get(src) {
  return typeof src === "string" ? cache[src] || (cache[src] = parse(src)) : typeof src === "number" ? get(NAMES[src] || "") : (0, _core.isPitch)(src) ? fromPitch(src) : (0, _core.isNamed)(src) ? get(src.name) : NoRomanNumeral;
}

const romanNumeral = (0, _core.deprecate)("RomanNumeral.romanNumeral", "RomanNumeral.get", get);
/**
 * Get roman numeral names
 *
 * @function
 * @param {boolean} [isMajor=true]
 * @return {Array<String>}
 *
 * @example
 * names() // => ["I", "II", "III", "IV", "V", "VI", "VII"]
 */

function names(major = true) {
  return (major ? NAMES : NAMES_MINOR).slice();
}

function fromPitch(pitch) {
  return get((0, _core.altToAcc)(pitch.alt) + NAMES[pitch.step]);
}

const REGEX = /^(#{1,}|b{1,}|x{1,}|)(IV|I{1,3}|VI{0,2}|iv|i{1,3}|vi{0,2})([^IViv]*)$/;

function tokenize(str) {
  return REGEX.exec(str) || ["", "", "", ""];
}

const ROMANS = "I II III IV V VI VII";
const NAMES = ROMANS.split(" ");
const NAMES_MINOR = ROMANS.toLowerCase().split(" ");

function parse(src) {
  const [name, acc, roman, chordType] = tokenize(src);

  if (!roman) {
    return NoRomanNumeral;
  }

  const upperRoman = roman.toUpperCase();
  const step = NAMES.indexOf(upperRoman);
  const alt = (0, _core.accToAlt)(acc);
  const dir = 1;
  return {
    empty: false,
    name,
    roman,
    interval: (0, _core.interval)({
      step,
      alt,
      dir
    }).name,
    acc,
    chordType,
    alt,
    step,
    major: roman === upperRoman,
    oct: 0,
    dir
  };
}

var index = {
  names,
  get,
  // deprecated
  romanNumeral
};
exports.default = index;
},{"@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js"}],"node_modules/@tonaljs/key/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.majorKey = majorKey;
exports.majorTonicFromKeySignature = majorTonicFromKeySignature;
exports.minorKey = minorKey;
exports.default = void 0;

var _core = require("@tonaljs/core");

var _note = require("@tonaljs/note");

var _romanNumeral = require("@tonaljs/roman-numeral");

const Empty = Object.freeze([]);
const NoKey = {
  type: "major",
  tonic: "",
  alteration: 0,
  keySignature: ""
};
const NoKeyScale = {
  tonic: "",
  grades: Empty,
  intervals: Empty,
  scale: Empty,
  chords: Empty,
  chordsHarmonicFunction: Empty,
  chordScales: Empty
};
const NoMajorKey = { ...NoKey,
  ...NoKeyScale,
  type: "major",
  minorRelative: "",
  scale: Empty,
  secondaryDominants: Empty,
  secondaryDominantsMinorRelative: Empty,
  substituteDominants: Empty,
  substituteDominantsMinorRelative: Empty
};
const NoMinorKey = { ...NoKey,
  type: "minor",
  relativeMajor: "",
  natural: NoKeyScale,
  harmonic: NoKeyScale,
  melodic: NoKeyScale
};

const mapScaleToType = (scale, list, sep = "") => list.map((type, i) => `${scale[i]}${sep}${type}`);

function keyScale(grades, chords, harmonicFunctions, chordScales) {
  return tonic => {
    const intervals = grades.map(gr => (0, _romanNumeral.get)(gr).interval || "");
    const scale = intervals.map(interval => (0, _core.transpose)(tonic, interval));
    return {
      tonic,
      grades,
      intervals,
      scale,
      chords: mapScaleToType(scale, chords),
      chordsHarmonicFunction: harmonicFunctions.slice(),
      chordScales: mapScaleToType(scale, chordScales, " ")
    };
  };
}

const distInFifths = (from, to) => {
  const f = (0, _core.note)(from);
  const t = (0, _core.note)(to);
  return f.empty || t.empty ? 0 : t.coord[0] - f.coord[0];
};

const MajorScale = keyScale("I II III IV V VI VII".split(" "), "maj7 m7 m7 maj7 7 m7 m7b5".split(" "), "T SD T SD D T D".split(" "), "major,dorian,phrygian,lydian,mixolydian,minor,locrian".split(","));
const NaturalScale = keyScale("I II bIII IV V bVI bVII".split(" "), "m7 m7b5 maj7 m7 m7 maj7 7".split(" "), "T SD T SD D SD SD".split(" "), "minor,locrian,major,dorian,phrygian,lydian,mixolydian".split(","));
const HarmonicScale = keyScale("I II bIII IV V bVI VII".split(" "), "mMaj7 m7b5 +maj7 m7 7 maj7 o7".split(" "), "T SD T SD D SD D".split(" "), "harmonic minor,locrian 6,major augmented,lydian diminished,phrygian dominant,lydian #9,ultralocrian".split(","));
const MelodicScale = keyScale("I II bIII IV V VI VII".split(" "), "m6 m7 +maj7 7 7 m7b5 m7b5".split(" "), "T SD T SD D  ".split(" "), "melodic minor,dorian b2,lydian augmented,lydian dominant,mixolydian b6,locrian #2,altered".split(","));
/**
 * Get a major key properties in a given tonic
 * @param tonic
 */

function majorKey(tonic) {
  const pc = (0, _core.note)(tonic).pc;
  if (!pc) return NoMajorKey;
  const keyScale = MajorScale(pc);
  const alteration = distInFifths("C", pc);

  const romanInTonic = src => {
    const r = (0, _romanNumeral.get)(src);
    if (r.empty) return "";
    return (0, _core.transpose)(tonic, r.interval) + r.chordType;
  };

  return { ...keyScale,
    type: "major",
    minorRelative: (0, _core.transpose)(pc, "-3m"),
    alteration,
    keySignature: (0, _core.altToAcc)(alteration),
    secondaryDominants: "- VI7 VII7 I7 II7 III7 -".split(" ").map(romanInTonic),
    secondaryDominantsMinorRelative: "- IIIm7b5 IV#m7 Vm7 VIm7 VIIm7b5 -".split(" ").map(romanInTonic),
    substituteDominants: "- bIII7 IV7 bV7 bVI7 bVII7 -".split(" ").map(romanInTonic),
    substituteDominantsMinorRelative: "- IIIm7 Im7 IIbm7 VIm7 IVm7 -".split(" ").map(romanInTonic)
  };
}
/**
 * Get minor key properties in a given tonic
 * @param tonic
 */


function minorKey(tnc) {
  const pc = (0, _core.note)(tnc).pc;
  if (!pc) return NoMinorKey;
  const alteration = distInFifths("C", pc) - 3;
  return {
    type: "minor",
    tonic: pc,
    relativeMajor: (0, _core.transpose)(pc, "3m"),
    alteration,
    keySignature: (0, _core.altToAcc)(alteration),
    natural: NaturalScale(pc),
    harmonic: HarmonicScale(pc),
    melodic: MelodicScale(pc)
  };
}
/**
 * Given a key signature, returns the tonic of the major key
 * @param sigature
 * @example
 * majorTonicFromKeySignature('###') // => 'A'
 */


function majorTonicFromKeySignature(sig) {
  if (typeof sig === "number") {
    return (0, _note.transposeFifths)("C", sig);
  } else if (typeof sig === "string" && /^b+|#+$/.test(sig)) {
    return (0, _note.transposeFifths)("C", (0, _core.accToAlt)(sig));
  }

  return null;
}

var index = {
  majorKey,
  majorTonicFromKeySignature,
  minorKey
};
exports.default = index;
},{"@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/note":"node_modules/@tonaljs/note/dist/index.es.js","@tonaljs/roman-numeral":"node_modules/@tonaljs/roman-numeral/dist/index.es.js"}],"node_modules/@tonaljs/mode/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.all = all;
exports.distance = distance;
exports.get = get;
exports.names = names;
exports.notes = notes;
exports.relativeTonic = relativeTonic;
exports.triads = exports.seventhChords = exports.mode = exports.entries = exports.default = void 0;

var _collection = require("@tonaljs/collection");

var _core = require("@tonaljs/core");

var _interval = require("@tonaljs/interval");

var _pcset = require("@tonaljs/pcset");

var _scaleType = require("@tonaljs/scale-type");

const MODES = [[0, 2773, 0, "ionian", "", "Maj7", "major"], [1, 2902, 2, "dorian", "m", "m7"], [2, 3418, 4, "phrygian", "m", "m7"], [3, 2741, -1, "lydian", "", "Maj7"], [4, 2774, 1, "mixolydian", "", "7"], [5, 2906, 3, "aeolian", "m", "m7", "minor"], [6, 3434, 5, "locrian", "dim", "m7b5"]];
const NoMode = { ..._pcset.EmptyPcset,
  name: "",
  alt: 0,
  modeNum: NaN,
  triad: "",
  seventh: "",
  aliases: []
};
const modes = MODES.map(toMode);
const index = {};
modes.forEach(mode => {
  index[mode.name] = mode;
  mode.aliases.forEach(alias => {
    index[alias] = mode;
  });
});
/**
 * Get a Mode by it's name
 *
 * @example
 * get('dorian')
 * // =>
 * // {
 * //   intervals: [ '1P', '2M', '3m', '4P', '5P', '6M', '7m' ],
 * //   modeNum: 1,
 * //   chroma: '101101010110',
 * //   normalized: '101101010110',
 * //   name: 'dorian',
 * //   setNum: 2902,
 * //   alt: 2,
 * //   triad: 'm',
 * //   seventh: 'm7',
 * //   aliases: []
 * // }
 */

function get(name) {
  return typeof name === "string" ? index[name.toLowerCase()] || NoMode : name && name.name ? get(name.name) : NoMode;
}

const mode = (0, _core.deprecate)("Mode.mode", "Mode.get", get);
/**
 * Get a list of all modes
 */

exports.mode = mode;

function all() {
  return modes.slice();
}

const entries = (0, _core.deprecate)("Mode.mode", "Mode.all", all);
/**
 * Get a list of all mode names
 */

exports.entries = entries;

function names() {
  return modes.map(mode => mode.name);
}

function toMode(mode) {
  const [modeNum, setNum, alt, name, triad, seventh, alias] = mode;
  const aliases = alias ? [alias] : [];
  const chroma = Number(setNum).toString(2);
  const intervals = (0, _scaleType.get)(name).intervals;
  return {
    empty: false,
    intervals,
    modeNum,
    chroma,
    normalized: chroma,
    name,
    setNum,
    alt,
    triad,
    seventh,
    aliases
  };
}

function notes(modeName, tonic) {
  return get(modeName).intervals.map(ivl => (0, _core.transpose)(tonic, ivl));
}

function chords(chords) {
  return (modeName, tonic) => {
    const mode = get(modeName);
    if (mode.empty) return [];
    const triads = (0, _collection.rotate)(mode.modeNum, chords);
    const tonics = mode.intervals.map(i => (0, _core.transpose)(tonic, i));
    return triads.map((triad, i) => tonics[i] + triad);
  };
}

const triads = chords(MODES.map(x => x[4]));
exports.triads = triads;
const seventhChords = chords(MODES.map(x => x[5]));
exports.seventhChords = seventhChords;

function distance(destination, source) {
  const from = get(source);
  const to = get(destination);
  if (from.empty || to.empty) return "";
  return (0, _interval.simplify)((0, _interval.transposeFifths)("1P", to.alt - from.alt));
}

function relativeTonic(destination, source, tonic) {
  return (0, _core.transpose)(tonic, distance(destination, source));
}

var index$1 = {
  get,
  names,
  all,
  distance,
  relativeTonic,
  notes,
  triads,
  seventhChords,
  // deprecated
  entries,
  mode
};
exports.default = index$1;
},{"@tonaljs/collection":"node_modules/@tonaljs/collection/dist/index.es.js","@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/interval":"node_modules/@tonaljs/interval/dist/index.es.js","@tonaljs/pcset":"node_modules/@tonaljs/pcset/dist/index.es.js","@tonaljs/scale-type":"node_modules/@tonaljs/scale-type/dist/index.es.js"}],"node_modules/@tonaljs/progression/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromRomanNumerals = fromRomanNumerals;
exports.toRomanNumerals = toRomanNumerals;
exports.default = void 0;

var _chord = require("@tonaljs/chord");

var _core = require("@tonaljs/core");

var _romanNumeral = require("@tonaljs/roman-numeral");

/**
 * Given a tonic and a chord list expressed with roman numeral notation
 * returns the progression expressed with leadsheet chords symbols notation
 * @example
 * fromRomanNumerals("C", ["I", "IIm7", "V7"]);
 * // => ["C", "Dm7", "G7"]
 */
function fromRomanNumerals(tonic, chords) {
  const romanNumerals = chords.map(_romanNumeral.get);
  return romanNumerals.map(rn => (0, _core.transpose)(tonic, (0, _core.interval)(rn)) + rn.chordType);
}
/**
 * Given a tonic and a chord list with leadsheet symbols notation,
 * return the chord list with roman numeral notation
 * @example
 * toRomanNumerals("C", ["CMaj7", "Dm7", "G7"]);
 * // => ["IMaj7", "IIm7", "V7"]
 */


function toRomanNumerals(tonic, chords) {
  return chords.map(chord => {
    const [note, chordType] = (0, _chord.tokenize)(chord);
    const intervalName = (0, _core.distance)(tonic, note);
    const roman = (0, _romanNumeral.get)((0, _core.interval)(intervalName));
    return roman.name + chordType;
  });
}

var index = {
  fromRomanNumerals,
  toRomanNumerals
};
exports.default = index;
},{"@tonaljs/chord":"node_modules/@tonaljs/chord/dist/index.es.js","@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/roman-numeral":"node_modules/@tonaljs/roman-numeral/dist/index.es.js"}],"node_modules/@tonaljs/range/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chromatic = chromatic;
exports.numeric = numeric;
exports.default = void 0;

var _collection = require("@tonaljs/collection");

var _midi = require("@tonaljs/midi");

/**
 * Create a numeric range. You supply a list of notes or numbers and it will
 * be connected to create complex ranges.
 *
 * @param {Array} notes - the list of notes or midi numbers used
 * @return {Array} an array of numbers or empty array if not valid parameters
 *
 * @example
 * numeric(["C5", "C4"]) // => [ 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60 ]
 * // it works midi notes
 * numeric([10, 5]) // => [ 10, 9, 8, 7, 6, 5 ]
 * // complex range
 * numeric(["C4", "E4", "Bb3"]) // => [60, 61, 62, 63, 64, 63, 62, 61, 60, 59, 58]
 */
function numeric(notes) {
  const midi = (0, _collection.compact)(notes.map(_midi.toMidi));

  if (!notes.length || midi.length !== notes.length) {
    // there is no valid notes
    return [];
  }

  return midi.reduce((result, note) => {
    const last = result[result.length - 1];
    return result.concat((0, _collection.range)(last, note).slice(1));
  }, [midi[0]]);
}
/**
 * Create a range of chromatic notes. The altered notes will use flats.
 *
 * @function
 * @param {Array} notes - the list of notes or midi note numbers to create a range from
 * @param {Object} options - The same as `midiToNoteName` (`{ sharps: boolean, pitchClass: boolean }`)
 * @return {Array} an array of note names
 *
 * @example
 * Range.chromatic(["C2, "E2", "D2"]) // => ["C2", "Db2", "D2", "Eb2", "E2", "Eb2", "D2"]
 * // with sharps
 * Range.chromatic(["C2", "C3"], { sharps: true }) // => [ "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3" ]
 */


function chromatic(notes, options) {
  return numeric(notes).map(midi => (0, _midi.midiToNoteName)(midi, options));
}

var index = {
  numeric,
  chromatic
};
exports.default = index;
},{"@tonaljs/collection":"node_modules/@tonaljs/collection/dist/index.es.js","@tonaljs/midi":"node_modules/@tonaljs/midi/dist/index.es.js"}],"node_modules/@tonaljs/scale/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extended = extended;
exports.get = get;
exports.modeNames = modeNames;
exports.rangeOf = rangeOf;
exports.reduced = reduced;
exports.scaleChords = scaleChords;
exports.scaleNotes = scaleNotes;
exports.tokenize = tokenize;
exports.scale = exports.names = exports.default = void 0;

var _chordType = require("@tonaljs/chord-type");

var _collection = require("@tonaljs/collection");

var _core = require("@tonaljs/core");

var _note = require("@tonaljs/note");

var _pcset = require("@tonaljs/pcset");

var _scaleType = require("@tonaljs/scale-type");

/**
 * References:
 * - https://www.researchgate.net/publication/327567188_An_Algorithm_for_Spelling_the_Pitches_of_Any_Musical_Scale
 * @module scale
 */
const NoScale = {
  empty: true,
  name: "",
  type: "",
  tonic: null,
  setNum: NaN,
  chroma: "",
  normalized: "",
  aliases: [],
  notes: [],
  intervals: []
};
/**
 * Given a string with a scale name and (optionally) a tonic, split
 * that components.
 *
 * It retuns an array with the form [ name, tonic ] where tonic can be a
 * note name or null and name can be any arbitrary string
 * (this function doesn"t check if that scale name exists)
 *
 * @function
 * @param {string} name - the scale name
 * @return {Array} an array [tonic, name]
 * @example
 * tokenize("C mixolydean") // => ["C", "mixolydean"]
 * tokenize("anything is valid") // => ["", "anything is valid"]
 * tokenize() // => ["", ""]
 */

function tokenize(name) {
  if (typeof name !== "string") {
    return ["", ""];
  }

  const i = name.indexOf(" ");
  const tonic = (0, _core.note)(name.substring(0, i));

  if (tonic.empty) {
    const n = (0, _core.note)(name);
    return n.empty ? ["", name] : [n.name, ""];
  }

  const type = name.substring(tonic.name.length + 1);
  return [tonic.name, type.length ? type : ""];
}
/**
 * Get all scale names
 * @function
 */


const names = _scaleType.names;
/**
 * Get a Scale from a scale name.
 */

exports.names = names;

function get(src) {
  const tokens = Array.isArray(src) ? src : tokenize(src);
  const tonic = (0, _core.note)(tokens[0]).name;
  const st = (0, _scaleType.get)(tokens[1]);

  if (st.empty) {
    return NoScale;
  }

  const type = st.name;
  const notes = tonic ? st.intervals.map(i => (0, _core.transpose)(tonic, i)) : [];
  const name = tonic ? tonic + " " + type : type;
  return { ...st,
    name,
    type,
    tonic,
    notes
  };
}

const scale = (0, _core.deprecate)("Scale.scale", "Scale.get", get);
/**
 * Get all chords that fits a given scale
 *
 * @function
 * @param {string} name - the scale name
 * @return {Array<string>} - the chord names
 *
 * @example
 * scaleChords("pentatonic") // => ["5", "64", "M", "M6", "Madd9", "Msus2"]
 */

exports.scale = scale;

function scaleChords(name) {
  const s = get(name);
  const inScale = (0, _pcset.isSubsetOf)(s.chroma);
  return (0, _chordType.all)().filter(chord => inScale(chord.chroma)).map(chord => chord.aliases[0]);
}
/**
 * Get all scales names that are a superset of the given one
 * (has the same notes and at least one more)
 *
 * @function
 * @param {string} name
 * @return {Array} a list of scale names
 * @example
 * extended("major") // => ["bebop", "bebop dominant", "bebop major", "chromatic", "ichikosucho"]
 */


function extended(name) {
  const s = get(name);
  const isSuperset = (0, _pcset.isSupersetOf)(s.chroma);
  return (0, _scaleType.all)().filter(scale => isSuperset(scale.chroma)).map(scale => scale.name);
}
/**
 * Find all scales names that are a subset of the given one
 * (has less notes but all from the given scale)
 *
 * @function
 * @param {string} name
 * @return {Array} a list of scale names
 *
 * @example
 * reduced("major") // => ["ionian pentatonic", "major pentatonic", "ritusen"]
 */


function reduced(name) {
  const isSubset = (0, _pcset.isSubsetOf)(get(name).chroma);
  return (0, _scaleType.all)().filter(scale => isSubset(scale.chroma)).map(scale => scale.name);
}
/**
 * Given an array of notes, return the scale: a pitch class set starting from
 * the first note of the array
 *
 * @function
 * @param {string[]} notes
 * @return {string[]} pitch classes with same tonic
 * @example
 * scaleNotes(['C4', 'c3', 'C5', 'C4', 'c4']) // => ["C"]
 * scaleNotes(['D4', 'c#5', 'A5', 'F#6']) // => ["D", "F#", "A", "C#"]
 */


function scaleNotes(notes) {
  const pcset = notes.map(n => (0, _core.note)(n).pc).filter(x => x);
  const tonic = pcset[0];
  const scale = (0, _note.sortedUniqNames)(pcset);
  return (0, _collection.rotate)(scale.indexOf(tonic), scale);
}
/**
 * Find mode names of a scale
 *
 * @function
 * @param {string} name - scale name
 * @example
 * modeNames("C pentatonic") // => [
 *   ["C", "major pentatonic"],
 *   ["D", "egyptian"],
 *   ["E", "malkos raga"],
 *   ["G", "ritusen"],
 *   ["A", "minor pentatonic"]
 * ]
 */


function modeNames(name) {
  const s = get(name);

  if (s.empty) {
    return [];
  }

  const tonics = s.tonic ? s.notes : s.intervals;
  return (0, _pcset.modes)(s.chroma).map((chroma, i) => {
    const modeName = get(chroma).name;
    return modeName ? [tonics[i], modeName] : ["", ""];
  }).filter(x => x[0]);
}

function getNoteNameOf(scale) {
  const names = Array.isArray(scale) ? scaleNotes(scale) : get(scale).notes;
  const chromas = names.map(name => (0, _core.note)(name).chroma);
  return noteOrMidi => {
    const currNote = typeof noteOrMidi === "number" ? (0, _core.note)((0, _note.fromMidi)(noteOrMidi)) : (0, _core.note)(noteOrMidi);
    const height = currNote.height;
    if (height === undefined) return undefined;
    const chroma = height % 12;
    const position = chromas.indexOf(chroma);
    if (position === -1) return undefined;
    return (0, _note.enharmonic)(currNote.name, names[position]);
  };
}

function rangeOf(scale) {
  const getName = getNoteNameOf(scale);
  return (fromNote, toNote) => {
    const from = (0, _core.note)(fromNote).height;
    const to = (0, _core.note)(toNote).height;
    if (from === undefined || to === undefined) return [];
    return (0, _collection.range)(from, to).map(getName).filter(x => x);
  };
}

var index = {
  get,
  names,
  extended,
  modeNames,
  reduced,
  scaleChords,
  scaleNotes,
  tokenize,
  rangeOf,
  // deprecated
  scale
};
exports.default = index;
},{"@tonaljs/chord-type":"node_modules/@tonaljs/chord-type/dist/index.es.js","@tonaljs/collection":"node_modules/@tonaljs/collection/dist/index.es.js","@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/note":"node_modules/@tonaljs/note/dist/index.es.js","@tonaljs/pcset":"node_modules/@tonaljs/pcset/dist/index.es.js","@tonaljs/scale-type":"node_modules/@tonaljs/scale-type/dist/index.es.js"}],"node_modules/@tonaljs/time-signature/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.names = names;
exports.parse = parse;
exports.default = void 0;
// CONSTANTS
const NONE = {
  empty: true,
  name: "",
  upper: undefined,
  lower: undefined,
  type: undefined,
  additive: []
};
const NAMES = ["4/4", "3/4", "2/4", "2/2", "12/8", "9/8", "6/8", "3/8"]; // PUBLIC API

function names() {
  return NAMES.slice();
}

const REGEX = /^(\d?\d(?:\+\d)*)\/(\d)$/;
const CACHE = new Map();

function get(literal) {
  const cached = CACHE.get(literal);

  if (cached) {
    return cached;
  }

  const ts = build(parse(literal));
  CACHE.set(literal, ts);
  return ts;
}

function parse(literal) {
  if (typeof literal === "string") {
    const [_, up, low] = REGEX.exec(literal) || [];
    return parse([up, low]);
  }

  const [up, down] = literal;
  const denominator = +down;

  if (typeof up === "number") {
    return [up, denominator];
  }

  const list = up.split("+").map(n => +n);
  return list.length === 1 ? [list[0], denominator] : [list, denominator];
}

var index = {
  names,
  parse,
  get
}; // PRIVATE

function build([up, down]) {
  const upper = Array.isArray(up) ? up.reduce((a, b) => a + b, 0) : up;
  const lower = down;

  if (upper === 0 || lower === 0) {
    return NONE;
  }

  const name = Array.isArray(up) ? `${up.join("+")}/${down}` : `${up}/${down}`;
  const additive = Array.isArray(up) ? up : [];
  const type = lower === 4 || lower === 2 ? "simple" : lower === 8 && upper % 3 === 0 ? "compound" : "irregular";
  return {
    empty: false,
    name,
    type,
    upper,
    lower,
    additive
  };
}

var _default = index;
exports.default = _default;
},{}],"node_modules/@tonaljs/tonal/dist/index.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  ChordDictionary: true,
  PcSet: true,
  ScaleDictionary: true,
  Tonal: true,
  AbcNotation: true,
  Array: true,
  Chord: true,
  ChordType: true,
  Collection: true,
  Core: true,
  DurationValue: true,
  Interval: true,
  Key: true,
  Midi: true,
  Mode: true,
  Note: true,
  Pcset: true,
  Progression: true,
  Range: true,
  RomanNumeral: true,
  Scale: true,
  ScaleType: true,
  TimeSignature: true
};
Object.defineProperty(exports, "AbcNotation", {
  enumerable: true,
  get: function () {
    return _abcNotation.default;
  }
});
Object.defineProperty(exports, "Chord", {
  enumerable: true,
  get: function () {
    return _chord.default;
  }
});
Object.defineProperty(exports, "ChordType", {
  enumerable: true,
  get: function () {
    return _chordType.default;
  }
});
Object.defineProperty(exports, "Collection", {
  enumerable: true,
  get: function () {
    return _collection.default;
  }
});
Object.defineProperty(exports, "DurationValue", {
  enumerable: true,
  get: function () {
    return _durationValue.default;
  }
});
Object.defineProperty(exports, "Interval", {
  enumerable: true,
  get: function () {
    return _interval.default;
  }
});
Object.defineProperty(exports, "Key", {
  enumerable: true,
  get: function () {
    return _key.default;
  }
});
Object.defineProperty(exports, "Midi", {
  enumerable: true,
  get: function () {
    return _midi.default;
  }
});
Object.defineProperty(exports, "Mode", {
  enumerable: true,
  get: function () {
    return _mode.default;
  }
});
Object.defineProperty(exports, "Note", {
  enumerable: true,
  get: function () {
    return _note.default;
  }
});
Object.defineProperty(exports, "Pcset", {
  enumerable: true,
  get: function () {
    return _pcset.default;
  }
});
Object.defineProperty(exports, "Progression", {
  enumerable: true,
  get: function () {
    return _progression.default;
  }
});
Object.defineProperty(exports, "Range", {
  enumerable: true,
  get: function () {
    return _range.default;
  }
});
Object.defineProperty(exports, "RomanNumeral", {
  enumerable: true,
  get: function () {
    return _romanNumeral.default;
  }
});
Object.defineProperty(exports, "Scale", {
  enumerable: true,
  get: function () {
    return _scale.default;
  }
});
Object.defineProperty(exports, "ScaleType", {
  enumerable: true,
  get: function () {
    return _scaleType.default;
  }
});
Object.defineProperty(exports, "TimeSignature", {
  enumerable: true,
  get: function () {
    return _timeSignature.default;
  }
});
exports.Core = exports.Array = exports.Tonal = exports.ScaleDictionary = exports.PcSet = exports.ChordDictionary = void 0;

var _abcNotation = _interopRequireDefault(require("@tonaljs/abc-notation"));

var array = _interopRequireWildcard(require("@tonaljs/array"));

exports.Array = array;

var _chord = _interopRequireDefault(require("@tonaljs/chord"));

var _chordType = _interopRequireDefault(require("@tonaljs/chord-type"));

var _collection = _interopRequireDefault(require("@tonaljs/collection"));

var Core = _interopRequireWildcard(require("@tonaljs/core"));

exports.Core = Core;
Object.keys(Core).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === Core[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return Core[key];
    }
  });
});

var _durationValue = _interopRequireDefault(require("@tonaljs/duration-value"));

var _interval = _interopRequireDefault(require("@tonaljs/interval"));

var _key = _interopRequireDefault(require("@tonaljs/key"));

var _midi = _interopRequireDefault(require("@tonaljs/midi"));

var _mode = _interopRequireDefault(require("@tonaljs/mode"));

var _note = _interopRequireDefault(require("@tonaljs/note"));

var _pcset = _interopRequireDefault(require("@tonaljs/pcset"));

var _progression = _interopRequireDefault(require("@tonaljs/progression"));

var _range = _interopRequireDefault(require("@tonaljs/range"));

var _romanNumeral = _interopRequireDefault(require("@tonaljs/roman-numeral"));

var _scale = _interopRequireDefault(require("@tonaljs/scale"));

var _scaleType = _interopRequireDefault(require("@tonaljs/scale-type"));

var _timeSignature = _interopRequireDefault(require("@tonaljs/time-signature"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// deprecated (backwards compatibility)
const Tonal = Core;
exports.Tonal = Tonal;
const PcSet = _pcset.default;
exports.PcSet = PcSet;
const ChordDictionary = _chordType.default;
exports.ChordDictionary = ChordDictionary;
const ScaleDictionary = _scaleType.default;
exports.ScaleDictionary = ScaleDictionary;
},{"@tonaljs/abc-notation":"node_modules/@tonaljs/abc-notation/dist/index.es.js","@tonaljs/array":"node_modules/@tonaljs/array/dist/index.es.js","@tonaljs/chord":"node_modules/@tonaljs/chord/dist/index.es.js","@tonaljs/chord-type":"node_modules/@tonaljs/chord-type/dist/index.es.js","@tonaljs/collection":"node_modules/@tonaljs/collection/dist/index.es.js","@tonaljs/core":"node_modules/@tonaljs/core/dist/index.es.js","@tonaljs/duration-value":"node_modules/@tonaljs/duration-value/dist/index.es.js","@tonaljs/interval":"node_modules/@tonaljs/interval/dist/index.es.js","@tonaljs/key":"node_modules/@tonaljs/key/dist/index.es.js","@tonaljs/midi":"node_modules/@tonaljs/midi/dist/index.es.js","@tonaljs/mode":"node_modules/@tonaljs/mode/dist/index.es.js","@tonaljs/note":"node_modules/@tonaljs/note/dist/index.es.js","@tonaljs/pcset":"node_modules/@tonaljs/pcset/dist/index.es.js","@tonaljs/progression":"node_modules/@tonaljs/progression/dist/index.es.js","@tonaljs/range":"node_modules/@tonaljs/range/dist/index.es.js","@tonaljs/roman-numeral":"node_modules/@tonaljs/roman-numeral/dist/index.es.js","@tonaljs/scale":"node_modules/@tonaljs/scale/dist/index.es.js","@tonaljs/scale-type":"node_modules/@tonaljs/scale-type/dist/index.es.js","@tonaljs/time-signature":"node_modules/@tonaljs/time-signature/dist/index.es.js"}],"src/chord-display/keyboard.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setAccidentalKeyboard = setAccidentalKeyboard;
exports.generateKeyboard = generateKeyboard;
exports.generateKeyboard2 = generateKeyboard2;
exports.setPitchWheel = setPitchWheel;
exports.setModWheel = setModWheel;
exports.render = render;
exports.renderAccidental = renderAccidental;

var _note = _interopRequireDefault(require("tonal/note"));

var _utils = require("./utils");

var _settings = require("./settings");

var _tonal = require("@tonaljs/tonal");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var keyboardContainer = document.getElementById("keyboard");
var keyboardContainer2 = document.getElementById("keyboardNotes");
var notesDisplay = document.getElementById("notesDisplay");
var NOTE_RADIUS = 5;
var NOTE_WHITE_WIDTH = 40; //const NOTE_WHITE_HEIGHT = 150;

var NOTE_WHITE_HEIGHT = 180; //const NOTE_BLACK_WIDTH = 22;

var NOTE_BLACK_WIDTH = 24; //const NOTE_BLACK_HEIGHT = 90;

var NOTE_BLACK_HEIGHT = 120;
var NOTE_TONIC_RADIUS = 5;
var NOTE_TONIC_BOTTOM_OFFSET = 30;
var NOTE_NAME_BOTTOM_OFFSET = 2;
var WHEEL_RADIUS = 10;
var WHEEL_PADDING = 5;
var WHEEL_MARGIN = 10;
var WHEEL_WIDTH = NOTE_WHITE_WIDTH;
var WHEEL_HEIGHT = NOTE_WHITE_HEIGHT;
var WHEEL_AMPLITUDE = 2 * WHEEL_HEIGHT - 80;
var WHEEL_SOCKET_BASE_COLOR = "#222222";
var showSharp = true;

var NOTE_WHITE_TEMPLATE = function NOTE_WHITE_TEMPLATE(props, posX, color) {
  return "\n<g id=\"note-".concat(props.midi, "\" class=\"note white\" transform=\"translate(").concat(posX, ",0)\" style=\"color: ").concat(color, ";\" \n    >\n  <rect class=\"piano-key\" width=\"").concat(NOTE_WHITE_WIDTH, "\" height=\"").concat(NOTE_WHITE_HEIGHT + NOTE_RADIUS, "\" x=\"0\" y=\"").concat(-NOTE_RADIUS, "\" rx=\"").concat(NOTE_RADIUS, "\" ry=\"").concat(NOTE_RADIUS, "\"></rect>\n  <circle class=\"piano-tonic\" cx=\"").concat(NOTE_WHITE_WIDTH / 2, "\" cy=\"").concat(NOTE_WHITE_HEIGHT - NOTE_TONIC_BOTTOM_OFFSET, "\" r=\"").concat(NOTE_TONIC_RADIUS, "\"></circle>\n\n<text class=\"piano-key-name\" x=\"").concat(NOTE_WHITE_WIDTH / 2, "\" y=\"").concat(NOTE_WHITE_HEIGHT - NOTE_NAME_BOTTOM_OFFSET, "\" text-anchor=\"middle\">").concat(props.name, "</text>\n</g>\n\n");
};

var NOTE_BLACK_TEMPLATE = function NOTE_BLACK_TEMPLATE(props, posX, color) {
  return "<g id=\"note-".concat(props.midi, "\" class=\"note black\" transform=\"translate(").concat(posX - NOTE_BLACK_WIDTH / 2, ",0)\" style=\"color: ").concat(color, ";\">\n  <rect class=\"piano-key\" width=\"").concat(NOTE_BLACK_WIDTH, "\" height=\"").concat(NOTE_BLACK_HEIGHT + NOTE_RADIUS, "\" x=\"0\" y=\"").concat(-NOTE_RADIUS, "\" rx=\"").concat(NOTE_RADIUS, "\" ry=\"").concat(NOTE_RADIUS, "\"></rect>\n  <circle class=\"piano-tonic\" cx=\"").concat(NOTE_BLACK_WIDTH / 2, "\" cy=\"").concat(NOTE_BLACK_HEIGHT - NOTE_TONIC_BOTTOM_OFFSET, "\" r=\"").concat(NOTE_TONIC_RADIUS, "\"></circle>\n</g>");
};

var blackKeyXPos = NOTE_WHITE_WIDTH / 2 - 10;

var NOTE_NAME_TEMPLATE = function NOTE_NAME_TEMPLATE(props, posX, color) {
  return "\n<g id=\"note-".concat(props.midi, "-display\" class=\"note display\" transform=\"translate(").concat(posX, ",0)\" style=\"color: white;\" \n>\n<text class=\"piano-key-name-played-notes\" x=\"").concat(blackKeyXPos, "\" y=\"").concat(NOTE_WHITE_HEIGHT - NOTE_NAME_BOTTOM_OFFSET - 140, "\" text-anchor=\"middle\">").concat(_tonal.Midi.midiToNoteName(props.midi, {
    pitchClass: true,
    sharps: showSharp
  }), "</text>\n</g>\n");
}; //}" text-anchor="middle">${props.name.replace(/[0-9]/g, "")}</text>


var WHEEL_TEMPLATE = function WHEEL_TEMPLATE(id, offsetX) {
  return "<g id=\"".concat(id, "\" transform=\"translate(").concat(offsetX, ",0)\">\n  <rect class=\"wheelSocket\" width=\"").concat(WHEEL_WIDTH, "\" height=\"").concat(WHEEL_HEIGHT, "\" rx=\"").concat(WHEEL_RADIUS, "\" ry=\"").concat(WHEEL_RADIUS, "\" />\n  <g transform=\"translate(").concat(WHEEL_PADDING, ",0)\" clip-path=\"url(#wheelClip)\">\n    <rect class=\"wheel\" transform=\"translate(0, ").concat(-WHEEL_HEIGHT / 2, ")\" width=\"").concat(WHEEL_WIDTH - 2 * WHEEL_PADDING, "\" height=\"").concat(WHEEL_HEIGHT * 2, "\"></rect>\n  </g>\n</g>\n");
};

var KEYBOARD_TEMPLATE = function KEYBOARD_TEMPLATE(keyboardNotes, wheels) {
  return "<svg width=\"100%\" viewBox=\"".concat(-wheels.width, " 0 ").concat(keyboardNotes.width + wheels.width, " ").concat(keyboardNotes.height, "\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">\n  <defs>\n    <filter id=\"insetKey\">                                                            <!-- source: https://www.xanthir.com/b4Yv0 -->\n      <feOffset dx=\"0\" dy=\"-7\"/>                                                          <!-- Shadow Offset -->\n      <feGaussianBlur stdDeviation=\"5\" result=\"offset-blur\"/>                            <!-- Shadow Blur -->\n      <feComposite operator=\"out\" in=\"SourceGraphic\" in2=\"offset-blur\" result=\"inverse\"/> <!-- Invert the drop shadow to create an inner shadow -->\n      <feFlood flood-color=\"black\" flood-opacity=\"0.4\" result=\"color\"/>                   <!-- Color & Opacity -->\n      <feComposite operator=\"in\" in=\"color\" in2=\"inverse\" result=\"shadow\"/>               <!-- Clip color inside shadow -->\n      <feComponentTransfer in=\"shadow\" result=\"shadow\">                                   <!-- Shadow Opacity -->\n        <feFuncA type=\"linear\" slope=\"5\"/>\n      </feComponentTransfer>\n      <feBlend mode=\"soft-light\" in=\"shadow\" in2=\"SourceGraphic\"/>                        <!-- Put shadow over original object -->\n    </filter>\n    <filter id=\"insetWheel\">                                                            <!-- source: https://www.xanthir.com/b4Yv0 -->\n      <feOffset dx=\"0\" dy=\"0\"/>                                                          <!-- Shadow Offset -->\n      <feGaussianBlur stdDeviation=\"2\" result=\"offset-blur\"/>                            <!-- Shadow Blur -->\n      <feComposite operator=\"out\" in=\"SourceGraphic\" in2=\"offset-blur\" result=\"inverse\"/> <!-- Invert the drop shadow to create an inner shadow -->\n      <feFlood flood-color=\"black\" flood-opacity=\"1\" result=\"color\"/>                   <!-- Color & Opacity -->\n      <feComposite operator=\"in\" in=\"color\" in2=\"inverse\" result=\"shadow\"/>               <!-- Clip color inside shadow -->\n      <feComponentTransfer in=\"shadow\" result=\"shadow\">                                   <!-- Shadow Opacity -->\n        <feFuncA type=\"linear\" slope=\"1.5\"/>\n      </feComponentTransfer>\n      <feBlend mode=\"normal\" in=\"shadow\" in2=\"SourceGraphic\" />\n    </filter>\n    <linearGradient id=\"whiteKey\" gradientTransform=\"rotate(90)\">\n      <stop offset=\"0%\"  stop-color=\"#bbbbbb\" />\n      <stop offset=\"8%\"  stop-color=\"#eeeeee\" />\n      <stop offset=\"90%\" stop-color=\"#ffffff\" />\n      <stop offset=\"91%\" stop-color=\"#eeeeee\" />\n    </linearGradient>\n    <linearGradient id=\"blackKey\" gradientTransform=\"rotate(90)\">\n      <stop offset=\"0%\"  stop-color=\"#000000\" />\n      <stop offset=\"16%\" stop-color=\"#222222\" />\n      <stop offset=\"80%\" stop-color=\"#444444\" />\n      <stop offset=\"80.5%\" stop-color=\"#aaaaaa\" />\n      <stop offset=\"85%\" stop-color=\"#222222\" />\n      <stop offset=\"91%\" stop-color=\"#000000\" />\n    </linearGradient>\n    <linearGradient id=\"wheelGradient\" gradientTransform=\"rotate(90)\">\n      <stop offset=\"0%\"  stop-color=\"#000000\" />\n      <stop offset=\"45%\" stop-color=\"#555555\" />\n      <stop offset=\"46%\" stop-color=\"#111111\" />\n      <stop offset=\"49.5%\" stop-color=\"#333333\" />\n      <stop offset=\"50%\" stop-color=\"#bbbbbb\" />\n      <stop offset=\"50.5%\" stop-color=\"#444444\" />\n      <stop offset=\"51%\" stop-color=\"#555555\" />\n      <stop offset=\"54%\" stop-color=\"#666666\" />\n      <stop offset=\"55%\" stop-color=\"#333333\" />\n      <stop offset=\"91%\" stop-color=\"#000000\" />\n    </linearGradient>\n    \n    <clipPath id=\"wheelClip\">\n      <rect width=\"").concat(WHEEL_WIDTH - 2 * WHEEL_PADDING, "\" height=\"").concat(WHEEL_HEIGHT - 2, "\" y=\"1\" rx=\"").concat(WHEEL_RADIUS / 2, "\" ry=\"").concat(WHEEL_RADIUS / 2, "\" />\n    </clipPath>\n  </defs>\n\n  <g id=\"wheels\" transform=\"translate(").concat(-wheels.width, ",0)\">\n    ").concat(wheels.markup, "\n  </g>\n\n  <g id=\"board\" transform=\"translate(0,0)\">\n    <rect id=\"keyboard-bg\" width=\"").concat(keyboardNotes.width, "\" height=\"").concat(keyboardNotes.height, "\" x=\"0\" y=\"0\" />\n    ").concat(keyboardNotes.markup, "\n    <rect id=\"board-border\" width=\"").concat(keyboardNotes.width, "\" height=\"").concat(keyboardNotes.height, "\" x=\"0\" y=\"0\" />\n  </g>\n</svg>\n");
};

var KEYBOARD_TEMPLATE2 = function KEYBOARD_TEMPLATE2(keyboardNotes, wheels) {
  return "<svg width=\"100%\" viewBox=\"".concat(-wheels.width, " 0 ").concat(keyboardNotes.width + wheels.width, " ").concat(keyboardNotes.height, "\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" stroke=\"transparent\"\nstroke-width=\"0px\">\n  <defs>\n    <filter id=\"insetKey\">                                                            <!-- source: https://www.xanthir.com/b4Yv0 -->\n      <feOffset dx=\"0\" dy=\"-7\"/>                                                          <!-- Shadow Offset -->\n      <feGaussianBlur stdDeviation=\"5\" result=\"offset-blur\"/>                            <!-- Shadow Blur -->\n      <feComposite operator=\"out\" in=\"SourceGraphic\" in2=\"offset-blur\" result=\"inverse\"/> <!-- Invert the drop shadow to create an inner shadow -->\n      <feFlood flood-color=\"black\" flood-opacity=\"0.4\" result=\"color\"/>                   <!-- Color & Opacity -->\n      <feComposite operator=\"in\" in=\"color\" in2=\"inverse\" result=\"shadow\"/>               <!-- Clip color inside shadow -->\n      <feComponentTransfer in=\"shadow\" result=\"shadow\">                                   <!-- Shadow Opacity -->\n        <feFuncA type=\"linear\" slope=\"5\"/>\n      </feComponentTransfer>\n      <feBlend mode=\"soft-light\" in=\"shadow\" in2=\"SourceGraphic\"/>                        <!-- Put shadow over original object -->\n    </filter>\n    <filter id=\"insetWheel\">                                                            <!-- source: https://www.xanthir.com/b4Yv0 -->\n      <feOffset dx=\"0\" dy=\"0\"/>                                                          <!-- Shadow Offset -->\n      <feGaussianBlur stdDeviation=\"2\" result=\"offset-blur\"/>                            <!-- Shadow Blur -->\n      <feComposite operator=\"out\" in=\"SourceGraphic\" in2=\"offset-blur\" result=\"inverse\"/> <!-- Invert the drop shadow to create an inner shadow -->\n      <feFlood flood-color=\"black\" flood-opacity=\"1\" result=\"color\"/>                   <!-- Color & Opacity -->\n      <feComposite operator=\"in\" in=\"color\" in2=\"inverse\" result=\"shadow\"/>               <!-- Clip color inside shadow -->\n      <feComponentTransfer in=\"shadow\" result=\"shadow\">                                   <!-- Shadow Opacity -->\n        <feFuncA type=\"linear\" slope=\"1.5\"/>\n      </feComponentTransfer>\n      <feBlend mode=\"normal\" in=\"shadow\" in2=\"SourceGraphic\" />\n    </filter>\n    <linearGradient id=\"whiteKey\" gradientTransform=\"rotate(90)\">\n      <stop offset=\"0%\"  stop-color=\"#bbbbbb\" />\n      <stop offset=\"8%\"  stop-color=\"#eeeeee\" />\n      <stop offset=\"90%\" stop-color=\"#ffffff\" />\n      <stop offset=\"91%\" stop-color=\"#eeeeee\" />\n    </linearGradient>\n    <linearGradient id=\"blackKey\" gradientTransform=\"rotate(90)\">\n      <stop offset=\"0%\"  stop-color=\"#000000\" />\n      <stop offset=\"16%\" stop-color=\"#222222\" />\n      <stop offset=\"80%\" stop-color=\"#444444\" />\n      <stop offset=\"80.5%\" stop-color=\"#aaaaaa\" />\n      <stop offset=\"85%\" stop-color=\"#222222\" />\n      <stop offset=\"91%\" stop-color=\"#000000\" />\n    </linearGradient>\n    <linearGradient id=\"wheelGradient\" gradientTransform=\"rotate(90)\">\n      <stop offset=\"0%\"  stop-color=\"#000000\" />\n      <stop offset=\"45%\" stop-color=\"#555555\" />\n      <stop offset=\"46%\" stop-color=\"#111111\" />\n      <stop offset=\"49.5%\" stop-color=\"#333333\" />\n      <stop offset=\"50%\" stop-color=\"#bbbbbb\" />\n      <stop offset=\"50.5%\" stop-color=\"#444444\" />\n      <stop offset=\"51%\" stop-color=\"#555555\" />\n      <stop offset=\"54%\" stop-color=\"#666666\" />\n      <stop offset=\"55%\" stop-color=\"#333333\" />\n      <stop offset=\"91%\" stop-color=\"#000000\" />\n    </linearGradient>\n    \n    <clipPath id=\"wheelClip\">\n      <rect width=\"").concat(WHEEL_WIDTH - 2 * WHEEL_PADDING, "\" height=\"").concat(WHEEL_HEIGHT - 2, "\" y=\"1\" rx=\"").concat(WHEEL_RADIUS / 2, "\" ry=\"").concat(WHEEL_RADIUS / 2, "\" />\n    </clipPath>\n  </defs>\n\n  <g id=\"wheels\" transform=\"translate(").concat(-wheels.width, ",0)\">\n    ").concat(wheels.markup, "\n  </g>\n\n  <g id=\"board\" transform=\"translate(0,0)\">\n    <rect id=\"keyboard-bg2\" width=\"").concat(keyboardNotes.width, "\" height=\"").concat(keyboardNotes.height, "\" x=\"0\" y=\"0\" />\n    ").concat(keyboardNotes.markup, "\n    <rect id=\"board-border\" width=\"").concat(keyboardNotes.width, "\" height=\"").concat(keyboardNotes.height, "\" x=\"0\" y=\"0\" />\n  </g>\n</svg>\n");
};

function setAccidentalKeyboard(val) {
  //console.log("setAccidental keyboard sharps: " + val);
  showSharp = val; //console.log("showSharp: " + showSharp);

  NOTE_NAME_TEMPLATE = function NOTE_NAME_TEMPLATE(props, posX, color) {
    return "\n<g id=\"note-".concat(props.midi, "-display\" class=\"note display\" transform=\"translate(").concat(posX, ",0)\" style=\"color: white;\">\n<text class=\"piano-key-name-played-notes\" x=\"").concat(NOTE_WHITE_WIDTH / 2, "\" y=\"").concat(NOTE_WHITE_HEIGHT - NOTE_NAME_BOTTOM_OFFSET - 140, "\" text-anchor=\"middle\">").concat(_tonal.Midi.midiToNoteName(props.midi, {
      pitchClass: true,
      sharps: showSharp
    }), "</text>\n</g>\n");
  };

  renderAccidental();
}

function getWheelsMarkup(ids) {
  return ids.reduce(function (wheels, id) {
    var markup = WHEEL_TEMPLATE(id, wheels.width);
    return {
      width: wheels.width + WHEEL_WIDTH + WHEEL_MARGIN,
      height: wheels.height,
      markup: wheels.markup + markup
    };
  }, {
    width: 0,
    height: WHEEL_HEIGHT,
    markup: ""
  });
}

function getNoteMarkup(noteNumber, offsetX, colorNoteWhite, colorNoteBlack, isDisplay) {
  var note = _note.default.fromMidi(noteNumber, {
    sharps: true
  });

  var props = _note.default.props(note); //console.log(noteNumber + " alt: " + props.alt);


  if (props.alt) {
    return {
      width: 0,
      isWhite: false,
      markup: !isDisplay ? NOTE_BLACK_TEMPLATE(props, offsetX, colorNoteBlack) : NOTE_NAME_TEMPLATE(props, offsetX, colorNoteWhite)
    };
  }

  return {
    width: NOTE_WHITE_WIDTH,
    isWhite: true,
    markup: !isDisplay ? NOTE_WHITE_TEMPLATE(props, offsetX, colorNoteWhite) : NOTE_NAME_TEMPLATE(props, offsetX, colorNoteWhite)
  };
}

function generateKeyboard(from, to) {
  var wheelIds = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ["pitchWheel", "modWheel"];
  var colorNoteWhite = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "#bf3a2b";
  var colorNoteBlack = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "#bf3a2b";

  var fromProps = _note.default.props(_note.default.simplify(from));

  var toProps = _note.default.props(_note.default.simplify(to));

  var noteStart = fromProps.name && fromProps.midi ? fromProps.alt ? fromProps.midi - 1 : fromProps.midi : _note.default.midi("C2");
  var noteEnd = toProps.name && toProps.midi ? toProps.alt ? toProps.midi + 1 : toProps.midi : _note.default.midi("C5");
  var start = Math.min(noteStart, noteEnd);
  var end = Math.max(noteStart, noteEnd);
  var keyboardNotes = (0, _utils.range)(start, end).reduce(function (keyboard, noteNumber) {
    var _getNoteMarkup = getNoteMarkup(noteNumber, keyboard.width, colorNoteWhite, colorNoteBlack),
        width = _getNoteMarkup.width,
        isWhite = _getNoteMarkup.isWhite,
        markup = _getNoteMarkup.markup;

    return {
      width: keyboard.width + width,
      height: keyboard.height,
      markup: isWhite ? markup + keyboard.markup : keyboard.markup + markup
    };
  }, {
    width: 0,
    height: NOTE_WHITE_HEIGHT,
    markup: ""
  }); //console.log("keyboardNotes: " + JSON.stringify(keyboardNotes));

  var wheels = getWheelsMarkup(wheelIds); //console.log("wheels: " + JSON.stringify(wheels));

  return KEYBOARD_TEMPLATE(keyboardNotes, wheels);
}

function generateKeyboard2(from, to) {
  var wheelIds = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ["pitchWheel", "modWheel"];
  var colorNoteWhite = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "#bf3a2b";
  var colorNoteBlack = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "#bf3a2b";
  var isDisplay = arguments.length > 5 ? arguments[5] : undefined;

  var fromProps = _note.default.props(_note.default.simplify(from));

  var toProps = _note.default.props(_note.default.simplify(to));

  var noteStart = fromProps.name && fromProps.midi ? fromProps.alt ? fromProps.midi - 1 : fromProps.midi : _note.default.midi("C2");
  var noteEnd = toProps.name && toProps.midi ? toProps.alt ? toProps.midi + 1 : toProps.midi : _note.default.midi("C5");
  var start = Math.min(noteStart, noteEnd);
  var end = Math.max(noteStart, noteEnd);
  var keyboardNotes = (0, _utils.range)(start, end).reduce(function (keyboard, noteNumber) {
    //console.log("keyboard.height: " + keyboard.height);
    var _getNoteMarkup2 = getNoteMarkup(noteNumber, keyboard.width, colorNoteWhite, colorNoteBlack, isDisplay),
        width = _getNoteMarkup2.width,
        isWhite = _getNoteMarkup2.isWhite,
        markup = _getNoteMarkup2.markup;

    return {
      width: keyboard.width + width,
      height: 60,
      markup: isWhite ? markup + keyboard.markup : keyboard.markup + markup
    };
  }, {
    width: 0,
    height: NOTE_WHITE_HEIGHT,
    markup: ""
  }); //console.log("keyboardNotes: " + JSON.stringify(keyboardNotes));

  var wheels = getWheelsMarkup(wheelIds); //console.log("wheels: " + JSON.stringify(wheels));

  return KEYBOARD_TEMPLATE2(keyboardNotes, wheels);
}

var currentPitch = 0;
var currentMod = 0;

function setPitchWheel(pitch) {
  currentPitch = pitch;
  var pitchWheelEnabled = (0, _settings.getSetting)("pitchWheelEnabled");
  if (!pitchWheelEnabled) return;
  var pitchWheelSocket = document.querySelector("#pitchWheel .wheelSocket");
  var pitchWheel = document.querySelector("#pitchWheel .wheel");
  var colorPitchWheelDown = (0, _settings.getSetting)("colorPitchWheelDown");
  var colorPitchWheelUp = (0, _settings.getSetting)("colorPitchWheelUp");
  var translateY = -(WHEEL_HEIGHT / 2) - pitch * (WHEEL_AMPLITUDE / 4);
  pitchWheel.setAttribute("transform", "translate(0, ".concat(translateY, ")"));

  if (pitch > 0) {
    pitchWheelSocket.style.fill = (0, _utils.mixRGB)(colorPitchWheelUp, WHEEL_SOCKET_BASE_COLOR, pitch);
  } else {
    pitchWheelSocket.style.fill = (0, _utils.mixRGB)(colorPitchWheelDown, WHEEL_SOCKET_BASE_COLOR, -pitch);
  }
}

function setModWheel(mod) {
  currentMod = mod;
  var modWheelEnabled = (0, _settings.getSetting)("modWheelEnabled");
  if (!modWheelEnabled) return;
  var modWheelSocket = document.querySelector("#modWheel .wheelSocket");
  var modWheel = document.querySelector("#modWheel .wheel");
  var colorModWheel = (0, _settings.getSetting)("colorModWheel");
  var translateY = -((WHEEL_HEIGHT - WHEEL_AMPLITUDE / 2) / 2) - mod * (WHEEL_AMPLITUDE / 2);
  modWheel.setAttribute("transform", "translate(0, ".concat(translateY, ")"));
  modWheelSocket.style.fill = (0, _utils.mixRGB)(colorModWheel, WHEEL_SOCKET_BASE_COLOR, mod);
}

function render(reset) {
  var noteStart = (0, _settings.getSetting)("noteStart");
  var noteEnd = (0, _settings.getSetting)("noteEnd");
  var pitchWheelEnabled = (0, _settings.getSetting)("pitchWheelEnabled");
  var modWheelEnabled = (0, _settings.getSetting)("modWheelEnabled");
  var colorNote = (0, _settings.getSetting)("colorNote");
  var colorNoteWhite = (0, _utils.mixRGB)(colorNote, "#ffffff", 0.4);
  var colorNoteBlack = colorNote;
  var wheels = [];
  if (pitchWheelEnabled) wheels.push("pitchWheel");
  if (modWheelEnabled) wheels.push("modWheel");
  keyboardContainer.innerHTML = generateKeyboard(noteStart, noteEnd, wheels, colorNoteWhite, colorNoteBlack);
  keyboardContainer2.innerHTML = generateKeyboard2(noteStart, noteEnd, wheels, colorNoteWhite, colorNoteBlack, 1);

  if (reset) {
    setPitchWheel(0);
    setModWheel(0);
  } else {
    setPitchWheel(currentPitch);
    setModWheel(currentMod);
  }
}

function renderAccidental() {
  var noteStart = (0, _settings.getSetting)("noteStart");
  var noteEnd = (0, _settings.getSetting)("noteEnd");
  var pitchWheelEnabled = (0, _settings.getSetting)("pitchWheelEnabled");
  var modWheelEnabled = (0, _settings.getSetting)("modWheelEnabled");
  var colorNote = (0, _settings.getSetting)("colorNote");
  var colorNoteWhite = (0, _utils.mixRGB)(colorNote, "#ffffff", 0.4);
  var colorNoteBlack = colorNote;
  var wheels = [];
  if (pitchWheelEnabled) wheels.push("pitchWheel");
  if (modWheelEnabled) wheels.push("modWheel");
  keyboardContainer2.innerHTML = generateKeyboard2(noteStart, noteEnd, wheels, colorNoteWhite, colorNoteBlack, 1);
}
},{"tonal/note":"node_modules/tonal/note/index.js","./utils":"src/chord-display/utils.js","./settings":"src/chord-display/settings.js","@tonaljs/tonal":"node_modules/@tonaljs/tonal/dist/index.es.js"}],"src/chord-display/ui.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.highlightNote = highlightNote;
exports.highlightNoteUser = highlightNoteUser;
exports.fadeNote = fadeNote;
exports.fadeNoteUser = fadeNoteUser;
exports.fadeNoteHvrOut = fadeNoteHvrOut;
exports.highlightTonic = highlightTonic;
exports.fadeTonics = fadeTonics;
exports.setChordHtml = setChordHtml;
exports.setNotesHtml = setNotesHtml;
exports.setLayoutSettings = setLayoutSettings;
exports.setAppLoaded = setAppLoaded;
exports.setAppError = setAppError;
exports.render = render;
Object.defineProperty(exports, "setPitchWheel", {
  enumerable: true,
  get: function () {
    return _keyboard.setPitchWheel;
  }
});
Object.defineProperty(exports, "setModWheel", {
  enumerable: true,
  get: function () {
    return _keyboard.setModWheel;
  }
});

var _note = _interopRequireDefault(require("tonal/note"));

var _utils = require("./utils");

var _settings = require("./settings");

var _keyboard = require("./keyboard");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var LAYOUT_SETTINGS = ["hideKeyboard", "hideNotes", "hideChord", "hideBassNote", "hideKeyName", "hideTonic"];
var appContainer = document.getElementById("app");
var chordDisplay = document.getElementById("chordDisplay1");
var notesDisplay = document.getElementById("notesDisplay");

function highlightNote(noteNumber) {
  var className = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "active";
  //console.log("highlightNote UI: " + noteNumber);
  // console.log("key elem str: " + `note-${noteNumber}`);
  var keyElement = document.getElementById("note-".concat(noteNumber)); //console.log("keyElement: " + JSON.stringify(keyElement));

  var keyElementDisplayNote = document.getElementById("note-".concat(noteNumber, "-display"));

  if (!keyElement) {
    //console.log("not key element");
    return;
  }

  keyElement.classList.add("autoSelect");

  if (noteNumber > 64) {
    keyElement.classList.add("activeRight"); //keyElementDisplayNote.classList.add("activeRight");
  } else {
    keyElement.classList.add("active"); //keyElementDisplayNote.classList.add("active");
  } //keyElement.classList.add(className);


  keyElementDisplayNote.classList.add(className);
}

function highlightNoteUser(noteNumber) {
  var className = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "activeUser";
  // console.log("highlightNote: " + noteNumber);
  // console.log("key el str: " + `note-${noteNumber}`);
  var keyElement = document.getElementById("note-".concat(noteNumber)); //console.log("keyElement: " + JSON.stringify(keyElement));

  var keyElementDisplayNote = document.getElementById("note-".concat(noteNumber, "-display"));

  if (!keyElement) {
    //console.log("not key element");
    return;
  }

  keyElement.classList.add(className);
  keyElementDisplayNote.classList.add("active2");
}

function fadeNote(noteNumber) {
  //console.log("fadeNote UI: " + noteNumber);
  //console.log("fadeNote");
  var keyElement = document.getElementById("note-".concat(noteNumber));
  var keyElementDisplayNote = document.getElementById("note-".concat(noteNumber, "-display"));
  if (!keyElement) return;
  keyElement.classList.remove("autoSelect"); //keyElement.classList.remove("active");

  keyElement.classList.remove("activeUser");

  if (noteNumber > 64) {
    keyElement.classList.remove("activeRight"); //keyElementDisplayNote.classList.add("activeRight");
  } else {
    keyElement.classList.remove("active"); //keyElementDisplayNote.classList.add("active");
  } //keyElement.classList.remove("activeUser");


  keyElementDisplayNote.classList.remove("active");
  keyElementDisplayNote.classList.remove("active2");
}

function fadeNoteUser(noteNumber) {
  //console.log("fadeNoteUser: " + noteNumber);
  //console.log("fadeNoteUser");
  var keyElement = document.getElementById("note-".concat(noteNumber)); //check this

  var keyElementDisplayNote = document.getElementById("note-".concat(noteNumber, "-display"));
  if (!keyElement) return;
  keyElement.classList.remove("activeUser"); // if (keyElement.classList.contains("autoSelect")) {
  //   //console.log("dont fade");
  //   return;
  // }
  //keyElement.classList.remove("autoSelect");

  keyElementDisplayNote.classList.remove("active2");
}

function fadeNoteHvrOut(noteNumber) {
  //console.log("fadeNoteHvrOut: " + noteNumber);
  //console.log("fadeNoteHvrOut");
  var keyElement = document.getElementById("note-".concat(noteNumber)); //console.log("keyElement:" + JSON.stringify(keyElement));

  if (keyElement.classList.contains("autoSelect")) {
    //console.log("dont fade");
    return;
  }

  var keyElementDisplayNote = document.getElementById("note-".concat(noteNumber, "-display")); //keyElement.classList.remove("autoSelect");
  //if (!keyElement) return;

  keyElement.classList.remove("activeUser");
  keyElementDisplayNote.classList.remove("active2");
}

function highlightTonic(tonic) {
  var notes = (0, _utils.range)(0, 10).map(function (oct) {
    return _note.default.midi("".concat(tonic).concat(oct));
  });

  var _iterator = _createForOfIteratorHelper(notes),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var note = _step.value;
      highlightNote(note, "tonic");
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}

function fadeTonics() {
  var elements = document.querySelectorAll(".tonic");

  if (elements && elements.length) {
    var _iterator2 = _createForOfIteratorHelper(elements),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var element = _step2.value;
        element.classList.remove("tonic");
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }
}

function setChordHtml(html) {
  chordDisplay.innerHTML = html;
}

function setNotesHtml(html) {
  notesDisplay.innerHTML = html;
}

function setLayoutSettings() {
  var _iterator3 = _createForOfIteratorHelper(LAYOUT_SETTINGS),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var setting = _step3.value;
      var value = (0, _settings.getSetting)(setting);

      if (value) {
        appContainer.classList.add(setting);
      } else {
        appContainer.classList.remove(setting);
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
}

function setAppLoaded(message) {
  appContainer.classList.add("loaded");
}

function setAppError(message) {
  appContainer.classList.add("error");
  setChordHtml("Error");
  setNotesHtml(message);
}

function render(reset) {
  setLayoutSettings();
  (0, _keyboard.render)(reset);
}
},{"tonal/note":"node_modules/tonal/note/index.js","./utils":"src/chord-display/utils.js","./settings":"src/chord-display/settings.js","./keyboard":"src/chord-display/keyboard.js"}],"node_modules/has-symbols/shams.js":[function(require,module,exports) {
'use strict';
/* eslint complexity: [2, 18], max-statements: [2, 33] */

module.exports = function hasSymbols() {
  if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') {
    return false;
  }

  if (typeof Symbol.iterator === 'symbol') {
    return true;
  }

  var obj = {};
  var sym = Symbol('test');
  var symObj = Object(sym);

  if (typeof sym === 'string') {
    return false;
  }

  if (Object.prototype.toString.call(sym) !== '[object Symbol]') {
    return false;
  }

  if (Object.prototype.toString.call(symObj) !== '[object Symbol]') {
    return false;
  } // temp disabled per https://github.com/ljharb/object.assign/issues/17
  // if (sym instanceof Symbol) { return false; }
  // temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
  // if (!(symObj instanceof Symbol)) { return false; }
  // if (typeof Symbol.prototype.toString !== 'function') { return false; }
  // if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }


  var symVal = 42;
  obj[sym] = symVal;

  for (sym in obj) {
    return false;
  } // eslint-disable-line no-restricted-syntax, no-unreachable-loop


  if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) {
    return false;
  }

  if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) {
    return false;
  }

  var syms = Object.getOwnPropertySymbols(obj);

  if (syms.length !== 1 || syms[0] !== sym) {
    return false;
  }

  if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
    return false;
  }

  if (typeof Object.getOwnPropertyDescriptor === 'function') {
    var descriptor = Object.getOwnPropertyDescriptor(obj, sym);

    if (descriptor.value !== symVal || descriptor.enumerable !== true) {
      return false;
    }
  }

  return true;
};
},{}],"node_modules/has-symbols/index.js":[function(require,module,exports) {
'use strict';

var origSymbol = typeof Symbol !== 'undefined' && Symbol;

var hasSymbolSham = require('./shams');

module.exports = function hasNativeSymbols() {
  if (typeof origSymbol !== 'function') {
    return false;
  }

  if (typeof Symbol !== 'function') {
    return false;
  }

  if (typeof origSymbol('foo') !== 'symbol') {
    return false;
  }

  if (typeof Symbol('bar') !== 'symbol') {
    return false;
  }

  return hasSymbolSham();
};
},{"./shams":"node_modules/has-symbols/shams.js"}],"node_modules/function-bind/implementation.js":[function(require,module,exports) {
'use strict';

/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

},{}],"node_modules/function-bind/index.js":[function(require,module,exports) {
'use strict';

var implementation = require('./implementation');

module.exports = Function.prototype.bind || implementation;

},{"./implementation":"node_modules/function-bind/implementation.js"}],"node_modules/has/src/index.js":[function(require,module,exports) {
'use strict';

var bind = require('function-bind');

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);
},{"function-bind":"node_modules/function-bind/index.js"}],"node_modules/get-intrinsic/index.js":[function(require,module,exports) {
'use strict';

var undefined;

var $SyntaxError = SyntaxError;
var $Function = Function;
var $TypeError = TypeError;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function (expressionSyntax) {
	try {
		return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
	} catch (e) {}
};

var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
	try {
		$gOPD({}, '');
	} catch (e) {
		$gOPD = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () {
	throw new $TypeError();
};
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols = require('has-symbols')();

var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto

var needsEval = {};

var TypedArray = typeof Uint8Array === 'undefined' ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'%ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined,
	'%AsyncFromSyncIteratorPrototype%': undefined,
	'%AsyncFunction%': needsEval,
	'%AsyncGenerator%': needsEval,
	'%AsyncGeneratorFunction%': needsEval,
	'%AsyncIteratorPrototype%': needsEval,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
	'%Boolean%': Boolean,
	'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'%Date%': Date,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': Error,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': EvalError,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
	'%Function%': $Function,
	'%GeneratorFunction%': needsEval,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined,
	'%Map%': typeof Map === 'undefined' ? undefined : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),
	'%Math%': Math,
	'%Number%': Number,
	'%Object%': Object,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'%RangeError%': RangeError,
	'%ReferenceError%': ReferenceError,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'%RegExp%': RegExp,
	'%Set%': typeof Set === 'undefined' ? undefined : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined,
	'%Symbol%': hasSymbols ? Symbol : undefined,
	'%SyntaxError%': $SyntaxError,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypeError%': $TypeError,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'%URIError%': URIError,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
};

var doEval = function doEval(name) {
	var value;
	if (name === '%AsyncFunction%') {
		value = getEvalledConstructor('async function () {}');
	} else if (name === '%GeneratorFunction%') {
		value = getEvalledConstructor('function* () {}');
	} else if (name === '%AsyncGeneratorFunction%') {
		value = getEvalledConstructor('async function* () {}');
	} else if (name === '%AsyncGenerator%') {
		var fn = doEval('%AsyncGeneratorFunction%');
		if (fn) {
			value = fn.prototype;
		}
	} else if (name === '%AsyncIteratorPrototype%') {
		var gen = doEval('%AsyncGenerator%');
		if (gen) {
			value = getProto(gen.prototype);
		}
	}

	INTRINSICS[name] = value;

	return value;
};

var LEGACY_ALIASES = {
	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
	'%ArrayPrototype%': ['Array', 'prototype'],
	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
	'%BooleanPrototype%': ['Boolean', 'prototype'],
	'%DataViewPrototype%': ['DataView', 'prototype'],
	'%DatePrototype%': ['Date', 'prototype'],
	'%ErrorPrototype%': ['Error', 'prototype'],
	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
	'%FunctionPrototype%': ['Function', 'prototype'],
	'%Generator%': ['GeneratorFunction', 'prototype'],
	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
	'%JSONParse%': ['JSON', 'parse'],
	'%JSONStringify%': ['JSON', 'stringify'],
	'%MapPrototype%': ['Map', 'prototype'],
	'%NumberPrototype%': ['Number', 'prototype'],
	'%ObjectPrototype%': ['Object', 'prototype'],
	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
	'%PromisePrototype%': ['Promise', 'prototype'],
	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
	'%Promise_all%': ['Promise', 'all'],
	'%Promise_reject%': ['Promise', 'reject'],
	'%Promise_resolve%': ['Promise', 'resolve'],
	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
	'%RegExpPrototype%': ['RegExp', 'prototype'],
	'%SetPrototype%': ['Set', 'prototype'],
	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
	'%StringPrototype%': ['String', 'prototype'],
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};

var bind = require('function-bind');
var hasOwn = require('has');
var $concat = bind.call(Function.call, Array.prototype.concat);
var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
var $replace = bind.call(Function.call, String.prototype.replace);
var $strSlice = bind.call(Function.call, String.prototype.slice);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var first = $strSlice(string, 0, 1);
	var last = $strSlice(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (hasOwn(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (value === needsEval) {
			value = doEval(intrinsicName);
		}
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError('"allowMissing" argument must be a boolean');
	}

	var parts = stringToPath(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice(part, 0, 1);
		var last = $strSlice(part, -1);
		if (
			(
				(first === '"' || first === "'" || first === '`')
				|| (last === '"' || last === "'" || last === '`')
			)
			&& first !== last
		) {
			throw new $SyntaxError('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (hasOwn(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined;
			}
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = hasOwn(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};

},{"has-symbols":"node_modules/has-symbols/index.js","function-bind":"node_modules/function-bind/index.js","has":"node_modules/has/src/index.js"}],"node_modules/call-bind/index.js":[function(require,module,exports) {
'use strict';

var bind = require('function-bind');
var GetIntrinsic = require('get-intrinsic');

var $apply = GetIntrinsic('%Function.prototype.apply%');
var $call = GetIntrinsic('%Function.prototype.call%');
var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
var $max = GetIntrinsic('%Math.max%');

if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = null;
	}
}

module.exports = function callBind(originalFunction) {
	var func = $reflectApply(bind, $call, arguments);
	if ($gOPD && $defineProperty) {
		var desc = $gOPD(func, 'length');
		if (desc.configurable) {
			// original length, plus the receiver, minus any additional arguments (after the receiver)
			$defineProperty(
				func,
				'length',
				{ value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
			);
		}
	}
	return func;
};

var applyBind = function applyBind() {
	return $reflectApply(bind, $apply, arguments);
};

if ($defineProperty) {
	$defineProperty(module.exports, 'apply', { value: applyBind });
} else {
	module.exports.apply = applyBind;
}

},{"function-bind":"node_modules/function-bind/index.js","get-intrinsic":"node_modules/get-intrinsic/index.js"}],"node_modules/call-bind/callBound.js":[function(require,module,exports) {
'use strict';

var GetIntrinsic = require('get-intrinsic');

var callBind = require('./');

var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

module.exports = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = GetIntrinsic(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
		return callBind(intrinsic);
	}
	return intrinsic;
};

},{"get-intrinsic":"node_modules/get-intrinsic/index.js","./":"node_modules/call-bind/index.js"}],"node_modules/parcel-bundler/src/builtins/_empty.js":[function(require,module,exports) {

},{}],"node_modules/side-channel/node_modules/object-inspect/index.js":[function(require,module,exports) {
var hasMap = typeof Map === 'function' && Map.prototype;
var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;
var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null;
var mapForEach = hasMap && Map.prototype.forEach;
var hasSet = typeof Set === 'function' && Set.prototype;
var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;
var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null;
var setForEach = hasSet && Set.prototype.forEach;
var hasWeakMap = typeof WeakMap === 'function' && WeakMap.prototype;
var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
var hasWeakSet = typeof WeakSet === 'function' && WeakSet.prototype;
var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
var hasWeakRef = typeof WeakRef === 'function' && WeakRef.prototype;
var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
var booleanValueOf = Boolean.prototype.valueOf;
var objectToString = Object.prototype.toString;
var functionToString = Function.prototype.toString;
var match = String.prototype.match;
var bigIntValueOf = typeof BigInt === 'function' ? BigInt.prototype.valueOf : null;
var gOPS = Object.getOwnPropertySymbols;
var symToString = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? Symbol.prototype.toString : null;
var hasShammedSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'object';
var isEnumerable = Object.prototype.propertyIsEnumerable;

var gPO = (typeof Reflect === 'function' ? Reflect.getPrototypeOf : Object.getPrototypeOf) || (
    [].__proto__ === Array.prototype // eslint-disable-line no-proto
        ? function (O) {
            return O.__proto__; // eslint-disable-line no-proto
        }
        : null
);

var inspectCustom = require('./util.inspect').custom;
var inspectSymbol = inspectCustom && isSymbol(inspectCustom) ? inspectCustom : null;
var toStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag !== 'undefined' ? Symbol.toStringTag : null;

module.exports = function inspect_(obj, options, depth, seen) {
    var opts = options || {};

    if (has(opts, 'quoteStyle') && (opts.quoteStyle !== 'single' && opts.quoteStyle !== 'double')) {
        throw new TypeError('option "quoteStyle" must be "single" or "double"');
    }
    if (
        has(opts, 'maxStringLength') && (typeof opts.maxStringLength === 'number'
            ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity
            : opts.maxStringLength !== null
        )
    ) {
        throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
    }
    var customInspect = has(opts, 'customInspect') ? opts.customInspect : true;
    if (typeof customInspect !== 'boolean' && customInspect !== 'symbol') {
        throw new TypeError('option "customInspect", if provided, must be `true`, `false`, or `\'symbol\'`');
    }

    if (
        has(opts, 'indent')
        && opts.indent !== null
        && opts.indent !== '\t'
        && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)
    ) {
        throw new TypeError('options "indent" must be "\\t", an integer > 0, or `null`');
    }

    if (typeof obj === 'undefined') {
        return 'undefined';
    }
    if (obj === null) {
        return 'null';
    }
    if (typeof obj === 'boolean') {
        return obj ? 'true' : 'false';
    }

    if (typeof obj === 'string') {
        return inspectString(obj, opts);
    }
    if (typeof obj === 'number') {
        if (obj === 0) {
            return Infinity / obj > 0 ? '0' : '-0';
        }
        return String(obj);
    }
    if (typeof obj === 'bigint') {
        return String(obj) + 'n';
    }

    var maxDepth = typeof opts.depth === 'undefined' ? 5 : opts.depth;
    if (typeof depth === 'undefined') { depth = 0; }
    if (depth >= maxDepth && maxDepth > 0 && typeof obj === 'object') {
        return isArray(obj) ? '[Array]' : '[Object]';
    }

    var indent = getIndent(opts, depth);

    if (typeof seen === 'undefined') {
        seen = [];
    } else if (indexOf(seen, obj) >= 0) {
        return '[Circular]';
    }

    function inspect(value, from, noIndent) {
        if (from) {
            seen = seen.slice();
            seen.push(from);
        }
        if (noIndent) {
            var newOpts = {
                depth: opts.depth
            };
            if (has(opts, 'quoteStyle')) {
                newOpts.quoteStyle = opts.quoteStyle;
            }
            return inspect_(value, newOpts, depth + 1, seen);
        }
        return inspect_(value, opts, depth + 1, seen);
    }

    if (typeof obj === 'function') {
        var name = nameOf(obj);
        var keys = arrObjKeys(obj, inspect);
        return '[Function' + (name ? ': ' + name : ' (anonymous)') + ']' + (keys.length > 0 ? ' { ' + keys.join(', ') + ' }' : '');
    }
    if (isSymbol(obj)) {
        var symString = hasShammedSymbols ? String(obj).replace(/^(Symbol\(.*\))_[^)]*$/, '$1') : symToString.call(obj);
        return typeof obj === 'object' && !hasShammedSymbols ? markBoxed(symString) : symString;
    }
    if (isElement(obj)) {
        var s = '<' + String(obj.nodeName).toLowerCase();
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
            s += ' ' + attrs[i].name + '=' + wrapQuotes(quote(attrs[i].value), 'double', opts);
        }
        s += '>';
        if (obj.childNodes && obj.childNodes.length) { s += '...'; }
        s += '</' + String(obj.nodeName).toLowerCase() + '>';
        return s;
    }
    if (isArray(obj)) {
        if (obj.length === 0) { return '[]'; }
        var xs = arrObjKeys(obj, inspect);
        if (indent && !singleLineValues(xs)) {
            return '[' + indentedJoin(xs, indent) + ']';
        }
        return '[ ' + xs.join(', ') + ' ]';
    }
    if (isError(obj)) {
        var parts = arrObjKeys(obj, inspect);
        if (parts.length === 0) { return '[' + String(obj) + ']'; }
        return '{ [' + String(obj) + '] ' + parts.join(', ') + ' }';
    }
    if (typeof obj === 'object' && customInspect) {
        if (inspectSymbol && typeof obj[inspectSymbol] === 'function') {
            return obj[inspectSymbol]();
        } else if (customInspect !== 'symbol' && typeof obj.inspect === 'function') {
            return obj.inspect();
        }
    }
    if (isMap(obj)) {
        var mapParts = [];
        mapForEach.call(obj, function (value, key) {
            mapParts.push(inspect(key, obj, true) + ' => ' + inspect(value, obj));
        });
        return collectionOf('Map', mapSize.call(obj), mapParts, indent);
    }
    if (isSet(obj)) {
        var setParts = [];
        setForEach.call(obj, function (value) {
            setParts.push(inspect(value, obj));
        });
        return collectionOf('Set', setSize.call(obj), setParts, indent);
    }
    if (isWeakMap(obj)) {
        return weakCollectionOf('WeakMap');
    }
    if (isWeakSet(obj)) {
        return weakCollectionOf('WeakSet');
    }
    if (isWeakRef(obj)) {
        return weakCollectionOf('WeakRef');
    }
    if (isNumber(obj)) {
        return markBoxed(inspect(Number(obj)));
    }
    if (isBigInt(obj)) {
        return markBoxed(inspect(bigIntValueOf.call(obj)));
    }
    if (isBoolean(obj)) {
        return markBoxed(booleanValueOf.call(obj));
    }
    if (isString(obj)) {
        return markBoxed(inspect(String(obj)));
    }
    if (!isDate(obj) && !isRegExp(obj)) {
        var ys = arrObjKeys(obj, inspect);
        var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
        var protoTag = obj instanceof Object ? '' : 'null prototype';
        var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? toStr(obj).slice(8, -1) : protoTag ? 'Object' : '';
        var constructorTag = isPlainObject || typeof obj.constructor !== 'function' ? '' : obj.constructor.name ? obj.constructor.name + ' ' : '';
        var tag = constructorTag + (stringTag || protoTag ? '[' + [].concat(stringTag || [], protoTag || []).join(': ') + '] ' : '');
        if (ys.length === 0) { return tag + '{}'; }
        if (indent) {
            return tag + '{' + indentedJoin(ys, indent) + '}';
        }
        return tag + '{ ' + ys.join(', ') + ' }';
    }
    return String(obj);
};

function wrapQuotes(s, defaultStyle, opts) {
    var quoteChar = (opts.quoteStyle || defaultStyle) === 'double' ? '"' : "'";
    return quoteChar + s + quoteChar;
}

function quote(s) {
    return String(s).replace(/"/g, '&quot;');
}

function isArray(obj) { return toStr(obj) === '[object Array]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isDate(obj) { return toStr(obj) === '[object Date]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isRegExp(obj) { return toStr(obj) === '[object RegExp]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isError(obj) { return toStr(obj) === '[object Error]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isString(obj) { return toStr(obj) === '[object String]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isNumber(obj) { return toStr(obj) === '[object Number]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isBoolean(obj) { return toStr(obj) === '[object Boolean]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }

// Symbol and BigInt do have Symbol.toStringTag by spec, so that can't be used to eliminate false positives
function isSymbol(obj) {
    if (hasShammedSymbols) {
        return obj && typeof obj === 'object' && obj instanceof Symbol;
    }
    if (typeof obj === 'symbol') {
        return true;
    }
    if (!obj || typeof obj !== 'object' || !symToString) {
        return false;
    }
    try {
        symToString.call(obj);
        return true;
    } catch (e) {}
    return false;
}

function isBigInt(obj) {
    if (!obj || typeof obj !== 'object' || !bigIntValueOf) {
        return false;
    }
    try {
        bigIntValueOf.call(obj);
        return true;
    } catch (e) {}
    return false;
}

var hasOwn = Object.prototype.hasOwnProperty || function (key) { return key in this; };
function has(obj, key) {
    return hasOwn.call(obj, key);
}

function toStr(obj) {
    return objectToString.call(obj);
}

function nameOf(f) {
    if (f.name) { return f.name; }
    var m = match.call(functionToString.call(f), /^function\s*([\w$]+)/);
    if (m) { return m[1]; }
    return null;
}

function indexOf(xs, x) {
    if (xs.indexOf) { return xs.indexOf(x); }
    for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) { return i; }
    }
    return -1;
}

function isMap(x) {
    if (!mapSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        mapSize.call(x);
        try {
            setSize.call(x);
        } catch (s) {
            return true;
        }
        return x instanceof Map; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakMap(x) {
    if (!weakMapHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakMapHas.call(x, weakMapHas);
        try {
            weakSetHas.call(x, weakSetHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakMap; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakRef(x) {
    if (!weakRefDeref || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakRefDeref.call(x);
        return true;
    } catch (e) {}
    return false;
}

function isSet(x) {
    if (!setSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        setSize.call(x);
        try {
            mapSize.call(x);
        } catch (m) {
            return true;
        }
        return x instanceof Set; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakSet(x) {
    if (!weakSetHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakSetHas.call(x, weakSetHas);
        try {
            weakMapHas.call(x, weakMapHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakSet; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isElement(x) {
    if (!x || typeof x !== 'object') { return false; }
    if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
        return true;
    }
    return typeof x.nodeName === 'string' && typeof x.getAttribute === 'function';
}

function inspectString(str, opts) {
    if (str.length > opts.maxStringLength) {
        var remaining = str.length - opts.maxStringLength;
        var trailer = '... ' + remaining + ' more character' + (remaining > 1 ? 's' : '');
        return inspectString(str.slice(0, opts.maxStringLength), opts) + trailer;
    }
    // eslint-disable-next-line no-control-regex
    var s = str.replace(/(['\\])/g, '\\$1').replace(/[\x00-\x1f]/g, lowbyte);
    return wrapQuotes(s, 'single', opts);
}

function lowbyte(c) {
    var n = c.charCodeAt(0);
    var x = {
        8: 'b',
        9: 't',
        10: 'n',
        12: 'f',
        13: 'r'
    }[n];
    if (x) { return '\\' + x; }
    return '\\x' + (n < 0x10 ? '0' : '') + n.toString(16).toUpperCase();
}

function markBoxed(str) {
    return 'Object(' + str + ')';
}

function weakCollectionOf(type) {
    return type + ' { ? }';
}

function collectionOf(type, size, entries, indent) {
    var joinedEntries = indent ? indentedJoin(entries, indent) : entries.join(', ');
    return type + ' (' + size + ') {' + joinedEntries + '}';
}

function singleLineValues(xs) {
    for (var i = 0; i < xs.length; i++) {
        if (indexOf(xs[i], '\n') >= 0) {
            return false;
        }
    }
    return true;
}

function getIndent(opts, depth) {
    var baseIndent;
    if (opts.indent === '\t') {
        baseIndent = '\t';
    } else if (typeof opts.indent === 'number' && opts.indent > 0) {
        baseIndent = Array(opts.indent + 1).join(' ');
    } else {
        return null;
    }
    return {
        base: baseIndent,
        prev: Array(depth + 1).join(baseIndent)
    };
}

function indentedJoin(xs, indent) {
    if (xs.length === 0) { return ''; }
    var lineJoiner = '\n' + indent.prev + indent.base;
    return lineJoiner + xs.join(',' + lineJoiner) + '\n' + indent.prev;
}

function arrObjKeys(obj, inspect) {
    var isArr = isArray(obj);
    var xs = [];
    if (isArr) {
        xs.length = obj.length;
        for (var i = 0; i < obj.length; i++) {
            xs[i] = has(obj, i) ? inspect(obj[i], obj) : '';
        }
    }
    var syms = typeof gOPS === 'function' ? gOPS(obj) : [];
    var symMap;
    if (hasShammedSymbols) {
        symMap = {};
        for (var k = 0; k < syms.length; k++) {
            symMap['$' + syms[k]] = syms[k];
        }
    }

    for (var key in obj) { // eslint-disable-line no-restricted-syntax
        if (!has(obj, key)) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if (isArr && String(Number(key)) === key && key < obj.length) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if (hasShammedSymbols && symMap['$' + key] instanceof Symbol) {
            // this is to prevent shammed Symbols, which are stored as strings, from being included in the string key section
            continue; // eslint-disable-line no-restricted-syntax, no-continue
        } else if ((/[^\w$]/).test(key)) {
            xs.push(inspect(key, obj) + ': ' + inspect(obj[key], obj));
        } else {
            xs.push(key + ': ' + inspect(obj[key], obj));
        }
    }
    if (typeof gOPS === 'function') {
        for (var j = 0; j < syms.length; j++) {
            if (isEnumerable.call(obj, syms[j])) {
                xs.push('[' + inspect(syms[j]) + ']: ' + inspect(obj[syms[j]], obj));
            }
        }
    }
    return xs;
}

},{"./util.inspect":"node_modules/parcel-bundler/src/builtins/_empty.js"}],"node_modules/side-channel/index.js":[function(require,module,exports) {
'use strict';

var GetIntrinsic = require('get-intrinsic');
var callBound = require('call-bind/callBound');
var inspect = require('object-inspect');

var $TypeError = GetIntrinsic('%TypeError%');
var $WeakMap = GetIntrinsic('%WeakMap%', true);
var $Map = GetIntrinsic('%Map%', true);

var $weakMapGet = callBound('WeakMap.prototype.get', true);
var $weakMapSet = callBound('WeakMap.prototype.set', true);
var $weakMapHas = callBound('WeakMap.prototype.has', true);
var $mapGet = callBound('Map.prototype.get', true);
var $mapSet = callBound('Map.prototype.set', true);
var $mapHas = callBound('Map.prototype.has', true);

/*
 * This function traverses the list returning the node corresponding to the
 * given key.
 *
 * That node is also moved to the head of the list, so that if it's accessed
 * again we don't need to traverse the whole list. By doing so, all the recently
 * used nodes can be accessed relatively quickly.
 */
var listGetNode = function (list, key) { // eslint-disable-line consistent-return
	for (var prev = list, curr; (curr = prev.next) !== null; prev = curr) {
		if (curr.key === key) {
			prev.next = curr.next;
			curr.next = list.next;
			list.next = curr; // eslint-disable-line no-param-reassign
			return curr;
		}
	}
};

var listGet = function (objects, key) {
	var node = listGetNode(objects, key);
	return node && node.value;
};
var listSet = function (objects, key, value) {
	var node = listGetNode(objects, key);
	if (node) {
		node.value = value;
	} else {
		// Prepend the new node to the beginning of the list
		objects.next = { // eslint-disable-line no-param-reassign
			key: key,
			next: objects.next,
			value: value
		};
	}
};
var listHas = function (objects, key) {
	return !!listGetNode(objects, key);
};

module.exports = function getSideChannel() {
	var $wm;
	var $m;
	var $o;
	var channel = {
		assert: function (key) {
			if (!channel.has(key)) {
				throw new $TypeError('Side channel does not contain ' + inspect(key));
			}
		},
		get: function (key) { // eslint-disable-line consistent-return
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if ($wm) {
					return $weakMapGet($wm, key);
				}
			} else if ($Map) {
				if ($m) {
					return $mapGet($m, key);
				}
			} else {
				if ($o) { // eslint-disable-line no-lonely-if
					return listGet($o, key);
				}
			}
		},
		has: function (key) {
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if ($wm) {
					return $weakMapHas($wm, key);
				}
			} else if ($Map) {
				if ($m) {
					return $mapHas($m, key);
				}
			} else {
				if ($o) { // eslint-disable-line no-lonely-if
					return listHas($o, key);
				}
			}
			return false;
		},
		set: function (key, value) {
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if (!$wm) {
					$wm = new $WeakMap();
				}
				$weakMapSet($wm, key, value);
			} else if ($Map) {
				if (!$m) {
					$m = new $Map();
				}
				$mapSet($m, key, value);
			} else {
				if (!$o) {
					/*
					 * Initialize the linked list as an empty node, so that we don't have
					 * to special-case handling of the first node: we can always refer to
					 * it as (previous node).next, instead of something like (list).head
					 */
					$o = { key: {}, next: null };
				}
				listSet($o, key, value);
			}
		}
	};
	return channel;
};

},{"get-intrinsic":"node_modules/get-intrinsic/index.js","call-bind/callBound":"node_modules/call-bind/callBound.js","object-inspect":"node_modules/side-channel/node_modules/object-inspect/index.js"}],"node_modules/qs/lib/formats.js":[function(require,module,exports) {
'use strict';

var replace = String.prototype.replace;
var percentTwenties = /%20/g;
var Format = {
  RFC1738: 'RFC1738',
  RFC3986: 'RFC3986'
};
module.exports = {
  'default': Format.RFC3986,
  formatters: {
    RFC1738: function (value) {
      return replace.call(value, percentTwenties, '+');
    },
    RFC3986: function (value) {
      return String(value);
    }
  },
  RFC1738: Format.RFC1738,
  RFC3986: Format.RFC3986
};
},{}],"node_modules/qs/lib/utils.js":[function(require,module,exports) {
'use strict';

var formats = require('./formats');

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var hexTable = function () {
  var array = [];

  for (var i = 0; i < 256; ++i) {
    array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
  }

  return array;
}();

var compactQueue = function compactQueue(queue) {
  while (queue.length > 1) {
    var item = queue.pop();
    var obj = item.obj[item.prop];

    if (isArray(obj)) {
      var compacted = [];

      for (var j = 0; j < obj.length; ++j) {
        if (typeof obj[j] !== 'undefined') {
          compacted.push(obj[j]);
        }
      }

      item.obj[item.prop] = compacted;
    }
  }
};

var arrayToObject = function arrayToObject(source, options) {
  var obj = options && options.plainObjects ? Object.create(null) : {};

  for (var i = 0; i < source.length; ++i) {
    if (typeof source[i] !== 'undefined') {
      obj[i] = source[i];
    }
  }

  return obj;
};

var merge = function merge(target, source, options) {
  /* eslint no-param-reassign: 0 */
  if (!source) {
    return target;
  }

  if (typeof source !== 'object') {
    if (isArray(target)) {
      target.push(source);
    } else if (target && typeof target === 'object') {
      if (options && (options.plainObjects || options.allowPrototypes) || !has.call(Object.prototype, source)) {
        target[source] = true;
      }
    } else {
      return [target, source];
    }

    return target;
  }

  if (!target || typeof target !== 'object') {
    return [target].concat(source);
  }

  var mergeTarget = target;

  if (isArray(target) && !isArray(source)) {
    mergeTarget = arrayToObject(target, options);
  }

  if (isArray(target) && isArray(source)) {
    source.forEach(function (item, i) {
      if (has.call(target, i)) {
        var targetItem = target[i];

        if (targetItem && typeof targetItem === 'object' && item && typeof item === 'object') {
          target[i] = merge(targetItem, item, options);
        } else {
          target.push(item);
        }
      } else {
        target[i] = item;
      }
    });
    return target;
  }

  return Object.keys(source).reduce(function (acc, key) {
    var value = source[key];

    if (has.call(acc, key)) {
      acc[key] = merge(acc[key], value, options);
    } else {
      acc[key] = value;
    }

    return acc;
  }, mergeTarget);
};

var assign = function assignSingleSource(target, source) {
  return Object.keys(source).reduce(function (acc, key) {
    acc[key] = source[key];
    return acc;
  }, target);
};

var decode = function (str, decoder, charset) {
  var strWithoutPlus = str.replace(/\+/g, ' ');

  if (charset === 'iso-8859-1') {
    // unescape never throws, no try...catch needed:
    return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
  } // utf-8


  try {
    return decodeURIComponent(strWithoutPlus);
  } catch (e) {
    return strWithoutPlus;
  }
};

var encode = function encode(str, defaultEncoder, charset, kind, format) {
  // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
  // It has been adapted here for stricter adherence to RFC 3986
  if (str.length === 0) {
    return str;
  }

  var string = str;

  if (typeof str === 'symbol') {
    string = Symbol.prototype.toString.call(str);
  } else if (typeof str !== 'string') {
    string = String(str);
  }

  if (charset === 'iso-8859-1') {
    return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
      return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
    });
  }

  var out = '';

  for (var i = 0; i < string.length; ++i) {
    var c = string.charCodeAt(i);

    if (c === 0x2D // -
    || c === 0x2E // .
    || c === 0x5F // _
    || c === 0x7E // ~
    || c >= 0x30 && c <= 0x39 // 0-9
    || c >= 0x41 && c <= 0x5A // a-z
    || c >= 0x61 && c <= 0x7A // A-Z
    || format === formats.RFC1738 && (c === 0x28 || c === 0x29) // ( )
    ) {
      out += string.charAt(i);
      continue;
    }

    if (c < 0x80) {
      out = out + hexTable[c];
      continue;
    }

    if (c < 0x800) {
      out = out + (hexTable[0xC0 | c >> 6] + hexTable[0x80 | c & 0x3F]);
      continue;
    }

    if (c < 0xD800 || c >= 0xE000) {
      out = out + (hexTable[0xE0 | c >> 12] + hexTable[0x80 | c >> 6 & 0x3F] + hexTable[0x80 | c & 0x3F]);
      continue;
    }

    i += 1;
    c = 0x10000 + ((c & 0x3FF) << 10 | string.charCodeAt(i) & 0x3FF);
    out += hexTable[0xF0 | c >> 18] + hexTable[0x80 | c >> 12 & 0x3F] + hexTable[0x80 | c >> 6 & 0x3F] + hexTable[0x80 | c & 0x3F];
  }

  return out;
};

var compact = function compact(value) {
  var queue = [{
    obj: {
      o: value
    },
    prop: 'o'
  }];
  var refs = [];

  for (var i = 0; i < queue.length; ++i) {
    var item = queue[i];
    var obj = item.obj[item.prop];
    var keys = Object.keys(obj);

    for (var j = 0; j < keys.length; ++j) {
      var key = keys[j];
      var val = obj[key];

      if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
        queue.push({
          obj: obj,
          prop: key
        });
        refs.push(val);
      }
    }
  }

  compactQueue(queue);
  return value;
};

var isRegExp = function isRegExp(obj) {
  return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var isBuffer = function isBuffer(obj) {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};

var combine = function combine(a, b) {
  return [].concat(a, b);
};

var maybeMap = function maybeMap(val, fn) {
  if (isArray(val)) {
    var mapped = [];

    for (var i = 0; i < val.length; i += 1) {
      mapped.push(fn(val[i]));
    }

    return mapped;
  }

  return fn(val);
};

module.exports = {
  arrayToObject: arrayToObject,
  assign: assign,
  combine: combine,
  compact: compact,
  decode: decode,
  encode: encode,
  isBuffer: isBuffer,
  isRegExp: isRegExp,
  maybeMap: maybeMap,
  merge: merge
};
},{"./formats":"node_modules/qs/lib/formats.js"}],"node_modules/qs/lib/stringify.js":[function(require,module,exports) {
'use strict';

var getSideChannel = require('side-channel');

var utils = require('./utils');

var formats = require('./formats');

var has = Object.prototype.hasOwnProperty;
var arrayPrefixGenerators = {
  brackets: function brackets(prefix) {
    return prefix + '[]';
  },
  comma: 'comma',
  indices: function indices(prefix, key) {
    return prefix + '[' + key + ']';
  },
  repeat: function repeat(prefix) {
    return prefix;
  }
};
var isArray = Array.isArray;
var push = Array.prototype.push;

var pushToArray = function (arr, valueOrArray) {
  push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
};

var toISO = Date.prototype.toISOString;
var defaultFormat = formats['default'];
var defaults = {
  addQueryPrefix: false,
  allowDots: false,
  charset: 'utf-8',
  charsetSentinel: false,
  delimiter: '&',
  encode: true,
  encoder: utils.encode,
  encodeValuesOnly: false,
  format: defaultFormat,
  formatter: formats.formatters[defaultFormat],
  // deprecated
  indices: false,
  serializeDate: function serializeDate(date) {
    return toISO.call(date);
  },
  skipNulls: false,
  strictNullHandling: false
};

var isNonNullishPrimitive = function isNonNullishPrimitive(v) {
  return typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean' || typeof v === 'symbol' || typeof v === 'bigint';
};

var stringify = function stringify(object, prefix, generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, sideChannel) {
  var obj = object;

  if (sideChannel.has(object)) {
    throw new RangeError('Cyclic object value');
  }

  if (typeof filter === 'function') {
    obj = filter(prefix, obj);
  } else if (obj instanceof Date) {
    obj = serializeDate(obj);
  } else if (generateArrayPrefix === 'comma' && isArray(obj)) {
    obj = utils.maybeMap(obj, function (value) {
      if (value instanceof Date) {
        return serializeDate(value);
      }

      return value;
    });
  }

  if (obj === null) {
    if (strictNullHandling) {
      return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, 'key', format) : prefix;
    }

    obj = '';
  }

  if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
    if (encoder) {
      var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, 'key', format);
      return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder, charset, 'value', format))];
    }

    return [formatter(prefix) + '=' + formatter(String(obj))];
  }

  var values = [];

  if (typeof obj === 'undefined') {
    return values;
  }

  var objKeys;

  if (generateArrayPrefix === 'comma' && isArray(obj)) {
    // we need to join elements in
    objKeys = [{
      value: obj.length > 0 ? obj.join(',') || null : undefined
    }];
  } else if (isArray(filter)) {
    objKeys = filter;
  } else {
    var keys = Object.keys(obj);
    objKeys = sort ? keys.sort(sort) : keys;
  }

  for (var i = 0; i < objKeys.length; ++i) {
    var key = objKeys[i];
    var value = typeof key === 'object' && key.value !== undefined ? key.value : obj[key];

    if (skipNulls && value === null) {
      continue;
    }

    var keyPrefix = isArray(obj) ? typeof generateArrayPrefix === 'function' ? generateArrayPrefix(prefix, key) : prefix : prefix + (allowDots ? '.' + key : '[' + key + ']');
    sideChannel.set(object, true);
    var valueSideChannel = getSideChannel();
    pushToArray(values, stringify(value, keyPrefix, generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, valueSideChannel));
  }

  return values;
};

var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
  if (!opts) {
    return defaults;
  }

  if (opts.encoder !== null && opts.encoder !== undefined && typeof opts.encoder !== 'function') {
    throw new TypeError('Encoder has to be a function.');
  }

  var charset = opts.charset || defaults.charset;

  if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
    throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
  }

  var format = formats['default'];

  if (typeof opts.format !== 'undefined') {
    if (!has.call(formats.formatters, opts.format)) {
      throw new TypeError('Unknown format option provided.');
    }

    format = opts.format;
  }

  var formatter = formats.formatters[format];
  var filter = defaults.filter;

  if (typeof opts.filter === 'function' || isArray(opts.filter)) {
    filter = opts.filter;
  }

  return {
    addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults.addQueryPrefix,
    allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
    charset: charset,
    charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
    delimiter: typeof opts.delimiter === 'undefined' ? defaults.delimiter : opts.delimiter,
    encode: typeof opts.encode === 'boolean' ? opts.encode : defaults.encode,
    encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults.encoder,
    encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
    filter: filter,
    format: format,
    formatter: formatter,
    serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults.serializeDate,
    skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults.skipNulls,
    sort: typeof opts.sort === 'function' ? opts.sort : null,
    strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
  };
};

module.exports = function (object, opts) {
  var obj = object;
  var options = normalizeStringifyOptions(opts);
  var objKeys;
  var filter;

  if (typeof options.filter === 'function') {
    filter = options.filter;
    obj = filter('', obj);
  } else if (isArray(options.filter)) {
    filter = options.filter;
    objKeys = filter;
  }

  var keys = [];

  if (typeof obj !== 'object' || obj === null) {
    return '';
  }

  var arrayFormat;

  if (opts && opts.arrayFormat in arrayPrefixGenerators) {
    arrayFormat = opts.arrayFormat;
  } else if (opts && 'indices' in opts) {
    arrayFormat = opts.indices ? 'indices' : 'repeat';
  } else {
    arrayFormat = 'indices';
  }

  var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

  if (!objKeys) {
    objKeys = Object.keys(obj);
  }

  if (options.sort) {
    objKeys.sort(options.sort);
  }

  var sideChannel = getSideChannel();

  for (var i = 0; i < objKeys.length; ++i) {
    var key = objKeys[i];

    if (options.skipNulls && obj[key] === null) {
      continue;
    }

    pushToArray(keys, stringify(obj[key], key, generateArrayPrefix, options.strictNullHandling, options.skipNulls, options.encode ? options.encoder : null, options.filter, options.sort, options.allowDots, options.serializeDate, options.format, options.formatter, options.encodeValuesOnly, options.charset, sideChannel));
  }

  var joined = keys.join(options.delimiter);
  var prefix = options.addQueryPrefix === true ? '?' : '';

  if (options.charsetSentinel) {
    if (options.charset === 'iso-8859-1') {
      // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
      prefix += 'utf8=%26%2310003%3B&';
    } else {
      // encodeURIComponent('✓')
      prefix += 'utf8=%E2%9C%93&';
    }
  }

  return joined.length > 0 ? prefix + joined : '';
};
},{"side-channel":"node_modules/side-channel/index.js","./utils":"node_modules/qs/lib/utils.js","./formats":"node_modules/qs/lib/formats.js"}],"node_modules/qs/lib/parse.js":[function(require,module,exports) {
'use strict';

var utils = require('./utils');

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;
var defaults = {
  allowDots: false,
  allowPrototypes: false,
  allowSparse: false,
  arrayLimit: 20,
  charset: 'utf-8',
  charsetSentinel: false,
  comma: false,
  decoder: utils.decode,
  delimiter: '&',
  depth: 5,
  ignoreQueryPrefix: false,
  interpretNumericEntities: false,
  parameterLimit: 1000,
  parseArrays: true,
  plainObjects: false,
  strictNullHandling: false
};

var interpretNumericEntities = function (str) {
  return str.replace(/&#(\d+);/g, function ($0, numberStr) {
    return String.fromCharCode(parseInt(numberStr, 10));
  });
};

var parseArrayValue = function (val, options) {
  if (val && typeof val === 'string' && options.comma && val.indexOf(',') > -1) {
    return val.split(',');
  }

  return val;
}; // This is what browsers will submit when the ✓ character occurs in an
// application/x-www-form-urlencoded body and the encoding of the page containing
// the form is iso-8859-1, or when the submitted form has an accept-charset
// attribute of iso-8859-1. Presumably also with other charsets that do not contain
// the ✓ character, such as us-ascii.


var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')
// These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.

var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

var parseValues = function parseQueryStringValues(str, options) {
  var obj = {};
  var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
  var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
  var parts = cleanStr.split(options.delimiter, limit);
  var skipIndex = -1; // Keep track of where the utf8 sentinel was found

  var i;
  var charset = options.charset;

  if (options.charsetSentinel) {
    for (i = 0; i < parts.length; ++i) {
      if (parts[i].indexOf('utf8=') === 0) {
        if (parts[i] === charsetSentinel) {
          charset = 'utf-8';
        } else if (parts[i] === isoSentinel) {
          charset = 'iso-8859-1';
        }

        skipIndex = i;
        i = parts.length; // The eslint settings do not allow break;
      }
    }
  }

  for (i = 0; i < parts.length; ++i) {
    if (i === skipIndex) {
      continue;
    }

    var part = parts[i];
    var bracketEqualsPos = part.indexOf(']=');
    var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;
    var key, val;

    if (pos === -1) {
      key = options.decoder(part, defaults.decoder, charset, 'key');
      val = options.strictNullHandling ? null : '';
    } else {
      key = options.decoder(part.slice(0, pos), defaults.decoder, charset, 'key');
      val = utils.maybeMap(parseArrayValue(part.slice(pos + 1), options), function (encodedVal) {
        return options.decoder(encodedVal, defaults.decoder, charset, 'value');
      });
    }

    if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
      val = interpretNumericEntities(val);
    }

    if (part.indexOf('[]=') > -1) {
      val = isArray(val) ? [val] : val;
    }

    if (has.call(obj, key)) {
      obj[key] = utils.combine(obj[key], val);
    } else {
      obj[key] = val;
    }
  }

  return obj;
};

var parseObject = function (chain, val, options, valuesParsed) {
  var leaf = valuesParsed ? val : parseArrayValue(val, options);

  for (var i = chain.length - 1; i >= 0; --i) {
    var obj;
    var root = chain[i];

    if (root === '[]' && options.parseArrays) {
      obj = [].concat(leaf);
    } else {
      obj = options.plainObjects ? Object.create(null) : {};
      var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
      var index = parseInt(cleanRoot, 10);

      if (!options.parseArrays && cleanRoot === '') {
        obj = {
          0: leaf
        };
      } else if (!isNaN(index) && root !== cleanRoot && String(index) === cleanRoot && index >= 0 && options.parseArrays && index <= options.arrayLimit) {
        obj = [];
        obj[index] = leaf;
      } else {
        obj[cleanRoot] = leaf;
      }
    }

    leaf = obj;
  }

  return leaf;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
  if (!givenKey) {
    return;
  } // Transform dot notation to bracket notation


  var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey; // The regex chunks

  var brackets = /(\[[^[\]]*])/;
  var child = /(\[[^[\]]*])/g; // Get the parent

  var segment = options.depth > 0 && brackets.exec(key);
  var parent = segment ? key.slice(0, segment.index) : key; // Stash the parent if it exists

  var keys = [];

  if (parent) {
    // If we aren't using plain objects, optionally prefix keys that would overwrite object prototype properties
    if (!options.plainObjects && has.call(Object.prototype, parent)) {
      if (!options.allowPrototypes) {
        return;
      }
    }

    keys.push(parent);
  } // Loop through children appending to the array until we hit depth


  var i = 0;

  while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
    i += 1;

    if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
      if (!options.allowPrototypes) {
        return;
      }
    }

    keys.push(segment[1]);
  } // If there's a remainder, just add whatever is left


  if (segment) {
    keys.push('[' + key.slice(segment.index) + ']');
  }

  return parseObject(keys, val, options, valuesParsed);
};

var normalizeParseOptions = function normalizeParseOptions(opts) {
  if (!opts) {
    return defaults;
  }

  if (opts.decoder !== null && opts.decoder !== undefined && typeof opts.decoder !== 'function') {
    throw new TypeError('Decoder has to be a function.');
  }

  if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
    throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
  }

  var charset = typeof opts.charset === 'undefined' ? defaults.charset : opts.charset;
  return {
    allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
    allowPrototypes: typeof opts.allowPrototypes === 'boolean' ? opts.allowPrototypes : defaults.allowPrototypes,
    allowSparse: typeof opts.allowSparse === 'boolean' ? opts.allowSparse : defaults.allowSparse,
    arrayLimit: typeof opts.arrayLimit === 'number' ? opts.arrayLimit : defaults.arrayLimit,
    charset: charset,
    charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
    comma: typeof opts.comma === 'boolean' ? opts.comma : defaults.comma,
    decoder: typeof opts.decoder === 'function' ? opts.decoder : defaults.decoder,
    delimiter: typeof opts.delimiter === 'string' || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
    // eslint-disable-next-line no-implicit-coercion, no-extra-parens
    depth: typeof opts.depth === 'number' || opts.depth === false ? +opts.depth : defaults.depth,
    ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
    interpretNumericEntities: typeof opts.interpretNumericEntities === 'boolean' ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
    parameterLimit: typeof opts.parameterLimit === 'number' ? opts.parameterLimit : defaults.parameterLimit,
    parseArrays: opts.parseArrays !== false,
    plainObjects: typeof opts.plainObjects === 'boolean' ? opts.plainObjects : defaults.plainObjects,
    strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
  };
};

module.exports = function (str, opts) {
  var options = normalizeParseOptions(opts);

  if (str === '' || str === null || typeof str === 'undefined') {
    return options.plainObjects ? Object.create(null) : {};
  }

  var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
  var obj = options.plainObjects ? Object.create(null) : {}; // Iterate over the keys and setup the new object

  var keys = Object.keys(tempObj);

  for (var i = 0; i < keys.length; ++i) {
    var key = keys[i];
    var newObj = parseKeys(key, tempObj[key], options, typeof str === 'string');
    obj = utils.merge(obj, newObj, options);
  }

  if (options.allowSparse === true) {
    return obj;
  }

  return utils.compact(obj);
};
},{"./utils":"node_modules/qs/lib/utils.js"}],"node_modules/qs/lib/index.js":[function(require,module,exports) {
'use strict';

var stringify = require('./stringify');

var parse = require('./parse');

var formats = require('./formats');

module.exports = {
  formats: formats,
  parse: parse,
  stringify: stringify
};
},{"./stringify":"node_modules/qs/lib/stringify.js","./parse":"node_modules/qs/lib/parse.js","./formats":"node_modules/qs/lib/formats.js"}],"src/chord-display/settings.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSetting = getSetting;
exports.setSetting = setSetting;
exports.initSettings = initSettings;

var _ui = require("./ui");

var _qs = _interopRequireDefault(require("qs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import { selectMIDIIn } from "./midi";
var DEFAULT_SETTINGS = {
  midiIn: null,
  noteStart: "A0",
  noteEnd: "C8",
  latinNotationEnabled: false,
  pitchWheelEnabled: false,
  modWheelEnabled: false,
  colorNote: "#bf3a2b",
  colorPitchWheelDown: "#bf3a2b",
  colorPitchWheelUp: "#44ffaa",
  colorModWheel: "#44bbff",
  hideKeyboard: false,
  hideNotes: false,
  hideChord: false,
  hideBassNote: false,
  hideKeyName: false,
  hideTonic: false
};
var customSettings = {};

function getSetting(name) {
  return customSettings[name] !== undefined ? customSettings[name] : DEFAULT_SETTINGS[name];
}

function setSetting(name, value) {
  customSettings[name] = value;
  saveQueryParams();
}

function qsValueDecoder(str, decoder, charset) {
  if (!Number.isNaN(Number(str))) return Number(str);
  if (str === "true") return true;
  if (str === "false") return false; // https://github.com/ljharb/qs/blob/master/lib/utils.js

  var strWithoutPlus = str.replace(/\+/g, " ");

  if (charset === "iso-8859-1") {
    // unescape never throws, no try...catch needed:
    return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
  } // utf-8


  try {
    return decodeURIComponent(strWithoutPlus);
  } catch (e) {
    return strWithoutPlus;
  }
}

function parseQueryParams() {
  var newSettings = _qs.default.parse(window.location.search, {
    depth: 0,
    parseArrays: false,
    ignoreQueryPrefix: true,
    decoder: qsValueDecoder
  });

  Object.assign(customSettings, newSettings);
}

function saveQueryParams() {
  var queryParams = _qs.default.stringify(customSettings, {
    addQueryPrefix: true
  });

  window.history.pushState(customSettings, "settings update", queryParams);
}

function onSettingChange(setting, evt) {
  if (setting === "midiIn") {
    selectMIDIIn(evt);
    (0, _ui.render)(true);
    return;
  }

  var target = evt.target;

  if (target.type === "checkbox") {
    setSetting(setting, !!target.checked);
  }

  if (target.type === "text" || target.type === "color") {
    setSetting(setting, target.value);
  }

  (0, _ui.render)();
}

function initSettings() {
  parseQueryParams();

  for (var _i = 0, _Object$keys = Object.keys(DEFAULT_SETTINGS); _i < _Object$keys.length; _i++) {
    var setting = _Object$keys[_i];
    var element = document.getElementById(setting);

    if (element.type === "checkbox") {
      element.checked = getSetting(setting);
    }

    if (element.type === "text" || element.type === "color") {
      element.value = getSetting(setting);
    } //element.addEventListener("input", onSettingChange.bind(null, setting));

  }
}
},{"./ui":"src/chord-display/ui.js","qs":"node_modules/qs/lib/index.js"}],"src/chord-display/index.js":[function(require,module,exports) {
"use strict";

require("./styles.css");

var _settings = require("./settings");

var _ui = require("./ui");

//import { initializeMidi } from './midi';
//let initialized = false;
(0, _settings.initSettings)(); //init: start up MIDI
// if (!initialized) {
//   initializeMidi();
//   initialized = true;
// }

(0, _ui.render)();
},{"./styles.css":"src/chord-display/styles.css","./settings":"src/chord-display/settings.js","./ui":"src/chord-display/ui.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62916" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/chord-display/index.js"], null)
//# sourceMappingURL=/chord-display.46eebead.js.map