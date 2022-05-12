const express = require("express");
const axios = require("axios");
const qs = require("qs");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8080;
app.listen(port);
console.log("App is listening on port " + port);
const client_id = process.env.SPOTIFY_API_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH;
let access_token;

const auth_token = Buffer.from(
  client_id + ":" + client_secret,
  "utf-8"
).toString("base64");

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
      console.log(access_token);
    })
    .catch((error) => {
      console.log(error);
    });
}

app.get("/token", (req, res) => {
  res.json({
    accessToken: access_token,
  });
});

getToken();
setInterval(getToken, 1000 * 60 * 55);

async function getPlaylistTracks() {
  const playlist_id = "3lTTllTnRJdf4PDUz54zE4";
  const accessToken = await getAuth();
  const api_url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;
  try {
    const response = await axios.get(api_url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}

async function searchSong(search) {
  const accessToken = await getAuth();
  const api_url = `https://api.spotify.com/v1/search?query=${search}&type=track&limit=5`;
  try {
    const response = await axios.get(api_url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.tracks.items;
  } catch (error) {
    console.log(error);
  }
}

async function addToPlaylist(uri) {
  console.log(uri);
  const accessToken = await getAuth();
  console.log(accessToken);
  const playlist_id = "3lTTllTnRJdf4PDUz54zE4";
  const api_url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?uri={uri}`;
  try {
    const response = await axios.post(api_url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

app.use(express.json({ limit: "1mb" }));

app.post("/auth/searchTitle", async (req, res) => {
  console.log("HELLO");
  const searchedTracks = await searchSong(req.body.song);
  res.json({
    searchedTracks: searchedTracks,
  });
});

app.post("/auth/playlist", async (req, res) => {
  await addToPlaylist(req.body.uri);
  res.json({
    status: "successs",
  });
});

app.get("/auth/playlist", async (req, res) => {
  const playlist = await getPlaylistTracks();
  res.json({
    playlistTracks: playlist.data.items,
  });
});
