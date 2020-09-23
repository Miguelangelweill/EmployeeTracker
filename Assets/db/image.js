const asciify = require("asciify-image");

const options = {
  fit: "box",
  width: 40,
  height: 30,
};
function welcomeImage() {
  asciify("Assets/images/welcomeImage.png", options)
    .then(function (asciified) {
      // Print asciified image to console
      console.table(asciified);
    })
    .catch(function (err) {
      // Print error to console
      console.error(err);
    });
}

module.exports=welcomeImage;
