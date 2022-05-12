const express = require("express");
const axios = require("axios");
const qs = require("qs");
require("dotenv").config();
path = require("path");

const app = express();
const port = process.env.PORT || 8080;
app.use(express.static(path.join(__dirname, "../build")));
app.listen(port);
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../build", "index.html"));
});
//hidden constants
const client_id = process.env.SPOTIFY_API_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH;

//global access token to access anywhere
let access_token;

//Authentication encoding
const auth_token = Buffer.from(
  client_id + ":" + client_secret,
  "utf-8"
).toString("base64");

//gets new access token from spotify via refresh token
function getToken() {
  axios({
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    data: qs.stringify({
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth_token}`,
    },
  })
    .then((response) => {
      access_token = response.data.access_token;
    })
    .catch((error) => {
      console.log(error);
    });
}

//endpoint for react to recieve access token
app.get("/token", (req, res) => {
  res.json({
    accessToken: access_token,
  });
});

//get initial access token
getToken();

//every 55 minutes, generate new access token
setInterval(getToken, 1000 * 60 * 55);
