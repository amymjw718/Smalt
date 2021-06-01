import React, { useContext } from "react";
import styles from "./style.module.css";
import IconButton from "@material-ui/core/IconButton";
import PlayCircleFilled from "@material-ui/icons/PlayCircleFilled";
import PauseCircleFilled from '@material-ui/icons/PauseCircleFilled';
import { useCookies } from "react-cookie";
import axios from "axios";
import { CurrentSongContext } from "../../currentsong-context";

const ENDPOINT = "http://localhost:3001/";

export default function PlayBack() {
  const [cookies, setCookie] = useCookies(["name"]);
  const [currentSong, setCurrentSong] = useContext(CurrentSongContext);

  const handlePlayButton = async () => {
    const toUpdate = {
      roomCode: cookies.room.id,
    };
    const response = await axios.put(
      "http://localhost:3001/play/toggleplay",
      toUpdate
    );
  };

  const formatArtists = (artists) => {
    var formattedArtists = "";
    artists.forEach(function (artist) {
      if (formattedArtists == "") {
        formattedArtists = artist;
      } else {
        formattedArtists = formattedArtists + ", " + artist;
      }
    });
    return formattedArtists;
  };

  return (
    <div className={styles.playBar}>
      {!(Object.keys(currentSong).length === 0) && (
        <div className={styles.currentSong}>
          <label className={styles.songLabel}>{currentSong.name}</label>
          <br></br>
          <label>{formatArtists(currentSong.artists)}</label>
        </div>
      )}
      <IconButton onClick={handlePlayButton} className={styles.playButton}>
        {currentSong.isPlaying ? <PauseCircleFilled className={styles.playIcon} /> : <PlayCircleFilled className={styles.playIcon} /> }
      </IconButton>
    </div>
  );
}
