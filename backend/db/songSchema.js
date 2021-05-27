const mongoose = require("mongoose");

const Schema = mongoose.Schema; //This schema represents all the users, playlists and host in a room database
const songSchema = new Schema({
    upVoteCount: {
      type: Number,
    },
    queueNumber: {
      type: Number,
    },
    name: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
    artists: [
      {
        type: String,
        required: true,
      },
    ],
    songDuration: {
      type: Number,
      required: true,
    }, //in milliseconds
    id: {
      type: String,
      required: true,
    } //spotify id
  });
  module.exports = mongoose.model("Song", songSchema);