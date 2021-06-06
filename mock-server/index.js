const app = require("express")();
const bodyParser = require("body-parser");

app.use(bodyParser.json()); // for parsing application/json

const port = 3000;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

app.post("/check", (req, res) => {
  const random = getRandomInt(0, 3);
  if (random == 0) {
    res.send("No");
  } else if (random == 1) {
    res.send("Yes");
  } else {
    res.send("Don't know");
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
