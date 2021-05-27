const mongoose = require("mongoose");

const Schema = mongoose.Schema; //This schema represents all the users, playlists and host in a room database

const roomSchema = new Schema({
  //randomised code for users to enter
  code: {
    type: String,
    unique: true,
    required: true,
  },

  //user subdocument
  // users: [
  //   {
  //     userName: {
  //       type: String,
  //     },
  //   },
  // ],

  //host subdocument
  host: {
     type: Schema.Types.ObjectId, ref: 'Host' 
  },

  //playlist subdocument
  playlist: {
    currentSong: {
      type: Schema.Types.ObjectId,
    },
    //songs nested subdocument. This array syntax means we can have multiple songs in a given playlist
    songs: [
      {type: Schema.Types.ObjectId}
    ],
  },
  timestamps: {},
  /* This object allows us to specify more config info. In this case, we're enabling automatic timestamps 
  using the default options. */
});

module.exports = mongoose.model("Room", roomSchema);

