import React, { useState, useEffect, useContext } from "react";
import { Playlist } from "../";
import socketIOClient from "socket.io-client";
import { useCookies } from "react-cookie";
import { PlaylistContext } from "../../playlist-context";
import { CurrentSongContext } from "../../currentsong-context";

const ENDPOINT = "http://localhost:3001/";

export default function WebSocketProvider() {
    const [cookies, setCookie] = useCookies(["name"]);
    const [playlist, setPlaylist] = useContext(PlaylistContext);
    const [currentSong, setCurrentSong] = useContext(CurrentSongContext);

    function sortSongsByUpVoteCount(array) {
        return array.sort(function (a, b) {
            var x = a.upVoteCount; var y = b.upVoteCount;
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });
    }

    useEffect(() => {
        const updateSong = (updatedSong) => {
            var oldPlaylist;
            setPlaylist((prevPlaylist) => {
                oldPlaylist = prevPlaylist;
                return prevPlaylist;
            });
            setPlaylist([]);
            oldPlaylist.forEach(function (song, index) {
                if (song.id === updatedSong.id) {
                    oldPlaylist[index] = updatedSong;
                }
            });
            var sortedPlaylist = sortSongsByUpVoteCount(oldPlaylist);
            return sortedPlaylist;
        }

        const addSong = (song) => {
            setPlaylist((prevPlaylist) => [...prevPlaylist, song]);
        }

        const socket = socketIOClient(ENDPOINT);

        socket.on("initPlaylist", (playlist) => {
            setPlaylist(sortSongsByUpVoteCount(playlist.songs));
        });


        socket.on('WhichRoom', function () {
            socket.emit('SpecifyRoom', { room: cookies.room.id });
        });

        socket.on("songUpdated", (updatedSong) => {
            var sortedPlaylist = updateSong(updatedSong);
            setPlaylist(sortedPlaylist);
        });

        socket.on('newSong', (song) => {
            addSong(song);
        });

        socket.on('playSong', (song) => {
            setCurrentSong(song);
        });

        socket.on('updatePlaylist', (playlist) => {
            console.log(playlist)
            setPlaylist(sortSongsByUpVoteCount(playlist));
        });

        return function cleanup() {
            socket.disconnect();
        };
    }, []);

    return (
        <>
            <Playlist />
        </>
    );
}
