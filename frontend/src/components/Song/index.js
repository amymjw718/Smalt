import React, { useState, useEffect } from "react";
import styles from "./style.module.css";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useSessionStorage } from '../../useSessionStorage';
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from '@material-ui/icons/Favorite';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import green from '@material-ui/core/colors/green'

import {
  Avatar,
  TableCell,
  TableRow,

} from "@material-ui/core";

export default function Song(props) {
  console.log("I was called");
  console.log(props);
  const song = props.props;
  var formattedArtist = "";
  song.artists.forEach(function (element) {
    if (formattedArtist == "") {
      formattedArtist = element
    } else {
      formattedArtist = formattedArtist + ", " + element
    }
  });

  const [likeButtonColor, setLikeButtonColor] = useState(green[50]);
  const [liked, setLikedStatus] = useSessionStorage(song.id, false);
  //const [cachedLike, setCachedLike] = useLocalStorage(song.id, liked);
  const [cookies, setCookie] = useCookies(["name"]);

  useEffect(() => {
    setLikedStatus(liked);
    if (liked) {
      setLikeButtonColor(green[500]);
    } else {
      setLikeButtonColor(green[50]);
    }
  });

  const deleteSong = () => {
    console.log('delete the song')
  }

  const handleLikeButton = async () => {
    setLikedStatus(!liked);
    var voteType;
    if (likeButtonColor !== green[500]) {
      setLikeButtonColor(green[500]);
    } else {
      setLikeButtonColor(green[500]);
    }
    if (liked) {
      voteType = "unvote";
    } else {
      voteType = "upvote";
    }
    const toUpdate = {
      room: cookies.room.id,
      track: song,
      voteType: voteType,
    };
    console.log(toUpdate);
    const response = await axios.put(
      "http://localhost:3001/users/song/vote",
      toUpdate
    );
  };

  return (
    <>
      <TableRow className={styles.tableRow}>
        <TableCell className={styles.tableCell}>
          <Avatar
            variant="rounded"
            src={song.imageURL}
            className={styles.image}
          />
        </TableCell>
        <TableCell className={styles.tableCellHead}>
          <div className={styles.songName}>{song.name}</div>
          <div className={styles.songArtist}>{song.artists}</div>
          <div className={styles.songArtist}>{song.upVoteCount}</div>
        </TableCell>
        <TableCell className={styles.tableCell}>
          <IconButton onClick={handleLikeButton} style={{ color: likeButtonColor }}>
            <FavoriteIcon />
          </IconButton>
          <IconButton onClick={deleteSong} color="secondary">
            <DeleteForeverIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
}
