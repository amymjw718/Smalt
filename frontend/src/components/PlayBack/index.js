import React, { useContext } from "react";
import styles from "./style.module.css";
import IconButton from '@material-ui/core/IconButton';
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';

const ENDPOINT = "http://localhost:3001/";

export default function PlayBack() {

    return (
        <div className={styles.playBar}>
            <IconButton className={styles.playButton} >
                <PlayCircleFilled className={styles.playIcon} />
            </IconButton>
        </div>
    );
}