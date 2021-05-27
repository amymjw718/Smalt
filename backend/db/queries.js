const Host = require("./hostSchema.js");
var Room = require("./roomSchema.js");
var Song = require("./songSchema.js");

exports.createNewHost = async function(tokens, hostName){
  console.log(hostName);
var host =await new Host();

host.userName = hostName;
host.tokens = tokens;
console.log(host);
await addData(host);
return host._id;
}
exports.getHostById = async function (hostname) {
  console.log(hostname);
  const host = await Host.findOne({ userName: hostname });
  console.log(host);
  return host._id;
};


exports.createNewRoom = async function (host_id) {
  codee = makeCode(6);
  console.log(host_id);
  const room = new Room({

    code: codee,
    playlist: {
      songs: [],
    },
  });
  room.host = host_id;
  await addData(room);
  console.log("createroomquery");
  const host = await Host.findOne({_id : host_id});
  ans = await host.rooms.push(room._id);
  host.save();

  return codee;
};

exports.addSongToPool = async function (song, roomId) {
  room = await this.getRoomById(roomId);
  console.log(song);
  song = await new Song(song);
  await song.save();
  room.playlist.songs.push(song);

  await room.save();
};

exports.refreshTokens = async function (newToken, roomId) {
  const room = await Room.findOne({ code: roomId });
  const host = await Host.findOne({_id: room.host._id})
  host.tokens.accessToken = newToken;
  host.save();
};

exports.addUserToRoom = async function (user, roomId) {
  room = await this.getRoomById(roomId);
  room.users.push(user);
  room.save();
};

exports.clearDB = async function () {
  const roomsGone = await Room.deleteMany({});
  const hostsGone = await Host.deleteMany({});
  const songsGone = await Song.deleteMany({});
  console.log(`Cleared database (removed ${roomsGone.deletedCount} rooms, ${hostsGone.deletedCount} hosts).`);
};

async function addData(room) {
  const result = await room.save();
  console.log(`Added to the database.`);
}

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

exports.getAllSongs = async function (room) {
  songs = await Room.findOne({ code: room }).select("playlist.songs -_id");
  return songs.playlist;
};

exports.roomDoesExist = async function (roomCode) {
  console.log(roomCode);
  truth = Room.exists({ code: roomCode });
  return truth;
};

exports.getAccessToken = async function (roomId) {
  console.log(`room id: ${roomId}`);
  const room = await Room.findOne({ code: roomId }).populate("host");
  console.log(room);
  return room.host.tokens.accessToken;
};
exports.getRefreshToken = async function (roomId) {
  console.log(`room id: ${roomId}`)
  const room = await Room.findOne({ code: roomId }).populate("host");
  return room.host.tokens.refreshToken;
};



exports.getRoomById = async function (roomId) {
  const room = await Room.findOne({ code: roomId });
  return room;
};

// exports.findSongById = async function (roomId, songId) {
//   var song = await Room.findOne(
//     { code: roomId, "playlist.songs.id": songId }
//   ).select("playlist.songs -_id");
//   console.log("selectedSong");
//   console.log(song.playlist);

//   return song.playlist.songs;
// }

exports.addLikeToSong = async function (roomId, songId) {
  console.log("add like called");
  var updatedRoom = await Room.findOneAndUpdate(
    { code: roomId, "playlist.songs.id": songId },
    {
      $inc: {
        "playlist.songs.$.upVoteCount": 1,
      },
    },
    {
      returnOriginal: false,
    }
  );

  return updatedRoom;
};

exports.highestVotedSong = async function(roomId){
  songs = await this.getAllSongs(roomId);
  console.log(songs);
  var bigSong = songs.songs[0];
  songs.songs.forEach(song =>{
    if(song.upVoteCount>bigSong.upVoteCount){
      bigSong =song;
    }
  });
  return bigSong.id;
}

exports.moveToCurrent= async function (songId,roomId){ 
  const room = await Room.findOne({ code: roomId }).populate("playlist.songs.name");
  console.log("here?")
  console.log(room);
  const song = room.playlist.songs.find(element => element.id == songId);
  console.log(song);  
  room.playlist.currentSong = song;
  //song.remove();
  console.log(room);
  await room.save();
  }

exports.removeLikeFromSong = async function (roomId, songId) {
  console.log("remove like called");
  var updatedRoom = await Room.findOneAndUpdate(
    { code: roomId, "playlist.songs.id": songId },
    {
      $inc: {
        "playlist.songs.$.upVoteCount": -1,
      },
    },
    {
      returnOriginal: false,
    }
  );



  return updatedRoom;
};
