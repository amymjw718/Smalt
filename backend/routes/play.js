var express = require('express');
const queries = require("../db/queries");
const spotify = require('../Spotify/spotifyHandler');
const sockets = require('../Sockets/socketMgr');
const Timer = require("tiny-timer");
const DELAY = 2000;

var router = express.Router();


router.put('/toggleplay', async (req, res)  => {
    const roomCode = req.body.roomCode;
    const token = await queries.getAccessToken(roomCode);
    console.log(roomCode)
    var currentSong = await queries.getCurrentSong(req.body.roomCode);

    //not the right check for playing 
    //const playing = currentSong.id;
    const playing = false;
    if (!playing) {
        timer = new Timer({ stopwatch: true });
        console.log("no current song")
        startNextSong(roomCode,timer);
        const updatedPlaylist = await queries.getAllSongs(roomCode);
        sockets.broadcastUpdatedPlaylist(roomCode, updatedPlaylist.songs);
    } else {
        if(currentSong.isPlaying) {
            await spotify.togglePause(token, "");
        } else {
            await spotify.togglePlay(true, token, currentSong.id, ""); 
        }
        currentSong = await queries.toggleCurrentPlaying(roomCode);
        console.log("after toggle in endpoint")
        console.log(currentSong)
        sockets.broadcastSongPlaying(roomCode, currentSong);
    }

    res.status(204).send();
});

async function startNextSong(roomCode, timer){

    currentSong = await queries.moveToCurrent(roomCode);
    const token = await queries.getAccessToken(roomCode);
    playlist = await queries.getAllSongs(roomCode);
    console.log(`playlist: ${playlist.songs}`);
    console.log(`duration: ${currentSong.songDuration}`);
    await spotify.togglePlay(false, token, currentSong.id, "");
    sockets.broadcastSongPlaying(roomCode, currentSong);
    sockets.broadcastUpdatedPlaylist(roomCode,playlist.songs);
    songDuration =currentSong.songDuration
    console.log(songDuration * 1000 + DELAY);
    console.log(roomCode);
    timer.on("done", () => {   
        console.log("finished song")
        console.log(playlist.songs);
        if(playlist.songs.length>0){
            console.log("not empty")
        startNextSong(roomCode,timer)   
        }else{
            console.log("empty");
            sockets.broadcastSongPlaying(roomCode, []);
        }
    });
    timer.start(
        //songDuration * 1000 + DELAY
        3000
        );

}

module.exports = router;