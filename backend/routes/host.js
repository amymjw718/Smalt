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
  console.log("gotaccessTokens");
  console.log(accessAndRefreshTokens);
  var hostUserName = await spotify.getUsername(accessAndRefreshTokens.accessToken);
  var host = await query.createNewHost(accessAndRefreshTokens, hostUserName);
  console.log(host);
  if (host) {
    console.log(host);
    res.status(200).send(hostUserName);
  }
});

router.post("/new", async (req, res) => {
  console.log("endpoint req");
  hostUsername = req.body.userName;
  console.log(hostUsername);
  var host_id = await query.getHostById(hostUsername);
  var code = await query.createNewRoom(host_id, req.body.name);
  // var trackToBePlayed = {
  //   id: "0",
  // };
  // console.log("code");
  // console.log(code);
  // var accessToken = await query.getAccessToken(code);
  // console.log(accessToken);
  // var playbackPoller = window.setInterval(spotify.pollPlayback, 1000, accessToken, trackToBePlayed);
  res.status(200).send(code);
});

router.post("/play", async (req, res) => {
    
  console.log(req.body);
  room = req.body.room;
  var song =await query.highestVotedSong(room)
  console.log(song);
  var token = await query.getAccessToken(room);
  
  await spotify.playSong(token,song);
  await query.moveToCurrent(song.id,room);
  io.broadcastSongPlaying(room, song);

  
  doPoll(token, song);
});

async function doPoll(tokenn, sonng){
  var token = tokenn;
  var song = sonng;
  return playbackPoller = window.setInterval(pollSpotify, 1000, token, song);
}

async function pollSpotify(){
  var same = await spotify.pollPlayback(token,song);
  if(!same){
    console.log("retardAlert")
  }else{
    console.log(".")
  }
}

module.exports = router;