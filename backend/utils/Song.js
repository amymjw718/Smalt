const Timer = require("tiny-timer");
const DELAY = 2000;
class Room {
    constructor(id) {
        this.id = id
        this.paused = true; // Rooms start with no video so default to true.
        this.duration = null;
    }


    newTimer(songDuration,doneCallback) {
    console.log("we innit")
    
    timer = new Timer({ stopwatch: true });
    console.log(songDuration * 1000 + DELAY);
    timer.on("done", doneCallback);

    timer.start(
        songDuration * 1000 + DELAY
    );
    }
}
    module.exports = Room;
