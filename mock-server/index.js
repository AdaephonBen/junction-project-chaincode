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
  const { eventLat, eventLong, carLat, carLong, carOrientation } = req.body;
  const fieldOfView = 135; // Human eye has a horizontal FOV of 135 degrees
  const farthestDistance = 10; // Assumed to be 10 metres for now

  const eventLocation = geolocationUtils.createLocation(
    eventLat,
    eventLong,
    "LatLon"
  );
  const carLocation = geolocationUtils.createLocation(
    carLat,
    carLong,
    "LatLon"
  );
  const headingDistance = geolocationUtils.headingDistanceTo(
    carLocation,
    eventLocation
  );
  const withinFOV = isAngleBetween(
    mod(carOrientation - fieldOfView / 2, 360),
    mod(carOrientation + fieldOfView / 2, 360),
    headingDistance.heading
  );

  if (headingDistance.distance < farthestDistance && withinFOV) {
    res.send("Yes");
  } else {
    res.send("Don't know");
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
