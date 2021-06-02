import React, { useState, useEffect } from "react";
import styles from "./style.module.css";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useSessionStorage } from "../../useSessionStorage";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";

import { Avatar, TableCell, TableRow } from "@material-ui/core";

export default function Song(props) {
  console.log("song render");
  console.log(props.props.name);
  console.log(props.props.id);
  const song = props.props;
  var formattedArtist = "";
  song.artists.forEach(function (element) {
    if (formattedArtist == "") {
      formattedArtist = element;
    } else {
      formattedArtist = formattedArtist + ", " + element;
    }
  });

  const [likeButtonColor, setLikeButtonColor] = useState("inherit");
  const [liked, setLikedStatus] = useSessionStorage(song.id, false);
  //const [cachedLike, setCachedLike] = useLocalStorage(song.id, liked);
  const [cookies, setCookie] = useCookies(["name"]);

  useEffect(() => {
    setLikedStatus(JSON.parse(window.sessionStorage.getItem(song.id)));
    console.log("likedstatus of song")
    console.log(liked)
    if (liked) {
      setLikeButtonColor("secondary");
    } else {
      setLikeButtonColor("inherit");
    }
  });

  const handleLikeButton = async () => {
    setLikedStatus(!liked);
    var voteType;
    if (likeButtonColor !== "inherit") {
      setLikeButtonColor("inherit");
    } else {
      setLikeButtonColor("secondary");
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
          <div className={styles.songArtist}>{formattedArtist}</div>
          <div className={styles.songArtist}>{song.upVoteCount}</div>
        </TableCell>
        <TableCell className={styles.tableCell}>
          <IconButton onClick={handleLikeButton} color={likeButtonColor}>
            <FavoriteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
}
