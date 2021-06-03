import React from 'react';
import styles from "./style.module.css";
import { LandingOptions } from "../../components";

/* This HostPage function applies the CSS styles to the LandingOptions */

export default function LandingPage() {
    return (
        <div className={styles.rootContainer} >
            <p className={styles.name} align="center"><h1>Smalt</h1></p>
            <LandingOptions />
        </div>
    );

}