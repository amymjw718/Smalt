import React, { useContext } from "react";
import styles from "./style.module.css";
import IconButton from '@material-ui/core/IconButton';
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import { useCookies } from "react-cookie";
import axios from "axios";

const ENDPOINT = "http://localhost:3001/";

export default function PlayBack() {
    const [cookies, setCookie] = useCookies(["name"]);

    const handlePlayButton = async () => {
        const toUpdate = {
          roomCode: cookies.room.id,
        };
        const response = await axios.put(
          "http://localhost:3001/play/toggleplay",
          toUpdate
        );
      };

    return (
        <div className={styles.playBar}>
            <IconButton onClick={handlePlayButton} className={styles.playButton} >
                <PlayCircleFilled className={styles.playIcon} />
            </IconButton>
        </div>
    );
}