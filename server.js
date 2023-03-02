var express = require("express");
var cors = require("cors");
const axios = require("axios");
require("dotenv").config();
var bodyParser = require("body-parser");

const CLIENT_ID = process.env.VITE_CLIENT_ID;
const CLIENT_SECRET = process.env.VITE_CLIENT_SECRET;

var app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/getAccessToken", async function (req, res) {
  const params = `?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${req.query.code}`;
  await axios({
    method: "POST",
    url: `https://github.com/login/oauth/access_token${params}`,
    headers: {
      Accept: "application/json",
    },
  }).then((response) => {
    return res.json(response.data);
  });
});

app.listen(4000, () => {
  console.log("server on port 4000");
});
