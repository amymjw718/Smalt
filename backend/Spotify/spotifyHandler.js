var express = require('express');
var router = express.Router();
const axios = require('axios');
var bodyParser = require('body-parser');

//our spotify app keys
const clientId = '0a6cf31ec5bf4808831e58a7bb937cc7';
const clientSecret = '25b3362597014da293b32f9d99bca194';

var access_token = null;
var refresh_token = null;

//spotify api endpoints
const AUTHORIZE = "https://accounts.spotify.com/authorize"
const TOKEN = "https://accounts.spotify.com/api/token";
const USERNAME = "https://api.spotify.com/v1/me"
const PLAYLISTS = "https://api.spotify.com/v1/me/playlists";
const DEVICES = "https://api.spotify.com/v1/me/player/devices";
const PLAY = "https://api.spotify.com/v1/me/player/play";
const PAUSE = "https://api.spotify.com/v1/me/player/pause";
const NEXT = "https://api.spotify.com/v1/me/player/next";
const PREVIOUS = "https://api.spotify.com/v1/me/player/previous";
const PLAYER = "https://api.spotify.com/v1/me/player";
const TRACKS = "https://api.spotify.com/v1/playlists/{{PlaylistId}}/tracks";
const GETTRACK = "https://api.spotify.com/v1/tracks/";
const CURRENTLYPLAYING = "https://api.spotify.com/v1/me/player/currently-playing";
const SHUFFLE = "https://api.spotify.com/v1/me/player/shuffle";
const SEARCH = "https://api.spotify.com/v1/search";

function getHeaders(token){

    let headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    }
    return headers;
}

exports.getUsername = async function (token){
    headers = getHeaders(token);

    res = await axios.get(USERNAME, { headers: headers }).catch(err => {
        console.log("ahh");
        console.log(err.response.data);
    });
    console.log(res)
    return res.data.display_name;
}
//this function creates string which redirects user to spotify with login prompt and returns it. User is redirected by frontend.
//redirectUri Must be approved in spotify
exports.createAuthRequest = function (redirectUri) {
    let url = AUTHORIZE;
    url += "?client_id=" + clientId;
    url += "&response_type=code";
    // url += "&redirect_uri=" + encodeURI('http://localhost:3000');
    url += "&redirect_uri=" + encodeURI(redirectUri);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    return url;
}

exports.getDevices= async function(token){
    headers = getHeaders(token);
    res = await axios.get(DEVICES, { headers: headers }).catch(err =>{
        console.log(err.response.data);
    });
    console.log(res.data)
    formatted = {name : res.data.name, id: res.data.id}
    return formatted;
}

exports.playSong = async function(token, song_id, device_id){
    headers = getHeaders(token);
    body = {context_uri : "spotify:tracks:" + song_id}
    config = {
        headers: headers,
        params: device_id
    }
    console.log(body);
    res = await axios.put(PLAY, body,config).catch(err =>{
        console.log(err.response.data);
    });
    console.log(res.data)
    formatted = {name : res.data.name, id: res.data.id}
    return formatted;
}

exports.createSearchQuery = function (searchTerm) {
    let url = SEARCH;
    url += "?q=" + searchTerm;
    url += "&type=track&market=NZ&limit=4&offset=0";
    return url;
}

exports.createGetTrackQuery = function (trackId) {
    var url = GETTRACK;
    url += trackId;
    url += "?market=NZ";
    console.log(url);
    return url;
}

exports.fetchAccessToken = async function (code) {
    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI('http://localhost:3000/host');
    body += "&client_id=" + clientId;
    body += "&client_secret=" + clientSecret;

    var responseToken = await callApiPost(body);
    output = {
        accessToken: responseToken.data.access_token,
        refreshToken: responseToken.data.refresh_token,
    };
    return output;
}

exports.togglePlay = async function(token, song_id, device_id){
    headers = getHeaders(token);
    body = {context_uri : "spotify:tracks:" + song_id}
    str = "[\"spotify:track:" + song_id + "\"]"
    body = {uris :[`spotify:track:${song_id}`]}
    config = {
        headers: headers,
        params: `${device_id}`,
    }
    res = await axios.put(PLAY, body,config).catch(err =>{
        console.log(err.response.data);
    });
}

exports.refreshAccessToken = async function (refreshToken) {
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refreshToken;
    body += "&client_id=" + clientId;
    body += "&client_secret=" + clientSecret;
    console.log(body);
    return await callApiPost(body);
}

exports.pollPlayback = async function (accessToken, trackToBePlayed) {
    console.log("pollplayback executed");
    console.log(accessToken);
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + accessToken
    }
    var nextTrack = trackToBePlayed;
    var response = await axios.get(PLAYER, {
        headers: headers
    });
    console.log(response);
    if (trackToBePlayed.id !== response.data.uri) {
        
    }
    var returnedData = response.data;
}

async function callApiPost(body) {
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
    res = await axios.post(TOKEN, body, { headers: headers }).catch(err => {
        console.log(err.response.data);
    });
    return res;

}
