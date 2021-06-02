var express = require("express");
const queries = require("../db/queries");
const spotify = require("../Spotify/spotifyHandler");
const sockets = require("../Sockets/socketMgr");
const Timer = require("tiny-timer");

var router = express.Router();

let roomTimerMap = new Map();

router.put("/toggleplay", async (req, res) => {
  const roomCode = req.body.roomCode;
  const token = await queries.getAccessToken(roomCode);
  console.log(roomCode);
  var currentSong = await queries.getCurrentSong(req.body.roomCode);

  const playing = currentSong.id;
  if (!playing) {
    var timer = new Timer({ interval: 1000, stopwatch: false });
    roomTimerMap.set(roomCode, timer);
    console.log("no current song");
    await startSong(roomCode, token, timer);
  } else {
    if (currentSong.isPlaying) {
      await spotify.togglePause(token, "");
    } else {
      await spotify.togglePlay(true, token, currentSong.id, "");
    }
    currentSong = await queries.toggleCurrentPlaying(roomCode);
    console.log("after toggle in endpoint");
    console.log(currentSong);
    sockets.broadcastSongPlaying(roomCode, currentSong);
  }

  res.status(204).send();
});

async function startSong(roomCode, token, timer) {
  var currentSong = await queries.moveToCurrent(roomCode);
  const updatedPlaylist = await queries.getAllSongs(roomCode);
  sockets.broadcastSongPlaying(roomCode, currentSong);
  sockets.broadcastUpdatedPlaylist(roomCode, updatedPlaylist.songs);

  const res = await spotify.togglePlay(false, token, currentSong.id, "");
  console.log(res.status);

  var currentSongInfo;

  timer.on("tick", async (ms) => {
    currentSongInfo = await spotify.currentSongInfo(token);
    if (currentSongInfo.progress_ms === 0 && currentSongInfo.item) {
      nextSong(roomCode, token, timer);
    }
    console.log(`progress of ${currentSongInfo.item.name}`);
    console.log(currentSongInfo.progress_ms);
  });
  timer.start(99999999);
}

async function nextSong(roomCode, token, timer) {
  const playlist = await queries.getAllSongs(roomCode);
  if (playlist.songs.length === 0) {
    sockets.broadcastSongPlaying(roomCode, {});
    timer.pause();
    return;
  } else {
    var currentSong = await queries.moveToCurrent(roomCode);
  }

  const updatedPlaylist = await queries.getAllSongs(roomCode);
  sockets.broadcastSongPlaying(roomCode, currentSong);
  sockets.broadcastUpdatedPlaylist(roomCode, updatedPlaylist.songs);

  const res = await spotify.togglePlay(false, token, currentSong.id, "");
  console.log(res.status);
  timer.start(99999999);
}

module.exports = router;
