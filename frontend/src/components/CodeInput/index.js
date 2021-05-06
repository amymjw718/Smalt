import React from "react";
import styles from "./style.module.css";
import { useHistory } from "react-router-dom";
import { Button, TextField, makeStyles } from "@material-ui/core";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import IconButton from '@material-ui/core/IconButton';

export default function CodeInput() {
  const history = useHistory();

  const [emptyFieldFlag, setEmptyFieldFlag] = React.useState(false);

  const [textValue, setTextValue] = React.useState("");

  const handleEnter = () => {
    if (textValue !== "") {
      setTextValue("");
      history.push("/home");
    }else{
      setEmptyFieldFlag(true);
    }
  };

  const handleBack = () => {
    history.goBack();
  };

  return (
    <>
      <IconButton className={styles.backButton} onClick={handleBack}>
        <ArrowBackIosIcon />
      </IconButton>
      <div className={styles.textFieldContainer}>
          <TextField
            className={styles.textField}
            id="standard-basic"
            variant="outlined"
            label="Playlist code"
            value={textValue}
            error={emptyFieldFlag}
            helperText={emptyFieldFlag && 'Please enter a username'}
            onChange={e => {setTextValue(e.target.value); setEmptyFieldFlag(false)}}
            InputProps={{
              style: { color: "#fff" },
            }}
            InputLabelProps={{
              style: { color: "#fff" },
            }}
          />
        <Button
          className={styles.enterButton}
          onClick={handleEnter}
        >
          Enter
        </Button>
      </div>
    </>
  );
}
