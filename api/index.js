const express = require("express");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
require("dotenv").config();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const TOTAL_TRACKS = 3;
const token_url = "https://accounts.spotify.com/api/token";
const track_url =
  "https://api.spotify.com/v1/playlists/3cEYpjA9oz9GiPac4AsH4n/tracks";

const app = express();
const staticPath = path.join(__dirname, "../public");
app.use(express.static(staticPath));

const getJsonDataFromFile = (filePath, res) => {
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read data from file" });
    }
    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (e) {
      res.status(500).json({ error: "Failed to parse json data" });
    }
  });
};

app.get("/artists", (_, res) => {
    const filePath = path.join(__dirname, "data/artists.json");
  
    getJsonDataFromFile(filePath, res);
  });
  
  app.get("/albums", (_, res) => {
    const filePath = path.join(__dirname, "data/albums.json");
  
    getJsonDataFromFile(filePath, res);
  });
  
  app.get("/charts", (_, res) => {
    const filePath = path.join(__dirname, "data/charts.json");
  
    getJsonDataFromFile(filePath, res);
  });


let accessToken = null
let tokenExpiration = null

const fetchAccessToken = async () => {
  try {
    const response = await axios.post(token_url, null, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        grant_type: "client_credentials",
        client_id: `${client_id}`,
        client_secret: `${client_secret}`,
      },
    });
    accessToken = response.data.access_token
    tokenExpiration = Date.now() + response.data.expires_in * 1000; // Set expiration time
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw new Error("Could not fetch access token");
  }
};

app.get("/tracks", async (_, res) => {
  if (!accessToken || Date.now() >= tokenExpiration) {
    try {
      await fetchAccessToken(); 
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch access token" });
    }
  }
  try {
    const response = await axios.get(track_url, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      params: {
        limit: TOTAL_TRACKS,
        fields:'items(track(id,name,preview_url,album(images),artists(name)))'
      },
    });

    const data = response.data;
    return res.json(data);
  } catch (err) {
    console.error("failed to get tracks");
    return res.status(500).json({ error: "Failed to fetch tracks" });
  }
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
