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
        upVoteCount: {
          type: Number,
        },
        queueNumber: {
          type: Number,
        },
        name: {
          type: String,
        },
        imageURL: {
          type: String,
        },
        artists: [
          {
            type: String,
          },
        ],
        songDuration: {
          type: Number,
        }, //in milliseconds
        id: {
          type: String,
        }, //spotify id
    },
    //songs nested subdocument. This array syntax means we can have multiple songs in a given playlist
    songs: [
      {
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
      },
    ],
  },
  timestamps: {},
  /* This object allows us to specify more config info. In this case, we're enabling automatic timestamps 
  using the default options. */
});

module.exports = mongoose.model("Room", roomSchema);

