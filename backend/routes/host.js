var express = require('express');
const axios = require('axios');
const query = require("../db/queries");
const spotify = require("../Spotify/spotifyHandler")


var router = express.Router();

router.post("/login", async (req, res) => {
  console.log(`authrequest recieved: ${req.body.authCode}`);
  var accessAndRefreshTokens = await spotify.fetchAccessToken(
    req.body.authCode
  );
  
  
  var hostUserName = await spotify.getUsername(accessAndRefreshTokens.accessToken);
  var host = query.getHostById(hostUserName);
  if(!host){
    host = await query.createNewHost(accessAndRefreshTokens, hostUserName);
  }
  if (host) {
    res.status(200).send(hostUserName);
  }else{
    res.status(500)
  }
});

router.post("/new", async (req, res) => {
  
  hostUsername = req.body.userName;
  
  var host_id = await query.getHostById(hostUsername);
  var code = await query.createNewRoom(host_id, req.body.name);
  // var trackToBePlayed = {
  //   id: "0",
  // };
  // 
  // 
  // var accessToken = await query.getAccessToken(code);
  // 
  // var playbackPoller = window.setInterval(spotify.pollPlayback, 1000, accessToken, trackToBePlayed);
  res.status(200).send(code);
});

module.exports = router;