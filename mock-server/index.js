const app = require("express")();
const bodyParser = require("body-parser");

app.use(bodyParser.json()); // for parsing application/json

const port = 3000;

app.post("/check", (req, res) => {
  res.send("Yes");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
