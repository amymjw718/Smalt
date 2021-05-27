const query = require("./queries");
const connect = require("./connect");

main();

async function main() {

  var testSong = {
    name: "the wheels on the bus",
    imageURL: "irefuse",
    artistNames: "no",
    upVoteCount: 0,
    songDuration: 10,
    id: makeCode(10),
  };

  var testSong2 = {
    name: "lol",
    imageURL: "nourl",
    artistNames: "yes",
    upVoteCount: 0,
    songDuration: 10,
    id: makeCode(10),
  };
  var testSong3 = {
    name: "the wheels on the bus",
    imageURL: "irefuse",
    artistNames: "no",
    songDuration: 10,
    id: "kill me",
  };

  var testUser = {
    userName: makeCode(5),
  };

  const testToken = {
    accessToken: makeCode(5),
    refreshToken: makeCode(5),
  }

  const TESTCONNECTIONSTRING =
    "mongodb+srv://smaltadmin:AG47gX6WIP3YUaB2@cluster0.knzot.mongodb.net/roomRegistry2?retryWrites=true&w=majority";

  if (connect.connectToDatabase(TESTCONNECTIONSTRING)) {
    console.log("connection success");
  }
  // await query.clearDB();
  // const host_id = await query.createNewHost(testToken,"jimmy")
  // const roomCode = await query.createNewRoom(host_id);
  // console.log(await query.refreshTokens("idk",roomCode))
  // console.log(await query.getAccessToken(roomCode));
  // xsd = await query.addSongToPool(testSong3,roomCode);
  // console.log(xsd);
  plsss = await query.moveToCurrent("kill me","1G3NHb");
  console.log(plsss);

  // var roomCode = await query.createNewRoom(, makeCode(4));
  // var b = await query.addSongToPool(testSong2, roomCode);
  // var a = await query.addSongToPool(testSong, roomCode);
  


  // await query.addSongToPool(testSong, roomCode);
  // await query.addSongToPool(testSong2, roomCode);
  // //await query.addUserToRoom(testUser, roomCode);
  // await query.removeLikeFromSong(roomCode, testSong.id);

  //await query.getRoomById(roomCode);
  //console.log(`token: ${await query.getAccessToken(roomCode)}`);

  function makeCode(length) {
    var result = [];
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result.push(
        characters.charAt(Math.floor(Math.random() * charactersLength))
      );
    }
    return result.join("");
  }
}
