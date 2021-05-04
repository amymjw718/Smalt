var express = require("express");
var router = express.Router();
const spotify = require("../Spotify/spotifyHandler.js");
const query = require("../db/queries");
const connect = require("../db/connect");

router.get("/auth", async (req, res) => {
  res.json(spotify.createAuthRequest(req.query.uri));
});

router.post("/auth/code", async (req, res) => {
  var accessAndRefreshTokens = await spotify.fetchAccessToken(
    req.body.authCode
  );
  var hostUserName = req.body.userName;
  console.log(`accesstoken: ${accessAndRefreshTokens.accessToken}`);
  console.log(`username: ${hostUserName}`);
  connect.connectToDatabase();
  console.log(await query.createNewRoom(accessAndRefreshTokens, hostUserName));
});

module.exports = router;