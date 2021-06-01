var express = require('express');
const queries = require("../db/queries");
const spotify = require('../Spotify/spotifyHandler');
const sockets = require('../Sockets/socketMgr');


var router = express.Router();


router.put('/toggleplay', async (req, res)  => {
    const roomCode = req.body.roomCode;
    const token = await queries.getAccessToken(roomCode);
    console.log(roomCode)
    var currentSong = await queries.getCurrentSong(req.body.roomCode);
    if (!currentSong.id) {
        console.log("no current song")
        currentSong = await queries.moveToCurrent(roomCode);
        await spotify.togglePlay(false, token, currentSong.id, "");
        sockets.broadcastSongPlaying(roomCode, currentSong);
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

module.exports = router;