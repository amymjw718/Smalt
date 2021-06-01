const Host = require("./hostSchema.js");
var Room = require("./roomSchema.js");

exports.createNewHost = async function (tokens, hostName) {
  console.log(hostName);
  var host = await new Host();

  host.userName = hostName;
  host.tokens = tokens;
  console.log(host);
  await addData(host);
  return host._id;
};
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
  console.log(room);
  const host = await Host.findOne({ _id: host_id });
  console.log(host);
  ans = await host.rooms.push(room._id);
  console.log(ans);
  host.save();

  return codee;
};

exports.addSongToPool = async function (song, roomId) {
  room = await this.getRoomById(roomId);
  console.log("addsongtopool query");
  console.log(song);
  room.playlist.songs.push(song);

  return await room.save(function (err, doc) {
    if (err) return false;
    return true;
  });
};

exports.refreshTokens = async function (newToken, roomId) {
  const room = await Room.findOne({ code: roomId });
  const host = await Host.findOne({ _id: room.host._id });
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
  console.log(
    `Cleared database (removed ${roomsGone.deletedCount} rooms, ${hostsGone.deletedCount} hosts).`
  );
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
  console.log(`room id: ${roomId}`);
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

exports.moveToCurrent = async function (roomId) {
  console.log("movetocurrent query");
  const room = await Room.findOne({ code: roomId });
  const highestSong = room.playlist.songs.reduce(function (prev, current) {
    return prev.upVoteCount > current.upVoteCount ? prev : current;
  });

  room.playlist.currentSong = highestSong;
  await addData(room);
};
