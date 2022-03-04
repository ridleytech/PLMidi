var fs = require("fs");

var stuff = fs.readFileSync("./dist/index.html").toString();

//console.log("stuff: " + typeof stuff);

//return;

var new1 = stuff.replace(/url\(\//g, "url(./");
new1 = new1.replace(/src\=\"\//g, 'src="./');
new1 = new1.replace(/href\=\"\//g, 'href="./');

fs.writeFile("./dist/index.html", new1, (ev) => {
  console.log("finished file");
});
