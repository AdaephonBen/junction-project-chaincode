const app = require("express")();
const bodyParser = require("body-parser");
const geolocationUtils = require("geolocation-utils");

app.use(bodyParser.json()); // for parsing application/json

const port = 3000;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

const isAngleBetween = (rangeAngle1, rangeAngle2, angle) => {
  rangeAngle1 -= rangeAngle1;
  rangeAngle2 -= rangeAngle1;
  angle -= rangeAngle1;
  if (rangeAngle1 < 0) {
    rangeAngle1 += 360;
  }
  if (rangeAngle2 < 0) {
    rangeAngle2 += 360;
  }
  if (angle < 0) {
    angle += 360;
  }
  return angle < rangeAngle2;
};

function mod(n, m) {
  return ((n % m) + m) % m;
}

app.post("/check", (req, res) => {
  res.send("Yes");
  console.log("Request came from ", req.ip);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
