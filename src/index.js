import { FancyMidiPlayer } from "./midi";
import "babel-polyfill";
const createMusicalPiece = (id, name, path) => ({ id, name, path });

var url = "https://pianolessonwithwarren.com/dev_site";

//url = "http://localhost:8888/pianolesson";

const pieces = [
  createMusicalPiece(
    0,
    "Pass Me Not - Advanced",
    "../assets/Pass Me Not - Advanced.mid"
  ),
  // createMusicalPiece(
  //   1,
  //   "Chopin - Etude 25 No. 1",
  //   "../assets/chopin_etude25_1.mid"
  // ),
  // createMusicalPiece(2, "Chopin - Op. 27 No. 1", "../assets/chopin_op27_1.mid"),
  // createMusicalPiece(
  //   3,
  //   "Chopin - Ballade no.1 G minor",
  //   "../assets/chopin_ballade23_g_minor.mid"
  // ),
  // createMusicalPiece(4, "Mozart - Minuet", "../assets/mozart_minuet.mid"),
  // createMusicalPiece(5, "Death Waltz", "../assets/death_waltz.mid"),
  // createMusicalPiece(
  //   6,
  //   "Elgar - Salut D'Amour",
  //   "../assets/elgar_salut_amour.mid"
  // ),
  // createMusicalPiece(
  //   7,
  //   "Liszt - Liebestraum",
  //   "../assets/liszt_liebestraum.mid"
  // ),
  // createMusicalPiece(
  //   8,
  //   "Bach - Invention 773",
  //   "../assets/bach_inventions_773.mid"
  // ),
  // createMusicalPiece(
  //   9,
  //   "Bach - Invention 774",
  //   "../assets/bach_inventions_774.mid"
  // ),
  // createMusicalPiece(
  //   10,
  //   "Bach - Invention 775",
  //   "../assets/bach_inventions_775.mid"
  // ),
  // createMusicalPiece(11, "Wiz", "../assets/wiz.mid"),
];

const instrumentUrl =
  "https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/gh-pages/FatBoy/bright_acoustic_piano-mp3.js";

const setAppBusy = (isBusy) => {
  const playButton = document.querySelector("#play-piece");
  const stopButton = document.querySelector("#stop-piece");

  const pauseButton = document.querySelector("#pause-piece");
  const musicalPiecesSelect = document.querySelector("#musical-pieces");

  if (isBusy) {
    playButton.setAttribute("disabled", true);
    stopButton.setAttribute("disabled", true);
    //pauseButton.setAttribute("disabled", true);
    //musicalPiecesSelect.setAttribute("disabled", true);
  } else {
    playButton.removeAttribute("disabled");
    stopButton.removeAttribute("disabled");
    //pauseButton.removeAttribute("disabled");
    //musicalPiecesSelect.removeAttribute("disabled");
  }
};

// var slider = document.getElementById("myRange");
// var output = document.getElementById("tempo-display");
//output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)

//output.innerHTML = "Tempo: " + this.value;
//output.innerHTML = "Tempo: 120 bpm";

// slider.oninput = function () {
//   output.innerHTML = "Tempo: " + this.value + " bpm";
//   fmp.setTempo(this.value);
// };

const fmp = new FancyMidiPlayer(document);
setAppBusy(true);
fmp.setInstrument(instrumentUrl).then(() => {
  const playButton = document.querySelector("#play-piece");
  const stopButton = document.querySelector("#stop-piece");

  //const pauseButton = document.querySelector("#pause-piece");
  playButton.onclick = fmp.manageMidi.bind(fmp);
  stopButton.onclick = fmp.stopMidi.bind(fmp);
  //pauseButton.onclick = fmp.pauseMidi.bind(fmp);
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

document.querySelector("#tempo").addEventListener("change", function (e) {
  //console.log("e: " + e.target.value);

  fmp.setTempo(e.target.value);
});

document.querySelector("#musical-piece").addEventListener(
  "change",
  function (e) {
    var file = this.files[0];

    console.log("the file: ", file);

    if (!file) return;

    var fd = new FormData();
    fd.append("afile", file);
    // These extra params aren't necessary but show that you can include other data.
    //fd.append("username", "Groucho");

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url + "/MIDI/upload.php", true);

    xhr.upload.onprogress = function (e) {
      if (e.lengthComputable) {
        var percentComplete = (e.loaded / e.total) * 100;
        console.log(percentComplete + "% uploaded");
      }
    };

    xhr.onload = function () {
      if (this.status == 200) {
        var resp = JSON.parse(this.response);

        console.log("Server got:", resp);

        if (resp.data.uploadData.status == "media upload") {
          console.log("we good: " + resp.data.uploadData.filename);

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

  var newpath = url + "/MIDI/uploads/" + path;

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
