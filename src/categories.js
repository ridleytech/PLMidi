var url = "https://pianolessonwithwarren.com/dev_site";

url = "http://localhost:8888/pianolesson";

var myMidiCategories;

getCategories();

const getCategories = (file) => {
  console.log("getFiles");
  var debug = false;

  var xhr = new XMLHttpRequest();
  xhr.open("GET", url + "/PLMidi/getmidicategories.php", true);

  xhr.onload = function () {
    if (this.status == 200) {
      var resp = JSON.parse(this.response);

      console.log("categories:", resp);

      myMidiCategories = resp.data.uploadData.files;

      var str = "";

      myMidiCategories.forEach((element) => {
        str +=
          "<div>" +
          element.categoryname +
          '<a href="' +
          element.categoryid +
          '">' +
          "Edit" +
          "</a></div>";
      });

      document.getElementById("categories").innerHTML = str;

      //console.log("getFiles");

      //   if (file) {
      //     var x = document
      //       .getElementById("midicategories")
      //       .querySelectorAll('option[value="' + categoryid + '"]');
      //     if (x.length === 1) {
      //       //console.log(x[0].index);
      //       document.getElementById("midicategories").selectedIndex = x[0].index;
      //     }
      //   }
    }
  };

  xhr.send();
};
